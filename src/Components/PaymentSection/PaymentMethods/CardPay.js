import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
/* Redux Imports */
import { connect } from 'react-redux';
import { commonActionCreater } from '../../../Redux/commonAction';
import showErrorAlert from '../../../Global/PosFunctions/showErrorAlert';
import genericPostData from '../../../Global/dataFetch/genericPostData';
import codes from '../StatusCodes/codes';
import CardPaymentDialogue from '../Dialogue/CardPaymentDialogue';
// var parser = require('xml2json');
var convert = require('xml-js');


const request = require('superagent');

let regex = /^\d*[\.\d]{1,3}$/;

class CardPay extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            success: false,
            open: false,
            error: false,
            errorMsg: ''
        }
    }

    componentDidMount() {
        //setting to the remaining amount
        this.props.dispatch(commonActionCreater({ cardAmount: this.props.remainingAmount.toUnit(), totalAmount: this.props.totalAmount }, 'CARD_INPUT_HANDLER'));
    }

    componentWillUnmount() {
        //setting to the 0 again on unmouning
        this.props.dispatch(commonActionCreater({ cardAmount: '', totalAmount: this.props.totalAmount }, 'CARD_INPUT_HANDLER'));

    }

    handleChange = name => event => {
        let value = event.target.value;
        if (regex.test(value)) {
            this.props.dispatch(commonActionCreater({ cardAmount: value, totalAmount: this.props.totalAmount }, 'CARD_INPUT_HANDLER'));
        }
        else if (regex.test(value.substring(0, value.length - 1))) {
            this.props.dispatch(commonActionCreater({ cardAmount: value.substring(0, value.length - 1), totalAmount: this.props.totalAmount }, 'CARD_INPUT_HANDLER'));

        }
        else {
            this.props.dispatch(commonActionCreater({ cardAmount: '', totalAmount: this.props.totalAmount }, 'CARD_INPUT_HANDLER'));
        }

    }

    makePOSReqObj = () => {
        let invoiceNo = this.randomString(11);
        let xmlBodyStr = `<POSRequest>\
        <RequestType>Sale</RequestType>\
        <ChargeAmount>${this.props.cardAmount}</ChargeAmount>\
        <TaxAmount>0</TaxAmount>\
        <TipAmount>0</TipAmount>\
        <ClientEnvironment>${localStorage.getItem('freedomPayClientEnvironment')}</ClientEnvironment>\
        <StoreId>${localStorage.getItem('freedomPayStoreId')}</StoreId>\
        <TerminalId>${localStorage.getItem('freedomPayTerminalId')}</TerminalId>\
        <MerchantReferenceCode>WEBPOS5c${invoiceNo}</MerchantReferenceCode>\
        <InvoiceNumber>${invoiceNo}</InvoiceNumber>\
        <WorkstationId>${localStorage.getItem('freedomPayWorkstationId')}</WorkstationId>\
      </POSRequest>`;
        return xmlBodyStr;
    }

    randomString = (len) => {
        var maxlen = 8,
            min = Math.pow(16,Math.min(len,maxlen)-1), 
            max = Math.pow(16,Math.min(len,maxlen)) - 1,
            n   = Math.floor( Math.random() * (max-min+1) ) + min,
            r   = n.toString(16);
        while ( r.length < len ) {
            r = r + this.randomString( len - maxlen );
        }
        return r;
    };

    reqPaymentByCard = () => {
        this.handleOpen();
        let POSReqObj = this.makePOSReqObj();
        request
            .post(localStorage.getItem('freedomPayClientUrl'))
            .send(POSReqObj) // sends a JSON post body
            .then(res => {
                var json = convert.xml2json(res.text, { compact: true, spaces: 4 });
                let responseObj = JSON.parse(json);
                let POSResponse = _get(responseObj, 'POSResponse');
                console.log(POSResponse, "POSResponse");
                if (_get(POSResponse, 'Decision._text') == 'A' && _get(POSResponse, 'ErrorCode._text') == '100') {
                    this.posResponseSuccess(res.text, POSResponse, false, 1);
                    return;
                }
                //if error has text msgs then show the code
                if (_get(POSResponse, 'ErrorCode._text')) {
                    if (_get(POSResponse, "Message._text")) {
                        let errMsg = `Error Occured with code:${POSResponse.ErrorCode._text}(${_get(POSResponse, "Message._text")})`;
                        this.posResponseSuccess(res.text, POSResponse, true, 1, errMsg)
                        return;
                    }
                    //if error dont have the msg then codes giving the msgs
                    let errorObj = codes(POSResponse.ErrorCode._text, true, 1);
                    let errMsg = `Error Occured with code:${POSResponse.ErrorCode._text}(${_get(errorObj, 'descripton')})`
                    this.posResponseSuccess(res.text, POSResponse, true, 1, errMsg)
                }
            }).catch(err => {
                // showErrorAlert({ dispatch: this.props.dispatch, error: err.message })
                this.posResponseSuccess(null, null, true, 1, err.message)

            });
    }   

    posResponseSuccess = (xmlRes, POSResponseObj, error, type, errMsg) => {
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: {
                retailerId: localStorage.getItem('retailerId'),
                customerId: _get(this.props, 'customer.id'),
                storeId: localStorage.getItem('storeId'),
                terminalId: localStorage.getItem('terminalId'),
                operatorId: localStorage.getItem('userId'),
                sessionId: localStorage.getItem('sessionId'),
                transactionId: _get(POSResponseObj, 'RequestId._text'),
                requestPayload: this.makePOSReqObj(),
                responsePayload: xmlRes,
                error,
                type
            },
            url: 'Payment/FreedomPay/Transactions/Save',
            constants: {
                init: 'FreedomPaySave_INIT',
                success: 'FreedomPaySave_SUCEESS',
                error: 'FreedomPaySave_ERROR'
            },
            identifier: 'FreedomPaySave',
            successCb: (resData) => this.refrenceSavedSuccess(resData, error, type, errMsg),
            errorCb: this.refrenceSavedError,
            dontShowMessage:true
        })
    }

    refrenceSavedSuccess = (resData, error, type, errMsg) => {
        if (!error) {
            this.props.dispatch(commonActionCreater({ cardAmount: this.props.cardAmount, totalAmount: this.props.totalAmount, cardRefrenceId: resData }, 'CARD_INPUT_HANDLER'));
            this.handleSuccess();
        }
        else {
            this.handleError(errMsg)
        }
    }

    refrenceSavedError = (err) => {
        this.handleError("Some Error Ocurred While Saving Refrence To Server");
    }

    handleClose = () => {
        this.setState({
            open: false,
            success: false,
            error: false
        })
    }
    handleOpen = () => {
        this.setState({
            open: true
        })
    }
    handleSuccess = () => {
        this.setState({
            success: true,
            error: false
        })
        setTimeout(() => this.handleClose(), 2000);
    }
    handleError = (err) => {
        this.setState({
            success: false,
            error: true,
            errorMsg: err,
        })
    }


    render() {
        return (
            <div className="default-card-pay">
                <span className='payment-title'>Card Pay</span>
                {!this.props.cardRefrenceId ?
                    <div className="flex-row align-center justify-space-between relative">
                        <div style={{ width: '80%' }}>
                            <TextField
                                InputLabelProps={{ shrink: true }}
                                autoFocus
                                onFocus={() => this.props.currentFocus({ fieldValue: 'cardAmount', handler: 'CARD_INPUT_HANDLER' })}
                                id="outlined-name"
                                label="Amount"
                                value={this.props.cardAmount}
                                onChange={this.handleChange('cardAmount')}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                            />
                        </div>
                        <span onClick={this.reqPaymentByCard} className="pay-button flex-row justify-center align-center">
                            pay
              </span>
                        <CloseIcon
                            onClick={() => this.props.onRemovePaymentMethod('showCardPay')} />
                    </div> :
                    <div>
                        <span>Ref Id:</span>
                        <span className="bold">{this.props.cardRefrenceId}</span>
                    </div>
                }
                <CardPaymentDialogue
                    reqPaymentByCard={this.reqPaymentByCard}
                    handleOpen={this.handleOpen}
                    handleClose={this.handleClose}
                    handleSuccess={this.handleSuccess}
                    handleError={this.handleError}
                    open={this.state.open}
                    success={this.state.success}
                    error={this.state.error}
                    errorMsg={this.state.errorMsg}
                />
            </div>
        );
    }
}

function mapStateMapToProps(state) {
    let totalAmount = _get(state, 'cart.totalMoney');
    let cardAmount = _get(state, 'PaymentDetails.cardAmount');
    let remainingAmount = _get(state, 'PaymentDetails.remainingAmount')
    let cardRefrenceId = _get(state, 'PaymentDetails.cardRefrenceId');
    let customer = _get(state,'cart.customer')


    return { totalAmount, cardAmount, remainingAmount, cardRefrenceId,customer };
}

export default connect(mapStateMapToProps)(CardPay);