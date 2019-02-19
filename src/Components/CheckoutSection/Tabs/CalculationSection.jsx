import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */

/* Redux Imports */

/* Component Imports */


class CalculationSection extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }

    render() {
        let { checkoutcalcArea } = this.props
        return (
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
        );
    }
}

export default CalculationSection;