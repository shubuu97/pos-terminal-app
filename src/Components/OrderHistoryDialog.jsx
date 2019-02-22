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
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
/* Material Icons */
import DeleteIcons from '@material-ui/icons/DeleteOutline';
/*  */
import applyCart from '../Global/PosFunctions/applyCart';
import genericPostData from '../Global/dataFetch/genericPostData';
import { isArray } from 'util';
import OrderRefund from './OrderRefund';


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
                _set(selectedOrder, `saleParts[${index}].saleItem.itemRefundAmount.amount`, (refundAmount));
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
            totalRefundAmount += _get(part, 'saleItem.itemRefundAmount.amount', 0);
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
            seconds: parseInt(new Date().getTime()/1000),
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
            errorCb: this.handleRefundError
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

    showRecieptOrderList = () => {
        {console.log('orderrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr', this.state.selectedOrder)}
        let listItems = !_isEmpty(_get(this.state, 'selectedOrder.saleParts', [])) ? this.state.selectedOrder.saleParts.map((item) => (
            <tr>
                <td>{_get(item, 'product.name', '')}</td>
                <td>{_get(item, 'saleItem.qty', 0)}</td>
                <td>{(_get(item, 'saleItem.itemRegularTotal.amount', 0) / _get(item, 'saleItem.qty', 0))}</td>
                <td>{_get(item, 'saleItem.price', 0)}</td>
                <td>{_get(item, 'saleItem.itemSubTotal.amount', 0)}</td>
            </tr>
        )) : (
                <tr>
                    <td>Cell 1-1</td>
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
                                        <th>Row Total</th>
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
                                <label style={{ float: 'right' }}>{`$ ${(_get(selectedOrder, 'sale.totalAmountPaid.amount', 0)-_get(selectedOrder, 'sale.totalAmount.amount', 0)).toFixed(2)}`}</label>
                            </div>
                        </div>
                        <div className="mui-row" style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button onClick={() => this.handlePrint()} variant="contained">ORDER PRINT </Button>
                            <Button style={{ marginLeft: '15px' }} variant="contained" onClick={() => this.openRefund()}>REFUND </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const { classes, store } = this.props;
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
                            handleReasonChange = {this.handleReasonChange}
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
                        <h3> <span>{_get(store, 'store.address.addressLine1', '') + ' ' + _get(store, 'store.address.city', '') + ' ' + _get(store, 'store.address.state', '') + ' ' + _get(store, 'store.address.country', '') + ' ' + _get(store, 'store.address.postalCode', '')}</span> </h3>
                        <h4> #<span>{_get(this.state, 'selectedOrder.sale.id', '')}</span> </h4>
                        <h4> <span>{moment().format('LLLL')}</span> </h4>
                        <h4> <span>CASHIER:</span> <span>{_get(this.state, 'selectedOrder.sale.operatorId', '')}</span> </h4>
                        <h4> <span>CUSTOMER:</span> <span>{_get(this.state, 'selectedOrder.customer.customer.firstName', '') + ' ' + _get(this.state, 'selectedOrder.customer.customer.lastName', '')}</span> </h4>
                        <div className="card">
                            <div className="mui-row" style={{ paddingLeft: '5%', paddingRight: '6%' }}>
                                <table className="mui-table mui-table--bordered">
                                    <thead>
                                        <tr>
                                            <th style={{ paddingRight: '50px' }}>ITEM</th>
                                            <th style={{ paddingRight: '50px' }}>QTY Price</th>
                                            <th style={{ paddingRight: '50px' }}>REGULAR PRICE</th>
                                            <th style={{ paddingRight: '50px' }}>PRICE</th>
                                            <th style={{ paddingRight: '50px' }}>SUBTOTAL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.showRecieptOrderList()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="mui-row">
                            <div className="mui-col-md-6" style={{ display: 'flex', paddingLeft: '29px' }}>
                            </div>
                            <div className="mui-col-md-6" style={{ paddingRight: '50px' }}>
                                <label >{`Tax: `}</label>
                                <label style={{ float: 'right' }}>{`$ ${_get(this.state.selectedOrder, 'sale.tax', '0')}`}</label>
                                <br />
                                <label >{`Grand Total: `}</label>
                                <label style={{ float: 'right' }}>{`${_get(this.state.selectedOrder, 'sale.totalAmount.currencyCode', '$')} ${_get(this.state.selectedOrder, 'sale.totalAmount.amount', '0')}`}</label>
                                <br />
                                <label >{`Total Paid: `}</label>
                                <div style={{ float: 'right' }}>
                                    {this.showPaymentMethods(this.state.selectedOrder)}
                                </div>
                                {/* <label style={{ float: 'right' }}>{`$ ${_get(selectedOrder, 'sale.paymentAmount', '100.00')}`}</label> */}
                                <br />
                                <br />
                                <label >{`Change: `}</label>
                                <label style={{ float: 'right' }}>{`$ ${_get(this.state.selectedOrder, 'sale.change', '0')}`}</label>
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