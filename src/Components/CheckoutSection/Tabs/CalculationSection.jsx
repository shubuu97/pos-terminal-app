import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Dinero Import */
import Dinero from "dinero.js";
/* Material import */
import Button from '@material-ui/core/Button';
/* Material Icons */
import RemoveCircleIcons from '@material-ui/icons/RemoveCircleOutline';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
/* Redux Imports */
import { connect } from 'react-redux';
import { commonActionCreater } from '../../../Redux/commonAction';

/* Component Imports */



class CalculationSection extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }



    handleCartDiscountRemove = () => {
        let cartDiscountObj = {}
        cartDiscountObj.type = ''
        cartDiscountObj.cartDiscount = 0
        cartDiscountObj.cartItems = this.props.cartItems
        this.props.dispatch(commonActionCreater(cartDiscountObj, 'CART_ITEM_LIST'));
    }

    handleClickOpenDiscount = () => {

    }

    render() {
        let { checkoutcalcArea, cartItems, cart } = this.props
        let cartRegularTotal = _get(cart, 'regularTotalMoney', Dinero({ amount: 0, currency: 'USD'}))
        let cartNetTotal = _get(cart, 'netTotalMoney', Dinero({ amount: 0, currency: 'USD'}))
        let taxMoney = _get(cart, 'taxMoney', Dinero({ amount: 0, currency: 'USD'}))
        let totalMoney = _get(cart, 'totalMoney', Dinero({ amount: 0, currency: 'USD'}))
        return (
            <div className='calculation-section flex-row' style={{ height: checkoutcalcArea }}>
                <div className="calc-first-part">
                    <div className="cart-details">
                        <div className='cart-each-details'>
                            <span className='cart-title bold'>Regular Total</span>
                            <span className='cart-amount bold'>{cartRegularTotal.toFormat('$0,0.00')}</span>
                        </div>
                        {
                            _get(cart, 'cartDiscountAmount.amount', 0) > 0 ?
                                <div className='cart-each-details'>
                                    <span className='cart-title flex-row align-center'>
                                        <RemoveCircleIcons style={{ fontSize: '1.2em', color: '#ff000096', paddingRight: 5 }}
                                            onClick={this.handleCartDiscountRemove}
                                        />
                                        Cart Discount
                                    </span>
                                    <span className='cart-amount'>- {_get(cart, 'cartDiscountAmount.currencyCode')}{_get(cart, 'cartDiscountAmount.amount', 0).toFixed(2)}</span>
                                </div> : null
                        }
                        {
                            _get(cart, 'employeeDiscountAmount.amount', 0) > 0 ?
                                <div className='cart-each-details'>
                                    <span className='cart-title'>Emp. Discount </span>
                                    <span className='cart-amount'>- {_get(cart, 'cartDiscountAmount.currencyCode')}{_get(cart, 'employeeDiscountAmount.amount', 0).toFixed(2)}</span>
                                </div> : null
                        }
                        {
                            _get(cart, 'itemDiscountAmount.amount', 0) > 0 ?
                                <div className='cart-each-details'>
                                    <span className='cart-title flex-row align-center'>
                                        {/* <RemoveCircleIcons style={{ fontSize: '1.2em', color: '#ff000096', paddingRight: 5 }} /> */}
                                        Item Discounts
                                </span>
                                    <span className='cart-amount'>- {_get(cart, 'itemDiscountAmount.currencyCode')}{_get(cart, 'itemDiscountAmount.amount', 0).toFixed(2)}</span>
                                </div> : null
                        }
                        {
                            _get(this, 'props.handleClickOpenDiscount', false) && !_get(cart, 'cartDiscountAmount.amount', 0) && _get(this, 'props.cartItems', []).length ?
                                <div className='cart-each-details cart-discount-btn'>
                                    <Button variant="outlined" onClick={this.props.handleClickOpenDiscount}><AddCircleOutline /> Cart Discount</Button>
                                </div>
                                : null
                        }
                    </div>
                </div>
                <div className="calc-second-part flex-column justify-space-between">
                    <div className="cart-details">
                        <div className='cart-each-details'>
                            <span className='cart-title bold'>Net Total</span>
                            <span className='cart-amount bold'>{cartNetTotal.toFormat('$0,0.00')}</span>
                        </div>
                        <div className='cart-each-details'>
                            <span className='cart-title'>Tax</span>
                            <span className='cart-amount'>{taxMoney.toFormat('$0,0.00')}</span>
                        </div>
                    </div>
                    <div className="cart-total">
                        <span className='total-text'>Total </span>
                        <span className='total-amount'>{_get(cart, 'totalAmount.currencyCode')}{totalMoney.toFormat('$0,0.00')}</span>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {

    let cartItems = _get(state, 'cart.cartItems', []);
    let cart = _get(state, 'cart', {})

    return {
        cartItems,
        cart
    };
}

export default connect(mapStateToProps)(CalculationSection);
