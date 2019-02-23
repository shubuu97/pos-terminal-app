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
import { connect } from 'react-redux'
import TextField from '@material-ui/core/TextField';
import { commonActionCreater } from '../../../Redux/commonAction';




class PaymentTab extends React.Component {

    constructor() {
        super();
        this.state = {
        }
    }

    handleReasonChange = (e) => {
        let value = _get(e, 'target.value', '');
        // this.setState({
        //     saleComments: value,
        // })
        this.props.dispatch(commonActionCreater(value, 'SALE_COMMENT'));
    }


    render() {
        let { checkoutactionArea, checkoutMainPart, checkoutCustomerArea, checkoutcalcArea, checkoutcartArea, cart } = this.props
        return (
            <div className="payment-section" style={{ height: checkoutMainPart }}>
                <div className='customer-summary fwidth flex-column'>
                    <span className='section-heading'>Customer Summary</span>
                    <div className='card '>
                        <React.Fragment>
                            {_get(cart, 'customer.email') ? <div>
                                <span className='summary-title'>Name-</span>
                                <span>{_get(cart, 'customer.customer.firstName')} {_get(cart, 'customer.customer.lastName')}</span>
                            </div> : null}
                        </React.Fragment>
                        <React.Fragment>
                            {_get(cart, 'customer.email') ? <div>
                                <span className='summary-title'>Email-</span>
                                <span>{_get(cart, 'customer.email')}</span>
                            </div> : null}
                        </React.Fragment>
                        <React.Fragment>
                            {_get(cart, 'customer.phoneNumber') ? <div>
                                <span className='summary-title'>Phone-</span>
                                <span>{_get(cart, 'customer.phoneNumber.countryCode')}{_get(cart, 'customer.phoneNumber.phoneNumber')}</span>
                            </div> : null}
                        </React.Fragment>
                    </div>
                </div>
                <div className='payment-summary fwidth flex-column'>
                    <span className='section-heading'>Payment Summary</span>
                    <div className='card flex-column flex-wrap'>
                        <div className='summary-area flex-row flex-wrap fwidth'>
                            <div className='each-detail flex-column align-center'>
                                <span className='summary-title'>Total Items</span>
                                <span className='summary-money'>{_get(cart, 'cartQty')}</span>
                            </div>
                            <div className='each-detail flex-column align-center'>
                                <span className='summary-title'>Cart Total</span>
                                <span className='summary-money'>${_get(cart, 'regularTotal')}</span>
                            </div>
                            <div className='each-detail flex-column align-center'>
                                <span className='summary-title'>Total Discount</span>
                                <span className='summary-money'>{_get(cart, 'totalDiscount.currencyCode')}{_get(cart, 'totalDiscount.amount')}</span>
                            </div>
                            <div className='each-detail flex-column align-center'>
                                <span className='summary-title'>Taxes</span>
                                <span className='summary-money'>{_get(cart, 'totalTaxAmount.currencyCode')}{_get(cart, 'totalTaxAmount.amount')}</span>
                            </div>
                        </div>
                        <div className='total-area flex-column '>
                            <span className='summary-title'>Total</span>
                            <span className='payment-total'>{_get(cart, 'totalAmount.currencyCode')}{_get(cart, 'totalAmount.amount')}</span>
                        </div>
                    </div>
                </div>
                <div className='payment-summary fwidth flex-column'>
                    <span className='section-heading'>Sale Comment</span>
                    <div className='card flex-column flex-wrap'>
                        <TextField
                            id="outlined-multiline-flexible"
                            label="Comments"
                            multiline
                            rowsMax="4"
                            value={_get(cart, 'saleComment', '')}
                            onChange={(e) => this.handleReasonChange(e)}
                            className={''}
                            margin="normal"
                            // helperText="Reason"
                            variant="outlined"
                        />
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    let cart = _get(state, 'cart');
    return { cart }
}
export default connect(mapStateToProps)(PaymentTab);