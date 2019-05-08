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

class DecliningBalance extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }
    handleChange = name => event => {
        let value = event.target.value;

        if (regex.test(value)) {
            this.props.dispatch(commonActionCreater({ decliningBalance: value, totalAmount: this.props.totalAmount }, 'DECLINING_BALANCE'));
        }
        else if (regex.test(value.substring(0, value.length - 1))) {
            this.props.dispatch(commonActionCreater({ decliningBalance: value.substring(0, value.length - 1), totalAmount: this.props.totalAmount }, 'DECLINING_BALANCE'));

        }
        else {
            this.props.dispatch(commonActionCreater({ decliningBalance: '', totalAmount: this.props.totalAmount }, 'DECLINING_BALANCE'));
        }


    };
    componentWillUnmount() {
        //setting to the 0 again on unmouning
        this.props.dispatch(commonActionCreater({ decliningBalance: '', totalAmount: this.props.totalAmount }, 'DECLINING_BALANCE'));

    }
    render() {
        return (
            <div className="default-card-pay">
                <span className='payment-title'>Decline Balance</span>
                <div className="flex-row align-center justify-space-between">
                    <div style={{ width: '80%' }}>
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            id="DecliningBalance"
                            label="Amount"
                            type="tel"
                            value={this.props.decliningBalance}
                            onChange={this.handleChange('DecliningBalance')}
                            margin="outline"
                            onFocus={() => this.props.currentFocus({ fieldValue: 'decliningBalance', handler: 'DECLINING_BALANCE' })}
                            fullWidth
                            autoFocus
                            type='text'
                            variant="outlined"
                            className='mt-10'
                        />
                    </div>
                    <CloseIcon
                        onClick={() => this.props.onRemovePaymentMethod('showDeclineBalance')} />

                </div>
            </div>
        );
    }
}

function mapStateMapToProps(state) {
    let totalAmount = _get(state, 'cart.totalMoney');
    let decliningBalance = _get(state, 'PaymentDetails.decliningBalance');
    let remainingAmount = _get(state, 'PaymentDetails.remainingAmount')

    return { totalAmount, decliningBalance, remainingAmount };
}

export default connect(mapStateMapToProps)(DecliningBalance);