import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */
import Button from '@material-ui/core/Button';
/* Material Icons */
import PersonAdd from '@material-ui/icons/PersonAddOutlined';
/* Redux Imports */

/* Global Imports */
import ReactSelect from '../../../Global/Components/ReactSelect/async-react-select';
import genericPostData from '../../../Global/dataFetch/genericPostData';
/* Component Imports */
import CalculationSection from './CalculationSection';




class PaymentTab extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }


    render() {
        let { checkoutactionArea, checkoutMainPart, checkoutCustomerArea, checkoutcalcArea, checkoutcartArea } = this.props
        return (
            <div className="payment-section" style={{ height: checkoutMainPart }}>
                <div className='customer-summary fwidth flex-column'>
                    <span className='section-heading'>Customer Summary</span>
                    <div className='card '>

                    </div>
                </div>
                <div className='payment-summary fwidth flex-column'>
                    <span className='section-heading'>Payment Summary</span>
                    <div className='card flex-column flex-wrap'>
                        <div className='summary-area flex-row flex-wrap fwidth'>
                            <div className='each-detail flex-column align-center'>
                                <span className='summary-title'>Total Items</span>
                                <span className='summary-money'>10</span>
                            </div>
                            <div className='each-detail flex-column align-center'>
                                <span className='summary-title'>Cart Total</span>
                                <span className='summary-money'>$345</span>
                            </div>
                            <div className='each-detail flex-column align-center'>
                                <span className='summary-title'>Total Discount</span>
                                <span className='summary-money'>$345</span>
                            </div>
                            <div className='each-detail flex-column align-center'>
                                <span className='summary-title'>Taxes</span>
                                <span className='summary-money'>$345</span>
                            </div>
                        </div>
                        <div className='total-area flex-column '>
                            <span className='summary-title'>Total</span>
                            <span className='payment-total'>$450.00</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PaymentTab;