import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close'
/* Redux Imports */
import { commonActionCreater } from '../../../Redux/commonAction';
import { connect } from 'react-redux';
/* Global Imports */
import genericPostData from '../../../Global/dataFetch/genericPostData'

let regex = /^\d*[\.\d]+$/;

class CashPay extends React.Component {

    constructor() {
        super();
        this.state = {
            availableRewardPoints: 0
        }
    }

    // * Fetching customer data for reward points
    componentDidMount() {
        genericPostData({
            dispatch: this.props.dispatch,
            url: 'Customer/Get',
            reqObj: { id: this.props.customerId },
            constants: {
                init: 'GET_CUSTOMER_DATA_INIT',
                success: 'GET_CUSTOMER_DATA_SUCCESS',
                error: 'GET_CUSTOMER_DATA_ERROR'
            },
            identifier: 'GET_CUSTOMER_DATA',
            dontShowMessage: true,
            successCb: this.handleCustomerDataSuccess,
        })
    }

    handleCustomerDataSuccess = (data) => {
        this.setState({
            availableRewardPoints: _get(data, 'rewardPoints', 0)
        })
    }

    handleChange = name => event => {
        let value = event.target.value;

        let loyaltyRedeemAmount = value * _get(this.props, 'RedemptionRules.redemptionMultiplier');

        this.setState({
            loyaltyRedeemAmount: loyaltyRedeemAmount
        })

        if (regex.test(loyaltyRedeemAmount)) {
            this.props.dispatch(commonActionCreater({ loyaltyRedeem: loyaltyRedeemAmount, totalAmount: this.props.totalAmount }, 'LOYALTY_INPUT_HANDLER'));
        }
        else if (regex.test(loyaltyRedeemAmount.substring(0, loyaltyRedeemAmount.length - 1))) {
            this.props.dispatch(commonActionCreater({ loyaltyRedeem: loyaltyRedeemAmount.substring(0, loyaltyRedeemAmount.length - 1), totalAmount: this.props.totalAmount }, 'LOYALTY_INPUT_HANDLER'));
        }
        else {
            this.props.dispatch(commonActionCreater({ loyaltyRedeem: '', totalAmount: this.props.totalAmount }, 'LOYALTY_INPUT_HANDLER'));
        }
    };

    componentWillUnmount() {
        //setting to the 0 again on unmouning
        this.props.dispatch(commonActionCreater({ loyaltyRedeem: '', totalAmount: this.props.totalAmount }, 'LOYALTY_INPUT_HANDLER'));

    }
    render() {
        return (
            <div className="default-card-pay">
                <span className='payment-title'>Reward Points</span>
                <div className="flex-row align-center justify-space-between">
                    <div style={{ width: '80%' }} className='flex-column'>
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            id="rewardPay"
                            label="Points"
                            type="tel"
                            //value={this.props.loyaltyRedeem}
                            onChange={this.handleChange('rewardPay')}
                            margin="outline"
                            onFocus={() => this.props.currentFocus({ fieldValue: 'loyaltyRedeem', handler: 'LOYALTY_INPUT_HANDLER' })}
                            fullWidth
                            autoFocus
                            type='text'
                            variant="outlined"
                            className='mt-10'
                        />
                        <div className='flex-row justify-space-between'>
                            {
                                this.state.availableRewardPoints ?
                                    <div className='mt-10'>
                                        Available Points : {this.state.availableRewardPoints}
                                    </div> : null
                            }
                            {
                                this.state.loyaltyRedeemAmount ?
                                    <div className='mt-10'>
                                        Value : {this.state.loyaltyRedeemAmount}
                                    </div> : null
                            }
                        </div>
                    </div>

                    <CloseIcon
                        onClick={() => this.props.onRemovePaymentMethod('showLoyaltyRedeem')} />

                </div>
            </div>
        );
    }
}

function mapStateMapToProps(state) {
    let RedemptionRules = _get(state, 'RedemptionRules.lookUpData.redemptionRule')
    let customerId = _get(state, 'cart.customer.id')
    let totalAmount = _get(state, 'cart.totalAmount');
    let loyaltyRedeem = _get(state, 'PaymentDetails.loyaltyRedeem');
    let remainingAmount = _get(state, 'PaymentDetails.remainingAmount')

    return {
        totalAmount,
        loyaltyRedeem,
        remainingAmount,
        customerId,
        RedemptionRules
    };
}

export default connect(mapStateMapToProps)(CashPay);