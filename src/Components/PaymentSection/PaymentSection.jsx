import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import _set from 'lodash/set';
import _cloneDeep from 'lodash/cloneDeep';
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
import { withRouter } from 'react-router-dom'
import { commonActionCreater } from '../../Redux/commonAction';
import { Detector } from 'react-detect-offline';
import PouchDb from 'pouchdb';
import generateV1uuid from '../../Global/Uuid';
import LoaderButton from '../../Global/Components/LoaderButton';
let transactiondb = new PouchDb('transactiondb')
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
            giftAmountRedeemValue:'',
            receiptData: {},
            showPaymentReceipt: false,
            giftCard: {},
            originalGiftCard: {},
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

    handleKeyBoardValue = (field, value) => {
        this.setState({ [field]: value });
    }
    handleGiftCardValue = (field, value) => {
        let giftCard = _get(this.state, 'giftCard', {});
        let originalGiftCard = _get(this.state, 'originalGiftCard', {});
        let existingValue = _get(this.state, 'originalGiftCard.value.amount', 0);
        _set(giftCard, 'value.amount', (value == 0 || value == '' ? _get(originalGiftCard, 'value.amount', 0) : existingValue - value));
        this.setState({
            giftCard: giftCard,
            giftCardUsedValue: value,
        })
    }
    onPayWithGiftCard = () => {
        let url = 'Sale/RedeemValueFromGiftCard';
        let value = {};
        let paymentTimeStamp = {
            seconds: parseInt(new Date().getTime() / 1000),
        }
        _set(value, 'amount', parseFloat(this.state.giftCardUsedValue));
        _set(value, 'currencyCode', '$');
        let data = {
            giftCardId: _get(this.state, 'giftCard.id', ''),
            value: value,
            customerId: _get(this.props, 'customer.id', ''),
            sessionId: localStorage.getItem('sessionId'),
            retailerId: localStorage.getItem('retailerId'),
            paymentTimeStamp: paymentTimeStamp,

        }
        this.paymentWithGiftCard(url, data, this.handleGiftCardPaymentSuccess, this.handleGiftCardPaymentError)
    }
    handleGiftCardPaymentSuccess = (data) => {
        console.log('came in payment success', data);
    }
    handleGiftCardPaymentError = (err) => {
        console.log('came in payment error', err);
    }
    getGiftCardDetail = (field, value) => {
        let url = 'GiftCard/GetByCodeAndStore';
        let data = {
            storeId: localStorage.getItem('storeId'),
            code: value,
        }
        this.getExistingGiftCard(url, data, this.handleGetGiftcardDataSuccess, this.handleGetGiftCardDataError);
    }
    paymentWithGiftCard = (url, data, successMethod, errorMethod) => {
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: data,
            url: url,
            constants: {
                init: 'GET_GIFT_CARD_PAYMENT_DATA_INIT',
                success: 'GET_GIFT_CARD_PAYMENT_DATA_SUCCESS',
                error: 'GET_GIFT_CARD_PAYMENT_DATA_ERROR'
            },
            identifier: 'GET_GIFT_CARD_PAYMENT_DATA',
            successCb: successMethod,
            errorCb: errorMethod
        })
    }
    getExistingGiftCard = (url, data, successMethod, errorMethod) => {
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: data,
            url: url,
            constants: {
                init: 'GET_GIFT_CARD_DATA_INIT',
                success: 'GET_GIFT_CARD__DATA_SUCCESS',
                error: 'GET_GIFT_CARD__DATA_ERROR'
            },
            identifier: 'GET_GIFT_CARD__DATA',
            successCb: successMethod,
            errorCb: errorMethod
        })
    }
    handleGetGiftcardDataSuccess = () => {
        console.log('came in success of gift card get');
        let { giftCard } = this.props;
        let status = _get(giftCard, 'status', 0);
        if (_get(giftCard, 'giftCode') && status === 1) {
            this.setState({
                giftCard: giftCard,
                originalGiftCard: _cloneDeep(giftCard),
            });
        } else {
            this.setState({
                giftCard: {},
            });
            alert('this gift card is not available/active.')
        }
    }
    handleGetGiftCardDataError = () => {
        console.log('came in error of gift card get');
    }

    handleInputChange = num => event => {
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

    makReqObj = (offline) => {
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
            obj.saleType = item.saleType;
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
        if ((parseFloat(this.state.giftCardUsedValue) || 0)) {
            payments.push({
                paymentMethod: 'GIFT_CARD',
                paymentAmount: { currencyCode: '$', amount: (parseFloat(this.state.giftCardUsedValue) || 0) },
                paymentReference: _get(this.props, 'giftCardPayment', ''),
            })
        }

        let totalAmountPaid =
            (parseFloat(this.state.cardAmountValue) || 0) +
            (parseFloat(this.state.defaultcardAmountValue) || 0)
            + (parseFloat(this.state.cashPayValue || 0)) +
            (parseFloat(this.state.giftCardUsedValue) || 0)
        let reqObj = {
            customerId: customer.id,
            storeId: localStorage.getItem('storeId'),
            terminalId: localStorage.getItem('terminalId'),
            operatorId: localStorage.getItem('userId'),
            retailerId: localStorage.getItem('retailerId'),
            sessionId: localStorage.getItem('sessionId'),
            saleItems,
            payments,
            miscSaleItems: [],
            totalAmount,
            totalAmountPaid: { currencyCode: '$', amount: totalAmountPaid },
            cartDiscountAmount,
            employeeDiscountAmount,
            itemDiscountAmount,
            totalTaxAmount,
            offline,
            saleComment: _get(this.props, 'saleComment', ''),
            saleTimeStamp: { seconds: parseInt((new Date().getTime() / 1000)) },
            changeDue: { currencyCode: '$', amount: parseFloat(Math.abs(this.calcRemainingAmount()).toFixed(2)) }

        };
        return reqObj;

    }
    handleSaleTransaction = (offline) => {
        let reqObj = this.makReqObj(offline);
        this.setState({ isLoadingTransaction: true })
        if (offline) {
            this.handleSaleTransactionOffline(reqObj);
        }
        else {
            this.handleSaleTransactionOnline(reqObj);
        }


    }
    handleSaleTransactionOffline = (reqObj) => {
        transactiondb.put({
            _id: generateV1uuid(),
            transactionDoc: reqObj
        }).then((data) => {
            debugger;
            this.setState({ isLoadingTransaction: false });
            this.setState({ receiptData: reqObj, showPaymentReceipt: true, transactionStatus: 'offline' })
            PouchDb.replicate('transactiondb', `http://localhost:5984/transactiondb`, {
                live: true,
                retry: true
            })
        })
            .catch((err) => {
                this.setState({ isLoadingTransaction: false })
            })
    }

    handleSaleTransactionOnline = (reqObj) => {
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
            successCb: this.handleSaleOnlineTransactionSuccess,
            errorCb: this.handleSaleOnlineTransactionError

        })
    }

    handleSaleOnlineTransactionSuccess = (data) => {
        this.setState({ isLoadingTransaction: false })
        this.props.dispatch(commonActionCreater('', 'SALE_COMMENT'));
        this.setState({ receiptData: data, showPaymentReceipt: true, transactionStatus: 'online' })
    }
    handleSaleOnlineTransactionError = () => {
        this.setState({ isLoadingTransaction: false })
        debugger;
    }
    calcRemainingAmount = () => {
        let paymentAmount =
            (parseFloat(this.state.cardAmountValue) || 0) +
            (parseFloat(this.state.defaultcardAmountValue) || 0)
            + (parseFloat(this.state.cashPayValue || 0)) +
            (parseFloat(_get(this.state, 'giftAmountRedeemValue', 0)));
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

    buttonToRender = ({ online }) => {
        if (online)
            return (<LoaderButton
                color='primary'
                isFetching={this.state.isLoadingTransaction}
                fullWidth
                disabled={this.calcRemainingAmount() > 0}
                variant='contained'
                onClick={() => this.handleSaleTransaction(!online)}
            >  Submit Transaction
        </LoaderButton>)
        else {
            return (<LoaderButton
                style={{ color: 'red' }}
                fullWidth
                isFetching={this.state.isLoadingTransaction}
                disabled={this.calcRemainingAmount() > 0}
                variant='contained'
                onClick={() => this.handleSaleTransaction(!online)}
            >  Submit Transaction Offline
        </LoaderButton>)
        }
    }

    render() {
        return (
            <div className='pos-payment m-50'>
                <div className='card payment-card'>
                    <span className='card-title soft-text'>Payment Methods</span>
                    <div className='flex-row justify-center'>
                        <div style={this.calcRemainingAmount() < 0 ? { pointerEvents: 'none' } : null} onClick={this.handleCashPayment} className='each-payment-method'>
                            Cash Payment
                        </div>
                        <div style={this.calcRemainingAmount() < 0 ? { pointerEvents: 'none' } : null} onClick={this.handleCardPayment} className='each-payment-method'>
                            Debit/Credit Card
                        </div>
                        {_get(this.props, 'customer.isEmpPayEnabled') ? <div style={this.calcRemainingAmount() < 0 ? { pointerEvents: 'none' } : null} onClick={this.handleDefaultCardPayment} className='each-payment-method'>
                            Employee
                        </div> : null}
                        <div onClick={this.handleGiftCardPayment} className='each-payment-method'>
                            Gift Card
                        </div>
                    </div>
                </div>
                <div className='flex-row'>
                    <div className='card transaction-card'>
                        <span className='card-title soft-text'>Transactions</span>
                        {this.state.showCashPay ?
                            <CashPay
                                handleKeyBoardValue={this.handleKeyBoardValue}
                                currentFocus={this.currentFocus}
                                value={this.state.cashPayValue}
                                onRemovePaymentMethod={this.onRemovePaymentMethod}
                            /> : null}
                        {this.state.showCardPay ?
                            <CardPay
                                handleKeyBoardValue={this.handleKeyBoardValue}
                                currentFocus={this.currentFocus}
                                value={this.state.cardAmountValue}
                                initialValue={this.calcRemainingAmount()}
                                onRemovePaymentMethod={this.onRemovePaymentMethod}
                            /> : null}
                        {this.state.showDefaultCardPay ?
                            <DefaultCardPay
                                handleKeyBoardValue={this.handleKeyBoardValue}
                                customer={this.props.customer}
                                value={this.state.defaultcardAmountValue}
                                currentFocus={this.currentFocus}
                                initialValue={this.calcRemainingAmount()}
                                onRemovePaymentMethod={this.onRemovePaymentMethod}
                            /> : null}
                        {this.state.showGiftPay ?
                            <GiftPay
                                handleKeyBoardValue={this.handleKeyBoardValue}
                                handleGiftCardValue={this.handleGiftCardValue}
                                getGiftCardDetail={this.getGiftCardDetail}
                                giftPayNumberValue={this.state.giftPayNumberValue}
                                giftAmountRedeemValue={this.state.giftAmountRedeemValue}
                                currentFocus={this.currentFocus}
                                remainingAmount = {this.calcRemainingAmount()}
                                giftCard={this.state.giftCard}
                                giftCardId = {_get(this.state, 'giftCard.id', '')}
                                originalGiftCard={this.state.originalGiftCard}
                                onRemovePaymentMethod={this.onRemovePaymentMethod}
                                onPayWithGiftCard={this.onPayWithGiftCard}
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

                        <Detector
                            render={this.buttonToRender} />


                    </div>
                </div>
                {this.state.showPaymentReceipt ? <PaymentReceipt
                    open={this.state.showPaymentReceipt}
                    transactionStatus={this.state.transactionStatus}
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
    let saleComment = _get(state, 'cart.saleComment');
    let giftCard = _get(state, 'giftCardData.lookUpData', {});
    let giftCardPayment = _get(state, 'giftCardPaymentData.lookUpData', {});

    let cart = _get(state, 'cart');

    return { cartItems, customer, totalAmount, cart, sessionId, saleComment, giftCard, giftCardPayment }
}

export default withRouter(connect(mapStateToProps)(PaymentSection));