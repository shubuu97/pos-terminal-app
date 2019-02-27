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
    handleGiftCardValue = name => event => {
        let value = _get(event, 'target.value', 0);
        if (value < _get(this.props, 'originalGiftCard.value.amount', 0)) {
            this.setState({
                [name]: event.target.value,
            });
            this.props.handleGiftCardValue('giftPayNumberValue',event.target.value)
        } 
    }
    handleBlur = name => event => {
        this.props.getGiftCardDetail('giftPayNumberValue',event.target.value)
    }
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
                            onBlur={this.handleBlur('giftPayNumber')}
                            margin="normal"
                            fullWidth
                            variant="outlined"
                        />
                    </div>
                    
                    <span className="pay-button" onClick={this.props.onPayWithGiftCard}>
                        pay
                    </span>
                    <CloseIcon
                        onClick={() => this.props.onRemovePaymentMethod('showGiftPay')} />
                </div>
                <div style={{ width: '50%' }}>
                    <TextField
                    InputLabelProps={{ shrink: true }}
                        // autoFocus
                        onFocus={() => this.props.currentFocus('giftValue')}
                        id="giftValue"
                        label="Value to be used"
                        type = "number"
                        value={_get(this.state, 'giftValue', '')}
                        onChange={this.handleGiftCardValue('giftValue')}
                        // onBlur={this.handleBlur('giftValue')}
                        margin="normal"
                        fullWidth
                        variant="outlined"
                    />
                </div>
                <span className="pay-button">
                    Value Available: {_get(this.props, 'giftCard.value.amount', 0)}
                </span>
            </div>
        );
    }
}

export default GiftPay;