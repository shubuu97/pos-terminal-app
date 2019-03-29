import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */

/* Material Icons */
import PermIdentityOutlined from '@material-ui/icons/PermIdentityOutlined'
/* Redux Imports */

/* Global Imports */

/* Component Imports */
import { connect } from 'react-redux'
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
                    <div className='card'>
                        <div className='flex-row align-center justify-center'>
                            <div className='customer-icon flex-row justify-center'>
                                <PermIdentityOutlined style={{ fontSize: '3em', }} />
                            </div>
                            <div className='customer-basic-info flex-column'>
                                <div className='flex-row'>
                                    <div className='customer-name flex-column'>
                                        <span className='card-title'>Name</span>
                                        <span className='card-data'>
                                            {_get(cart, 'customer.customer.firstName', "")} {_get(cart, 'customer.customer.lastName, "')}
                                        </span>
                                    </div>
                                    {
                                        _get(cart, 'customer.guest', false) ?
                                            null :
                                            <div className='customer-phone flex-column'>
                                                <span className='card-title'>Phone</span>
                                                <span className='card-data'>
                                                    {_get(cart, 'customer.phoneNumber.countryCode', "")}{_get(cart, 'customer.phoneNumber.phoneNumber', "")}
                                                </span>
                                            </div>
                                    }
                                </div>
                                {
                                    _get(cart, 'customer.guest', false) ?
                                        null :
                                        <div className='customer-email flex-column'>
                                            <span className='card-title'>Email</span>
                                            <span className='card-data'>
                                                {_get(cart, 'customer.email', "")}
                                            </span>
                                        </div>
                                }
                            </div>
                        </div>
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
                                    <span className='summary-money'>${parseFloat(_get(cart, 'regularTotal', 0)).toFixed(2)}</span>
                                </div>
                                <div className='each-detail flex-column align-center'>
                                    <span className='summary-title'>Total Discount</span>
                                    <span className='summary-money'>{_get(cart, 'totalDiscount.currencyCode')}{parseFloat(_get(cart, 'totalDiscount.amount', 0)).toFixed(2)}</span>
                                </div>
                                <div className='each-detail flex-column align-center'>
                                    <span className='summary-title'>Taxes</span>
                                    <span className='summary-money'>{_get(cart, 'totalTaxAmount.currencyCode')}{parseFloat(_get(cart, 'totalTaxAmount.amount', 0)).toFixed(2)}</span>
                                </div>
                            </div>
                            <div className='total-area flex-column '>
                                <span className='summary-title'>Total</span>
                                <span className='payment-total'>{_get(cart, 'totalAmount.currencyCode')}{parseFloat(_get(cart, 'totalAmount.amount', 0)).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                );
            }
        }
        
function mapStateToProps(state) {
                    let cart = _get(state, 'cart');
    return {cart}
                }
export default connect(mapStateToProps)(PaymentTab);