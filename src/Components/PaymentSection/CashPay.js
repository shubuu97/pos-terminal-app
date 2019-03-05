import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close'
import { commonActionCreater } from '../../Redux/commonAction';
import {connect} from 'react-redux';


/* Redux Imports */

/* Component Imports */


class CashPay extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
        this.props.dispatch(commonActionCreater({cashAmount:event.target.value,totalAmount:this.props.totalAmount},'CASH_INPUT_HANDLER'));
        
    };
    componentWillUnmount(){
        //setting to the 0 again on unmouning
        this.props.dispatch(commonActionCreater({cashAmount:'',totalAmount:this.props.totalAmount},'CASH_INPUT_HANDLER'));

    }
    render() {
        return (
            <div className="default-card-pay">
                <span>Cash Pay</span>
                <div className="flex-row align-center justify-space-between">
                    <div style={{ width: '80%' }}>
                        <TextField
                        InputLabelProps={{ shrink: true }}
                            id="cashPay"
                            label="Amount"
                            type = "number"
                            value={this.props.cashAmount}
                            onChange={this.handleChange('cashPay')}
                            margin="outline"
                            onFocus={() => this.props.currentFocus({fieldValue:'cashAmount',handler:'CASH_INPUT_HANDLER'})}
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

function mapStateMapToProps(state){
    let totalAmount = _get(state,'cart.totalAmount');
    let cashAmount = _get(state,'PaymentDetails.cashAmount');
    let remainingAmount = _get(state,'PaymentDetails.remainingAmount')

    return {totalAmount,cashAmount,remainingAmount};
}

export default connect(mapStateMapToProps)(CashPay);