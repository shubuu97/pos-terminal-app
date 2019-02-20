import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import _findIndex from 'lodash/findIndex';

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
import { commonActionCreater } from '../../../Redux/commonAction'

/* Component Imports */
import CalculationSection from './CalculationSection'
import DiscountDialogue from '../DiscountDialogue/DiscountDialogue'
/* style */

/* Global Function import */
import globalClearCart from '../../../Global/PosFunctions/clearCart';
import globalHoldCart from '../../../Global/PosFunctions/holdCart';


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
            itemIndex: ''
        }
    }

    componentDidMount() {
        this.props.dispatch(commonActionCreater(10, 'ADD_DISCOUNT_TO_CART'));

    }

    componentWillReceiveProps(props) {
        let cartItemHeight = document.getElementById('cartItemHeading').offsetHeight;
        let cartListHeight = this.props.checkoutcartArea - cartItemHeight - 30;
        this.setState({
            cartListHeight
        })
    }

    handleDelete = (item) => {
        let cartItems = [...this.props.cartItems];
        let index = _findIndex(cartItems, ['id', item.id]);
        cartItems.splice(index, 1);
        this.props.dispatch(commonActionCreater(cartItems, 'CART_ITEM_LIST'));
    }

    handleIncreaseQuantity = (item) => {
        let cartItems = [...this.props.cartItems];
        let index = _findIndex(cartItems, ['id', item.id]);
        cartItems[index].cartQuantity = cartItems[index].cartQuantity + 1;
        // cartItems[index].subTotal = item.salePrice.price * cartItems[index].cartQuantity;
        this.props.dispatch(commonActionCreater(cartItems, 'CART_ITEM_LIST'));
    }
    handleDecreseQuantity = (item) => {
        let cartItems = [...this.props.cartItems];
        let index = _findIndex(cartItems, ['id', item.id]);
        cartItems[index].cartQuantity = cartItems[index].cartQuantity - 1;
        // cartItems[index].subTotal = item.salePrice.price * cartItems[index].cartQuantity;
        if (cartItems[index].cartQuantity == 0) {
            cartItems.splice(index, 1);
        }
        this.props.dispatch(commonActionCreater(cartItems, 'CART_ITEM_LIST'));
    }

    handleChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });
    };

    handleClickOpenDiscount = () => {
        this.setState({ 
            open: true,
            identifier: 'Discount'
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

    handleDiscount = (data, identifier, index) => {
        let cartItems = _get(this, 'props.cart.cartItems', []);

        if(identifier == 'Discount'){
            this.props.dispatch(commonActionCreater(data, 'ADD_DISCOUNT_TO_CART'));
        }
        else if(identifier == 'ItemDiscount'){
            let reqObj = [
                ...cartItems
            ]
            reqObj[index].itemDiscount = parseFloat(data);
            // reqObj[index].subTotal = (cartItems[index].salePrice.price * cartItems[index].cartQuantity) - parseFloat(data);
            this.props.dispatch(commonActionCreater(reqObj, 'CART_ITEM_LIST'));
        }
        
    }

    mapCartItems = () => {
        let totalCartItems = 0;
        let orderTotal = 0
        let cartItems = this.props.cartItems.map((item, index) => {
            totalCartItems += item.cartQuantity;
            orderTotal += item.subTotal;
            this.state.orderTotal = this.state.orderTotal + item.subTotal;
            return (
                <ExpansionPanel className='each-checkout-item' expanded={this.state.expanded === `Panel${item.sku}`} onChange={this.handleChange(`Panel${item.sku}`)}>
                    <ExpansionPanelSummary className=''>
                        <div className='each-product-des fwidth flex-row justify-space-between'>
                            <div className=' des-first-part flex-row align-center'>
                                <DeleteIcons onClick={() => this.handleDelete(item)} style={{ color: '#ff000096', fontSize: '1.5em' }} />
                                <div className='title'>{item.name}</div>
                            </div>

                            <div className='flex-column'>
                                <div className='each-product-price'>{_get(item, 'salePrice.currencyCode')} {item.subTotal.toFixed(2)}</div>
                                <div className='each-product-reg-price'>Reg Price - {_get(item, 'salePrice.currencyCode')}{item.salePrice.price}</div>
                            </div>
                        </div>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div className='fwidth flex-row justify-space-between'>
                            <div className='expanded-options'>
                                <span className='option-title'>Quantity</span>
                                <div className='flex-row justify-center align-center'>
                                    <RemoveCircleIcons onClick={() => this.handleDecreseQuantity(item)} style={{ fontSize: '1.7em' }} />
                                    <span className='quantity'>{item.cartQuantity}</span>
                                    <AddIcons onClick={() => this.handleIncreaseQuantity(item)} style={{ fontSize: '1.7em' }} />
                                </div>
                            </div>
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
        let reqObj = {};
        reqObj.orderTotal = orderTotal.toFixed(2);
        reqObj.totalCartItems = totalCartItems;
        // this.props.dispatch(commonActionCreater(reqObj, 'ORDER_DETAILS'));
        this.state.orderTotal = orderTotal.toFixed(2);
        this.state.totalCartItems = totalCartItems;
        return cartItems
    }
    clearCart = () => {
        globalClearCart(this.props.dispatch);
    }
    holdCart = () => {
        globalHoldCart(this.props.dispatch, this.props.cart, 'title', 'customer Name');
    }

    render() {

        let { checkoutcalcArea, checkoutactionArea, checkoutcartArea, checkoutMainPart } = this.props;

        return (
            <div className="orders-section" style={{ height: checkoutMainPart }}>
                <DiscountDialogue
                    open={this.state.open}
                    identifier={this.state.identifier}
                    handleClose={this.handleClose}
                    handleDiscount={this.handleDiscount}
                    itemIndex={this.state.itemIndex}
                />

                <div style={{ height: checkoutcartArea }}>
                    <div className='cart-items' id='cartItemHeading'>
                        <span>Cart Items</span>
                        <Button variant="outlined" onClick={this.handleClickOpenDiscount}>Add Discount</Button>
                    </div>
                    <div className="items-section flex-column" style={{ height: this.state.cartListHeight }} >
                        {this.mapCartItems()}
                    </div>
                </div>


                <CalculationSection
                    checkoutcalcArea={checkoutcalcArea}
                />
                <div className='button-section flex-row ' style={{ height: checkoutactionArea }}>
                    <div>
                        <Button className='mr-20' variant="outlined" onClick={this.clearCart}>Clear</Button>
                        <Button className='mr-20' variant="outlined" onClick={this.holdCart}>Hold</Button>
                        <Button variant="contained">Proceed</Button>
                    </div>

                </div>
            </div>
        );
    }
}

export default OrdersTab;