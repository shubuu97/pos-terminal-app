import React from 'react';
/* React Pose */
import posed from 'react-pose';
/* Material Imports */
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
/* Material Icons */
import RemoveCircleIcons from '@material-ui/icons/RemoveCircleOutline';
import AddIcons from '@material-ui/icons/AddCircleOutline';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
/* Lodash Imports */
import _get from 'lodash/get';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class RefundDialogue extends React.Component {
    state = {
        open: false,
        error: false,
        success: false,
        step: 1,
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
                            onChange={this.handleChangeCB(`checkbox${index}`)}
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
            this.setState({
                [`returnQty${index}`]: returnQty - 1
            })
        }
    }

    handleIncreaseQuantity = (index, returnableQty) => {
        let returnQty = this.state[`returnQty${index}`] || 0
        if (returnQty < returnableQty) {
            this.setState({
                [`returnQty${index}`]: returnQty + 1
            });
            let refundObj = {};
            let expectedQty = returnQty + 1;
            let saleItems = _get(this.props, "selectedSaleTransaction.sale.saleItems", []);
            let selectedSaleItems = saleItems[index];
            console.log(selectedSaleItems,"selectedSaleItems");
            
            let itemSubTotal =  selectedSaleItems.itemSubTotal.amount;
            let perPriceItemPrice = (itemSubTotal/(selectedSaleItems.qty))
            let itemRefundSubTotalAmount = perPriceItemPrice*expectedQty;

            refundObj.itemRefundSubTotal =  {currencyCode:"$",amount:itemRefundSubTotalAmount};
            refundObj.qty = returnQty + 1;
            refundObj.productId = selectedSaleItems.productId;
            console.log(refundObj,"refundObj")

            // Amount itemRefundTaxTotal = 4;
            // Amount itemRefundEffectiveTotal = 5;
            // bool replenishInventory = 6;
        }
        // string id = 1;
        // string saleId = 2;
        // repeated ReturnItem returnItems= 3;
        // string operatorId = 4;
        // string terminalId = 5;
        // string storeId = 6;
        // string retailerId = 7;
        // string sessionId = 8;
        // google.protobuf.Timestamp timestamp = 9;
        // string reason = 10;
        // repeated Payment refunds = 11;
        // Amount refundSubTotal = 12;
        // Amount refundTaxTotal = 13;
        // Amount refundTotal = 14;

        // string productId = 1;
        // int32 qty = 2;
        // Amount itemRefundSubTotal = 3;
        // Amount itemRefundTaxTotal = 4;
        // Amount itemRefundEffectiveTotal = 5;
        // bool replenishInventory = 6;
    }
    handleChangeCB = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    render() {
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    TransitionComponent={Transition}
                    keepMounted
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
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
                                <div className='refund-step-2 flex-column'>
                                    <span className='card-title'>Refund Methods</span>

                                </div> : null
                        }

                        {
                            this.state.step == 3 ?
                                <div className='refund-step-2 flex-column'>
                                    <span className='card-title'>Success</span>

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