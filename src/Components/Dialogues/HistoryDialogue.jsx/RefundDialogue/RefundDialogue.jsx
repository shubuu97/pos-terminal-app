import React from 'react';
/* React Pose */
import posed from 'react-pose';
/* Material Imports */
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close'

import TextField from '@material-ui/core/TextField';
/* Material Icons */
import RemoveCircleIcons from '@material-ui/icons/RemoveCircleOutline';
import AddIcons from '@material-ui/icons/AddCircleOutline';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
/* Lodash Imports */
import _get from 'lodash/get';
import _findIndex from 'lodash/findIndex';
import _find from 'lodash/find';
import _set from 'lodash/set';
import { commonActionCreater } from '../../../../Redux/commonAction';
/* Redux Imports */
import { connect } from 'react-redux';
import genericPostData from '../../../../Global/dataFetch/genericPostData';
import showMessage from '../../../../Redux/toastAction';
import RefundPrintView from '../RefundPrintView';
import dineroObj from '../../../../Global/PosFunctions/dineroObj';
import splitDot from '../../../../Global/PosFunctions/splitDot';
import splitDotWithInt from '../../../../Global/PosFunctions/splitDotWithInt';

const request = require('superagent');
const convert = require('xml-js');




let regex = /^\d*[\.\d]{1,3}$/;


function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class RefundDialogue extends React.Component {
    state = {
        open: false,
        error: false,
        success: false,
        step: 1,
        returnItems: [],
        totalRefundAmount: 0,
        returnObj: null,
        cardLoading: false
    };

    componentDidMount() {
        let payments = _get(this.props, "selectedSaleTransaction.sale.payments", []);
        let paidThroughCardObj = _find(payments, { paymentMethod: 1 });
        let paidThroughCard = _get(paidThroughCardObj, "paymentAmount.amount", 0);
        let paymentReferenceNumber = _get(paidThroughCardObj, "paymentReference", 0);
        let gc = this.props.paymentMethods.findIndex((m) => m == 2)
        let giftPayEnabled = gc == -1 ? false : true;
        let saleCommitTimeStamp = _get(this.props, "selectedSaleTransaction.sale.saleCommitTimeStamp.seconds", 0);
        let saleDate = new Date(saleCommitTimeStamp * 1000);
        let diffrenceOfDates = saleDate.getDate() - (new Date()).getDate();
        console.log(diffrenceOfDates, "########diffrenceOfDates#######");
        let saleCommitedToday = diffrenceOfDates == 0 ? true : false
        this.setState({ paidThroughCard, giftPayEnabled, saleCommitedToday, paymentReferenceNumber });
        this.props.dispatch(commonActionCreater({}, 'RESET_REFUND_REDUCER'));

    };

    handleClose = () => {
        this.setState({ open: false });
    };

    showItemList = () => {
        let saleItems = _get(this.props, "selectedSaleTransaction.sale.saleItems", []);
        let saleItemResp = saleItems.map((saleItem, index) => {
            if (saleItem.saleType == 1) {
                return null
            }
            if (this.state[`checkbox${index}`] == undefined)
                this.state[`checkbox${index}`] = true;
            let returnableQty = _get(saleItem, "qty", 0) - _get(saleItem, "returnQty", 0)
            return (<tr>
                <td>{_get(saleItem, "product.name", '')}</td>
                <td align='center' className='table-text'>{returnableQty}</td>
                <td align='center'>

                    {
                        <div className='expanded-options'>
                            <div className='flex-row justify-center align-center'>
                                <RemoveCircleIcons className='pr-10' onClick={() => this.handleDecreseQuantity(index, returnableQty)} style={{ fontSize: '2.3em' }} />
                                <span className='quantity table-text'>{this.state[`returnQty${index}`] || 0}</span>
                                <AddIcons className='pl-10' onClick={() => this.handleIncreaseQuantity(index, returnableQty)} style={{ fontSize: '2.3em' }} />
                            </div>
                        </div>
                    }
                </td>
                {
                    _get(saleItem, 'product.misc', false) ?
                        <td align='center '></td> :
                        <td align='center '><FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state[`checkbox${index}`]}
                                    onChange={this.handleChangeCB(index)}
                                // value="checkedA"
                                />
                            }
                        /></td>
                }

            </tr>)
        })
        return (
            <React.Fragment>
                {saleItemResp}
            </React.Fragment>

        )
    }

    refundSale = async () => {
        let saleId = _get(this.props, 'selectedSaleTransaction.sale.id')
        let refunds = [];
        if ((splitDotWithInt(this.props.cashAmount) || 0)) {

            refunds.push({
                paymentMethod: 0,
                paymentAmount: { currency: 'USD', amount:parseInt(splitDot(this.props.cashAmount))  },
                paymentReference: ""
            })
        }
        if ((splitDotWithInt(this.props.cardAmount) || 0)) {
            refunds.push({
                paymentMethod: 1,
                paymentAmount: { currencyCode: 'USD', amount:parseInt(splitDot(this.props.cardAmount))},
                paymentReference: this.props.cardRefrenceId
            })
        }
        if ((splitDotWithInt(this.props.giftCardAmount) || 0)) {

            let apiRespGetGiftCard = await genericPostData({
                dispatch: this.props.dispatch,
                reqObj: {
                    storeId: localStorage.getItem('storeId'),
                    code: this.state.giftCode
                },
                url: 'GiftCard/GetByCodeAndStore',
                constants: {
                    init: 'GET_GIFT_CARD_DATA_REFUND_INIT',
                    success: 'GET_GIFT_CARD_DATA_REFUND_SUCCESS',
                    error: 'GET_GIFT_CARD_DATA_REFUND_ERROR'
                },
                identifier: 'GET_GIFT_CARD_DATA_REFUND',
                dontShowMessage: true
            });
            let existingGiftCardId

            if (apiRespGetGiftCard) {
                if (apiRespGetGiftCard.status == 1) {
                    return ({ error: "Gift Card Already Exist" });
                }
                else {
                    existingGiftCardId = apiRespGetGiftCard.id
                }
            }

            let url = 'GiftCard/Create';
            let value = {};
            let paymentTimeStamp = {
                seconds: parseInt(new Date().getTime() / 1000),
            }
            _set(value, 'amount', parseInt(splitDot(this.props.giftCardAmount)));
            _set(value, 'currency', 'USD');
            let data = {}
            data.retailerId = localStorage.getItem('retailerId');
            data.storeId = localStorage.getItem('storeId');
            data.value = value;
            data.giftCode = this.state.giftCode;
            if (existingGiftCardId) {
                data.id = existingGiftCardId
            }
            _set(data, 'createdOn.seconds', parseInt((new Date().getTime()) / 1000));
            let apiResponse = await genericPostData({
                dispatch: this.props.dispatch,
                reqObj: data,
                url,
                constants: {
                    init: 'GIFT_CARD_CREATE_REFUND_INIT',
                    success: 'GIFT_CARD_CREATE_REFUND_SUCCESS',
                    error: 'GIFT_CARD_CREATE_REFUND_ERROR'
                },
                identifier: 'GIFT_CARD_CREATE_REFUND',
                dontShowMessage: true
            });

            refunds.push({
                paymentMethod: 2,
                paymentAmount:value,
                paymentReference: apiResponse.id,
            })
        }
        let refundSubTotal = 0;
        let refundTaxTotal = 0;
        let refundTotal = 0;
        let returnItems = this.state.returnItems.filter(returnItem => {
            return returnItem.qty > 0 ? true : false
        });
        returnItems.map(returnItem => {
            refundSubTotal = refundSubTotal + returnItem.itemRefundSubTotal.amount;
            refundTaxTotal = refundTaxTotal + returnItem.itemRefundTaxTotal.amount;
            refundTotal = refundTotal + returnItem.itemRefundEffectiveTotal.amount;
        })
        let reqObj = {
            saleId,
            returnItems,
            operatorId: localStorage.getItem("userId"),
            terminalId: localStorage.getItem("terminalId"),
            storeId: localStorage.getItem("storeId"),
            retailerId: localStorage.getItem("retailerId"),
            sessionId: localStorage.getItem("sessionId"),
            timestamp: { seconds: parseInt(new Date().getTime() / 1000) },
            reason: '',
            refunds,
            refundSubTotal: { currencyCode: "$", amount: refundSubTotal },
            refundTaxTotal: { currencyCode: "$", amount: refundTaxTotal },
            refundTotal: { currencyCode: "$", amount: refundTotal },
        }
        let saleRefundRes = await genericPostData({
            dispatch: this.props.dispatch,
            reqObj,
            url: "Sale/CreateReturnTransaction",
            constants: {
                init: "Sale_Refund_INIT",
                success: "Sale_Refund_SUCCESS",
                error: "Sale_Refund_ERROR"
            },
            identifier: "Sale_Refund",
            successCb: this.saleRefundSuccess,
            errorCb: this.saleRefundError
        })

        return saleRefundRes;
    }

    handleProceed = () => {
        let nextStep = this.state.step + 1
        if (nextStep == 2) {
            this.props.dispatch(commonActionCreater({ amount: this.state.totalRefundAmount }, 'RESET_REFUND_REDUCER'));
            this.setState({
                step: this.state.step + 1
            })
        }
        else if (nextStep == 3) {
            this.refundSale().then((data) => {
                if (_get(data, 'error')) {
                    this.props.dispatch(showMessage({ text: _get(data, 'error'), isSuccess: false }));
                    setTimeout(() => {
                        this.props.dispatch(showMessage({}));
                    }, 6000);
                    return;
                }
                
                let length = _get(data, 'sale.returns', []).length;
                let returnObj = _get(data, `sale.returns[${length - 1}]`, {})
                console.log(returnObj, 'mayuk')
                this.setState({
                    returnObj,
                    print: true
                })
            })
                .catch((err) => {
                    this.props.dispatch(showMessage({ text: _get(err, 'error'), isSuccess: false }));
                    setTimeout(() => {
                        this.props.dispatch(showMessage({}));
                    }, 6000);
                })
        }

    }

    handlePrint = () => {
        var content = document.getElementById('printarea');
        var pri = document.getElementById('ifmcontentstoprint').contentWindow;
        pri.document.open();
        pri.document.write(content.innerHTML);
        pri.document.close();
        pri.focus();
        pri.print();
        this.props.handleRefundClose();
        window.location.reload();
    }

    handleDecreseQuantity = (index, returnableQty) => {
        let returnQty = this.state[`returnQty${index}`]
        if (returnQty != 0) {
            let expectedQty = returnQty - 1;
            this.setState({
                [`returnQty${index}`]: expectedQty
            });
            this.makeReturnArray(index, expectedQty);
            this.calculateTotalRefundAmount();
        }
    }
    calAmounts = (amount, quantity, returnQuantity) => {
        let remainingQty = quantity-returnQuantity;
        if(remainingQty==0){
            return amount;
        }
        let allocatedAmount = dineroObj(amount).allocate([returnQuantity,remainingQty]);
        return allocatedAmount[0].getAmount()
    }
    calculateTotalRefundAmount = () => {
        console.log(this.state.returnItems, 'this.state.returnItems')
        let totalRefundAmount = this.state.returnItems.reduce((accumulator, refundItem) => {
            return accumulator + refundItem.itemRefundEffectiveTotal.amount
        }, 0);
       this.setState({ totalRefundAmount });
    }
    makeReturnArray = (index, expectedQty, replenishInventory) => {
        let refundObj = {};
        let selectedSaleItems = _get(this.props, `selectedSaleTransaction.sale.saleItems[${index}]`, {});

        //logic to calculate itemRefundSubTotalAmount;
        let qty = selectedSaleItems.returnableQty;
        let itemSubTotal = _get(selectedSaleItems, 'returnableSubTotal.amount', 0);
        let itemTaxAmount = _get(selectedSaleItems, 'returnableTaxTotal.amount', 0);
        //let itemEffectiveTotal = _get(selectedSaleItems, 'returnableEffectiveTotal.amount', 0);
        let itemRefundSubTotalAmount = this.calAmounts(itemSubTotal, qty, expectedQty);
        let itemRefundTaxTotalAmount = this.calAmounts(itemTaxAmount, qty, expectedQty);
        let itemRefundEffectiveTotalAmount = itemRefundSubTotalAmount + itemRefundTaxTotalAmount;
        console.log(itemRefundEffectiveTotalAmount,"itemRefundEffectiveTotalAmount")

        refundObj.itemRefundSubTotal = { currencyCode: "$", amount: itemRefundSubTotalAmount };
        refundObj.itemRefundTaxTotal = { currencyCode: "$", amount: itemRefundTaxTotalAmount };
        refundObj.itemRefundEffectiveTotal = { currencyCode: "$", amount: itemRefundEffectiveTotalAmount };
        refundObj.qty = expectedQty;
        refundObj.productId = selectedSaleItems.productId;
        refundObj.replenishInventory = replenishInventory;


        //logic to find if object already exist in the state
        let indexOfReturnItem = _findIndex(this.state.returnItems, { 'productId': selectedSaleItems.productId });
        if (indexOfReturnItem == -1) {
            this.state.returnItems.push(refundObj)
        }
        else {
            this.state.returnItems[indexOfReturnItem] = refundObj;
        }
    }

    handleIncreaseQuantity = (index, returnableQty) => {
        let returnQty = this.state[`returnQty${index}`] || 0
        if (returnQty < returnableQty) {
            let expectedQty = returnQty + 1;
            this.setState({
                [`returnQty${index}`]: expectedQty
            });

            this.makeReturnArray(index, expectedQty, this.state[`checkbox${index}`]);
            this.calculateTotalRefundAmount();
        }

    }
    handleChangeCB = index => event => {
        this.setState({ [`checkbox${index}`]: event.target.checked });
        let returnQty = this.state[`returnQty${index}`] || 0
        this.makeReturnArray(index, returnQty, event.target.checked);
    };
    handleRefundClick = (refundMethod) => (event) => {
        this.setState({ [refundMethod]: true });
    }

    onRemoveRefundMethod = (refundMethod) => {
        this.setState({ [refundMethod]: false });
        if(this.state.currentFocus==refundMethod){
            this.setState({currentFocus:''});
        }
        if (refundMethod == "cashRefund") {
            if(this.state.currentFocus=="cashAmount"){
                this.setState({currentFocus:''});
            }
            this.props.dispatch(commonActionCreater({ cashAmount: '', amount: this.state.totalRefundAmount }, 'CASH_REFUND_INPUT_HANDLER'));
        }
        else if (refundMethod == "cardRefund") {
            if(this.state.currentFocus=="cardAmount"){
                this.setState({currentFocus:''});
            }
            this.props.dispatch(commonActionCreater({ cardAmount: '', amount: this.state.totalRefundAmount, paidThroughCard: this.state.paidThroughCard }, 'CARD_REFUND_INPUT_HANDLER'));
        }
        else if (refundMethod == "giftRefund") {
            if(this.state.currentFocus=="giftCardAmount"){
                this.setState({currentFocus:''});
            }
            this.props.dispatch(commonActionCreater({ giftCardAmount: '', amount: this.state.totalRefundAmount, }, 'GIFTCARD_REFUND_INPUT_HANDLER'));
        }
    }

    giftCardRefundComponent = () => {
        return (<div className="default-card-pay">
            <span className='payment-title'>Gift Card Refund</span>
            {!this.props.cardRefrenceId ?
                <div className="flex-row align-center justify-space-between relative">
                    <div className="d-flex" style={{ width: '80%' }}>
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            autoFocus
                            id="outlined-name"
                            label="Gift Card Number"
                            value={this.state.giftCode}
                            onChange={(event) => this.setState({ giftCode: event.target.value })}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                        />
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            autoFocus
                            onFocus={() => this.currentFocus({ fieldValue: 'giftCardAmount', handler: 'GIFTCARD_REFUND_INPUT_HANDLER' })}
                            id="outlined-name"
                            label="Amount"
                            value={this.props.giftCardAmount}
                            onChange={this.handleGiftRefundAmountInput}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            className='ml-10'
                        />
                    </div>
                    <CloseIcon
                        onClick={() => this.onRemoveRefundMethod('giftRefund')} />
                </div> :
                <div>
                    <span>Ref Id:</span>
                    <span className="bold">{this.props.cardRefrenceId}</span>
                </div>
            }
        </div>)
    }

    cardRefundComponent = () => {
        return (<div className="default-card-pay">
            <span className='payment-title'>Card Refund</span>
            {!this.props.cardRefrenceId ?
                <div className="flex-row align-center justify-space-between relative">
                    <div style={{ width: '80%' }}>
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            autoFocus
                            onFocus={() => this.currentFocus({ fieldValue: 'cardAmount', handler: 'CARD_REFUND_INPUT_HANDLER' })}
                            id="outlined-name"
                            label="Amount"
                            value={this.props.cardAmount}
                            onChange={this.handleCardRefundAmountInput}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                        />
                    </div>
                    {
                        this.state.cardLoading ?
                            <div>Loading...</div> :
                            <React.Fragment>
                                {this.state.saleCommitedToday ?
                                    <span onClick={this.triggerFreedomPayRefund} className="pay-button flex-row justify-center align-center">Void</span> :
                                    <span onClick={this.triggerFreedomPayRefund} className="pay-button flex-row justify-center align-center">Refund</span>}
                            </React.Fragment>
                    }
                    <span onClick={this.reqPaymentByCard} className="pay-button flex-row justify-center align-center">
                        {this.state.paidThroughCard}</span>
                    <CloseIcon
                        onClick={() => this.onRemoveRefundMethod('cardRefund')} />
                </div> :
                <div>
                    <span>Ref Id:</span>
                    <span className="bold">{this.props.cardRefrenceId}</span>
                </div>
            }
        </div>)
    }
    makePOSReqObj = () => {
        let xmlBodyStr;
        if (this.state.saleCommitedToday) {
            xmlBodyStr = `<POSRequest>\
            <RequestType>Void</RequestType>\
            <TokenType>2</TokenType>\
            <RequestId>${_get(this.state, 'paymentReferenceNumber')}</RequestId>\
            <ClientEnvironment>${localStorage.getItem('freedomPayClientEnvironment')}</ClientEnvironment>\
            <StoreId>${localStorage.getItem('freedomPayStoreId')}</StoreId>\
            <TerminalId>${localStorage.getItem('freedomPayTerminalId')}</TerminalId>\
            <MerchantReferenceCode>${localStorage.getItem('merchantReferenceCode')}</MerchantReferenceCode>\
            <InvoiceNumber>174211</InvoiceNumber>\
            <WorkstationId>${localStorage.getItem('freedomPayWorkstationId')}</WorkstationId>\
            <Recurring p2:nil="true" xmlns:p2="http://www.w3.org/2001/XMLSchema-instance" />\
          </POSRequest>`;
        }
        else {

        }
        return xmlBodyStr;
    }
    triggerFreedomPayRefund = () => {
        this.setState({ cardLoading: true })
        let POSReqObj = this.makePOSReqObj();
        request
            .post(localStorage.getItem('freedomPayClientUrl'))
            .send(POSReqObj) // sends a JSON post body
            .then(res => {
                this.setState({ cardLoading: false })
                var json = convert.xml2json(res.text, { compact: true, spaces: 4 });
                let responseObj = JSON.parse(json);
                let POSResponse = _get(responseObj, 'POSResponse');
                console.log(POSResponse, "POSResponse");
                // if (_get(POSResponse, 'Decision._text') == 'A' && _get(POSResponse, 'ErrorCode._text') == '100') {
                //     this.posResponseSuccess(res.text, POSResponse, false, 1);
                //     return;
                // }
                // //if error has text msgs then show the code
                // if (_get(POSResponse, 'ErrorCode._text')) {
                //     if (_get(POSResponse, "Message._text")) {
                //         let errMsg = `Error Occured with code:${POSResponse.ErrorCode._text}(${_get(POSResponse, "Message._text")})`;
                //         this.posResponseSuccess(res.text, POSResponse, true, 1, errMsg)
                //         return;
                //     }
                //     //if error dont have the msg then codes giving the msgs
                //     let errorObj = codes(POSResponse.ErrorCode._text, true, 1);
                //     let errMsg = `Error Occured with code:${POSResponse.ErrorCode._text}(${_get(errorObj, 'descripton')})`
                //     this.posResponseSuccess(res.text, POSResponse, true, 1, errMsg)
                // }
            }).catch(err => {
                // showErrorAlert({ dispatch: this.props.dispatch, error: err.message })
                this.setState({ cardLoading: false })

            });
    }


    cashRefundComponent = () => {
        return (<div className="default-card-pay">
            <span className='payment-title'>Cash Refund</span>
            <div className="flex-row align-center justify-space-between">
                <div style={{ width: '80%' }}>
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        id="cashPay"
                        label="Amount"
                        type="tel"
                        value={this.props.cashAmount}
                        onChange={this.handleCashRefundAmountInput}
                        margin="outline"
                        onFocus={() => this.currentFocus({ fieldValue: 'cashAmount', handler: 'CASH_REFUND_INPUT_HANDLER' })}
                        fullWidth
                        autoFocus
                        type='text'
                        variant="outlined"
                        className='mt-10'
                    />
                </div>
                <CloseIcon
                    onClick={() => this.onRemoveRefundMethod('cashRefund')} />

            </div>
        </div>)
    }
    currentFocus = (field) => {
        this.setState({ currentFocus: field.fieldValue, handler: field.handler })
    }
    handleCashRefundAmountInput = event => {
        let value = event.target.value;
        if (regex.test(value)) {
            this.props.dispatch(commonActionCreater({ cashAmount: value, amount: this.state.totalRefundAmount }, 'CASH_REFUND_INPUT_HANDLER'));
        }
        else if (regex.test(value.substring(0, value.length - 1))) {
            this.props.dispatch(commonActionCreater({ cashAmount: value.substring(0, value.length - 1), amount: this.state.totalRefundAmount }, 'CASH_REFUND_INPUT_HANDLER'));
        }
        else {
            this.props.dispatch(commonActionCreater({ cashAmount: '', amount: this.state.totalRefundAmount }, 'CASH_REFUND_INPUT_HANDLER'));
        }
    }
    handleCardRefundAmountInput = event => {

        let value = event.target.value;
        if (regex.test(value)) {
            this.props.dispatch(commonActionCreater({ cardAmount: value, amount: this.state.totalRefundAmount, paidThroughCard: this.state.paidThroughCard }, 'CARD_REFUND_INPUT_HANDLER'));
        }
        else if (regex.test(value.substring(0, value.length - 1))) {
            this.props.dispatch(commonActionCreater({ cardAmount: value.substring(0, value.length - 1), amount: this.state.totalRefundAmount, paidThroughCard: this.state.paidThroughCard }, 'CARD_REFUND_INPUT_HANDLER'));
        }
        else {
            this.props.dispatch(commonActionCreater({ cardAmount: '', amount: this.state.totalRefundAmount, paidThroughCard: this.state.paidThroughCard }, 'CARD_REFUND_INPUT_HANDLER'));
        }
    }
    handleGiftRefundAmountInput = event => {
        let value = event.target.value;
        if (regex.test(value)) {
            this.props.dispatch(commonActionCreater({ giftCardAmount: value, amount: this.state.totalRefundAmount }, 'GIFTCARD_REFUND_INPUT_HANDLER'));
        }
        else if (regex.test(value.substring(0, value.length - 1))) {
            this.props.dispatch(commonActionCreater({ giftCardAmount: value.substring(0, value.length - 1), amount: this.state.totalRefundAmount }, 'GIFTCARD_REFUND_INPUT_HANDLER'));
        }
        else {
            this.props.dispatch(commonActionCreater({ giftCardAmount: '', amount: this.state.totalRefundAmount }, 'GIFTCARD_REFUND_INPUT_HANDLER'));
        }
    }



    handleInputChange = num => event => {
        if (this.state.currentFocus !== '') {
            let currentFocus = this.state.currentFocus;
            let focusItemValue = this.props[currentFocus];
            if (num != '<') {
                focusItemValue = (focusItemValue || '') + num;
                let regex = /^\d*[\.\d]{1,3}$/;
                if(!regex.test(focusItemValue))
                return false;
            }
            else {
                focusItemValue = '';
            }

            this.props.dispatch(commonActionCreater({ [currentFocus]: focusItemValue, amount: this.state.totalRefundAmount }, this.state.handler))
        }
    }

    render() {
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    TransitionComponent={Transition}
                    keepMounted
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                    fullWidth
                    maxWidth={this.state.step == 2 ? 'md' : 'sm'}
                >
                    <div className='refund-dialogue'>
                        {/* Step 1 */}
                        {
                            this.state.step == 1 ?
                                <div className='refund-step-1 flex-column '>
                                    <span className='card-title'>Order Details</span>
                                    <div className="refund-items overflow-y mui-row" style={{ paddingLeft: '5%', paddingRight: '6%' }}>
                                        <table className="mui-table mui-table--bordered">
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th style={{ textAlign: 'center' }}>Returnable Qty</th>
                                                    <th style={{ textAlign: 'center' }}>Return Qty</th>
                                                    <th style={{ textAlign: 'center' }}>Return to Stock</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.showItemList()}
                                            </tbody>
                                        </table>
                                    </div>
                                </div> : null
                        }

                        {/* Step 2 */}
                        {
                            this.state.step == 2 ?
                                <div className='refund-step-2 flex-row justify-space-between'>
                                    <div style={{ width: '63%' }}>
                                        <div className='flex-row align-center'>
                                            <span className='title'>Refund Methods</span>
                                            <div
                                                className={this.props.remainingAmount == 0 ? 'disable-button refund-method-btn' : 'refund-method-btn'}
                                                onClick={this.handleRefundClick("cashRefund")}
                                                variant="contained"
                                                color="primary">Cash</div>
                                            <div
                                                className={(this.props.remainingAmount == 0 || this.state.paidThroughCard <= 0) ? 'disable-button refund-method-btn' : 'refund-method-btn'}
                                                onClick={this.handleRefundClick("cardRefund")}
                                                variant="contained"
                                                color="primary">Card</div>
                                            {
                                                this.props.paymentMethods.findIndex((m) => m == 2) > 0 ?
                                                    this.state.giftPayEnabled ?
                                                        <div
                                                            className={this.props.remainingAmount == 0 ? 'disable-button refund-method-btn' : 'refund-method-btn'}
                                                            onClick={this.handleRefundClick("giftRefund")}
                                                            variant="contained"
                                                            color="primary">Gift Card</div> : null : null
                                            }

                                        </div>
                                        <div className='flex-row fwidth mt-10'>
                                            <div className='flex-column pl-5 halfwidth'>
                                                <span className='info-title'>Total Refund Amount</span>
                                                <span className='info-value'>{dineroObj(_get(this.state,'totalRefundAmount',0)).toFormat('$0,0.00')}</span>
                                            </div>
                                            <div className='flex-column pl-5 halfwidth'>
                                                <span className='info-title'>Remaining Refund Amount</span>
                                                <span className='info-value'>{_get(this.props,'remainingAmount',0).toFormat('$0,0.00')}</span>
                                            </div>
                                        </div>

                                        <div className='mt-10'>
                                            <div className='mt-10'>
                                                {this.state.cashRefund ? this.cashRefundComponent() : null}
                                            </div>
                                            <div className='mt-10'>
                                                {this.state.cardRefund ? this.cardRefundComponent() : null}
                                            </div>
                                            <div className='mt-10'>
                                                {this.state.giftRefund ? this.giftCardRefundComponent() : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='numpad-global' style={{ width: '35%' }}>
                                        <div className='card numpad-card' >
                                            <span className='card-title' style={{ color: '#fff' }}>Numpad</span>
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
                                </div>
                                : null
                        }


                        <iframe id="ifmcontentstoprint" style={{
                            height: '0px',
                            width: '0px',
                            position: 'absolute'
                        }}></iframe>

                        {
                            <div id='printarea' className='none'>
                                <div>
                                    <RefundPrintView
                                        store={this.props.store}
                                        selectedOrder={this.props.selectedSaleTransaction}
                                        logo={this.props.logo}
                                        data={this.state.returnObj}
                                        print={this.state.print ? true : false}
                                        handlePrint={this.handlePrint}
                                    />
                                </div>
                            </div>
                        }




                        {
                            this.state.step == 1 || this.state.step == 2 ?
                                <div className='refund-action-section flex-row'>
                                    <div className='action-btn flex-row justify-center align-center' onClick={this.props.handleRefundClose}>Cancel</div>
                                    <div className='action-btn flex-row justify-center align-center' style={this.state.returnItems.every(val=>!val.qty)|| (this.state.step == 2&&this.props.remainingAmount.toUnit()>0)? { opacity: '0.3', pointerEvents: 'none' } : null} onClick={this.handleProceed}>Complete</div>
                                </div> : null
                        }


                    </div>
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state) {
    let { storeData } = state;
    let cashAmount = _get(state, 'RefundPaymentDetails.cashAmount');
    let cardAmount = _get(state, 'RefundPaymentDetails.cardAmount');
    let giftCardAmount = _get(state, 'RefundPaymentDetails.giftCardAmount');
    let store = storeData.lookUpData || {};
    let remainingAmount = _get(state, 'RefundPaymentDetails.remainingAmount')
    let cardRefrenceId = _get(state, 'RefundPaymentDetails.cardRefrenceId');
    let paymentMethods = _get(state, "storeData.lookUpData.store.paymentMethods", []);

    return {
        cashAmount,
        cardAmount,
        giftCardAmount,
        remainingAmount,
        store,
        cardRefrenceId,
        paymentMethods
    }
}
export default connect(mapStateToProps)(RefundDialogue);