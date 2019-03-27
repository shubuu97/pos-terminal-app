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
// var parser = require('xml2json');
var convert = require('xml-js');


const request = require('superagent');

let regex = /^\d*[\.\d]+$/;

class CardPay extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
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

    };
    componentDidMount() {
        //setting to the remaining amount
        this.props.dispatch(commonActionCreater({ cardAmount: this.props.remainingAmount, totalAmount: this.props.totalAmount }, 'CARD_INPUT_HANDLER'));
    }
    componentWillUnmount() {
        //setting to the 0 again on unmouning
        this.props.dispatch(commonActionCreater({ cardAmount: '', totalAmount: this.props.totalAmount }, 'CARD_INPUT_HANDLER'));

    }
    reqPaymentByCard = () => {
        //const parseString = require('xml2js').parseString;
        var xmlBodyStr = '<POSRequest>\
        <RequestType>Sale</RequestType>\
        <CardNumber>4386128598056733</CardNumber>\
        <ExpiryDate>09/19</ExpiryDate>\
        <CardType>visa</CardType>\
        <TokenType>2</TokenType>\
        <ChargeAmount>49</ChargeAmount>\
        <TaxAmount>0</TaxAmount>\
        <TipAmount>0</TipAmount>\
        <ClientEnvironment>FCCTestClient 4.1.10.3</ClientEnvironment>\
        <StoreId>1234567</StoreId>\
        <TerminalId>123456789</TerminalId>\
        <MerchantReferenceCode>D3F35ED5369A48E9</MerchantReferenceCode>\
        <InvoiceNumber>174211</InvoiceNumber>\
        <Recurring p2:nil="true" xmlns:p2="http://www.w3.org/2001/XMLSchema-instance" />\
      </POSRequest>';
        console.log(xmlBodyStr, "xmlBodyStr")
        var config = {
            headers: { 'Content-Type': 'text/xml' }
        };
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xmlBodyStr, "text/xml");
        console.log(xmlDoc, "xmlBodyStr");
        request
            .post('http://192.168.1.19:1011')
            .send(xmlBodyStr) // sends a JSON post body
            .then(res => {
                debugger;
                var json = convert.xml2json(res.text, { compact: true, spaces: 4 });
                let responseObj = JSON.parse(json);
                let POSResponse = _get(responseObj, 'POSResponse');

                if (_get(POSResponse, 'Decision._text' == 'A')) {
                    debugger;
                }
                console.log(JSON.parse(json), "json")
                if (_get(responseObj, 'POSResponse.ErrorCode._text')) {
                    showErrorAlert({ dispatch: this.props.dispatch, error: _get(responseObj, 'POSResponse.ErrorCode._text') })
                }


            }).catch(err => {
                showErrorAlert({ dispatch: this.props.dispatch, error: err.message })
            });
    }

    render() {
        return (
            <div className="default-card-pay">
                <span className='payment-title'>Card Pay</span>
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
                </div>
            </div>
        );
    }
}

function mapStateMapToProps(state) {
    let totalAmount = _get(state, 'cart.totalAmount');
    let cardAmount = _get(state, 'PaymentDetails.cardAmount');
    let remainingAmount = _get(state, 'PaymentDetails.remainingAmount')

    return { totalAmount, cardAmount, remainingAmount };
}

export default connect(mapStateMapToProps)(CardPay);