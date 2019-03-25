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
import HandlePrint from '../../Global/PosFunctions/handlePrint';
import logo from '../../assets/images/aobLogodark.png';
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
        this.handlePrint()
        this.handleNewOrder()
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

    showOnlineTransactionData = () => {
        return (
            <React.Fragment>
                <span>
                    <span>Order has been created succesfully.</span>
                    <span style={{display: 'block'}}>Order Id:&nbsp;&nbsp;
                        <span className="bold">{_get(this.props, 'receiptData.id')}</span>
                    </span>
                </span>
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
                        <td> <span>${_get(this.props, 'receiptData.changeDue.amount', 0)}</span></td>
                    </tr>
                </table>
            </React.Fragment>)
    }

    showOfflineTransactionData = ()=>{
        return (
            <React.Fragment>
                <span>
                    <span>We have created an offline transaction order and will try to sync  in background</span>
                </span>
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
                        <td> <span>${_get(this.props, 'receiptData.changeDue.amount', 0)}</span></td>
                    </tr>
                </table>
            </React.Fragment>)
    }
    render() {
        console.log(this.props.receiptData.saleComment, 'this.props.receiptData.saleComment')
        const { store, cart } = this.props;
        let address  = _get(store,'store.address', '')
        let customer = _get(cart, 'customer.customer')

        let storeAddress = _get(address, 'addressLine1', '') + ', ' + 
        _get(address, 'addressLine2', '') + ', ' + _get(address, 'city', '') + ', ' +
        _get(address, 'state', '') + ', ' + _get(address, 'country', '') + ', ' +
        _get(address, 'postalCode', '')

        let customerName = _get(customer, 'firstName', '') + ' ' + 
        _get(customer, 'lastName', '')

        return (
            <React.Fragment>
                {/* // ! Commenting this out since we redirect as soon as we print */}
                {/* <Dialog
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
                            {this.props.transactionStatus == 'online' ? this.showOnlineTransactionData() : this.showOfflineTransactionData()}
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
                </Dialog> */}
                <iframe id="ifmcontentstoprint" style={{
                    height: '0px',
                    width: '0px',
                    position: 'absolute'
                }}></iframe>
                <div id='printarea'>
                    <div>
                        <HandlePrint 
                            type="Sale Transaction"
                            orderId={_get(this.props, 'receiptData.id')}
                            currency='$'
                            logo={_get(this, 'props.logo', '')}
                            itemList={_get(cart,'cartItems', [])}
                            cashierName={localStorage.getItem('userName')}
                            staffId={localStorage.getItem('userId')}
                            orderDate={moment().format('LLLL')}
                            storeName={_get(store,'store.name', '')}
                            storeAddress={storeAddress}
                            customerName={customerName}
                            terminalName={localStorage.getItem('terminalName')}
                            saleComment={_get(this.props,'receiptData.saleComment','')}
                            itemsDiscount={_get(cart,'itemDiscountAmount.amount', '')}
                            cartDiscount={_get(cart,'cartDiscountAmount.amount', '')}
                            employeeDiscount={_get(cart,'employeeDiscountAmount.amount', '')}
                            // regularTotal={_get(cart, 'regularTotal', '')}
                            // totalDiscount={_get(cart,'totalDiscount.amount', '')}
                            // netTotal={_get(cart,'netTotal','')}
                            totalAmountPaid={_get(this.props, 'receiptData.totalAmountPaid.amount',0)}
                            changeDue={_get(this.props, 'receiptData.changeDue.amount', 0)}
                            totalTax={_get(cart,'totalTaxAmount.amount',0)}
                            totalAmount={_get(cart,'totalAmount.amount',0)}
                            paymentMethods={_get(this.props,'receiptData.payments',[])}
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    let { storeData, cart } = state;
    let store = storeData.lookUpData || {};

    return {
        store,
        cart
    }
}

export default connect(mapStateToProps)(PaymentReceipt);