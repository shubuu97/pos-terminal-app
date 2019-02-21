import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
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
/* Component Imports */

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class PaymentReceipt extends React.Component {
    constructor() {
        super();
        this.state = {
            manager: '',
            managerAuthList: []
        }
    }
    componentDidMount() {
    }
    handleNewOrder = () => {
        clearCart(this.props.dispatch);
        this.props.handleClose();
    }
    render() {

        return (
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
                        <table  class="mui-table">
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
                    <Button variant='outlined' color="primary">
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
        );
    }
}

const mapStateToProps = state => {
    return {}
}

export default connect(mapStateToProps)(PaymentReceipt);