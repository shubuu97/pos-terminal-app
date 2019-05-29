import React from 'react';
import { withRouter } from 'react-router-dom';
// import { Detector } from 'react-detect-offline';
import aobLogo from '../../assets/images/aobLogodark.png';
/* Lodash Imports */
import _get from 'lodash/get';
import _set from 'lodash/set';
import _cloneDeep from 'lodash/cloneDeep';
/* Pouch DB */
import PouchDb from 'pouchdb';
/* Material import */
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
/* Redux Imports */
import { connect } from 'react-redux';
import { commonActionCreater } from '../../Redux/commonAction';
import { APPLICATION_BFF_URL } from '../../Redux/urlConstants';
import { postData } from '../../Redux/postAction';
import showMessage from '../../Redux/toastAction';
/* Global Imports */
import generateV1uuid from '../../Global/Uuid';
import LoaderButton from '../../Global/Components/LoaderButton';
import genericPostData from '../../Global/dataFetch/genericPostData';
import showErrorAlert from '../../Global/PosFunctions/showErrorAlert';
/* Component Imports */
import CashPay from './PaymentMethods/CashPay';
import CardPay from './PaymentMethods/CardPay';
import EmployeePay from './PaymentMethods/EmployeePay';
import GiftPay from './PaymentMethods/GiftPay';
import LoyaltyRedeem from './PaymentMethods/LoyaltyRedeem';
import PaymentReceipt from './paymentReceipt';
import CostCenter from './CostCenter';
import DecliningBalance from './PaymentMethods/DecliningBalance';
import Dinero from 'dinero.js';
import splitDotWithInt from '../../Global/PosFunctions/splitDotWithInt';


let dineroObj = (amount, currency) => {
    return Dinero({
        amount: parseInt(amount) || 0,
        currency: currency || 'USD'
    });
}

class PaymentSection extends React.Component {

    constructor() {
        super();
        this.state = {
            showCashPay: false,
            showCardPay: false,
            showEmpPay: false,
            showGiftPay: false,
            showLoyaltyRedeem: false,
            cardAmountValue: '',
            defaultcardAmountValue: '',
            cashPayValue: '',
            giftPayNumberValue: '',
            giftAmountRedeemValue: '',
            receiptData: {},
            showPaymentReceipt: false,
            giftCard: {},
            originalGiftCard: {},
            giftCardUsedValue: 0,
            comment: '',
            currentFocus: ''
        }
    }

    componentDidMount() {
        //Action for getting total remaining ammount
        this.props.dispatch(commonActionCreater({ totalAmount: this.props.totalAmount }, 'CASH_INPUT_HANDLER'));

    }
    componentWillUnmount() {
        //Action for destroy all amount reducer
    }

    populatePaymentOptions = () => {
        let allowedOptions = this.props.paymentMethods;
        let options = []

        let disable = this.props.remainingAmount.getAmount() <= 0 ? { opacity: '0.3', pointerEvents: 'none' } : null
        let disableOffline = this.props.offline ? { opacity: '0.3', pointerEvents: 'none' } : null;
        for (let i = 0; i < _get(allowedOptions, 'length', 0); i++) {
            switch (allowedOptions[i]) {
                case 0:
                    options.push(
                        <li style={disable} onClick={this.handleCashPayment} className="cash-method" > Cash</li>
                    )
                    break;
                case 1:
                    options.push(
                        <li style={disable} onClick={this.handleCardPayment} variant="outlined" className="card-method" > Debit / Credit Card</li>
                    )
                    break;
                case 2:
                    options.push(
                        this.giftCardRender()
                    )
                    break;
                case 3:
                    options.push(
                        _get(this.props, 'customer.isEmpPayEnabled') ? <li style={disable || disableOffline} onClick={this.handleCostCenter} variant="outlined" className="card-method">Cost Center Charge</li> : null
                    )
                    break;
                case 4:
                    options.push(
                        _get(this.props, 'customer.isEmpPayEnabled') ? < li style={disable || disableOffline} onClick={this.handleEmployeePay} className="employee-section" > Employee</li > : null
                    )
                    break;
                case 5:
                    options.push(
                        _get(this.props, 'totalAmount.amount') > _get(this.props, 'redemptionRules.lookUpData.redemptionRule.minimumSaleAmount') && !(_get(this.props, 'customer.guest', false)) ?
                            <li style={disable || disableOffline} onClick={this.handleLoyaltyRedeem} className="giftcard-section">Redeem Points</li> : null
                    )
                    break;
                case 6:
                    options.push(
                        <li style={disable} onClick={this.handleDeclineBalance} variant="outlined" className="card-method" >Declining Balance</li>
                    )
                    break;



                    {/* <li  className="freedompay">Freedom <br/> Pay</li>      */ }
            }
        }


        return options
    }

    handleCashPayment = () => {
        this.setState({ showCashPay: true })
    }
    handleCardPayment = () => {
        this.setState({ showCardPay: true })

    }
    handleEmployeePay = () => {
        this.setState({ showEmpPay: true })
    }
    handleGiftCardPayment = () => {
        this.setState({ showGiftPay: true })
    }
    handleLoyaltyRedeem = () => {
        this.setState({ showLoyaltyRedeem: true })
    }
    handleCostCenter = () => {
        this.setState({ showCostCenter: true })
    }
    handleDeclineBalance = () => {
        this.setState({ showDeclineBalance: true })

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
        _set(value, 'amount', splitDotWithInt(this.props.giftCardAmount))
        _set(value, 'currency', 'USD');
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
            errorCb: errorMethod,
            dontShowMessage: true
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
            errorCb: errorMethod,
            dontShowMessage: true
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
        if (this.state.currentFocus !== '') {
            let currentFocus = this.state.currentFocus;
            let focusItemValue
            if (currentFocus == 'loyaltyRedeem') {
                focusItemValue = this.props.loyaltyRedeemData.points;
            }
            else {
                focusItemValue = this.props[currentFocus];
            }
            if (num != '<') {
                focusItemValue = (focusItemValue || '') + num;
                let regex = /^\d*[\.\d]{1,3}$/;
                if (!regex.test(focusItemValue))
                    return false;

            }
            else {
                focusItemValue = 0;
            }
            if (currentFocus == 'loyaltyRedeem') {
                let loyaltyRedeemAmount = focusItemValue * _get(this.props, 'RedemptionRules.redemptionMultiplier', 0);
                this.props.dispatch(commonActionCreater({ loyaltyRedeem: loyaltyRedeemAmount, totalAmount: this.props.totalAmount, points: focusItemValue }, 'LOYALTY_INPUT_HANDLER'));
            }
            else {
                this.props.dispatch(commonActionCreater({ [currentFocus]: focusItemValue, totalAmount: this.props.totalAmount }, this.state.handler))
            }

        }
    }
    currentFocus = (field) => {
        this.setState({ currentFocus: field.fieldValue, handler: field.handler })
    }
    onRemovePaymentMethod = (fieldValue) => {
        if (fieldValue == 'showCashPay') {
            if (this.state.currentFocus == 'cashAmount') {
                this.setState({ [fieldValue]: false, currentFocus: '' });
            }
            else {
                this.setState({ [fieldValue]: false });
            }
            this.props.dispatch(commonActionCreater({ cashAmount: '', totalAmount: this.props.totalAmount }, 'CASH_INPUT_HANDLER'))
        }
        if (fieldValue == 'showCardPay') {
            if (this.state.currentFocus == 'cardAmount') {
                this.setState({ [fieldValue]: false, currentFocus: '' });
            }
            else {
                this.setState({ [fieldValue]: false });
            }
            this.props.dispatch(commonActionCreater({ cardAmount: '', totalAmount: this.props.totalAmount }, 'CARD_INPUT_HANDLER'))
        }
        if (fieldValue == 'showEmpPay') {
            if (this.state.currentFocus == 'employeePay') {
                this.setState({ [fieldValue]: false, currentFocus: '' });
            }
            else {
                this.setState({ [fieldValue]: false });
            }
            this.props.dispatch(commonActionCreater({ employeePay: '', totalAmount: this.props.totalAmount }, 'EMPLOYEE_PAYROLL'))

        }
        if (fieldValue == 'showGiftPay') {
            if (this.state.currentFocus == 'giftCardAmount' || this.state.currentFocus == 'giftPayNumber') {
                this.setState({ [fieldValue]: false, currentFocus: '' });
            }
            else {
                this.setState({ [fieldValue]: false });
            }
            this.props.dispatch(commonActionCreater({ giftPayNumber: '', totalAmount: this.props.totalAmount }, 'GIFT_CARD_NUMBER'));
            this.props.dispatch(commonActionCreater({ giftCardAmount: '', totalAmount: this.props.totalAmount }, 'GIFT_AMOUNT_TO_REDEEM'));
        }
        if (fieldValue == 'showLoyaltyRedeem') {
            if (this.state.currentFocus == 'loyaltyRedeem') {
                this.setState({ [fieldValue]: false, currentFocus: '' });
            }
            else {
                this.setState({ [fieldValue]: false });
            }
            this.props.dispatch(commonActionCreater({ loyaltyRedeem: '', totalAmount: this.props.totalAmount, points: 0 }, 'LOYALTY_INPUT_HANDLER'));
        }
        if (fieldValue == 'showCostCenter') {
            if (this.state.currentFocus == 'showCostCenter' || this.state.currentFocus == 'showCostCenter') {
                this.setState({ [fieldValue]: false, currentFocus: '' });
            }
            else {
                this.setState({ [fieldValue]: false });
            }
            this.props.dispatch(commonActionCreater({ giftPayNumber: '', totalAmount: this.props.totalAmount }, 'GIFT_CARD_NUMBER'));
            this.props.dispatch(commonActionCreater({ giftCardAmount: '', totalAmount: this.props.totalAmount }, 'GIFT_AMOUNT_TO_REDEEM'));
        }
        if (fieldValue == 'showDeclineBalance') {
            if (this.state.currentFocus == 'showDeclineBalance' || this.state.currentFocus == 'showDeclineBalance') {
                this.setState({ [fieldValue]: false, currentFocus: '' });
            }
            else {
                this.setState({ [fieldValue]: false });
            }
            this.props.dispatch(commonActionCreater({ decliningBalance: '', totalAmount: this.props.totalAmount }, 'DECLINING_BALANCE'));
        }
    }

    calcPaymentAmount = (a, b, c, d, e, f, g) => {
        let paymentAmount = dineroObj(0);
        a = dineroObj(splitDotWithInt(a));
        b = dineroObj(splitDotWithInt(b));
        c = dineroObj(splitDotWithInt(c));
        d = dineroObj(splitDotWithInt(d));
        e = dineroObj(splitDotWithInt(e));
        f = dineroObj(splitDotWithInt(f));
        g = dineroObj(splitDotWithInt(g));
        paymentAmount = paymentAmount.add(a).add(b).add(c).add(d).add(e).add(f).add(g)
        return paymentAmount;
    };

    makReqObj = async (offline) => {
        let { customer, cartItems, totalAmount, sessionId } = this.props;
        let { cartDiscount, employeeDiscountMoney, totalItemDiscountMoney, totalTaxAmount } = this.props.cart
        let saleItems = cartItems.map((item) => {
            let obj = {}
            obj.productId = item.doc.product.id;
            obj.qty = item.qty;
            obj.itemEffectiveTotal = item.itemEffectiveTotal;
            obj.itemRegularTotal = item.itemRegularTotalMoney;
            obj.cartDiscountTotal = item.cartDiscountMoney;
            obj.itemDiscountTotal = item.itemDiscountMoney
            obj.employeeDiscountTotal = item.empDiscountMoney
            obj.itemSubTotal = item.subTotal
            obj.itemTaxAmount = item.itemTaxAmount
            obj.saleType = item.saleType;
            obj.product = item.doc.product;
            return obj;
        });

        let payments = []
        if ((splitDotWithInt(this.props.cashAmount) || 0)) {
            payments.push({
                paymentMethod: 0,
                paymentAmount: { currency: 'USD', amount: splitDotWithInt(this.props.cashAmount) },
                paymentReference: ""
            })
        }
        if ((splitDotWithInt(this.props.cardAmount) || 0)) {
            payments.push({
                paymentMethod: 1,
                paymentAmount: { currency: 'USD', amount: splitDotWithInt(this.props.cardAmount) },
                paymentReference: this.props.cardRefrenceId
            })
        }
        if ((splitDotWithInt(this.props.giftCardAmount) || 0)) {
            let url = 'Sale/RedeemValueFromGiftCard';
            let value = {};
            _set(value, 'amount', splitDotWithInt(this.props.giftCardAmount));
            _set(value, 'currency', 'USD');
            let data = {
                retailerId: localStorage.getItem('retailerId'),
                terminalId: localStorage.getItem('terminalId'),
                customerId: _get(this.props, 'customer.id', ''),
                sessionId: localStorage.getItem('sessionId'),
                operatorId: localStorage.getItem('userId'),
                storeId: localStorage.getItem('storeId'),
                giftCardId: _get(this.props, 'giftCardData.id', ''),
                value: value
            }

            let apiResponse = await this.props.dispatch(postData(`${APPLICATION_BFF_URL}${url}`, data, 'GET_GIFT_CARD_PAYMENT_DATA', {
                init: 'GET_GIFT_CARD_PAYMENT_DATA_INIT',
                success: 'GET_GIFT_CARD_PAYMENT_DATA_SUCCESS',
                error: 'GET_GIFT_CARD_PAYMENT_DATA_ERROR'
            }))
            payments.push({
                paymentMethod: 2,
                paymentAmount: { currency: 'USD', amount: splitDotWithInt(this.props.giftCardAmount) },
                paymentReference: apiResponse,
            })
        }
        if ((splitDotWithInt(this.props.decliningBalance) || 0)) {
            let url = 'Payment/DecliningBalance/Save';
            let value = {};
            _set(value, 'amount', splitDotWithInt(this.props.decliningBalance));
            _set(value, 'currency', 'USD');
            let data = {
                retailerId: localStorage.getItem('retailerId'),
                terminalId: localStorage.getItem('terminalId'),
                customerId: _get(this.props, 'customer.id', ''),
                sessionId: localStorage.getItem('sessionId'),
                operatorId: localStorage.getItem('userId'),
                storeId: localStorage.getItem('storeId'),
                value: value
            }

            let apiResponse = await this.props.dispatch(postData(`${APPLICATION_BFF_URL}${url}`, data, 'SAVE_DECLINE_BALANCE_DATA', {
                init: 'SAVE_DECLINE_BALANCE_DATA_INIT',
                success: 'SAVE_DECLINE_BALANCE_DATA_SUCCESS',
                error: 'SAVE_DECLINE_BALANCE_DATA_ERROR'
            }))
            payments.push({
                paymentMethod: 6,
                paymentAmount: { currency: 'USD', amount: splitDotWithInt(this.props.decliningBalance) },
                paymentReference: apiResponse.referenceId,
            })
        }
        let LoyaltyValue = 0
        if ((splitDotWithInt(this.props.loyaltyRedeemPoints) || 0)) {
            let url = 'Sale/RedeemRewardPoints';
            let data = {
                retailerId: localStorage.getItem('retailerId'),
                terminalId: localStorage.getItem('terminalId'),
                customerId: _get(this.props, 'customer.id', ''),
                sessionId: localStorage.getItem('sessionId'),
                operatorId: localStorage.getItem('userId'),
                storeId: localStorage.getItem('storeId'),
                pointsToRedeem: parseInt(this.props.loyaltyRedeemPoints),
            }
            LoyaltyValue = splitDotWithInt(this.props.loyaltyRedeem);
            let apiResponse = await this.props.dispatch(postData(`${APPLICATION_BFF_URL}${url}`, data, 'GET_REF_FROM_LOYALTY_REDEEM', {
                init: 'GET_REF_FROM_LOYALTY_REDEEM_INIT',
                success: 'GET_REF_FROM_LOYALTY_REDEEM_SUCCESS',
                error: 'GET_REF_FROM_LOYALTY_REDEEM_ERROR'
            }))
            payments.push({
                paymentMethod: 5,
                paymentAmount: { currency: 'USD', amount: LoyaltyValue },
                paymentReference: apiResponse,
            })
        }
        if ((splitDotWithInt(this.props.costCenterAmount) || 0)) {
            let url = 'Payment/CostCenterCharge/Save';
            let data = {
                retailerId: localStorage.getItem('retailerId'),
                terminalId: localStorage.getItem('terminalId'),
                customerId: _get(this.props, 'customer.id', ''),
                sessionId: localStorage.getItem('sessionId'),
                operatorId: localStorage.getItem('userId'),
                storeId: localStorage.getItem('storeId'),
                departmentName: this.props.costCenterDepartment,
                chargeType: this.props.costCenterType,
                value: { currency: 'USD', amount: splitDotWithInt(this.props.costCenterAmount) },
            }
            let apiResponse = await this.props.dispatch(postData(`${APPLICATION_BFF_URL}${url}`, data, 'GET_COST_CENTER_CHARGE', {
                init: 'GET_COST_CENTER_CHARGE_INIT',
                success: 'GET_COST_CENTER_CHARGE_SUCCESS',
                error: 'GET_COST_CENTER_CHARGE_ERROR'
            }))
            payments.push({
                paymentMethod: 3,
                paymentAmount: { currency: 'USD', amount: (splitDotWithInt(this.props.costCenterAmount) || 0) },
                paymentReference: apiResponse,
            })
        }

        if ((splitDotWithInt(this.props.employeePay) || 0)) {
            let url = 'Payment/EmployeePayrollDeduct/Save';
            let data = {
                retailerId: localStorage.getItem('retailerId'),
                terminalId: localStorage.getItem('terminalId'),
                customerId: _get(this.props, 'customer.id', ''),
                sessionId: localStorage.getItem('sessionId'),
                operatorId: localStorage.getItem('userId'),
                storeId: localStorage.getItem('storeId'),
                value: {
                    currency: 'USD',
                    amount: splitDotWithInt(this.props.employeePay)
                }
            }
            let apiResponse = await this.props.dispatch(postData(`${APPLICATION_BFF_URL}${url}`, data, 'GET_REF_FROM_LOYALTY_REDEEM', {
                init: 'GET_REF_FROM_LOYALTY_REDEEM_INIT',
                success: 'GET_REF_FROM_LOYALTY_REDEEM_SUCCESS',
                error: 'GET_REF_FROM_LOYALTY_REDEEM_ERROR'
            }))
            payments.push({
                paymentMethod: 4,
                paymentAmount: { currency: 'USD', amount: splitDotWithInt(this.props.employeePay) },
                paymentReference: apiResponse
            })
        }



        let totalAmountPaid = this.calcPaymentAmount(this.props.cashAmount, this.props.cardAmount, this.props.employeePay, this.props.giftCardAmount, LoyaltyValue, this.props.costCenterAmount, this.props.decliningBalance);

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
            totalAmountPaid: { currency: 'USD', amount: totalAmountPaid.getAmount() },
            cartDiscountAmount: _get(cartDiscount, 'cartDiscountMoney', {}),
            employeeDiscountAmount: employeeDiscountMoney,
            itemDiscountAmount: totalItemDiscountMoney,
            totalTaxAmount,
            offline,
            saleComment: _get(this.state, 'comment', ''),
            saleTimeStamp: { seconds: parseInt((new Date().getTime() / 1000)) },
            changeDue: { currency: 'USD', amount: this.props.remainingAmount.isNegative() ? this.props.remainingAmount.multiply(-1).getAmount() : this.props.remainingAmount.getAmount() }

        };
        if (offline) {
            reqObj.customerName = _get(customer, 'customer.firstName', '') + ' ' + _get(customer, 'customer.lastName');
            reqObj.terminalName = localStorage.getItem('terminalName');
            reqObj.staffName = localStorage.getItem('userName');
            reqObj.id = generateV1uuid();
            reqObj._id = generateV1uuid();
        }
        return reqObj;

    }
    handleSaleTransaction = async (offline) => {
        this.setState({ isLoadingTransaction: true })
        await this.makReqObj(offline).then((reqObj) => {
            if (offline) {
                this.handleSaleTransactionOffline(JSON.parse(JSON.stringify(reqObj))); 
            }
            else {
                this.handleSaleTransactionOnline(reqObj);
            }
            if(localStorage.getItem('cannibis')){
                let queueId = _get(this.props, 'cannabisCustomer.queueId', '')
                genericPostData({
                    dispatch: this.props.dispatch,
                    reqObj: { id : queueId },
                    url: 'Remove/CustomerQueueById',
                    dontShowMessage: true,
                    constants: {
                        init: 'REMOVE_CUSTOMER_TO_QUEUE_INIT',
                        success: 'REMOVE_CUSTOMER_TO_QUEUE_SUCCESS',
                        error: 'REMOVE_CUSTOMER_TO_QUEUE_ERROR'
                    },
                    identifier: 'REMOVE_CUSTOMER_TO_QUEUE',
                    successCb: (data) => { }
                }).then((data) => {
                    this.props.dispatch(commonActionCreater(data.queueItems, 'UPDATE_CUSTOMER_QUEUE'));
                    this.props.dispatch(commonActionCreater({}, 'CUSTOMER_SERVING'));
                })
            }
        })
            .catch((error) => {
                this.setState({ isLoadingTransaction: false });
                showErrorAlert({ dispatch: this.props.dispatch, error: _get(error, 'err', '') })
            })
    }
    handleSaleTransactionOffline = (reqObj) => {
        let transactiondb = new PouchDb(`transactiondb${localStorage.getItem('storeId')}`)
        transactiondb.put({
            _id: reqObj.id,
            id: reqObj.id,
            transactionDoc: reqObj
        }).then((data) => {
            this.setState({ isLoadingTransaction: false });
            this.props.startPolling();
            this.setState({ receiptData: reqObj, showPaymentReceipt: true, transactionStatus: 'offline' });
            // if (process.env.NODE_ENV !== 'production') {
            //     PouchDb.replicate('transactiondb', `http://localhost:5984/transactiondb`, {
            //         live: true,
            //         retry: true
            //     });
            // }
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
            errorCb: this.handleSaleOnlineTransactionError,
            dontShowMessage: true

        })
    }

    handleSaleOnlineTransactionSuccess = (data) => {
        this.setState({ isLoadingTransaction: false })
        this.props.dispatch(commonActionCreater('', 'SALE_COMMENT'));
        this.setState({ receiptData: data, showPaymentReceipt: true, transactionStatus: 'online' })
    }
    handleSaleOnlineTransactionError = () => {
        this.setState({ isLoadingTransaction: false })
    }
    handleClose = () => {
        this.setState({
            showPaymentReceipt: false,
            showCashPay: false,
            showCardPay: false,
            showEmpPay: false,
            showGiftPay: false,
            cardAmountValue: '',
            defaultcardAmountValue: '',
            cashPayValue: '',
            giftPayNumberValue: '',
            receiptData: {}
        });
        this.props.history.push('/?tab==1');
    }
    disableDecider = () => {
        if (this.props.remainingAmount.getAmount() > 0) {
            return true
        }
        if (this.state.showCardPay) {
            if (this.props.cardAmount) {
                if (!this.props.cardRefrenceId) {
                    return true;
                }
            }
        }
        return false;
    }

    buttonToRender = () => {
        let online = !this.props.offline;
        if (online)
            return (
                <LoaderButton
                    color='primary'
                    isFetching={this.state.isLoadingTransaction}
                    fullWidth
                    disabled={this.disableDecider()}
                    variant='contained'
                    onClick={() => this.handleSaleTransaction(!online)}
                >  Submit Transaction</LoaderButton>
            )
        else {
            return (
            <LoaderButton
                style={{ color: 'red' }}
                fullWidth
                isFetching={this.state.isLoadingTransaction}
                disabled={this.disableDecider()}
                variant='contained'
                onClick={() => this.handleSaleTransaction(!online)}
            >  Submit Transaction Offline</LoaderButton>)
        }
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };
    giftCardRender = () => {
        let disable = this.props.remainingAmount.getAmount() <= 0 ? { opacity: '0.3', pointerEvents: 'none' } : null
        if (!this.props.offline)
            return (
                <React.Fragment>
                    <li style={disable} onClick={this.handleGiftCardPayment} className="giftcard-section">Gift Card</li>
                </React.Fragment>
            )
        else {
            return (
                <React.Fragment>
                    <li className='disable-button giftcard-section'>Gift Card</li>
                </React.Fragment>
            )
        }
    }

    render() {
        let { paymentOptionsPart, paymentMainPart, paymentCalculator, paymentSaleComment, paymentSubmitTransaction } = this.props
        let logo
        if (localStorage.getItem('storeLogo')) {
            logo = localStorage.getItem('storeLogo')
        } else {
            logo = aobLogo
        }

        return (
            <div className='pos-payment'>
                <div className='flex-column'>
                    <div className='flex-row justify-space-between' style={{ height: paymentOptionsPart }}>
                        <ul className="payment-method">
                            {this.populatePaymentOptions()}
                        </ul>
                    </div>

                    <div className='flex-row' style={{ height: paymentMainPart }}>
                        <div className='card transaction-card' style={{ height: paymentMainPart }}>
                            <span className='card-title soft-text'>Transactions</span>
                            <div className="Card">
                                <span>{this.props.remainingAmount.getAmount() > 0 ? 'Remaining Amount ' : 'Change Due '}</span>
                                <span>{this.props.remainingAmount.isNegative() ? this.props.remainingAmount.multiply(-1).toFormat('$0,0.00') : this.props.remainingAmount.toFormat('$0,0.00')}</span>
                            </div>
                            {this.state.showCashPay ?
                                <CashPay
                                    handleKeyBoardValue={this.handleKeyBoardValue}
                                    currentFocus={this.currentFocus}
                                    value={this.props.cashAmount}
                                    onRemovePaymentMethod={this.onRemovePaymentMethod}
                                /> : null}
                            {this.state.showCardPay ?
                                <CardPay
                                    handleKeyBoardValue={this.handleKeyBoardValue}
                                    currentFocus={this.currentFocus}
                                    value={this.props.cardAmount}
                                    onRemovePaymentMethod={this.onRemovePaymentMethod}
                                /> : null}
                            {this.state.showEmpPay ?
                                <EmployeePay
                                    handleKeyBoardValue={this.handleKeyBoardValue}
                                    customer={this.props.customer}
                                    value={this.props.employeePay}
                                    currentFocus={this.currentFocus}
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
                                    giftCard={this.state.giftCard}
                                    giftCardId={_get(this.state, 'giftCard.id', '')}
                                    originalGiftCard={this.state.originalGiftCard}
                                    onRemovePaymentMethod={this.onRemovePaymentMethod}
                                    onPayWithGiftCard={this.onPayWithGiftCard}
                                /> : null}
                            {this.state.showLoyaltyRedeem ?
                                <LoyaltyRedeem
                                    handleKeyBoardValue={this.handleKeyBoardValue}
                                    currentFocus={this.currentFocus}
                                    value={this.props.loyaltyRedeem}
                                    onRemovePaymentMethod={this.onRemovePaymentMethod}
                                /> : null}
                            {
                                this.state.showCostCenter ?
                                    <CostCenter
                                        currentFocus={this.currentFocus}
                                        onRemovePaymentMethod={this.onRemovePaymentMethod}
                                    /> : null
                            }
                            {
                                this.state.showDeclineBalance ?
                                    <DecliningBalance
                                        currentFocus={this.currentFocus}
                                        onRemovePaymentMethod={this.onRemovePaymentMethod}
                                    /> : null
                            }

                        </div>

                        <div className='numpad-section' style={{ height: paymentMainPart }}>
                            <div className='card numpad-card' style={{ height: paymentCalculator }}>
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
                            <div className='card' style={{ height: paymentSaleComment }}>
                                <TextField
                                    id="outlined-name"
                                    label="Sale Comment"
                                    value={this.state.comment}
                                    onChange={this.handleChange('comment')}
                                    margin="none"
                                    variant="outlined"
                                    fullWidth
                                />
                            </div>
                            <div className="flex-row justify-flex-end mr-10 ml-10 submit-transaction" style={{ height: paymentSubmitTransaction }}>
                                <div style={{ width: '100%' }}>
                                    {this.buttonToRender()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='none'>
                    <img src={logo} alt="" />
                </div>
                {this.state.showPaymentReceipt ? <PaymentReceipt
                    open={this.state.showPaymentReceipt}
                    transactionStatus={this.state.transactionStatus}
                    receiptData={this.state.receiptData}
                    handleClose={this.handleClose}
                    logo={logo}
                /> : null}


            </div>
        );
    }
}

function mapStateToProps(state) {
    let RedemptionRules = _get(state, 'RedemptionRules.lookUpData.redemptionRule', {})
    let cartItems = _get(state, 'cart.cartItems');
    let customer = _get(state, 'cart.customer');
    let totalAmount = _get(state, 'cart.totalMoney');
    let sessionId = _get(state, 'terminalData.lookUpData.sessionId');
    let saleComment = _get(state, 'cart.saleComment');
    let giftCard = _get(state, 'giftCardData.lookUpData', {});
    let giftCardPayment = _get(state, 'giftCardPaymentData.lookUpData', {});
    let cashAmount = _get(state, 'PaymentDetails.cashAmount');
    let loyaltyRedeem = _get(state, 'PaymentDetails.loyaltyRedeem', '');
    let loyaltyRedeemPoints = _get(state, 'loyaltyRedeem.lookUpData.points', '');
    let loyaltyRedeemData = _get(state, 'loyaltyRedeem.lookUpData', {});
    let cardAmount = _get(state, 'PaymentDetails.cardAmount');
    let giftCardAmount = _get(state, 'PaymentDetails.giftCardAmount');
    let giftPayNumber = _get(state, 'PaymentDetails.giftPayNumber');
    let employeePay = _get(state, 'PaymentDetails.employeePay');
    let remainingAmount = _get(state, 'PaymentDetails.remainingAmount');
    remainingAmount = remainingAmount || Dinero({ amount: 0, currency: 'USD' })
    let giftCardData = _get(state, 'PaymentDetails.giftCardData');
    let cart = _get(state, 'cart');
    let redemptionRules = _get(state, 'RedemptionRules');
    let cardRefrenceId = _get(state, 'PaymentDetails.cardRefrenceId');
    let costCenterAmount = _get(state, 'PaymentDetails.costCenterAmount');
    let costCenterType = _get(state, 'PaymentDetails.costCenterType');
    let costCenterDepartment = _get(state, 'PaymentDetails.costCenterDepartment');
    let decliningBalance = _get(state, 'PaymentDetails.decliningBalance');
    let cannabisCustomer = _get(state, 'customerQueue.customer', {})

    let paymentMethods = _get(state, 'storeData.lookUpData.store.paymentMethods')
    return {
        RedemptionRules,
        cart,
        cartItems,
        cashAmount,
        loyaltyRedeem,
        loyaltyRedeemPoints,
        loyaltyRedeemData,
        cardAmount,
        employeePay,
        giftCardAmount,
        giftPayNumber,
        remainingAmount,
        customer,
        totalAmount,
        sessionId,
        saleComment,
        giftCard,
        giftCardData,
        giftCardPayment,
        redemptionRules,
        cardRefrenceId,
        costCenterAmount,
        costCenterType,
        costCenterDepartment,
        paymentMethods,
        decliningBalance,
        cannabisCustomer

    }
}

export default withRouter(connect(mapStateToProps)(PaymentSection));