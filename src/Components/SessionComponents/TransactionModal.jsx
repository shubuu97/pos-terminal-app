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
import moment from "moment";
/* Component Imports */

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class TransactionModal extends React.Component {
    constructor() {
        super();
        this.state = {
        }
    }

    mapPositiveTransactions = () => {
        let total = 0;
        let mappedTransactions = this.props.transactions.map((transaction) => {

            let adjustmentTime = moment(_get(transaction, 'adjustmentTimeStamp.seconds') * 1000).format('dddd DD MMM,YYYY hh:mm A')
            if (transaction.adjustmentType == 'SALE' || transaction.adjustmentType == 'CASHIN') {
                total = total + _get(transaction, 'amount.amount')
                return (
                    <div className="flex flex-row justify-space-between mt-20">
                        <div className="flex flex-column justify-center">
                            <div className="bold pt-10 pl-10 pr-10 pb-10"> ${_get(transaction, 'amount.amount',0).toFixed(2)}</div>
                        </div>
                        <div className="flex flex-column pt-10 pl-10 pr-10 pb-10">
                            <div className="bold">{localStorage.getItem('terminalName')}</div>
                            <div>{adjustmentTime}</div>
                            <div style={{maxWidth:'220px'}}>{transaction.reason}</div>
                        </div>
                        <div className="flex flex-column pt-10 pl-10 pr-10 pb-10">
                            <div>Balance</div>
                            <div className="bold">${total.toFixed(2)}</div>
                        </div>
                    </div>
                )
            }
        })
        return mappedTransactions;
    }

    mapNegativeTransactions = () => {
        let total = 0;
        let mappedTransactions = this.props.transactions.map((transaction) => {

            let adjustmentTime = moment(_get(transaction, 'adjustmentTimeStamp.seconds') * 1000).format('dddd DD MMM,YYYY hh:mm A')
            if (transaction.adjustmentType == 'CASHOUT') {
                total = total + _get(transaction, 'amount.amount')
                return (
                    <div className="flex flex-row justify-space-between mt-20">
                        <div className="flex flex-column justify-center">
                            <div className="bold pt-10 pl-10 pr-10 pb-10"> ${_get(transaction, 'amount.amount')}</div>
                        </div>
                        <div className="flex flex-column pt-10 pl-10 pr-10 pb-10">
                            <div className="bold">{localStorage.getItem('terminalName')}</div>
                            <div>{adjustmentTime}</div>
                            <div style={{maxWidth:'220px'}}>{transaction.reason}</div>
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
                            {this.props.type=='positive'?this.mapPositiveTransactions():this.mapNegativeTransactions()}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant='outlined' onClick={this.props.handleClose} color="primary">
                            Close
                    </Button>
                    </DialogActions>
                </Dialog>

            </React.Fragment>
        );
    }
}



export default TransactionModal;