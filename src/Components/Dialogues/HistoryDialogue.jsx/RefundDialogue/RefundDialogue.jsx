import React from 'react';
/* React Pose */
import posed from 'react-pose';
/* Material Imports */
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close'

import TextField from '@material-ui/core/TextField';
/* Material Icons */
import RemoveCircleIcons from '@material-ui/icons/RemoveCircleOutline';
import AddIcons from '@material-ui/icons/AddCircleOutline';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
/* Lodash Imports */
import _get from 'lodash/get';
import _findIndex from 'lodash/findIndex';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class RefundDialogue extends React.Component {
    state = {
        open: false,
        error: false,
        success: false,
        step: 1,
        returnItems: []
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    showItemList = () => {
        let saleItems = _get(this.props, "selectedSaleTransaction.sale.saleItems", []);
        let saleItemResp = saleItems.map((saleItem, index) => {
            if (this.state[`checkbox${index}`] == undefined)
                this.state[`checkbox${index}`] = true;
            let returnableQty = _get(saleItem, "qty", 0) - _get(saleItem, "returnQty", 0)
            return (<tr>
                <td>{_get(saleItem, "product.name", '')}</td>
                <td>{returnableQty}</td>
                <td>

                    {
                        <div className='expanded-options'>
                            <span className='option-title'>Quantity</span>
                            <div className='flex-row justify-center align-center'>
                                <RemoveCircleIcons onClick={() => this.handleDecreseQuantity(index, returnableQty)} style={{ fontSize: '1.7em' }} />
                                <span className='quantity'>{this.state[`returnQty${index}`] || 0}</span>
                                <AddIcons onClick={() => this.handleIncreaseQuantity(index, returnableQty)} style={{ fontSize: '1.7em' }} />
                            </div>
                        </div>
                    }
                </td>
                <td><FormControlLabel
                    control={
                        <Checkbox
                            checked={this.state[`checkbox${index}`]}
                            onChange={this.handleChangeCB(index)}
                        // value="checkedA"
                        />
                    }
                /></td>
            </tr>)
        })
        return (
            <React.Fragment>
                {saleItemResp}
            </React.Fragment>

        )
    }

    handleProceed = () => {
        this.setState({
            step: this.state.step + 1
        })
    }

    handleDecreseQuantity = (index, returnableQty) => {
        let returnQty = this.state[`returnQty${index}`]
        if (returnQty != 0) {
            let expectedQty = returnQty - 1;
            this.setState({
                [`returnQty${index}`]: expectedQty
            });
            this.makeReturnArray(index, expectedQty);
        }
    }
    calAmounts = (subTotal, quantity, returnQuantity) => {
        let perPriceItemPrice = subTotal / quantity;
        let refundEstimatedAmount = perPriceItemPrice * returnQuantity;
        return refundEstimatedAmount;
    }
    makeReturnArray = (index, expectedQty, replenishInventory) => {
        let refundObj = {};
        let selectedSaleItems = _get(this.props, `selectedSaleTransaction.sale.saleItems[${index}]`, {});
        console.log(selectedSaleItems, "selectedSaleItems");

        //logic to calculate itemRefundSubTotalAmount;
        let qty = selectedSaleItems.qty;
        let itemSubTotal = _get(selectedSaleItems, 'itemSubTotal.amount', 0);
        let itemTaxAmount = _get(selectedSaleItems, 'itemTaxAmount.amount', 0);
        let itemEffectiveTotal = _get(selectedSaleItems, 'itemEffectiveTotal.amount', 0);

        let itemRefundSubTotalAmount = this.calAmounts(itemSubTotal, qty, expectedQty);
        let itemRefundTaxTotalAmount = this.calAmounts(itemTaxAmount, qty, expectedQty);
        let itemRefundEffectiveTotalAmount = this.calAmounts(itemEffectiveTotal, qty, expectedQty);


        refundObj.itemRefundSubTotal = { currencyCode: "$", amount: itemRefundSubTotalAmount };
        refundObj.itemRefundTaxTotal = { currencyCode: "$", amount: itemRefundTaxTotalAmount };
        refundObj.itemRefundEffectiveTotal = { currencyCode: "$", amount: itemRefundEffectiveTotalAmount };
        refundObj.qty = expectedQty;
        refundObj.productId = selectedSaleItems.productId;
        refundObj.replenishInventory = replenishInventory;
        console.log(refundObj, "refundObj");


        //logic to find if object already exist in the state
        let indexOfReturnItem = _findIndex(this.state.returnItems, { 'productId': selectedSaleItems.productId });
        console.log(indexOfReturnItem, "indexindex");
        if (indexOfReturnItem == -1) {
            this.state.returnItems.push(refundObj)
        }
        else {
            this.state.returnItems[indexOfReturnItem] = refundObj;
        }
    }

    handleIncreaseQuantity = (index, returnableQty) => {
        debugger;
        let returnQty = this.state[`returnQty${index}`] || 0
        if (returnQty < returnableQty) {
            let expectedQty = returnQty + 1;
            this.setState({
                [`returnQty${index}`]: expectedQty
            });

            this.makeReturnArray(index, expectedQty, this.state[`checkbox${index}`]);
        }

    }
    handleChangeCB = index => event => {
        this.setState({ [`checkbox${index}`]: event.target.checked });
        let returnQty = this.state[`returnQty${index}`] || 0
        this.makeReturnArray(index, returnQty, event.target.checked);
    };
    handleRefundClick = (refundMethod) => (event) => {
        this.setState({ [refundMethod]: true });
    }

    onRemoveRefundMethod = (refundMethod) => {
        this.setState({ [refundMethod]: false })
    }

    giftCardRefundComponent = () => {
        return (<div className="default-card-pay">
            <span className='payment-title'>Gift Card Refund</span>
            {!this.props.cardRefrenceId ?
                <div className="flex-row align-center justify-space-between relative">
                    <div className="d-flex" style={{ width: '80%' }}>
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            autoFocus
                            // onFocus={() => this.props.currentFocus({ fieldValue: 'cardAmount', handler: 'CARD_INPUT_HANDLER' })}
                            id="outlined-name"
                            label="Gift Card Number"
                            value={this.props.cardAmount}
                            // onChange={this.handleChange('cardAmount')}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                        />
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            autoFocus
                            // onFocus={() => this.props.currentFocus({ fieldValue: 'cardAmount', handler: 'CARD_INPUT_HANDLER' })}
                            id="outlined-name"
                            label="Amount"
                            value={this.props.cardAmount}
                            // onChange={this.handleChange('cardAmount')}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                        />
                    </div>
                    <span onClick={this.reqPaymentByCard} className="pay-button flex-row justify-center align-center">
                        Void
                    </span>
                    <CloseIcon
                        onClick={() => this.onRemoveRefundMethod('giftRefund')} />
                </div> :
                <div>
                    <span>Ref Id:</span>
                    <span className="bold">{this.props.cardRefrenceId}</span>
                </div>
            }
        </div>)
    }

    cardRefundComponent = () => {
        return (<div className="default-card-pay">
            <span className='payment-title'>Card Refund</span>
            {!this.props.cardRefrenceId ?
                <div className="flex-row align-center justify-space-between relative">
                    <div style={{ width: '80%' }}>
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            autoFocus
                            // onFocus={() => this.props.currentFocus({ fieldValue: 'cardAmount', handler: 'CARD_INPUT_HANDLER' })}
                            id="outlined-name"
                            label="Amount"
                            value={this.props.cardAmount}
                            // onChange={this.handleChange('cardAmount')}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                        />
                    </div>
                    <span onClick={this.reqPaymentByCard} className="pay-button flex-row justify-center align-center">
                        Void
          </span>
                    <CloseIcon
                        onClick={() => this.onRemoveRefundMethod('cardRefund')} />
                </div> :
                <div>
                    <span>Ref Id:</span>
                    <span className="bold">{this.props.cardRefrenceId}</span>
                </div>
            }
        </div>)
    }

    cashRefundComponent = () => {
        return (<div className="default-card-pay">
            <span className='payment-title'>Cash Refund</span>
            <div className="flex-row align-center justify-space-between">
                <div style={{ width: '80%' }}>
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        id="cashPay"
                        label="Amount"
                        type="tel"
                        value={this.props.cashAmount}
                        // onChange={this.handleChange('cashPay')}
                        margin="outline"
                        // onFocus={() => this.props.currentFocus({ fieldValue: 'cashAmount', handler: 'CASH_INPUT_HANDLER' })}
                        fullWidth
                        autoFocus
                        type='text'
                        variant="outlined"
                        className='mt-10'
                    />
                </div>
                <CloseIcon
                    onClick={() => this.onRemoveRefundMethod('cashRefund')} />

            </div>
        </div>)
    }


    handleInputChange = () => {

    }

    render() {
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    TransitionComponent={Transition}
                    keepMounted
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                    fullWidth
                    maxWidth={'md'}
                >
                    <div className='refund-dialogue'>

                        {/* Step 1 */}
                        {
                            this.state.step == 1 ?
                                <div className='refund-step-1 flex-column '>
                                    <span className='card-title'>Order Details</span>
                                    <div className="refund-items overflow-y mui-row" style={{ paddingLeft: '5%', paddingRight: '6%' }}>
                                        <table className="mui-table mui-table--bordered">
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th>Returnable Qty</th>
                                                    <th>Return Qty</th>
                                                    <th>Increase Inventory</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.showItemList()}
                                            </tbody>
                                        </table>
                                    </div>
                                </div> : null
                        }

                        {/* Step 2 */}
                        {
                            this.state.step == 2 ?
                                <div className='flex-row'>
                                    <div className='halfwidth'>
                                        <span className='card-title'>Refund Methods</span>
                                        <div className="d-flex justify-space-evenly">
                                            <Button onClick={this.handleRefundClick("cashRefund")} variant="contained" color="primary">Cash</Button>
                                            <Button onClick={this.handleRefundClick("cardRefund")} variant="contained" color="primary">Card</Button>
                                            <Button onClick={this.handleRefundClick("giftRefund")} variant="contained" color="primary">Gift Card</Button>
                                        </div>
                                        <div>
                                            {this.state.cashRefund ? this.cashRefundComponent() : null}
                                        </div>
                                        <div>
                                            {this.state.cardRefund ? this.cardRefundComponent() : null}
                                        </div>
                                        <div>
                                            {this.state.giftRefund ? this.giftCardRefundComponent() : null}
                                        </div>
                                    </div>
                                    <div className='halfwidth flex-row justify-flex-end'>
                                        <div className='numpad-global' style={{ width: '70%' }}>
                                            <div className='card numpad-card' >
                                                <span className='card-title' style={{ color: '#fff' }}>Numpad</span>
                                                <div className='flex-row flex-wrap justify-center pt-15'>
                                                    <div className='key small-key' onClick={this.handleInputChange('1')}>1</div>
                                                    <div className='key small-key' onClick={this.handleInputChange('2')}>2</div>
                                                    <div className='key small-key' onClick={this.handleInputChange('3')}>3</div>
                                                    <div className='key small-key' onClick={this.handleInputChange('4')}>4</div>
                                                    <div className='key small-key' onClick={this.handleInputChange('5')}>5</div>
                                                    <div className='key small-key' onClick={this.handleInputChange('6')}>6</div>
                                                    <div className='key small-key' onClick={this.handleInputChange('7')}>7</div>
                                                    <div className='key small-key' onClick={this.handleInputChange('8')}>8</div>
                                                    <div className='key small-key' onClick={this.handleInputChange('9')}>9</div>
                                                    <div className='key small-key' onClick={this.handleInputChange('.')}>.</div>
                                                    <div className='key small-key' onClick={this.handleInputChange('0')}>0</div>
                                                    <div className='key small-key' onClick={this.handleInputChange('<')}>clr</div>
                                                    <div className='small-key'></div>
                                                    <div className='key big-key'>Enter</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                : null
                        }

                        {/* Step 3 */}
                        {
                            this.state.step == 3 ?
                                <div className='refund-step-2 flex-column'>
                                    <span className='card-title'>Success/Faliure</span>
                                </div> : null
                        }


                        {
                            this.state.step == 1 || this.state.step == 2 ?
                                <div className='refund-action-section flex-row'>
                                    <div className='action-btn flex-row justify-center align-center' onClick={this.props.handleRefundClose}>Cancel</div>
                                    <div className='action-btn flex-row justify-center align-center' onClick={this.handleProceed}>Proceed</div>
                                </div> : null
                        }


                    </div>
                </Dialog>
            </div>
        );
    }
}

export default RefundDialogue;