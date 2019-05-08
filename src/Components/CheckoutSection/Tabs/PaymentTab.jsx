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
import Dinero from 'dinero.js';

const DineroObj = () => {
    return Dinero({
        amount: 0,
        currency: 'USD'
    })
}

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
        let regularTotal = _get(cart,'regularTotalMoney') || DineroObj()
        let totalDiscountMoney = _get(cart, 'totalDiscountMoney') || DineroObj()
        let taxMoney = _get(cart, 'taxMoney') || DineroObj()
        let totalMoney = _get(cart, 'totalMoney') || DineroObj()
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
                                    <span className='summary-money'>{regularTotal.toFormat('$0,0.00')}</span>
                                </div>
                                <div className='each-detail flex-column align-center'>
                                    <span className='summary-title'>Total Discount</span>
                                    <span className='summary-money'>{totalDiscountMoney.toFormat('$0,0.00')}</span>
                                </div>
                                <div className='each-detail flex-column align-center'>
                                    <span className='summary-title'>Taxes</span>
                                    <span className='summary-money'>{taxMoney.toFormat('$0,0.00')}</span>
                                </div>
                            </div>
                            <div className='total-area flex-column '>
                                <span className='summary-title'>Total</span>
                                <span className='payment-total'>{totalMoney.toFormat('$0,0.00')}</span>
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