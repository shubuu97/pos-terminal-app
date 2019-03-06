import React from 'react';
import PropTypes from 'prop-types';
import moment from "moment";
/* Lodash Imports */
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _isArray from 'lodash/isArray';
import _find from 'lodash/find';
import _cloneDeep from 'lodash/cloneDeep';
import _set from 'lodash/set';
/* Redux Imports */
import { commonActionCreater } from '../Redux/commonAction'
/* Material Imports */
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';

import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
/* Material Icons */
import genericPostData from '../Global/dataFetch/genericPostData';
import OrderRefund from './OrderRefund';
import HandlePrint from '../Global/PosFunctions/handlePrint';

const styles = {
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
};

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class OrderHistoryDialog extends React.Component {
    state = {
        orderId: '',
        openRefund: false,
        selectedOrder: {},
    }

    componentDidMount() {

    }
    onSelectOrder = (custData) => {
        this.setState({
            orderId: _get(custData, 'sale.id', ''),
            selectedOrder: custData,
        })
    }
    handleReasonChange = (e, index) => {
        let selectedOrder = _cloneDeep(this.state.selectedOrder);
        _set(selectedOrder, `saleParts[${index}].saleItem.returnReason`, _get(e, 'target.value', ''));
        this.setState({
            selectedOrder,
        });
    }
    updateReturnQuantity = (quantity, index) => {
        let selectedOrder = _cloneDeep(this.state.selectedOrder);
        let item = _get(selectedOrder, `saleParts[${index}]`, {});
        if (quantity <= _get(selectedOrder, `saleParts[${index}].saleItem.qty`, 0)) {
            _set(selectedOrder, `saleParts[${index}].saleItem.returnQty`, Number(quantity));
            if (quantity != '') {
                let refundAmount = (_get(item, 'saleItem.itemRegularTotal.amount', 0) / _get(item, 'saleItem.qty', 0)) * Number(quantity);
                _set(selectedOrder, `saleParts[${index}].saleItem.itemRefundAmount.amount`, Number(refundAmount.toFixed(2)));
                _set(selectedOrder, `saleParts[${index}].saleItem.itemRefundAmount.currencyCode`, '$');
            }
        }
        this.setState({
            selectedOrder,
        });
    }
    openRefund = () => {
        this.setState({
            openRefund: true,
        })
    }

    handleRefundClose = () => {
        this.setState({
            openRefund: false,
        })
    }
    handleRefund = () => {
        const { selectedOrder } = this.state;
        let data = {};
        data.saleId = _get(selectedOrder, 'sale.id', '');
        let saleItems = [];
        let totalRefundAmount = 0;
        selectedOrder.saleParts.map((part, index) => {
            let tempPart = { ...part.saleItem };
            tempPart.productId = _get(part, 'product.id', '');
            totalRefundAmount += Number(_get(part, 'saleItem.itemRefundAmount.amount', 0));
            if (tempPart.returnQty && tempPart.returnQty > 0) {
                saleItems.push(tempPart);
            }
        })
        data.saleItems = saleItems;
        data.totalRefundAmount = {
            amount: totalRefundAmount,
            currencyCode: "$",
        }
        data.refundSessionId = localStorage.getItem('sessionId');
        data.refundApprovedBy = localStorage.getItem('userId');
        data.refundTimeStamp = {
            seconds: parseInt(new Date().getTime() / 1000),
        }

        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: data,
            url: 'Sale/Refund',
            constants: {
                init: 'SALE_REFUND_INIT',
                success: 'SALE_REFUND_SUCCESS',
                error: 'SALE_REFUND_ERROR'
            },
            identifier: 'SALE_REFUND',
            successCb: this.handleRefundSuccess,
            errorCb: this.handleRefundError,
            dontShowMessage:true
        })
    }

    handleRefundSuccess = () => {
        this.handleRefundClose();
        let url = 'Sale/GetByCustomerId';
        let data = { id: _get(this.state, 'selectedOrder.sale.customerId', '') }
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: data,
            url: url,
            constants: {
                init: 'GET_CUSTOMER_SALE_DATA_INIT',
                success: 'GET_CUSTOMER_SALE_DATA_SUCCESS',
                error: 'GET_CUSTOMER_SALE_DATA_ERROR'
            },
            identifier: 'GET_CUSTOMER_SALE_DATA',
            successCb: this.handleGetCustomerSaleData,
            errorCb: this.handleGetCustomerSaleDataError
        })
    }
    handleRefundError = () => {

    }

    showPaymentMethods = (custData) => {
        const paymentMethodsView = !_isEmpty(_get(custData, 'sale.payments', [])) && _get(custData, 'sale.payments', []).map((payment) => (
            <React.Fragment>
                <span>{`Amount: ${_get(payment, 'paymentAmount.currencyCode', '$')} ${_get(payment, 'paymentAmount.amount', 0)}`}</span>
                <span>{`  Payment Method: ${_get(payment, 'paymentMethod', '')}`}</span>
                <br />
            </React.Fragment>
        ))
        return (
            <div className="mui-col-md-12">
                {paymentMethodsView}
            </div>
        )
    }

    populateOrderHistory = () => {
        const { salesList } = this.props;
        const orderHistory = !_isEmpty(salesList) && _isArray(salesList) && salesList.map((custData, index) => (
            <div onClick={() => this.onSelectOrder(custData)} key={index} className="card">
                <div className={_get(this.state, 'orderId', '') === _get(custData, 'sale.id', '') ? "active" : ""}>
                    <div className="mui-col-md-12">
                        {moment(_get(custData, 'sale.saleCommitTimeStamp.seconds', 0) * 1000).format('MM/DD/YYYY')}
                    </div>
                    <div className="mui-row" style={{ paddingLeft: '15px' }}>
                        <div className="">
                            <div className="mui-col-md-8">
                                <label>{`Order Id: ${_get(custData, 'sale.id', '')}`}</label>
                                <br />
                                <span>{`Email: ${_get(custData, 'customer.email', '')}`}</span>
                            </div>
                            <div className="mui-col-md-8">
                                <label>{`Total Amount: ${_get(custData, 'sale.totalAmount.currencyCode', '$')} ${_get(custData, 'sale.totalAmount.amount', 0)}`}</label>
                                <br />
                            </div>
                            {this.showPaymentMethods(custData)}
                        </div>
                    </div>
                </div>
            </div>
        ));
        return (
            <div className="content">
                {orderHistory}
            </div>
        )
    }

    showRefundOrderList = () => {
        const { selectedOrder } = this.props;
        // let orderData = _find(salesList, { sale: { id: this.state.orderId } });
        let listItems = !_isEmpty(_get(this.state, 'selectedOrder.saleParts', [])) ? this.state.selectedOrder.saleParts.map((item, index) => (
            <tr>
                <td>{_get(item, 'product.name', '')}</td>
                {/* <td>{(_get(item, 'saleItem.itemRegularTotal.amount', 0) / _get(item, 'saleItem.qty', 0)).toFixed(2)}</td> */}
                {/* <td>{_get(item, 'saleItem.qty', 0)}</td> */}
                <td>
                    <input name={`returnQty-${index}`} value={_get(item, 'saleItem.returnQty', 0)} onChange={(e) => this.handleChange(e, index)} />
                </td>
                <td>{(_get(item, 'saleItem.itemRefundAmount.amount', 0))}</td>
                <td>{(_get(item, 'saleItem.returnReason', ''))}</td>
                {/* <td>{((_get(item, 'saleItem.itemRegularTotal.amount', 0) / _get(item, 'saleItem.qty', 0)) * _get(item, 'saleItem.returnQty', 0)).toFixed(2) + _get(item, 'product.tax', 0)}</td> */}

            </tr>
        )) : (
                <tr>
                    <td>Cell 1-1</td>
                    <td>Cell 1-2</td>
                    <td>Cell 1-2</td>
                    <td>Cell 1-2</td>
                    <td>Cell 1-2</td>
                    <td>Cell 1-2</td>
                    <td>Cell 1-2</td>
                </tr>
            )
        return (
            <React.Fragment>
                {listItems}
            </React.Fragment>
        )
    }

    showItemList = () => {
        const { salesList } = this.props;

        let orderData = _find(salesList, { sale: { id: this.state.orderId } });
        let listItems = _isArray(orderData.saleParts) ? orderData.saleParts.map((item) => (
            <tr>
                <td>{_get(item, 'product.name', '')}</td>
                <td>{(_get(item, 'saleItem.itemRegularTotal.amount', 0) / _get(item, 'saleItem.qty', 0))}</td>
                <td>{_get(item, 'saleItem.qty', 0)}</td>
                <td>{_get(item, 'saleItem.returnQty', 0)}</td>
                <td>{_get(item, 'product.discount', 0)}</td>
                <td>{(_get(item, 'saleItem.itemSubTotal.amount', ''))}</td>
                <td>{_get(item, 'product.tax', 0)}</td>
                <td>{(_get(item, 'saleItem.itemEffectiveTotal.amount', 0))}</td>
                <td>{(_get(item, 'saleItem.itemRefundAmount.amount', ''))}</td>
            </tr>
        )) : (
                <tr>
                    <td>Cell 1-1</td>
                    <td>Cell 1-2</td>
                    <td>Cell 1-2</td>
                    <td>Cell 1-2</td>
                    <td>Cell 1-2</td>
                    <td>Cell 1-2</td>
                    <td>Cell 1-2</td>
                </tr>
            )
        return (
            <React.Fragment>
                {listItems}
            </React.Fragment>
        )
    }

    handlePrint = () => {
        var content = document.getElementById('printarea');
        var pri = document.getElementById('ifmcontentstoprint').contentWindow;
        pri.document.open();
        pri.document.write(content.innerHTML);
        pri.document.close();
        pri.focus();
        pri.print();
    }

    handlePrintRefund = () => {
        var content = document.getElementById('printareaRefund');
        var pri = document.getElementById('ifmcontentstoprintRefund').contentWindow;
        pri.document.open();
        pri.document.write(content.innerHTML);
        pri.document.close();
        pri.focus();
        pri.print();
    }

    populateOrderData = () => {
        const { salesList } = this.props;
        let selectedOrder = _find(salesList, { sale: { id: this.state.orderId } });
        return (
            <div className="">
                <div className={"mui-row"} >
                    <div className="card" style={{ justifyContent: 'center' }}>
                        {moment(_get(selectedOrder, 'sale.saleCommitTimeStamp.seconds', 0) * 1000).format('MM/DD/YYYY')}
                        <div className="mui-row">
                            <div className="mui-col-md-4" style={{ display: 'flex', paddingLeft: '29px' }}>
                                <label >{` ${_get(selectedOrder, 'sale.totalAmount.currencyCode', '$')} ${_get(selectedOrder, 'sale.totalAmount.amount', '0')}`}</label>
                            </div>
                            <div className="mui-col-md-8">
                                <label >{`Status: Complete`}</label>
                                <br />
                                <label >{`Created Date: ${moment(_get(selectedOrder, 'sale.saleCommitTimeStamp.seconds', 0) * 1000).format('MM/DD/YYYY')}`}</label>
                                <br />
                                <label >{`Served By: ${_get(selectedOrder, 'sale.terminalId', '')}`}</label>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="mui-row" style={{ paddingLeft: '5%', paddingRight: '6%' }}>
                            <table className="mui-table mui-table--bordered">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Original Price</th>
                                        <th>Qty</th>
                                        <th>Return Qty</th>
                                        <th>Discount Amount</th>
                                        <th>SubTotal</th>
                                        <th>Tax Amount</th>
                                        <th>Sale Total</th>
                                        <th>Return Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.showItemList()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="card">
                        <div className="mui-row">
                            <div className="mui-col-md-6" style={{ display: 'flex', paddingLeft: '29px' }}>
                            </div>
                            <div className="mui-col-md-6" style={{ paddingRight: '50px' }}>
                                <label >{`Tax: `}</label>
                                <label style={{ float: 'right' }}>{`$ ${_get(selectedOrder, 'sale.tax', '0')}`}</label>
                                <br />
                                <label >{`Grand Total: `}</label>
                                <label style={{ float: 'right' }}>{`${_get(selectedOrder, 'sale.totalAmount.currencyCode', '$')} ${_get(selectedOrder, 'sale.totalAmount.amount', '0')}`}</label>
                                <br />
                                <label >{`Returned Amount: `}</label>
                                <label style={{ float: 'right' }}>{`${_get(selectedOrder, 'sale.totalRefundAmount.currencyCode', '$')} ${_get(selectedOrder, 'sale.totalRefundAmount.amount', '0')}`}</label>
                                <br />
                                <label >{`Total Paid: `}</label>
                                <div style={{ float: 'right' }}>
                                    {this.showPaymentMethods(this.state.selectedOrder)}
                                </div>
                                {/* <label style={{ float: 'right' }}>{`$ ${_get(selectedOrder, 'sale.paymentAmount', '100.00')}`}</label> */}
                                <br />
                                <br />
                                <label >{`Change: `}</label>
                                <label style={{ float: 'right' }}>{`$ ${(_get(selectedOrder, 'sale.totalAmountPaid.amount', 0) - _get(selectedOrder, 'sale.totalAmount.amount', 0)).toFixed(2)}`}</label>
                            </div>
                        </div>
                        <div className="mui-row" style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button onClick={() => this.handlePrint()} variant="contained">ORDER PRINT </Button>
                            {_get(selectedOrder, 'sale.totalRefundAmount') ?
                                <Button style={{ marginLeft: '15px' }} onClick={() => this.handlePrintRefund()} variant="contained">REFUND PRINT </Button> : ''
                            }
                            {
                                !_get(selectedOrder, 'sale.refund', false) &&
                                    <Button style={{ marginLeft: '15px' }} variant="contained" onClick={() => this.openRefund()}>REFUND </Button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const { classes, store } = this.props;
        const { selectedOrder } = this.state; 
        let check = ('amount' in _get(selectedOrder,'sale.itemDiscountAmount',{}))
        console.log(check, 'checking check')
        let address  = _get(store,'store.address', '')

        let storeAddress = _get(address, 'addressLine1', '') + ', ' + 
        _get(address, 'addressLine2', '') + ', ' + _get(address, 'city', '') + ', ' +
        _get(address, 'state', '') + ', ' + _get(address, 'country', '') + ', ' +
        _get(address, 'postalCode', '')

        const customerName = _get(selectedOrder,'customer.customer.firstName') + ' ' +
        _get(selectedOrder,'customer.customer.lastName')

        let terminalId = _get(selectedOrder,'sale.terminalId', '')
        let terminal = _find(_get(store,'terminals', []), terminal => {
            return terminal.id === terminalId
        })
        let terminalName = _get(terminal,'name', '')

        return (
            <div className='hold-dialogue'>
                <Dialog
                    fullScreen
                    open={this.props.open}
                    onClose={this.props.handleClose}
                    TransitionComponent={Transition}
                >
                    <div className='history-section'>
                        <div className='history-header'>
                            <IconButton color="inherit" onClick={this.props.handleClose} aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                            <span className='ml-20'>Order History</span>
                        </div>
                        <div className="mui-container-fluid">
                            <div className="mui-col-md-4 pad-none"  >
                                {this.populateOrderHistory()}
                            </div>
                            {
                                this.state.orderId !== '' &&
                                <div className="mui-col-md-8 pad-none"  >
                                    {this.populateOrderData()}
                                </div>
                            }
                        </div>
                    </div>
                    {
                        this.state.openRefund &&
                        <OrderRefund
                            open={this.state.openRefund}
                            handleClose={this.handleRefundClose}
                            selectedOrder={this.state.selectedOrder}
                            updateReturnQuantity={this.updateReturnQuantity}
                            handleRefund={this.handleRefund}
                            handleReasonChange={this.handleReasonChange}
                        />
                    }
                </Dialog>
                <iframe id="ifmcontentstoprint" style={{
                    height: '0px',
                    width: '0px',
                    position: 'absolute'
                }}></iframe>
                <div id='printarea'>
                    <div>
                        <HandlePrint 
                            type="Order History"
                            currency='$'
                            itemList={_get(selectedOrder,'saleParts', [])}
                            orderDate= {moment(_get(selectedOrder, 'sale.saleCommitTimeStamp.seconds', 0) * 1000).format('llll')}  
                            storeName={_get(store,'store.name', '')}
                            storeAddress={storeAddress}
                            customerName={customerName}
                            terminalName={terminalName}
                            itemsDiscount={('amount' in _get(selectedOrder,'sale.itemDiscountAmount',{})) ? _get(selectedOrder,'sale.itemDiscountAmount.amount', '') : 0}
                            cartDiscount={('amount' in _get(selectedOrder,'sale.cartDiscountAmount',{})) ? _get(selectedOrder,'sale.cartDiscountAmount.amount', '') : 0}
                            employeeDiscount={('amount' in _get(selectedOrder,'sale.employeeDiscountAmount',{})) ? _get(selectedOrder,'sale.employeeDiscountAmount.amount', '') : 0}
                            totalTax={('amount' in _get(selectedOrder,'sale.totalTaxAmount',{})) ? _get(selectedOrder,'sale.totalTaxAmount.amount','') : 0}
                            totalAmount={('amount' in _get(selectedOrder,'sale.totalAmount',{})) ? _get(selectedOrder,'sale.totalAmount.amount','') : 0}
                            totalAmountPaid={('amount' in _get(selectedOrder,'sale.totalAmountPaid',{})) ? _get(selectedOrder,'sale.totalAmountPaid.amount','') : 0}
                            changeDue={('amount' in _get(selectedOrder,'sale.changeDue',{})) ? _get(selectedOrder,'sale.changeDue.amount','0') : 0}
                            paymentMethods={_get(selectedOrder,'sale.payments',[])}
                        />
                    </div>
                </div>
                <iframe id="ifmcontentstoprintRefund" style={{
                    height: '0px',
                    width: '0px',
                    position: 'absolute'
                }}></iframe>
                <div id='printareaRefund'>
                    <div>
                        <h3> <span>{_get(store, 'store.address.addressLine1', '') + ' ' + _get(store, 'store.address.city', '') + ' ' + _get(store, 'store.address.state', '') + ' ' + _get(store, 'store.address.country', '') + ' ' + _get(store, 'store.address.postalCode', '')}</span> </h3>
                        <h4> <span>CUSTOMER:</span> <span>{_get(this.state, 'selectedOrder.customer.customer.firstName', '') + ' ' + _get(this.state, 'selectedOrder.customer.customer.lastName', '')}</span> </h4>
                        <h3> <span>STORE:</span> <span>{_get(store, 'store.name', '')}</span> </h3>
                        <h3> <span>TERMINAL:</span> <span>{_get(store, 'terminals[0].name', '')}</span> </h3>
                        <h4> <span>CASHIER:</span> <span>{_get(this.state, 'selectedOrder.sale.operatorId', '')}</span> </h4>
                        <h4> <span>{moment().format('LLLL')}</span> </h4>

                        <div className="card">
                            <div className="mui-row" style={{ paddingLeft: '5%', paddingRight: '6%' }}>
                                <table className="mui-table mui-table--bordered">
                                    <thead>
                                        <tr>
                                            <th style={{ paddingRight: '50px' }}>ITEM</th>
                                            <th style={{ paddingRight: '50px' }}>RETURN QTY</th>
                                            <th style={{ paddingRight: '50px' }}>RETURN AMOUNT</th>
                                            <th style={{ paddingRight: '50px' }}>REASON</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.showRefundOrderList()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="mui-row">
                            <div className="mui-col-md-6" style={{ paddingRight: '50px' }}>
                                <label >{`Total Refund: `}</label>
                                <label style={{ float: 'right' }}>{`$ ${_get(selectedOrder, 'sale.totalRefundAmount.amount', 0)}`}</label>
                                <br />
                            </div>
                        </div>
                    </div>

                </div>
            </div >
        );
    }
}

OrderHistoryDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    let { customerSalesList, storeData } = state;
    let salesList = customerSalesList.lookUpData || [];
    let store = storeData.lookUpData || {};

    return {
        salesList,
        store
    }
}


export default connect(mapStateToProps)(withStyles(styles)(OrderHistoryDialog));