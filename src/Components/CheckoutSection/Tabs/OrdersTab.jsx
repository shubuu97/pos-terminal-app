import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import _findIndex from 'lodash/findIndex';
import _isArray from 'lodash/isArray';
/* Dinero Import */
import Dinero from 'dinero.js'
/* Material import */
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Slide from '@material-ui/core/Slide';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
/* Material Icons */
import RemoveCircleIcons from '@material-ui/icons/RemoveCircleOutline';
import DeleteIcons from '@material-ui/icons/DeleteOutline';
import AddIcons from '@material-ui/icons/AddCircleOutline';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
/* Redux Imports */
import { connect } from 'react-redux';
import { commonActionCreater } from '../../../Redux/commonAction';
/* Component Imports */
import CalculationSection from './CalculationSection'
import DiscountDialogue from '../../Dialogues/DiscountDialogue/DiscountDialogue'
import CannaConsumptionTooltip from './CannaConsumptionTooltip';
import ArrowTooltip from './ArrowTooltip';
/* Global Function import */
import genericPostData from '../../../Global/dataFetch/genericPostData';
import globalClearCart from '../../../Global/PosFunctions/clearCart';
import addGuestToCart from '../../../Global/PosFunctions/addGuestToCart';
import splitDotWithInt from '../../../Global/PosFunctions/splitDotWithInt'
/* Asset Import  */
import EmptyCartImg from '../../../assets/images/pos/empty_cart.png'
const DineroInit = () => {
    return Dinero({
        amount: 0,
        currency: 'USD'
    })
}

let DineroFunc = (amount) => {
    return Dinero({
        amount: parseInt(amount),
        currency: 'USD'
    })
}

const styles = props => ({
    barColorPrimary: {
        backgroundColor: '#da2020',
    }
});

class OrdersTab extends React.Component {

    constructor() {
        super();
        this.state = {
            totalCartItems: 0,
            orderTotal: 0,
            expanded: null,
            open: false,
            identifier: '',
            itemIndex: '',
            forCart: false,
            cartItemQty: 0,
            openTooltip: false
        }
    }

    componentDidMount() {
        this.setState({ cartItemQty: _get(this, 'props.cart.cartQty', 0) })
    }

    componentWillReceiveProps(props) {
        if (props.tabValue != 2 || _get(props, 'cart.cartQty', 0) == 0) {
            if (this.state.cartItemQty != _get(props, 'cart.cartQty', 0)) {
                this.props.dispatch(commonActionCreater(1, 'SWITCH_TAB_NUMBER'))
                this.setState({
                    cartItemQty: _get(props, 'cart.cartQty', 0)
                })
            }
        }
    }

    // * Minor Functions for Opening closing Modals 
    handleChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });
    };

    handleClickOpenDiscount = () => {
        let cartItems = _get(this, 'props.cart.cartItems', []);
        let cartTotal = 0;
        _isArray(cartItems) && cartItems.map((cartItem) => {
            cartTotal += Number(_get(cartItem, 'itemRegularTotal.amount', 0));
        })
        this.setState({
            open: true,
            identifier: 'Discount',
            forCart: true,
            cartTotal: cartTotal,
        });
    };

    handleClickOpenItemDiscount = (index) => {
        this.setState({
            open: true,
            identifier: 'ItemDiscount',
            itemIndex: index,
        });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleCartDiscountCalculate = (cartItems) => {
        let cartDiscountObj = {}
        cartDiscountObj.cartItems = cartItems
        cartDiscountObj.prevCart = _get(this, 'props.cart', {});
        this.props.dispatch(commonActionCreater(cartDiscountObj, 'CART_ITEM_LIST'));
    }

    // * Functions to Update Cart Reducers 
    handleDelete = (item) => {
        let cartItems = [...this.props.cartItems];
        let index
        if (localStorage.getItem('cannabisStore')) {
            index = _findIndex(cartItems, cartItem => cartItem.packages[0].label == item.packages[0].label);
        }
        else {
            index = _findIndex(cartItems, cartItem => cartItem.doc._id == item.doc._id);
        }

        cartItems.splice(index, 1);
        this.handleCartDiscountCalculate(cartItems)
    };
    handleIncreaseQuantity = (item) => {
        let cartItems = [...this.props.cartItems];
        let index = _findIndex(cartItems, cartItem => cartItem.doc._id == item.doc._id);
        cartItems[index].qty = cartItems[index].qty + 1;
        this.handleCartDiscountCalculate(cartItems)
    };
    handleDecreseQuantity = (item) => {
        let cartItems = [...this.props.cartItems];
        let index = _findIndex(cartItems, cartItem => cartItem.doc._id == item.doc._id);
        cartItems[index].qty = cartItems[index].qty - 1;
        if (cartItems[index].qty == 0) {
            cartItems.splice(index, 1);
        }
        this.handleCartDiscountCalculate(cartItems)
    };
    handleDiscount = (data, identifier, index, type) => {
        let cartItems = _get(this, 'props.cart.cartItems', []);
        let cartDiscountObj = {}
        // * Making object for Cart reducer
        let reqObj = [
            ...cartItems
        ]
        cartDiscountObj.cartItems = reqObj

        if (identifier == 'Discount') {
            // * Changing Cart Discounts
            cartDiscountObj.type = type
            if (type != '%') {
                cartDiscountObj.cartDiscount = splitDotWithInt(parseFloat(data))
                cartDiscountObj.isPercentage = false
            } else {
                cartDiscountObj.cartDiscount = parseFloat(data)
                cartDiscountObj.isPercentage = true
            }
            cartDiscountObj.prevCart = _get(this, 'props.cart', {});
            this.props.dispatch(commonActionCreater(cartDiscountObj, 'CART_ITEM_LIST'));
        }
        else if (identifier == 'ItemDiscount') {
            // * Changing Item Discount
            if (type != '%') {
                reqObj[index].itemDiscountMoney = Dinero({ amount: splitDotWithInt(data), currency: 'USD' })
                reqObj[index].itemDiscountPercent = (data / ((reqObj[index].itemRegularTotalMoney).toUnit())) * 100
                reqObj[index].isPercent = false
            } else {
                reqObj[index].itemDiscountPercent = data
                reqObj[index].isPercent = true
            }
            cartDiscountObj.cartItems = reqObj
            cartDiscountObj.prevCart = _get(this, 'props.cart', {});
            this.props.dispatch(commonActionCreater(cartDiscountObj, 'CART_ITEM_LIST'));
        }
    };
    handleClearCart = () => {
        if (localStorage.getItem('cannabisStore')) {
            let selectedCannabisCustomer = _get(this.props, 'customerQueue.customer', {})
            selectedCannabisCustomer.status = 1
            genericPostData({
                dispatch: this.props.dispatch,
                reqObj: selectedCannabisCustomer,
                url: 'Update/CustomerQueue',
                dontShowMessage: true,
                constants: {
                    init: 'CUSTOMER_UPDATE_INIT',
                    success: 'CUSTOMER_UPDATE_SUCCESS',
                    error: 'CUSTOMER_UPDATE_ERROR'
                },
                identifier: 'CUSTOMER_UPDATE',
                successCb: (data) => { }
            }).then((data) => {

            })
        }
        globalClearCart(this.props.dispatch);
        addGuestToCart(this.props.dispatch);
    };


    // * Populate each Item added to cart
    populateCartItems = () => {
        let totalCartItems = 0;
        let orderTotal = 0
        let cartItems = this.props.cartItems.map((item, index) => {
            let subTotal = _get(item, 'subTotal', DineroInit())
            let regularTotal = _get(item, 'itemSalesPriceMoney', DineroInit())
            totalCartItems += item.cartQuantity;
            orderTotal += item.subTotal;
            this.state.orderTotal = this.state.orderTotal + item.subTotal;
            return (
                <Slide direction="right" in={true} mountOnEnter unmountOnExit>
                    <ExpansionPanel
                        className='each-checkout-item'
                        expanded={_get(item, 'doc.product.isGiftCard', false) ? false : this.state.expanded === `Panel${_get(item, 'packages[0].label', _get(item, 'id'))}`}
                        onChange={this.handleChange(`Panel${_get(item, 'packages[0].label', _get(item, 'id'))}`)}>
                        <ExpansionPanelSummary>
                            <div className='each-product-des fwidth flex-row justify-space-between'>

                                {/* Item Quantity */}
                                {
                                    _get(item, 'doc.product.isGiftCard') || localStorage.getItem('cannabisStore') ?
                                        null :
                                        <div className='each-item-qty absolute'>
                                            {item.qty}
                                        </div>
                                }

                                {/* Item Discount */}
                                {
                                    _get(item, 'itemDiscountMoney', DineroFunc(0)).getAmount() > 0 ?
                                        <div className='each-item-discount absolute'></div> : null
                                }

                                {/* Delete Icon and Title */}
                                <div className=' des-first-part flex-row align-center'>
                                    <DeleteIcons
                                        onClick={() => this.handleDelete(item)}
                                        style={{ color: '#ff000096', fontSize: '1.5em' }} />
                                    <div className='flex-column'>
                                        <div className='title'>
                                            {
                                                _get(item, 'doc.product.isGiftCard') ?
                                                    <div><span>Gift Card : </span> {_get(item, 'doc.product.name')}</div>
                                                    :
                                                    _get(item, 'doc.product.name')
                                            }
                                        </div>
                                        {
                                            localStorage.getItem('cannabisStore') ?
                                                <span className='title-label'>
                                                    {_get(item, 'packages[0].label', '')}
                                                </span> : null
                                        }
                                    </div>

                                </div>

                                {/* Item Price and Regular Price */}
                                <div className='flex-column'>
                                    <div className='each-product-price'>{subTotal.toFormat('$0,0.00')}</div>
                                    <div className='each-product-reg-price'>Reg Price - {regularTotal.toFormat('$0,0.00')}</div>
                                </div>
                            </div>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <div className='fwidth flex-row justify-space-between'>
                                {
                                    localStorage.getItem('cannabisStore') ?
                                        <div className='expanded-options'>
                                            <span className='option-title'>Quantity</span>
                                            <div className='flex-row justify-center align-center'>
                                                <span className='quantity'>{item.qty}</span>
                                            </div>
                                        </div>
                                        :
                                        item.saleType === 0 &&
                                        <div className='expanded-options'>
                                            <span className='option-title'>Quantity</span>
                                            <div className='flex-row justify-center align-center'>
                                                <RemoveCircleIcons onClick={() => this.handleDecreseQuantity(item)} style={{ fontSize: '1.7em' }} />
                                                <span className='quantity'>{item.qty}</span>
                                                <AddIcons onClick={() => this.handleIncreaseQuantity(item)} style={{ fontSize: '1.7em' }} />
                                            </div>
                                        </div>
                                }
                                {
                                    _get(item, 'doc.product.discountable', false) ?
                                        _get(item, 'cartDiscountMoney', DineroFunc(0)).getAmount() > 0 ?
                                            <div className='expanded-options'>
                                                <span className='option-title'>Cart Discount</span>
                                                <div className='flex-row justify-center align-center'>
                                                    {item.cartDiscountMoney.toFormat('$0,0.00')}
                                                </div>
                                            </div> : null : null
                                }
                                {
                                    _get(item, 'doc.product.discountable', false) ?
                                        _get(item, 'empDiscountMoney', DineroFunc(0)).getAmount() > 0 ?
                                            <div className='expanded-options'>
                                                <span className='option-title'>Employee Discount</span>
                                                <div className='flex-row justify-center align-center'>
                                                    {item.empDiscountMoney.toFormat('$0,0.00')}
                                                </div>
                                            </div> : null : null
                                }
                                {
                                    _get(item, 'doc.product.discountable', false) ?
                                        _get(item, 'itemDiscountMoney', DineroFunc(0)).getAmount() > 0 ?
                                            <div className='expanded-options'>
                                                <span className='option-title'>Item Discount</span>
                                                <div className='flex-row justify-center align-center' onClick={() => this.handleItemDiscountRemove(index)}>
                                                    {item.itemDiscountMoney.toFormat('$0,0.00')}
                                                    <RemoveCircleIcons
                                                        style={{ fontSize: '1.2em', color: '#ff000096', paddingLeft: 5 }}
                                                    />
                                                </div>
                                            </div>
                                            :
                                            <div className='expanded-options'>
                                                <span className='option-title'>Item Discount</span>
                                                <div className='flex-row justify-center align-center' onClick={() => this.handleClickOpenItemDiscount(index)}>
                                                    <AddCircleOutline
                                                        style={{ fontSize: '1.2em', color: '#ff000096', paddingRight: 5 }}
                                                    /> Add</div>
                                            </div> : null
                                }
                            </div>
                        </ExpansionPanelDetails>
                    </ExpansionPanel >
                </Slide>
            )
        });
        let cart = cartItems.reverse()
        return cart
    }
    handleProceedToCustomer = () => {
        this.props.dispatch(commonActionCreater(2, 'SWITCH_TAB_NUMBER'))
    }

    handleItemDiscountRemove = (index) => {
        let cartDiscountObj = {}
        cartDiscountObj.cartItems = _get(this.props, 'cart.cartItems', [])
        cartDiscountObj.cartItems[index].itemDiscountMoney = DineroFunc(0)
        cartDiscountObj.cartItems[index].itemDiscountPercent = 0;
        cartDiscountObj.cartItems[index].isPercent = false;
        cartDiscountObj.prevCart = _get(this, 'props.cart', {});
        this.props.dispatch(commonActionCreater(cartDiscountObj, 'CART_ITEM_LIST'));
    }

    render() {
        let { checkoutcalcArea, checkoutactionArea, checkoutcartArea, checkoutMainPart, cart } = this.props;
        let cartListHeight = checkoutcartArea - 30
        const { classes } = this.props;
        return (
            <div className="orders-section" >
                <DiscountDialogue
                    open={this.state.open}
                    identifier={this.state.identifier}
                    handleClose={this.handleClose}
                    handleDiscount={this.handleDiscount}
                    itemIndex={this.state.itemIndex}
                    forCart={this.state.forCart}
                    cartTotal={this.state.cartTotal}
                    cart={this.props.cart}
                />
                <div style={{ height: checkoutcartArea }}>
                    <div className="items-section flex-column" style={{ height: cartListHeight }} >
                        {
                            _get(this, 'props.cartItems', []).length ?
                                this.populateCartItems() :
                                <div className='flex-row justify-center align-center fheight' >
                                    <img src={EmptyCartImg} style={{ height: '70%' }} alt="" />
                                </div>
                        }
                    </div>
                </div>
                <div className="order-amount-section">
                    {
                        localStorage.getItem('cannabisStore') || false ?
                            <ClickAwayListener onClickAway={() => this.setState({ openTooltip: false })}>
                                <div>
                                    <ArrowTooltip
                                        title={<CannaConsumptionTooltip cart={cart} />}
                                        placement="top"
                                        open={this.state.openTooltip}
                                    >
                                        <LinearProgress
                                            onClick={() => this.setState({ openTooltip: true })}
                                            variant="buffer"
                                            value={_get(this.props, 'cart.cannabisCartLimitPercentage', 0)}
                                            classes={
                                                _get(this.props, 'cart.cannabisCartLimitPercentage', 0) > 100 ?
                                                    { barColorPrimary: classes.barColorPrimary, colorPrimary: classes.barColorPrimary } : {}
                                            }
                                            style={{
                                                width: '100%',
                                                height: '15px',
                                                borderRadius: '8px',
                                            }}
                                        />
                                    </ArrowTooltip>
                                </div>
                            </ClickAwayListener> : null
                    }
                    <CalculationSection
                        checkoutcalcArea={checkoutcalcArea}
                        handleClickOpenDiscount={this.handleClickOpenDiscount}
                    />
                    <div className='button-section flex-row ' style={{ height: checkoutactionArea }}>
                        <Button className='mr-20 btnsecondary' variant="outlined" onClick={this.handleClearCart}>Clear</Button>
                        <Button className={_get(this, 'props.cartItems', []).length ? 'mr-20 btnsecondary' : 'mr-20 btnsecondary disable-button'} variant="outlined" onClick={this.props.handleClickOpen}>Hold</Button>
                        <Button className="btnprimary" style={{ flex: 1 }} onClick={this.handleProceedToCustomer} variant="contained">Proceed</Button>
                    </div>
                </div>
            </div>



        );
    }
}

function mapStateToProps(state) {
    let customer = _get(state, 'cart.customer');
    let customerQueue = _get(state, 'customerQueue');
    let cart = _get(state, 'cart');
    let redemptionRules = _get(state, 'RedemptionRules.lookUpData.redemptionRule', {})
    return { customer, cart, redemptionRules, customerQueue }
}

export default connect(mapStateToProps)(withStyles(styles)(OrdersTab))