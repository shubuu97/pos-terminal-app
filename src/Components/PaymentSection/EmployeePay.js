import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close'
import { commonActionCreater } from '../../Redux/commonAction';
import { connect } from 'react-redux';

/* Redux Imports */

/* Component Imports */


class EmployeePay extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
        this.props.dispatch(commonActionCreater({ employeePay: event.target.value, totalAmount: this.props.totalAmount }, 'EMPLOYEE'));

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
                <span>Employee Pay Deduct</span>
                <div className="flex-row align-center justify-space-between">
                    <div style={{ width: '50%' }}>
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
                    <span className="pay-button">
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