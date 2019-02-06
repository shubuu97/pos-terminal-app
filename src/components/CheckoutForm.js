import React from 'react';
import Redirect from "react-router/Redirect";
import Panel from 'react-bootstrap/lib/Panel';
import PanelGroup from 'react-bootstrap/lib/PanelGroup';
import "bootstrap/dist/css/bootstrap.css";

import _isEmpty from 'lodash/isEmpty';
import SaveButton from './common/SaveButton.jsx';
import Money from './Money';


class CheckoutForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleReceivedMoney = this.handleReceivedMoney.bind(this);
        this.handleTransactionSubmit = this.handleTransactionSubmit.bind(this);
        this.changePaymentMethod = this.changePaymentMethod.bind(this);
        this.balancedAmount = Number(this.props.totalAmount);
        this.handleRewardInputChange = this.handleRewardInputChange.bind(this);
        this.paymentMethod = '';
        this.availablePoints = this.props.availableRewardPoints;
        this.receivedAmount = 0;
        this.reedemdPoint = 0;
        this.reedemedPrice = 0;
        this.effectivePrice = 0;
        this.priceOfRewardPoint = 0;

    }
    shouldComponentUpdate(props) {
        if (!props.open) {
            this.availablePoints = props.availableRewardPoints;
            this.reedemdPoint = 0;
            this.effectivePrice = 0;
            this.balancedAmount = this.props.totalAmount;
            return false;
        } else {
            return true;
        }
    }

    handleRewardInputChange(event) {
        let value = event.target.value;
        if (value > this.availablePoints) {
            return;
        } else {
            this.reedemdPoint = event.target.value;
        }
        this.forceUpdate();
    }
    handleReceivedMoney(receivedAmount) {
        this.balancedAmount = Number(receivedAmount) - Number(this.effectivePrice);
        this.receivedAmount = Number(receivedAmount);
        this.forceUpdate();

    }
    reedemRewardPoints() {
        // alert('applied');
        let rewardSpentInfo = JSON.parse(localStorage.getItem('rewardSpentInfo'));
        this.priceOfRewardPoint = rewardSpentInfo.equivalentMoney / rewardSpentInfo.pointsSpent;
        if (this.reedemdPoint > 0) {
            this.reedemedPrice = this.reedemdPoint * this.priceOfRewardPoint;
            this.effectivePrice = this.props.totalAmount - this.reedemedPrice;
            this.balancedAmount = Number(this.receivedAmount) - Number(this.effectivePrice);
            this.availablePoints -= this.reedemdPoint;
            this.props.handlePointsReedem(true);
            this.forceUpdate();
        }

    }
    clearRewardPoints = () => {
        this.availablePoints = this.props.availableRewardPoints;
        this.effectivePrice = this.props.totalAmount;
        this.balancedAmount = Number(this.receivedAmount) - Number(this.effectivePrice);
        this.reedemedPrice = 0;
        this.reedemdPoint = 0;
        this.props.handlePointsReedem(false);
        this.forceUpdate();
    }
    changePaymentMethod(method) {
        this.paymentMethod = method;
        this.forceUpdate();
    }

    handleTransactionSubmit() {
        this.props.onClose();
        // this.receivedAmount = 0;
        this.props.handleTransactionSubmit(this.receivedAmount, this.reedemedPrice, parseFloat(this.reedemdPoint));
    }


    render() {


        return (
            <div>
                <div className="col-sm-3 pad-none cart-div">
                    {this.props.cartView}
                </div>
                <div className="col-sm-9 pad-none pro-list-section payment-section" style={{ height: (this.props.height - 70) }} >
                    <div className="final-payment-block" >
                        <h2 style={{ textAlign: "center" }}> ${this.effectivePrice > 0 ? this.effectivePrice : this.props.totalAmount} </h2>
                    </div>
                    <div className="final-payment-block payment-block2" >
                        <div>
                            <p>Available reward points:<span className="rp">{this.availablePoints}</span></p>
                        </div>
                        <div className="d-flex points-redeem">
                            <label>Enter Points to reedem:</label>
                            <input type="number" className="form-control" name="rewardPoint" value={this.reedemdPoint} onChange={(event) => this.handleRewardInputChange(event)} />
                            <div className="col-sm-2 plr-3 checkout-action">
                                <SaveButton buttonDisplayText={"Apply"} Class_Name="btn-green btn btn-default" handlerSearch={() => this.reedemRewardPoints()} />
                            </div>
                            <div className="col-sm-2 plr-3 checkout-action">
                                <SaveButton buttonDisplayText={"Cancel"} style={{ marginLeft: "5px" }} Class_Name="btn-green btn btn-default" handlerSearch={() => this.clearRewardPoints()} />
                            </div>
                        </div>

                    </div>
                    {this.paymentMethod === '' ?
                        <div className="checkout-action-block">
                            <div className="row mlr-0 style3" >
                                <div className="col-sm-12 plr-0" ><h5>Please Select Your Payment Method  </h5></div>
                            </div>
                            <div className="col-sm-12">
                                <div className="payment-method-type cash" onClick={() => this.changePaymentMethod('CASH')}>Cash Payment</div>
                                <div className="payment-method-type currency" onClick={() => this.changePaymentMethod('AOB WALLET')}>AOB Currency</div>
                            </div>
                        </div>
                        :
                        <div className="checkout-action-block">
                            <div className="row  mlr-0 style3">
                                <div className="col-sm-6"><h5>Payment Method: {this.paymentMethod}</h5></div>
                                <div className="col-sm-6"><SaveButton Class_Name="pull-right btn-green" buttonDisplayText={'CHANGE PAYMENT METHOD'} handlerSearch={() => this.changePaymentMethod('')} /></div>
                            </div>
                            <div className="col-sm-12">
                                <Money receivedAmount={this.receivedAmount}
                                    handleReceivedMoney={(receivedAmount) => this.handleReceivedMoney(receivedAmount)}
                                />
                            </div>
                        </div>
                    }
                    <div className="complate-payment-section">
                        <div className="due-amoount-block">
                            <div className="col-sm-8 plr-5">
                                <span>{this.balancedAmount > 0 ? 'Change Due:' : 'Payment Remaining:'}</span> <span>{'$ ' + this.balancedAmount}</span>

                            </div>
                            <div className="col-sm-4 plr-5 checkout-action">
                                <SaveButton
                                    Class_Name="pull-right btn-green"
                                    buttonDisplayText={'COMPLETE TRANSACTION'}
                                    handlerSearch={this.handleTransactionSubmit} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }

}
export default CheckoutForm;;