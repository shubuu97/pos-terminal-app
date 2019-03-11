import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import _findIndex from 'lodash/findIndex';
import _isArray from 'lodash/isArray';
/* Material import */
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
/* Material Icons */
import RemoveCircleIcons from '@material-ui/icons/RemoveCircleOutline';
import DeleteIcons from '@material-ui/icons/DeleteOutline';
import AddIcons from '@material-ui/icons/AddCircleOutline';
/* Redux Imports */
import { commonActionCreater } from '../../../Redux/commonAction';
/* Component Imports */
import CalculationSection from './CalculationSection'
import DiscountDialogue from '../DiscountDialogue/DiscountDialogue'
/* Global Function import */
import globalClearCart from '../../../Global/PosFunctions/clearCart';
import addGuestToCart from '../../../Global/PosFunctions/addGuestToCart';
/* Asset Import  */
import EmptyCartImg from '../../../assets/images/pos/empty_cart.png'


class OrdersTab extends React.Component {

    constructor() {
        super();
        this.state = {
            totalCartItems: 0,
            orderTotal: 0,
            expanded: null,
            cartListHeight: 0,
            open: false,
            identifier: '',
            itemIndex: '',
            forCart: false,
            cartItemQty: 0,
        }
    }

    componentDidMount() {
        this.setState({ cartItemQty: _get(this, 'props.cart.cartQty', 0) })
    }

    componentWillReceiveProps(props) {
        let cartItemHeight = 0
        let cartListHeight = this.props.checkoutcartArea - cartItemHeight - 30;
        this.setState({
            cartListHeight
        })
        if (this.state.cartItemQty != _get(props, 'cart.cartQty', 0)) {
            this.props.dispatch(commonActionCreater(1, 'SWITCH_TAB_NUMBER'))
            this.setState({
                cartItemQty: _get(props, 'cart.cartQty', 0)
            })
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


    // * Functions to Update Cart Reducers 
    handleDelete = (item) => {
        let cartItems = [...this.props.cartItems];
        let index = _findIndex(cartItems, ['id', item.id]);
        cartItems.splice(index, 1);
        this.props.dispatch(commonActionCreater(cartItems, 'CART_ITEM_LIST'));
    };
    handleIncreaseQuantity = (item) => {
        let cartItems = [...this.props.cartItems];
        let index = _findIndex(cartItems, ['id', item.id]);
        cartItems[index].qty = cartItems[index].qty + 1;
        this.props.dispatch(commonActionCreater(cartItems, 'CART_ITEM_LIST'));
    };
    handleDecreseQuantity = (item) => {
        let cartItems = [...this.props.cartItems];
        let index = _findIndex(cartItems, ['id', item.id]);
        cartItems[index].qty = cartItems[index].qty - 1;
        if (cartItems[index].qty == 0) {
            cartItems.splice(index, 1);
        }
        this.props.dispatch(commonActionCreater(cartItems, 'CART_ITEM_LIST'));
    };
    handleDiscount = (data, identifier, index, type) => {
        let cartItems = _get(this, 'props.cart.cartItems', []);
        console.log('cartitems', cartItems);
        let cartDiscountPercent = 0;
        // let maxDiscount = 80;
        if (type === '$') {
            let cartTotal = 0;
            _isArray(cartItems) && cartItems.map((cartItem) => {
                cartTotal += Number(_get(cartItem, 'itemRegularTotal.amount', 0));
            })
            let discountDoll = parseFloat(data);
            let absolutePer = Number(discountDoll / cartTotal);
            cartDiscountPercent = parseFloat((absolutePer * 100).toFixed(2));
        } else {
            cartDiscountPercent = parseFloat(data);
        }
        let reqObj = [
            ...cartItems
        ]
        if (identifier == 'Discount') {
            // if(cartDiscountPercent < maxDiscount) {
            this.props.dispatch(commonActionCreater(cartDiscountPercent, 'ADD_DISCOUNT_TO_CART'));
            this.props.dispatch(commonActionCreater(reqObj, 'CART_ITEM_LIST'));
            // } else {
            //     alert('discount should be less than 80%');
            // }

        }
        else if (identifier == 'ItemDiscount') {
            reqObj[index].itemDiscountPercent = parseFloat(data);
            this.props.dispatch(commonActionCreater(reqObj, 'CART_ITEM_LIST'));
        }
    };
    handleClearCart = () => {
        globalClearCart(this.props.dispatch);
        addGuestToCart(this.props.dispatch);
    };


    // * Populate each Item added to cart
    populateCartItems = () => {
        let totalCartItems = 0;
        let orderTotal = 0
        let cartItems = this.props.cartItems.map((item, index) => {
            totalCartItems += item.cartQuantity;
            orderTotal += item.subTotal;
            this.state.orderTotal = this.state.orderTotal + item.subTotal;
            return (
                <ExpansionPanel
                    className='each-checkout-item'
                    expanded={this.state.expanded === `Panel${_get(item, 'doc.product.sku')}`}
                    onChange={this.handleChange(`Panel${_get(item, 'doc.product.sku')}`)}>
                    <ExpansionPanelSummary>
                        <div className='each-product-des fwidth flex-row justify-space-between'>

                            {/* Item Quantity */}
                            {_get(item, 'doc.product.isGiftCard') ?
                                null :
                                <div className='each-item-qty absolute'>
                                    {item.qty}
                                </div>
                            }

                            {/* Delete Icon and Title */}
                            <div className=' des-first-part flex-row align-center'>
                                <DeleteIcons
                                    onClick={() => this.handleDelete(item)}
                                    style={{ color: '#ff000096', fontSize: '1.5em' }} />
                                <div className='title'>{_get(item, 'doc.product.isGiftCard') ? <div><span>Gift Card :</span> {_get(item, 'doc.product.name')}</div> :
                                    _get(item, 'doc.product.name')}</div>
                            </div>

                            {/* Item Price and Regular Price */}
                            <div className='flex-column'>
                                <div className='each-product-price'>{_get(item, 'itemSubTotal.currencyCode')} {_get(item, 'itemSubTotal.amount')}</div>
                                <div className='each-product-reg-price'>Reg Price - {_get(item, 'itemRegularTotal.currencyCode')} {_get(item, 'itemRegularTotal.amount')}</div>
                            </div>
                        </div>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div className='fwidth flex-row justify-space-between'>
                            {
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
                            <div className='expanded-options'>
                                <span className='option-title'>Item Discount</span>
                                <div className='flex-row justify-center align-center'>
                                    <div onClick={() => this.handleClickOpenItemDiscount(index)}>Add Discount</div>
                                </div>
                            </div>
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel >
            )
        });
        return cartItems.reverse()
    }
    handleProceedToCustomer = () => {
        this.props.dispatch(commonActionCreater(2, 'SWITCH_TAB_NUMBER'))
    }



    render() {
        let { checkoutcalcArea, checkoutactionArea, checkoutcartArea, checkoutMainPart } = this.props;
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
                />
                <div style={{ height: checkoutcartArea }}>
                    {/* <div className='cart-items' id='cartItemHeading'>
                        <span>Cart Items</span>
                        <Button variant="outlined" onClick={this.handleClickOpenDiscount}>Add Discount</Button>
                    </div> */}
                    <div className="items-section flex-column" style={{ height: this.state.cartListHeight }} >
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

export default OrdersTab;