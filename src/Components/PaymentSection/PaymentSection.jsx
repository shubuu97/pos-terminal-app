import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */

/* Redux Imports */

/* Component Imports */
import CashPay from './CashPay';
import CardPay from './CardPay';
import DefaultCardPay from './DefaultCardPay';
import GiftPay from './GiftPay';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import genericPostData from '../../Global/dataFetch/genericPostData';
import PaymentReceipt from './paymentReceipt';
import {withRouter} from 'react-router-dom'

/* style */

class PaymentSection extends React.Component {

    constructor() {
        super();
        this.state = {
            showCashPay: false,
            showCardPay: false,
            showDefaultCardPay: false,
            showGiftPay: false,
            cardAmountValue: '',
            defaultcardAmountValue: '',
            cashPayValue: '',
            giftPayNumberValue: '',
            receiptData: {},
            showPaymentReceipt: false
        }


    }

    handleCashPayment = () => {
        this.setState({ showCashPay: true })
    }
    handleCardPayment = () => {
        this.setState({ showCardPay: true })

    }
    handleDefaultCardPayment = () => {
        this.setState({ showDefaultCardPay: true })
    }
    handleGiftCardPayment = () => {
        this.setState({ showGiftPay: true })
    }

    handleInputChange = num => event => {
        debugger;
        let currentFocus = this.state.currentFocus;
        let currenctFocusValue = this.state[`${currentFocus}Value`]
        if (num != '<') {
            currenctFocusValue = currenctFocusValue + num;
        }
        else {
            currenctFocusValue = ''
        }

        this.setState({
            [`${currentFocus}Value`]: currenctFocusValue,
        })
    }
    currentFocus = (fieldValue) => {
        this.setState({ currentFocus: fieldValue })
    }
    onRemovePaymentMethod = (fieldValue) => {
        if (fieldValue == 'showCashPay') {
            this.setState({ [fieldValue]: false, cashPayValue: '' })
        }
        if (fieldValue == 'showCardPay') {
            this.setState({ [fieldValue]: false, cardAmountValue: '' })
        }
        if (fieldValue == 'showDefaultCardPay') {
            this.setState({ [fieldValue]: false, defaultcardAmountValue: '' })
        }
        if (fieldValue == 'showGiftPay') {
            this.setState({ [fieldValue]: false, giftPayNumberValue: '' })
        }
    }
    handleSaleTransaction = () => {
        debugger;
        let { customer, cartItems, totalAmount, sessionId } = this.props;
        let { cartDiscountAmount, employeeDiscountAmount, itemDiscountAmount, totalTaxAmount } = this.props.cart
        let saleItems = cartItems.map((item) => {
            let obj = {}
            obj.productId = item.doc.product.id;
            obj.qty = item.qty;
            obj.itemEffectiveTotal = item.itemEffectiveTotal;
            obj.itemRegularTotal = item.itemRegularTotal;
            obj.cartDiscountPercent = item.cartDiscountPercent;
            obj.employeeDiscountPercent = item.employeeDiscountPercent;
            obj.itemTotalDiscountAmount = item.itemTotalDiscountAmount;
            obj.itemSubTotal = item.itemSubTotal;
            obj.taxPercentage = item.taxPercentage;
            return obj;
        });
        let payments = []
        if ((parseFloat(this.state.cashPayValue) || 0)) {
            payments.push({
                paymentMethod: 'CASH',
                paymentAmount: { currencyCode: '$', amount: (parseFloat(this.state.cashPayValue) || 0) },
                paymentReference: ""
            })
        }
        if ((parseFloat(this.state.defaultcardAmountValue) || 0)) {
            payments.push({
                paymentMethod: 'EMPLOYEE_PAYROLL_DEDUCT',
                paymentAmount: { currencyCode: '$', amount: (parseFloat(this.state.defaultcardAmountValue) || 0) },
                paymentReference: ""
            })
        }
        if ((parseFloat(this.state.cardAmountValue) || 0)) {
            payments.push({
                paymentMethod: 'CARD',
                paymentAmount: { currencyCode: '$', amount: (parseFloat(this.state.cardAmountValue) || 0) },
                paymentReference: ""
            })
        }

        let totalAmountPaid =
            (parseFloat(this.state.cardAmountValue) || 0) +
            (parseFloat(this.state.defaultcardAmountValue) || 0)
            + (parseFloat(this.state.cashPayValue || 0)) +
            (parseFloat(this.state.giftPayNumberValue) || 0)
        let reqObj = {
            customerId: customer.id,
            storeId: localStorage.getItem('storeId'),
            terminalId: localStorage.getItem('terminalId'),
            operatorId: localStorage.getItem('userId'),
            retailerId: localStorage.getItem('retailerId'),
            sessionId,
            saleItems,
            payments,
            miscSaleItems: [],
            totalAmount,
            totalAmountPaid: { currencyCode: '$', amount: totalAmountPaid },
            cartDiscountAmount,
            employeeDiscountAmount,
            itemDiscountAmount,
            totalTaxAmount,
            offline: false,
            saleComment: _get(this.props, 'saleComment', ''),
            saleTimeStamp: { seconds: parseInt((new Date().getTime() / 1000)) },
            changeDue: { currencyCode: '$', amount: parseFloat(Math.abs(this.calcRemainingAmount()).toFixed(2)) }

        };
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj,
            url: 'Sale/CreateSaleTransaction',
            constants: {
                init: 'POST_SALE_TRANSACTION_INIT',
                success: 'POST_SALE_TRANSACTION_SUCCESS',
                error: 'POST_SALE_TRANSACTION_ERROR'
            },
            identifier: 'SALE_TRANSACTION_INIT',
            successCb: this.handleSaleTransactionTransactionSuccess,
            errorCb: this.handleSaleTransactionTransactionError

        })

    }

    handleSaleTransactionTransactionSuccess = (data) => {
        this.setState({ receiptData: data, showPaymentReceipt: true })
    }
    handleSaleTransactionTransactionError = () => {
        debugger;
    }
    calcRemainingAmount = () => {
        let paymentAmount =
            (parseFloat(this.state.cardAmountValue) || 0) +
            (parseFloat(this.state.defaultcardAmountValue) || 0)
            + (parseFloat(this.state.cashPayValue || 0)) +
            (parseFloat(this.state.giftPayNumberValue) || 0);
        let netTotal = _get(this.props, 'cart.netTotal', 0);
        let remainingAmount = parseFloat(netTotal) - parseFloat(paymentAmount);
        return (remainingAmount || 0).toFixed(2);
    }
    handleClose = () => {
        this.setState({
            showPaymentReceipt: false,
            showCashPay: false,
            showCardPay: false,
            showDefaultCardPay: false,
            showGiftPay: false,
            cardAmountValue: '',
            defaultcardAmountValue: '',
            cashPayValue: '',
            giftPayNumberValue: '',
            receiptData: {},
            showPaymentReceipt: false
        });
        this.props.history.push('/?tab==1');
    }

    render() {
        return (
            <div className='pos-payment m-50'>
                <div className='card payment-card'>
                    <span className='card-title soft-text'>Payment Methods</span>
                    <div className='flex-row justify-center'>
                        <div onClick={this.handleCashPayment} className='each-payment-method'>
                            Cash Payment
                        </div>
                        <div onClick={this.handleCardPayment} className='each-payment-method'>
                            Debit/Credit Card
                        </div>
                        {_get(this.props, 'customer.employee') ? <div onClick={this.handleDefaultCardPayment} className='each-payment-method'>
                            Employee
                        </div> : null}
                        {/* <div onClick={this.handleGiftCardPayment} className='each-payment-method'>
                            Gift Card
                        </div> */}
                    </div>
                </div>
                <div className='flex-row'>
                    <div className='card transaction-card'>
                        <span className='card-title soft-text'>Transactions</span>
                        {this.state.showCashPay ?
                            <CashPay
                                currentFocus={this.currentFocus}
                                value={this.state.cashPayValue}
                                onRemovePaymentMethod={this.onRemovePaymentMethod}
                            /> : null}
                        {this.state.showCardPay ?
                            <CardPay
                                currentFocus={this.currentFocus}
                                value={this.state.cardAmountValue}
                                onRemovePaymentMethod={this.onRemovePaymentMethod}
                            /> : null}
                        {this.state.showDefaultCardPay ?
                            <DefaultCardPay
                                customer={this.props.customer}
                                value={this.state.defaultcardAmountValue}
                                currentFocus={this.currentFocus}
                                onRemovePaymentMethod={this.onRemovePaymentMethod}
                            /> : null}
                        {this.state.showGiftPay ?
                            <GiftPay
                                value={this.state.giftPayNumberValue}
                                currentFocus={this.currentFocus}
                                onRemovePaymentMethod={this.onRemovePaymentMethod}
                            /> : null}

                    </div>




                    <div className='card numpad-card'>
                        <span className='card-title'>Numpad</span>
                        <div className='flex-row flex-wrap justify-center pt-15'>
                            <div className='key small-key' onClick={this.handleInputChange('1')}>1</div>
                            <div className='key small-key' onClick={this.handleInputChange('2')}>2</div>
                            <div className='key small-key' onClick={this.handleInputChange('3')}>3</div>
                            <div className='key small-key' onClick={this.handleInputChange('4')}>4</div>
                            <div className='key small-key' onClick={this.handleInputChange('5')}>5</div>
                            <div className='key small-key' onClick={this.handleInputChange('6')}>6</div>
                            <div className='key small-key' onClick={this.handleInputChange('7')}>7</div>
                            <div className='key small-key' onClick={this.handleInputChange('8')}>8</div>
                            <div className='key small-key' onClick={this.handleInputChange('9')}>9</div>
                            <div className='key small-key' onClick={this.handleInputChange('.')}>.</div>
                            <div className='key small-key' onClick={this.handleInputChange('0')}>0</div>
                            <div className='key small-key' onClick={this.handleInputChange('<')}>clr</div>
                            <div className='small-key'></div>
                            <div className='key big-key'>Enter</div>
                        </div>
                    </div>

                </div>
                <div className="Card">
                    <span>{this.calcRemainingAmount() > 0 ? 'Remaining Amount ' : 'Change Due '}</span>
                    <span>{Math.abs(this.calcRemainingAmount())}</span>
                </div>
                <div className="flex-row justify-flex-end">
                    <div style={{ width: '48%' }}>
                        <Button
                            color='primary'
                            fullWidth
                            disabled={this.calcRemainingAmount() > 0}
                            variant='contained'
                            onClick={this.handleSaleTransaction}
                        >
                            Submit Transaction
                    </Button>
                    </div>
                </div>
                {this.state.showPaymentReceipt ? <PaymentReceipt
                    open={this.state.showPaymentReceipt}
                    receiptData={this.state.receiptData}
                    handleClose={this.handleClose}
                /> : null}
            </div>

        );
    }
}

function mapStateToProps(state) {
    let cartItems = _get(state, 'cart.cartItems');
    let customer = _get(state, 'cart.customer');
    let totalAmount = _get(state, 'cart.totalAmount');
    let sessionId = _get(state, 'terminalData.lookUpData.sessionId');
    let saleComment = _get(state, 'staticReducers.saleComment');

    let cart = _get(state, 'cart');

    return { cartItems, customer, totalAmount, cart, sessionId, saleComment }
}

export default withRouter(connect(mapStateToProps)(PaymentSection));