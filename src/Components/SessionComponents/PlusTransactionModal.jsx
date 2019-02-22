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
import Divider from '@material-ui/core/Divider';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
/* Redux Imports */
import connect from 'react-redux/lib/connect/connect';
import clearCart from '../../Global/PosFunctions/clearCart';
import moment from "moment";
/* Component Imports */

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class PlusTransactionModal extends React.Component {
    constructor() {
        super();
        this.state = {
        }
    }

    mapTransactions = () => {
        debugger;
        let total = 0;
        let mappedTransactions = this.props.transactions.map((transaction) => {
           
            let adjustmentTime = moment(_get(transaction, 'adjustmentTimeStamp.seconds') * 1000).format('dddd DD MMM,YYYY hh:mm A')
            if (transaction.adjustmentType == 'SALE' || transaction.adjustmentType == 'CASHIN') {
                total = total+ _get(transaction, 'amount.amount')
                return (
                    <div className="flex flex-row justify-space-between mt-20">
                        <div className="flex flex-column justify-center">
                            <div className="bold pt-10 pl-10 pr-10 pb-10"> ${_get(transaction, 'amount.amount')}</div>
                        </div>
                        <div className="flex flex-column pt-10 pl-10 pr-10 pb-10">
                            <div className="bold">{localStorage.getItem('terminalName')}</div>
                            <div>{adjustmentTime}</div>
                            <div>{transaction.reason}</div>
                        </div>
                        <div className="flex flex-column pt-10 pl-10 pr-10 pb-10">
                            <div>Balance</div>
                            <div className="bold">${total}</div>
                        </div>
                    </div>
                )
            }
        })
        return mappedTransactions;
    }

    render() {
        const { store } = this.props;
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
                        {"Transctions Summary"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {this.mapTransactions()}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant='outlined' onClick={this.props.handleClose} color="primary">
                            Close
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
                        <h4> #<span>{_get(this.props, 'receiptData.id', '')}</span> </h4>
                        <h4> <span>{moment().format('LLLL')}</span> </h4>
                        <h4> <span>CASHIER:</span> <span>{_get(this.props, 'receiptData.operatorId', '')}</span> </h4>
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
                                        {/* {this.showRecieptOrderList()} */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="mui-row">
                            <div className="mui-col-md-6" style={{ display: 'flex', paddingLeft: '29px' }}>
                            </div>
                            <div className="mui-col-md-6" style={{ paddingRight: '50px' }}>
                                <label >{`Tax: `}</label>
                                <label style={{ float: 'right' }}>{`$ ${_get(this.props.receiptData, 'totalTaxAmount', '0')}`}</label>
                                <br />
                                <label >{`Grand Total: `}</label>
                                <label style={{ float: 'right' }}>{`${_get(this.props.receiptData, 'totalAmount.currencyCode', '$')} ${_get(this.props.receiptData, 'totalAmount.amount', '0')}`}</label>
                                <br />
                                <label >{`Total Paid: `}</label>
                                <div style={{ float: 'right' }}>
                                    <label style={{ float: 'right' }}>{`${_get(this.props.receiptData, 'totalAmountPaid.currencyCode', '$')} ${_get(this.props.receiptData, 'totalAmountPaid.amount', '0')}`}</label>
                                    {/* {this.showPaymentMethods(this.state.selectedOrder)} */}
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

export default connect(mapStateToProps)(PlusTransactionModal);