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
/* Global Imports */
import genericPostData from '../../../Global/dataFetch/genericPostData'

//Dinero import
import Dinero from 'dinero.js'
import dineroObj from '../../../Global/PosFunctions/dineroObj';

let regex = /^\d*[\.\d]{1,3}$/;

class EmployeePay extends React.Component {

    constructor() {
        super();
        this.state = {
            availableValue: 0
        }
    }

    componentDidMount() {
        this.getEmployeeData();
    }

    componentWillUnmount() {
        //setting to the 0 again on unmouning
        this.props.dispatch(commonActionCreater({ employeePay: '', totalAmount: this.props.totalAmount }, 'EMPLOYEE_PAYROLL'));
    }

    getEmployeeData = () => {
        genericPostData({
            dispatch: this.props.dispatch,
            url: 'Employee/PayrollLimit/Get',
            reqObj: { id: _get(this.props, 'customer.id') },
            constants: {
                init: 'GET_EMPLOYEE_DATA_INIT',
                success: 'GET_EMPLOYEE_DATA_SUCCESS',
                error: 'GET_EMPLOYEE_DATA_ERROR'
            },
            identifier: 'GET_EMPLOYEE_DATA',
            dontShowMessage: true,
            successCb: this.handleEmployeeDataSuccess,
        })
    }

    handleEmployeeDataSuccess = (data) => {
        this.setState({
            availableValue: dineroObj(_get(data, 'limit.amount', 0))
        })
    }

    handleChange = name => event => {
        let value = event.target.value;
        if (regex.test(value)) {
            this.props.dispatch(commonActionCreater({ employeePay: value, totalAmount: this.props.totalAmount }, 'EMPLOYEE_PAYROLL'));
        }
        else if (regex.test(value.substring(0, value.length - 1))) {
            this.props.dispatch(commonActionCreater({ employeePay: value.substring(0, value.length - 1), totalAmount: this.props.totalAmount }, 'EMPLOYEE_PAYROLL'));
        }
        else {
            this.props.dispatch(commonActionCreater({ employeePay: '', totalAmount: this.props.totalAmount }, 'EMPLOYEE_PAYROLL'));
        }
    };

    render() {
        return (
            <div className="default-card-pay">
                <span className='payment-title'>Employee Pay Deduct</span>
                <div className="flex-row align-center justify-space-between">
                    <div style={{ width: '80%' }} className='flex-column'>
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            autoFocus
                            id="outlined-name"
                            type="text"
                            onFocus={() => this.props.currentFocus({ fieldValue: 'employeePay', handler: 'EMPLOYEE_PAYROLL' })}
                            label="Amount"
                            value={_get(this.props, 'employeePay')}
                            onChange={this.handleChange('employeePay')}
                            margin="normal"
                            fullWidth
                            variant="outlined"
                        />
                        <div className='flex-row justify-space-between'>
                            {
                                this.state.availableValue ?
                                    <div className='mt-10'>
                                        Available Amount : {this.state.availableValue.toFormat('$0,0.00')}
                                    </div> : null
                            }
                            {
                                _get(this.props, 'customer.employeeId', false) ?
                                    <div className='mt-10'>
                                        Employee Id : {_get(this.props, 'customer.employeeId')}
                                    </div> : null
                            }
                        </div>
                    </div>

                    <CloseIcon
                        onClick={() => this.props.onRemovePaymentMethod('showEmpPay')} />

                </div>
            </div>
        );
    }
}

function mapStateMapToProps(state) {
    let totalAmount = _get(state, 'cart.totalMoney', 0);
    let employeePay = _get(state, 'PaymentDetails.employeePay');
    let remainingAmount = _get(state, 'PaymentDetails.remainingAmount')
    let employeePayroll = _get(state, 'employeePayroll.lookUpData', {});

    return {
        totalAmount,
        employeePay,
        remainingAmount,
        employeePayroll
    };
}

export default connect(mapStateMapToProps)(EmployeePay);