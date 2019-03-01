import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */

/* Material Icons */
import RemoveCircleIcons from '@material-ui/icons/RemoveCircleOutline';
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
    handleCartDiscountRemove = ()=>{
        this.props.dispatch(commonActionCreater(0,'ADD_DISCOUNT_TO_CART'));
        this.props.dispatch(commonActionCreater(this.props.cartItems,'CART_ITEM_LIST'));

    }

    render() {
        let { checkoutcalcArea, cartItems, cart } = this.props
        return (
            <div className='calculation-section flex-row' style={{ height: checkoutcalcArea }}>
                <div className="calc-first-part">
                    <div className="cart-details">
                        <div className='cart-each-details'>
                            <span className='cart-title bold'>Regular Total</span>
                            <span className='cart-amount bold'>${_get(cart, 'regularTotal', 0)}</span>
                        </div>
                        {
                            _get(cart, 'cartDiscountAmount.amount', 0) > 0 ?
                                <div className='cart-each-details'>
                                    <span className='cart-title flex-row align-center'>
                                        <RemoveCircleIcons style={{ fontSize: '1.2em', color: '#ff000096', paddingRight: 5 }}
                                        onClick = {this.handleCartDiscountRemove}
                                        />
                                        Cart Discount
                                    </span>
                                    <span className='cart-amount'>- {_get(cart, 'cartDiscountAmount.currencyCode')}{_get(cart, 'cartDiscountAmount.amount')}</span>
                                </div> : null
                        }
                        {
                            _get(cart, 'employeeDiscountAmount.amount', 0) > 0 ?
                                <div className='cart-each-details'>
                                    <span className='cart-title'>Emp. Discount </span>
                                    <span className='cart-amount'>- {_get(cart, 'cartDiscountAmount.currencyCode')}{_get(cart, 'employeeDiscountAmount.amount')}</span>
                                </div> : null
                        }
                        {
                            _get(cart, 'itemDiscountAmount.amount', 0) > 0 ?
                            <div className='cart-each-details'>
                                <span className='cart-title flex-row align-center'>
                                    <RemoveCircleIcons style={{ fontSize: '1.2em', color: '#ff000096', paddingRight: 5 }} />
                                    Items Discount
                                </span>
                                <span className='cart-amount'>- {_get(cart, 'itemDiscountAmount.currencyCode')}{_get(cart, 'itemDiscountAmount.amount')}</span>
                            </div> : null
                        }
                    </div>
                </div>
                <div className="calc-second-part flex-column justify-space-between">
                    <div className="cart-details">
                        <div className='cart-each-details'>
                            <span className='cart-title bold'>Net Total</span>
                            <span className='cart-amount bold'>${_get(cart, 'netTotal')}</span>
                        </div>
                        <div className='cart-each-details'>
                            <span className='cart-title'>Tax</span>
                            <span className='cart-amount'>{_get(cart, 'totalTaxAmount.currencyCode')}{_get(cart, 'totalTaxAmount.amount')}</span>
                        </div>
                    </div>
                    <div className="cart-total">
                        <span className='total-text'>Total </span>
                        <span className='total-amount'>{_get(cart, 'totalAmount.currencyCode')}{_get(cart, 'totalAmount.amount')}</span>
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
