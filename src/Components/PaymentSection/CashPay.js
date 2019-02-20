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
    render() {
        return (
            <div className="default-card-pay">
            <span>Cash Pay</span>
            <div className="flex-row align-center justify-space-between">
                <div style={{width:'80%'}}>
                <TextField
                    id="outlined-name"
                    label="Amount"
                    value={this.state.name}
                    onChange={this.handleChange('cashPay')}
                    margin="normal"
                    variant="outlined"
                />
                </div>
                 <CloseIcon/>
            </div>
            </div>
        );
    }
}

export default CashPay;