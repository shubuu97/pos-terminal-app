import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close'
/* Redux Imports */
import { commonActionCreater } from '../../../Redux/commonAction';
import { connect } from 'react-redux';

let regex = /^\d*[\.\d]+$/;

class EmployeePay extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }
    handleChange = name => event => {
        let value = event.target.value;
        if (regex.test(value)) {
            this.props.dispatch(commonActionCreater({ employeePay: value, totalAmount: this.props.totalAmount }, 'EMPLOYEE'));
        }
        else if (regex.test(value.substring(0, value.length - 1))) {
            this.props.dispatch(commonActionCreater({ employeePay: value.substring(0, value.length - 1), totalAmount: this.props.totalAmount }, 'EMPLOYEE'));

        }
        else {
            this.props.dispatch(commonActionCreater({ employeePay: '', totalAmount: this.props.totalAmount }, 'EMPLOYEE'));
        }
    };
    componentDidMount() {
        //setting to the remaining amount
        this.props.dispatch(commonActionCreater({ employeePay: this.props.remainingAmount, totalAmount: this.props.totalAmount }, 'EMPLOYEE'));
    }
    componentWillUnmount() {
        //setting to the 0 again on unmouning
        this.props.dispatch(commonActionCreater({ employeePay: '', totalAmount: this.props.totalAmount }, 'EMPLOYEE'));

    }
    render() {
        return (
            <div className="default-card-pay">
                <span className='payment-title'>Employee Pay Deduct</span>
                <div className="flex-row align-center justify-space-between relative">
                    <div style={{ width: '80%' }}>
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            autoFocus
                            id="outlined-name"
                            type="text"
                            onFocus={() => this.props.currentFocus({ fieldValue: 'employeePay', handler: 'EMPLOYEE' })}
                            label="Amount"
                            value={this.props.employeePay}
                            onChange={this.handleChange('employeePay')}
                            margin="normal"
                            fullWidth
                            variant="outlined"
                        />
                    </div>
                    <span className="pay-button flex-row justify-center align-center">
                        {_get(this.props, 'customer.employeeId')}
                    </span>
                    <CloseIcon
                        onClick={() => this.props.onRemovePaymentMethod('showEmpPay')} />

                </div>
            </div>
        );
    }
}

function mapStateMapToProps(state) {
    let totalAmount = _get(state, 'cart.totalAmount');
    let employeePay = _get(state, 'PaymentDetails.employeePay');
    let remainingAmount = _get(state, 'PaymentDetails.remainingAmount')

    return { totalAmount, employeePay, remainingAmount };
}

export default connect(mapStateMapToProps)(EmployeePay);