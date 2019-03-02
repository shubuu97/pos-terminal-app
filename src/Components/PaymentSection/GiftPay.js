import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';


/* Redux Imports */

/* Component Imports */


class GiftPay extends React.Component {

    constructor() {
        super();
        this.state = {
            giftPayNumber: '',

        }
    }
    handleChange = name => event => {

        this.props.handleKeyBoardValue('giftPayNumberValue', event.target.value);
    };
    //function to check and set where reddemed value is less the giftcard amount
    giftCardValueValidator = (enterdGiftCardAmount) => {
        if (enterdGiftCardAmount == "") {
            enterdGiftCardAmount = 0;
        }
        //value returned from api
        let giftCardAmount = _get(this.props, 'giftCard.value.amount', 0);
        if (enterdGiftCardAmount <= giftCardAmount && enterdGiftCardAmount >= 0) {
            return true
        }
        return false
    }

    handleGiftCardValue = name => event => {
        if (this.giftCardValueValidator(event.target.value))
            this.props.handleKeyBoardValue('giftAmountRedeemValue', event.target.value)
    }
    handleBlur = name => event => {
        this.props.getGiftCardDetail('giftPayNumberValue', event.target.value)
    }
    componentWillReceiveProps(props) {
        this.setState({ giftPayNumber: props.giftPayNumberValue });
        //this function will set and validate the gift amount redeem value
        if (this.giftCardValueValidator(props.giftAmountRedeemValue))
            this.setState({ giftAmountRedeem: props.giftAmountRedeemValue })
    }
    checkGiftCardValue = () => {
        this.props.getGiftCardDetail('giftPayNumberValue', this.state.giftPayNumber);

    }
    whichTextFieldToRender = () => {
        if (this.props.giftCardId) {

            return (<React.Fragment>
                <TextField
                    InputLabelProps={{ shrink: true }}
                    // autoFocus
                    onFocus={() => this.props.currentFocus('giftAmountRedeem')}
                    id="giftAmountRedeem"
                    label="Value to be used"
                    onKeyDown={this.handleGiftCardValue('giftAmountRedeem')}
                    onKeyUp={this.handleGiftCardValue('giftAmountRedeem')}
                    type="number"
                    value={_get(this.state, 'giftAmountRedeem', '')}
                    onChange={this.handleGiftCardValue('giftAmountRedeem')}
                    // onBlur={this.handleBlur('giftValue')}
                    margin="normal"
                    fullWidth
                    variant="outlined"
                />
            </React.Fragment>)
        }
        else {
            return (
                <React.Fragment>
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        autoFocus
                        onFocus={() => this.props.currentFocus('giftPayNumber')}
                        id="giftPayNumber"
                        label="Gift Card Number"
                        type="number"
                        value={this.state.giftPayNumber}
                        onChange={this.handleChange('giftPayNumber')}
                        // onBlur={this.handleBlur('giftPayNumber')}
                        margin="normal"
                        fullWidth
                        variant="outlined"
                    />
                </React.Fragment>
            )
        }
    }
    handleCheckMaxAmt = (event) => {
        let checked = event.target.checked;
        if (checked) {
            //It should fill the value remaining amount
            let giftCardAmount = parseFloat(_get(this.props, 'giftCard.value.amount', 0));
            let remainingAmount = parseFloat(this.props.remainingAmount);
            if (giftCardAmount > remainingAmount)
                this.props.handleKeyBoardValue('giftAmountRedeemValue', remainingAmount);
            else {
                this.props.handleKeyBoardValue('giftAmountRedeemValue', giftCardAmount);

            }
        }
        else {
            this.props.handleKeyBoardValue('giftAmountRedeemValue', '');
        }
        this.setState({ maxAmt: event.target.checked });
    }

    whichButtonToRender = () => {
        if (this.props.giftCardId) {
            return (<React.Fragment>
                <span>
                    Value: {_get(this.props, 'giftCard.value.amount', 0)}
                </span>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={this.state.maxAmt}
                            onChange={this.handleCheckMaxAmt}
                            value="checkedA"
                        />
                    }
                    label="Use Maximum"
                />
            </React.Fragment>)
        }
        else {
            return (
                <React.Fragment>
                    <span className="pay-button" onClick={this.checkGiftCardValue}>
                        Check Value
                    </span>
                </React.Fragment>
            )
        }
    }

    render() {
        return (
            <div className="default-card-pay">
                <span>Gift Pay</span>
                <div className="flex-row align-center justify-space-between">
                    <div style={{ width: '50%' }}>
                        {this.whichTextFieldToRender()}
                    </div>
                    {this.whichButtonToRender()}
                    <CloseIcon
                        onClick={() => this.props.onRemovePaymentMethod('showGiftPay')} />
                </div>
            </div>
        );
    }
}

export default GiftPay;