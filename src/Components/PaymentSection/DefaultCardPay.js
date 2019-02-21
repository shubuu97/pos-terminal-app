import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close'

/* Redux Imports */

/* Component Imports */


class DefaultCardPay extends React.Component {

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
        this.setState({defaultcardAmount:props.value})
    }
    render() {
        return (
            <div className="default-card-pay">
                <span>Default Card Pay</span>
                <div className="flex-row align-center justify-space-between">
                    <div style={{ width: '50%' }}>
                        <TextField
                        InputLabelProps={{ shrink: true }}
                            autoFocus
                            id="outlined-name"
                            onFocus={() => this.props.currentFocus('defaultcardAmount')}
                            label="Refrence Number"
                            value={this.state.name}
                            onChange={this.handleChange('defaultcardAmount')}
                            margin="normal"
                            fullWidth
                            variant="outlined"
                        />
                    </div>
                    <span className="pay-button">
                        pay
              </span>
                    <CloseIcon
                        onClick={() => this.props.onRemovePaymentMethod('showDefaultCardPay')} />
                    
                </div>
            </div>
        );
    }
}

export default DefaultCardPay;