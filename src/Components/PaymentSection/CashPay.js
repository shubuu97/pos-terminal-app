import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close'


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
    };
    componentWillReceiveProps(props){
        this.setState({cashPay:props.value})
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
                            value={this.state.cashPay}
                            onChange={this.handleChange('cashPay')}
                            margin="outline"
                            onFocus={() => this.props.currentFocus('cashPay')}
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

export default CashPay;