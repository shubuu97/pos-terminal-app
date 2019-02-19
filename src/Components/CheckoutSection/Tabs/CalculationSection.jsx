import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */

/* Material Icons */
import RemoveCircleIcons from '@material-ui/icons/RemoveCircleOutline';
import DeleteIcons from '@material-ui/icons/DeleteOutline';
import AddIcons from '@material-ui/icons/AddCircleOutline';
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
                            <span className='cart-title'>Cart Total</span>
                            <span className='cart-amount'>$500</span>
                        </div>
                        <div className='cart-each-details'>
                            <span className='cart-title flex-row align-center'>
                                <RemoveCircleIcons style={{ fontSize: '1.2em', color: '#ff000096', paddingRight: 5 }} />
                                Discount
                            </span>
                            <span className='cart-amount'>- $10</span>
                        </div>
                        <div className='cart-each-details'>
                            <span className='cart-title'>Emp. Discount </span>
                            <span className='cart-amount'>- $20</span>
                        </div>
                        <div className='cart-each-details'>
                            <span className='cart-title flex-row align-center'>
                                <RemoveCircleIcons style={{ fontSize: '1.2em', color: '#ff000096', paddingRight: 5 }} />
                                Item Discount
                            </span>
                            <span className='cart-amount'>- $50</span>
                        </div>
                    </div>
                </div>
                <div className="calc-second-part flex-column justify-space-between">
                    <div className="cart-details">
                        <div className='cart-each-details'>
                            <span className='cart-title'>Discount Total</span>
                            <span className='cart-amount'>$420</span>
                        </div>
                        <div className='cart-each-details'>
                            <span className='cart-title'>County Tax</span>
                            <span className='cart-amount'>$ 10</span>
                        </div>
                        <div className='cart-each-details'>
                            <span className='cart-title'>Fedral Tax</span>
                            <span className='cart-amount'>$ 10</span>
                        </div>
                        <div className='cart-each-details'>
                            <span className='cart-title'>State Tax</span>
                            <span className='cart-amount'>$ 10</span>
                        </div>
                    </div>
                    <div className="cart-total">
                        <span className='total-text'>Total </span>
                        <span className='total-amount'>$450</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default CalculationSection;