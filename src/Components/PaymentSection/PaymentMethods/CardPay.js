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

let regex = /^\d*[\.\d]+$/;

class CardPay extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            success: false,
            open: false,
            error: false,
            errorMsg:''
        }
    }

    componentDidMount() {
        //setting to the remaining amount
        this.props.dispatch(commonActionCreater({ cardAmount: this.props.remainingAmount, totalAmount: this.props.totalAmount }, 'CARD_INPUT_HANDLER'));
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
        let xmlBodyStr = `<POSRequest>\
        <RequestType>Sale</RequestType>\
        <CardNumber>4111111111111111</CardNumber>\
        <ExpiryDate>09/19</ExpiryDate>\
        <CardType>credit</CardType>\
        <TokenType>2</TokenType>\
        <ChargeAmount>49</ChargeAmount>\
        <TaxAmount>0</TaxAmount>\
        <TipAmount>0</TipAmount>\
        <ClientEnvironment>${localStorage.getItem('freedomPayClientEnvironment')}</ClientEnvironment>\
        <StoreId>${localStorage.getItem('freedomPayStoreId')}</StoreId>\
        <TerminalId>${localStorage.getItem('freedomPayTerminalId')}</TerminalId>\
        <MerchantReferenceCode>${localStorage.getItem('merchantReferenceCode')}</MerchantReferenceCode>\
        <InvoiceNumber>174211</InvoiceNumber>\
        <Recurring p2:nil="true" xmlns:p2="http://www.w3.org/2001/XMLSchema-instance" />\
      </POSRequest>`;
        return xmlBodyStr;
    }

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
                    this.posResponseSuccess(res.text, POSResponse);
                    return
                }
                if (_get(responseObj, 'POSResponse.ErrorCode._text')) {
                    let errorObj = codes(POSResponse.ErrorCode._text);
                    console.log(errorObj, "errorObj");
                    let errMsg = `Error Occured with code:${POSResponse.ErrorCode._text}(${_get(errorObj, 'descripton')})`
                    this.handleError(errMsg)
                }
            }).catch(err => {
                // showErrorAlert({ dispatch: this.props.dispatch, error: err.message })
                this.handleError(err.message)
            });
    }

    posResponseSuccess = (xmlRes, POSResponseObj) => {

        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: {
                retailerId: localStorage.getItem('retailerId'),
                customerId: localStorage.getItem('customerId'),
                storeId: localStorage.getItem('storeId'),
                terminalId: localStorage.getItem('terminalId'),
                operatorId: localStorage.getItem('operatorId'),
                sessionId: localStorage.getItem('sessionId'),
                transactionId: _get(POSResponseObj, 'RequestId._text'),
                requestPayload: this.makePOSReqObj(),
                responsePayload: xmlRes,
            },
            url: 'Payment/FreedomPay/Transactions/Save',
            constants: {
                init: 'FreedomPaySave_INIT',
                success: 'FreedomPaySave_SUCEESS',
                error: 'FreedomPaySave_ERROR'
            },
            identifier: 'FreedomPaySave',
            successCb: this.refrenceSavedSuccess,
            errorCb: this.refrenceSavedError
        })
    }

    refrenceSavedSuccess = (resData) => {
        this.props.dispatch(commonActionCreater({ cardAmount: this.props.cardAmount, totalAmount: this.props.totalAmount,cardRefrenceId:resData }, 'CARD_INPUT_HANDLER'));
        this.handleSuccess();

    }

    refrenceSavedError = (err) => {
        this.handleError(err);
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
        setTimeout(()=>this.handleClose(), 2000);
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
                {!this.props.cardRefrenceId?
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
                </div>:
                <div>
                    <span>Ref Id:</span>
                <span className="bold">{this.props.cardRefrenceId}</span>
                </div>
                }
                <CardPaymentDialogue
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
    let totalAmount = _get(state, 'cart.totalAmount');
    let cardAmount = _get(state, 'PaymentDetails.cardAmount');
    let remainingAmount = _get(state, 'PaymentDetails.remainingAmount')
    let cardRefrenceId = _get(state, 'PaymentDetails.cardRefrenceId');


    return { totalAmount, cardAmount, remainingAmount,cardRefrenceId };
}

export default connect(mapStateMapToProps)(CardPay);