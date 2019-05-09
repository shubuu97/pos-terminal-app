import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
/* Material import */
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
/* Redux Imports */
import { commonActionCreater } from '../../../Redux/commonAction';
import { connect } from 'react-redux';
/* Global Imports */
import genericPostData from '../../../Global/dataFetch/genericPostData';
import roundUp from '../../../Global/PosFunctions/roundUp';
import showErrorAlert from '../../../Global/PosFunctions/showErrorAlert';
import dineroObj from '../../../Global/PosFunctions/dineroObj';

let regex = /^\d*[\.\d]{1,3}$/;

class GiftPay extends React.Component {

    constructor() {
        super();
        this.state = {
            giftPayNumber: '',

        }
    }
    handleChange = name => event => {
        this.props.dispatch(commonActionCreater({ giftPayNumber: event.target.value, totalAmount: this.props.totalAmount }, 'GIFT_CARD_NUMBER'));

    };




    handleGiftCardValue = name => event => {
        let value = event.target.value;
        if (regex.test(value)) {
            this.props.dispatch(commonActionCreater({ giftCardAmount: value, totalAmount: this.props.totalAmount }, 'GIFT_AMOUNT_TO_REDEEM'));
        }
        else if (regex.test(value.substring(0, value.length - 1))) {
            this.props.dispatch(commonActionCreater({ giftCardAmount: value.substring(0, value.length - 1), totalAmount: this.props.totalAmount }, 'GIFT_AMOUNT_TO_REDEEM'));

        }
        else {
            this.props.dispatch(commonActionCreater({ giftCardAmount: '', totalAmount: this.props.totalAmount }, 'GIFT_AMOUNT_TO_REDEEM'));
        }
    }

    componentWillUnmount() {
        this.props.dispatch(commonActionCreater({ giftPayNumber: '', totalAmount: this.props.totalAmount }, 'GIFT_CARD_NUMBER'));
        this.props.dispatch(commonActionCreater({ giftCardAmount: '', totalAmount: this.props.totalAmount }, 'GIFT_AMOUNT_TO_REDEEM'));
        this.props.dispatch(commonActionCreater({}, 'CHECK_GIFT_CARD_DATA_SUCCESS'));

    }
    checkGiftCardValue = () => {
        let url = 'GiftCard/GetByCodeAndStore';
        let data = {
            storeId: localStorage.getItem('storeId'),
            code: this.props.giftPayNumber,
        };
        this.setState({ isLoadingCheckValue: true })
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: data,
            url: url,
            constants: {
                init: 'CHECK_GIFT_CARD_DATA_INIT',
                success: 'CHECK_GIFT_CARD_DATA_SUCCESS',
                error: 'CHECK_GIFT_CARD_DATA_ERROR'
            },
            identifier: 'CHECK_GIFT_CARD_DATA',
            successCb: (data) => {
            this.setState({ isLoadingCheckValue: false });
            if(data==null){
                showErrorAlert({ dispatch: this.props.dispatch, error:"Gift Card Not Found" })

            }
        
        },
            errorCb: (error) => this.setState({ isLoadingCheckValue: false }),
            dontShowMessage: true
        })
        // this.props.getGiftCardDetail('giftPayNumberValue', this.props.giftPayNumber);

    }
    whichTextFieldToRender = () => {
        if (!_isEmpty(this.props.giftCardData)) {

            return (<React.Fragment>
                <TextField
                    InputLabelProps={{ shrink: true }}
                    // autoFocus
                    autoFocus
                    onFocus={() => this.props.currentFocus({ fieldValue: 'giftCardAmount', handler: 'GIFT_AMOUNT_TO_REDEEM' })}
                    id="giftAmountRedeem"
                    label="Value to be used"
                    onKeyDown={this.handleGiftCardValue('giftAmountRedeem')}
                    onKeyUp={this.handleGiftCardValue('giftAmountRedeem')}
                    type="text"
                    value={_get(this.props, 'giftCardAmount', '')}
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
                        onFocus={() => this.props.currentFocus({ fieldValue: 'giftPayNumber', handler: 'GIFT_CARD_NUMBER' })}
                        id="giftPayNumber"
                        label="Gift Card Number"
                        type="text"
                        value={this.props.giftPayNumber}
                        onChange={this.handleChange('giftPayNumber')}
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
            this.props.dispatch(commonActionCreater({ totalAmount: this.props.totalAmount }, 'GIFT_USE_MAX'))
        }
        else {
            this.props.dispatch(commonActionCreater({ giftCardAmount: '', totalAmount: this.props.totalAmount }, 'GIFT_AMOUNT_TO_REDEEM'));

        }
        this.setState({ maxAmt: event.target.checked });
    }

    whichButtonToRender = () => {
        if (!_isEmpty(this.props.giftCardData)) {
            return (
                <React.Fragment>
                    {/* 
                    <span>
                        Value: {roundUp(_get(this.props, 'giftCardData.value.amount', 0), 2)}
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
                    */}
                </React.Fragment>
            )
        }
        else {
            return (
                <React.Fragment>
                    <span className="pay-button flex-row justify-center align-center" onClick={this.checkGiftCardValue}>
                        {this.state.isLoadingCheckValue ? <CircularProgress size={24} /> : "pay"}
                    </span>
                </React.Fragment>
            )
        }
    }
    handleRemove = () => {
        this.props.dispatch(commonActionCreater({ giftPayNumber: '', totalAmount: this.props.totalAmount }, 'GIFT_CARD_NUMBER'));
        this.props.dispatch(commonActionCreater({ giftCardAmount: '', totalAmount: this.props.totalAmount }, 'GIFT_AMOUNT_TO_REDEEM'));
        this.props.dispatch(commonActionCreater({}, 'CHECK_GIFT_CARD_DATA_SUCCESS'));

        this.props.onRemovePaymentMethod('showGiftPay');
    }

    render() {
        return (
            <div className="default-card-pay">
                <span className='payment-title'>Gift Pay</span>
                <div className="flex-row align-center justify-space-between relative">
                    <div className='flex-column' style={{ width: '80%' }}>
                        {this.whichTextFieldToRender()}
                        {
                            !_isEmpty(this.props.giftCardData) ? 
                            <div className='flex-row align-center justify-space-between'>
                                <span>
                                    Value: {dineroObj(_get(this.props, 'giftCardData.value.amount', 0)).toFormat('$0,0.00')}
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
                            </div> : null
                        }
                    </div>
                    {this.whichButtonToRender()}
                    <CloseIcon
                        onClick={this.handleRemove} />
                </div>
            </div>
        );
    }
}

function mapStateMapToProps(state) {
    let totalAmount = _get(state, 'cart.totalMoney');
    let giftPayNumber = _get(state, 'PaymentDetails.giftPayNumber');
    let remainingAmount = _get(state, 'PaymentDetails.remainingAmount')
    let giftCardAmount = _get(state, 'PaymentDetails.giftCardAmount');
    let giftCardData = _get(state, 'PaymentDetails.giftCardData');


    return { totalAmount, giftCardData, giftPayNumber, remainingAmount, giftCardAmount };
}

export default connect(mapStateMapToProps)(GiftPay);