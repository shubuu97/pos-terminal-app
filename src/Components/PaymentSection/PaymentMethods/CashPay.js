import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close'
/* Redux Imports */
import { commonActionCreater } from '../../../Redux/commonAction';
import { connect } from 'react-redux';

let regex = /^\d*[\.\d]{1,3}$/;
class CashPay extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }
    handleChange = name => event => {
        let value = event.target.value;

        if (regex.test(value)) {
            this.props.dispatch(commonActionCreater({ cashAmount: value, totalAmount: this.props.totalAmount }, 'CASH_INPUT_HANDLER'));
        }
        else if (regex.test(value.substring(0, value.length - 1))) {
            this.props.dispatch(commonActionCreater({ cashAmount: value.substring(0, value.length - 1), totalAmount: this.props.totalAmount }, 'CASH_INPUT_HANDLER'));

        }
        else {
            this.props.dispatch(commonActionCreater({ cashAmount: '', totalAmount: this.props.totalAmount }, 'CASH_INPUT_HANDLER'));
        }


    };
    componentWillUnmount() {
        //setting to the 0 again on unmouning
        this.props.dispatch(commonActionCreater({ cashAmount: '', totalAmount: this.props.totalAmount }, 'CASH_INPUT_HANDLER'));

    }
    render() {
        return (
            <div className="default-card-pay">
                <span className='payment-title'>Cash Pay</span>
                <div className="flex-row align-center justify-space-between">
                    <div style={{ width: '80%' }}>
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            id="cashPay"
                            label="Amount"
                            type="tel"
                            value={this.props.cashAmount}
                            onChange={this.handleChange('cashPay')}
                            margin="outline"
                            onFocus={() => this.props.currentFocus({ fieldValue: 'cashAmount', handler: 'CASH_INPUT_HANDLER' })}
                            fullWidth
                            autoFocus
                            type='text'
                            variant="outlined"
                            className='mt-10'
                        />
                    </div>
                    <CloseIcon
                        onClick={() => this.props.onRemovePaymentMethod('showCashPay')} />

                </div>
            </div>
        );
    }
}

function mapStateMapToProps(state) {
    let totalAmount = _get(state, 'cart.totalMoney');   
    let cashAmount = _get(state, 'PaymentDetails.cashAmount');
    let remainingAmount = _get(state, 'PaymentDetails.remainingAmount')

    return { totalAmount, cashAmount, remainingAmount };
}

export default connect(mapStateMapToProps)(CashPay);