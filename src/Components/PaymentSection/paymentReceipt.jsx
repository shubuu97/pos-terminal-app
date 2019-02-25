import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
/* Material import */
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
/* Redux Imports */
import connect from 'react-redux/lib/connect/connect';
import clearCart from '../../Global/PosFunctions/clearCart';
import moment from "moment";
import { commonActionCreater } from '../../Redux/commonAction';
import addGuestToCart from '../../Global/PosFunctions/addGuestToCart';
/* Component Imports */

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class PaymentReceipt extends React.Component {
    constructor() {
        super();
        this.state = {
            manager: '',
            managerAuthList: [],
            selectedOrder: ''
        }
    }
    componentDidMount() {
    }
    handleNewOrder = () => {
        clearCart(this.props.dispatch);
        addGuestToCart(this.props.dispatch);

        this.props.handleClose();
        this.props.dispatch(commonActionCreater(1, 'SWITCH_TAB_NUMBER'));
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
    showRecieptOrderList = () => {
        let listItems = !_isEmpty(_get(this.props, 'receiptData.saleItems', [])) ? this.props.receiptData.saleItems.map((item) => (
            <tr>
                <td>{_get(item, 'productId', '')}</td>
                <td>{_get(item, 'qty', 0)}</td>
                <td>{_get(item, 'price', 0)}</td>
                <td>{_get(item, 'itemSubTotal.amount', 0)}</td>
            </tr>
        )) : (
                <tr>
                    <td>Cell 1-1</td>
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
    render() {
        const { store } = this.props;
        console.log('receiptdataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', this.props.receiptData)
        return (
            <React.Fragment>
                <Dialog
                    open={this.props.open}
                    TransitionComponent={Transition}
                    keepMounted
                    fullWidth
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">
                        {"Payment Summary"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Order has been created succesfully <span className="bold">{_get(this.props, 'receiptData.id')}</span>
                            <table class="mui-table">
                                <tr>
                                    <td> <span>Total Amount</span></td>
                                    <td>  <span>${_get(this.props, 'receiptData.totalAmount.amount')}</span></td>
                                </tr>
                                <tr>
                                    <td> <span>Total Amount Paid</span></td>
                                    <td> <span>${_get(this.props, 'receiptData.totalAmountPaid.amount')}</span></td>
                                </tr>
                                <tr>
                                    <td> <span>Change Due</span></td>
                                    <td> <span>${_get(this.props, 'receiptData.changeDue.amount')}</span></td>
                                </tr>
                            </table>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant='outlined' onClick={this.handlePrint} color="primary">
                            Print
                    </Button>
                        <Button
                            onClick={this.handleNewOrder}
                            variant='contained'
                            color="primary">
                            New Order
                    </Button>
                    </DialogActions>
                </Dialog>
                <iframe id="ifmcontentstoprint" style={{
                    height: '0px',
                    width: '0px',
                    position: 'absolute'
                }}></iframe>
                <div id='printarea'>
                    <div>

                        <h3> <span>{_get(store, 'store.address.addressLine1', '') + ' ' + _get(store, 'store.address.city', '') + ' ' + _get(store, 'store.address.state', '') + ' ' + _get(store, 'store.address.country', '') + ' ' + _get(store, 'store.address.postalCode', '')}</span> </h3>
                        <h4> <span>CASHIER:</span> <span>{_get(this.props, 'receiptData.operatorId', '')}</span> </h4>
                        <h4> <span>CUSTOMER:</span> <span>{_get(this.props, 'receiptData.customerId', '') + ' ' + _get(this.state, 'selectedOrder.customer.customer.lastName', '')}</span> </h4>
                        <h3> <span>STORE:</span> <span>{_get(this.props, 'receiptData.storeId', '')}</span> </h3>
                        <h3> <span>TERMINAL:</span> <span>{_get(this.props, 'receiptData.terminalId', '')}</span> </h3>
                        {/* <h4> <span>CASHIER:</span> <span>{_get(this.state, 'selectedOrder.sale.operatorId', '')}</span> </h4> */}
                        {/* <h4> #<span>{_get(this.state, 'selectedOrder.sale.id', '')}</span> </h4> */}
                        <h4> <span>{moment().format('LLLL')}</span> </h4>

                        <div className="card">
                            <div className="mui-row" style={{ paddingLeft: '5%', paddingRight: '6%' }}>
                                <table className="mui-table mui-table--bordered">
                                    <thead>
                                        <tr>
                                            <th style={{ paddingRight: '50px' }}>ITEM</th>
                                            <th style={{ paddingRight: '50px' }}>QTY Price</th>
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

                                <div className="mui-row">
                                    <div className="mui-col-md-6" style={{ paddingRight: '50px' }}>
                                        <label >{`Sale Comment: `}</label>
                                        <label style={{ float: 'right' }}>{`${_get(this.props, 'receiptData.saleComment', '')}`}</label>
                                        <br />
                                        {/* <label >{`Subtotal: `}</label>
                                        <label style={{ float: 'right' }}>{`$ ${_get(this.props, 'receiptData.saleItems.itemSubTotal', '0')}`}</label>
                                        <br /> */}
                                        {_get(this.props, 'receiptData.itemTotalDiscountAmount', '0') != '0' ?
                                            <div>
                                                <label >{`Item Discount: `}</label>
                                                <label style={{ float: 'right' }}>{`$ ${_get(this.props, 'receiptData.itemDiscountAmount', '0')}`}</label>
                                                <br />
                                            </div> : ''
                                        }
                                        {_get(this.props, 'receiptData.cartDiscountAmount', '0') != '0' ?
                                            <div>
                                                <label >{`Cart Discounts: `}</label>
                                                <label style={{ float: 'right' }}>{`$ ${_get(this.props, 'receiptData.cartDiscountAmount.amount', '0')}`}</label>
                                                <br />
                                            </div> : ''
                                        }
                                        {_get(this.props, 'receiptData.employeeDiscountAmount', '0') != '0' ?
                                            <div>
                                                <label >{`Employee Discount: `}</label>
                                                <label style={{ float: 'right' }}>{`$ ${_get(this.props, 'receiptData.employeeDiscountAmount.amount', '0')}`}</label>
                                                <br />
                                            </div> : ''
                                        }
                                        <label >{`Tax: `}</label>
                                        <label style={{ float: 'right' }}>{`$ ${_get(this.props.receiptData, 'totalTaxAmount.amount', '0')}`}</label>
                                        <br />
                                        <label >{`Total Paid: `}</label>
                                        <div style={{ float: 'right' }}>
                                            <label style={{ float: 'right' }}>{`${_get(this.props.receiptData, 'totalAmountPaid.currencyCode', '$')} ${_get(this.props.receiptData, 'totalAmountPaid.amount', '0')}`}</label>
                                            {/* {this.showPaymentMethods(this.state.selectedOrder)} */}
                                        </div>
                                        {/* <label style={{ float: 'right' }}>{`$ ${_get(selectedOrder, 'sale.paymentAmount', '100.00')}`}</label> */}
                                        <br />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    let { storeData } = state;
    let store = storeData.lookUpData || {};

    return {
        store
    }
}

export default connect(mapStateToProps)(PaymentReceipt);