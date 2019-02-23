import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close'


/* Redux Imports */

/* Component Imports */


class GiftPay extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
        this.props.handleKeyBoardValue('giftPayNumberValue',event.target.value)

    };
    componentWillReceiveProps(props){
        this.setState({giftPayNumber:props.value})
    }
    render() {
        return (
            <div className="default-card-pay">
                <span>Gift Pay</span>
                <div className="flex-row align-center justify-space-between">
                    <div style={{ width: '50%' }}>
                        <TextField
                        InputLabelProps={{ shrink: true }}
                            autoFocus
                            onFocus={() => this.props.currentFocus('giftPayNumber')}
                            id="giftPayNumber"
                            label="Gift Card Number"
                            type = "number"
                            value={this.state.giftPayNumber}
                            onChange={this.handleChange('giftPayNumber')}
                            margin="normal"
                            fullWidth
                            variant="outlined"
                        />
                    </div>
                    <span className="pay-button">
                        pay
              </span>
                    <CloseIcon
                        onClick={() => this.props.onRemovePaymentMethod('showGiftPay')} />
                </div>
            </div>
        );
    }
}

export default GiftPay;