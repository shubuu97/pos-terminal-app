import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import _findIndex from 'lodash/findIndex';

/* Material import */
import Button from '@material-ui/core/Button';
import SvgIcon from '@material-ui/core/SvgIcon';
/* Redux Imports */
import {commonActionCreater} from '../../../Redux/commonAction'

/* Component Imports */

/* style */
class OrdersTab extends React.Component {

    constructor() {
        super();
        this.state = {
            totalCartItems:0,
            orderTotal:0
        }
    }
    handleDelete=(item)=>
    {
    let cartItems = [...this.props.cartItems];
    let index = _findIndex(cartItems, ['id',item.id]);
    cartItems.splice(index,1);
    this.props.dispatch(commonActionCreater(cartItems, 'CART_ITEM_LIST'));

    }
    handleIncreaseQuantity = (item)=>
    {
        let cartItems = [...this.props.cartItems];
        let index = _findIndex(cartItems, ['id',item.id]);
        cartItems[index].cartQuantity = cartItems[index].cartQuantity+1;
        cartItems[index].subTotal = item.salePrice.price* cartItems[index].cartQuantity;
        this.props.dispatch(commonActionCreater(cartItems, 'CART_ITEM_LIST'));
    }
    handleDecreseQuantity = (item)=>{
        let cartItems = [...this.props.cartItems];
        let index = _findIndex(cartItems, ['id',item.id]);
        cartItems[index].cartQuantity = cartItems[index].cartQuantity-1;
        cartItems[index].subTotal = item.salePrice.price* cartItems[index].cartQuantity;
        if(cartItems[index].cartQuantity==0){
         cartItems.splice(index,1);
        }
        this.props.dispatch(commonActionCreater(cartItems, 'CART_ITEM_LIST'));
    }

    mapCartItems = () => {
        let totalCartItems = 0;
        let orderTotal = 0
        let cartItems =  this.props.cartItems.map((item) => {
            totalCartItems+=item.cartQuantity;
            orderTotal+=item.subTotal;
            this.state.orderTotal = this.state.orderTotal+item.subTotal;
            return (
                <div className='p-rel each-checkout-item flex-row'>
                    <div onClick={()=>this.handleDelete(item)} className='p-abs delete-item'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            <path d="M0 0h24v24H0z" fill="none" />
                        </svg>
                    </div>
                    <div className='each-img'>
                        <img src={item.image} alt="img" />
                    </div>
                    <div className='each-product-des flex-column'>
                        <span className='title'>{item.name}</span>
                        <span className='code'>{item.sku}</span>
                        <span className='title'>
                        <span onClick={()=>this.handleIncreaseQuantity(item)} style={{cursor:'pointer'}}>+</span>
                        <span>{item.cartQuantity}</span>
                        <span  onClick={()=>this.handleDecreseQuantity(item)} style={{cursor:'pointer'}}>-</span></span>
                        <span className='code'>{`${_get(item,'salePrice.currencyCode')}${_get(item,'salePrice.price')}`}</span>
                    </div>
                    <div className='each-product-price flex-column justify-center'>
                       {item.subTotal.toFixed(2)}
                   </div>
                </div>)
        });
        let reqObj = {};
        reqObj.orderTotal = orderTotal.toFixed(2);
        reqObj.totalCartItems = totalCartItems;
        // this.props.dispatch(commonActionCreater(reqObj, 'ORDER_DETAILS'));
        this.state.orderTotal = orderTotal.toFixed(2);
        this.state.totalCartItems = totalCartItems;
        return cartItems
    }

    render() {
        let { checkoutcalcArea, checkoutactionArea, checkoutcartArea, checkoutMainPart } = this.props
        return (
            <div className="orders-section" style={{ height: checkoutMainPart }}>
                <div className="items-section flex-column" style={{ height: checkoutcartArea }}>
                {this.mapCartItems()}
                </div>




                <div className='calculation-section flex-row' style={{ height: checkoutcalcArea }}>
                    <div className="calc-first-part">
                        <div className="cart-details">
                            <div className='cart-each-details'>
                                <span className='cart-title'>Total Items </span>
                                <span className='cart-amount'>{this.state.totalCartItems}</span>
                            </div>
                            <div className='cart-each-details'>
                                <span className='cart-title'>Discount </span>
                                <span className='cart-amount'>- $0</span>
                            </div>
                            <div className='cart-each-details'>
                                <span className='cart-title'>Est.Tax </span>
                                <span className='cart-amount'>$0</span>
                            </div>
                        </div>
                    </div>
                    <div className="calc-second-part flex-column justify-space-between">
                        <div className="cart-details">
                            <div className='cart-each-details'>
                                <span className='cart-title'>Order Total </span>
                                <span className='cart-amount'>{this.state.orderTotal}</span>
                            </div>
                            <div className='cart-each-details'>
                                <span className='cart-title'>Discount </span>
                                <span className='cart-amount'>- $ 0</span>
                            </div>
                            <div className='cart-each-details'>
                                <span className='cart-title'>Est.Tax </span>
                                <span className='cart-amount'>$ 0</span>
                            </div>
                        </div>
                        <div className="cart-total">
                            <span className='total-text'>Total </span>
                            <span className='total-amount'>{this.state.orderTotal}</span>
                        </div>
                    </div>
                </div>




                <div className='button-section flex-row ' style={{ height: checkoutactionArea }}>
                    <div>
                        <Button className='mr-20' variant="outlined">Clear</Button>
                        <Button className='mr-20' variant="outlined">Hold</Button>
                        <Button variant="contained">Proceed</Button>
                    </div>

                </div>
            </div>
        );
    }
}

export default OrdersTab;