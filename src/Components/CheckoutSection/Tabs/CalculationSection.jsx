import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */

/* Material Icons */
import RemoveCircleIcons from '@material-ui/icons/RemoveCircleOutline';
/* Redux Imports */
import { connect } from 'react-redux';

/* Component Imports */


class CalculationSection extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }

    render() {
        let { checkoutcalcArea, cartItems, cart } = this.props
        return (
            <div className='calculation-section flex-row' style={{ height: checkoutcalcArea }}>
                <div className="calc-first-part">
                    <div className="cart-details">
                        <div className='cart-each-details'>
                            <span className='cart-title bold'>Gross Total</span>
                            <span className='cart-amount bold'>${_get(cart, 'grossTotal', 0)}</span>
                        </div>
                        {
                            _get(cart, 'cartDiscount', 0) > 0 ?
                                <div className='cart-each-details'>
                                    <span className='cart-title flex-row align-center'>
                                        <RemoveCircleIcons style={{ fontSize: '1.2em', color: '#ff000096', paddingRight: 5 }} />
                                        Cart Discount
                                    </span>
                                    <span className='cart-amount'>- ${_get(cart, 'cartDiscount')}</span>
                                </div> : null
                        }
                        {
                            _get(cart, 'empDiscount', 0) > 0 ?
                                <div className='cart-each-details'>
                                    <span className='cart-title'>Emp. Discount </span>
                                    <span className='cart-amount'>- ${_get(cart, 'empDiscount')}</span>
                                </div> : null
                        }
                        {
                            _get(cart, 'itemsDiscount', 0) > 0 ?
                            <div className='cart-each-details'>
                                <span className='cart-title flex-row align-center'>
                                    <RemoveCircleIcons style={{ fontSize: '1.2em', color: '#ff000096', paddingRight: 5 }} />
                                    Items Discount
                                </span>
                                <span className='cart-amount'>- ${_get(cart, 'itemsDiscount')}</span>
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
                            <span className='cart-amount'>0</span>
                        </div>
                    </div>
                    <div className="cart-total">
                        <span className='total-text'>Total </span>
                        <span className='total-amount'>${_get(cart, 'netTotal')}</span>
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
