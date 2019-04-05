import React from 'react';
import PropTypes from 'prop-types';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
/* Redux Imports */
/* Component Imports */
import Transaction from './Transaction';
/* Pouchdb Imports */
import PouchDb from 'pouchdb';
import SyncBeforeSession from '../SessionComponents/SyncBeforeSessionEnd';

let transactiondb = new PouchDb('transactiondb');
const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    card: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});
class Transactions extends React.Component {

    constructor() {
        super();
        this.state = {
            transactionDocs: []
        }
    }
    componentDidMount() {
        this.setState({ isLoading: true })
        transactiondb.allDocs({
            include_docs: true,
        }).then((data) => {
            this.setState({
                transactionDocs: _get(data, 'rows', []),
                isLoading: false
            })
        })
    }

    mapTransaction = () => {
        const { classes } = this.props;
        return this.state.transactionDocs.map((transactionDoc) => {
            let transaction = _get(transactionDoc, 'doc.transactionDoc');
            return (<Grid item xs={12}>
                <div className='offline-transaction'>
                    <ExpansionPanel>
                        <ExpansionPanelSummary>
                            <div className='payment-summary fwidth flex-column'>
                                <div className='card flex-column flex-wrap'>
                                    <div className='summary-area flex-row flex-wrap fwidth'>
                                        <div className='each-detail flex-column align-center'>
                                            <span className='summary-title'>Total Items</span>
                                            <span className='summary-money'>{_get(transaction, 'saleItems.length')}</span>
                                        </div>
                                        <div className='each-detail flex-column align-center'>
                                            <span className='summary-title'>transaction Total</span>
                                            <span className='summary-money'>${_get(transaction, 'totalAmount.amount')}</span>
                                        </div>
                                        <div className='each-detail flex-column align-center'>
                                            <span className='summary-title'>Total Amount Paid</span>
                                            <span className='summary-money'>{_get(transaction, 'totalAmountPaid.currencyCode')}{_get(transaction, 'totalAmountPaid.amount')}</span>
                                        </div>
                                        <div className='each-detail flex-column align-center'>
                                            <span className='summary-title'>Change Due</span>
                                            <span className='summary-money'>{_get(transaction, 'changeDue.currencyCode')}{_get(transaction, 'changeDue.amount')}</span>
                                        </div>
                                        <div className='each-detail flex-column align-center'>
                                            <span className='summary-title'>Customer Name</span>
                                            <span className='summary-money'>{_get(transaction, 'customerName')}</span>
                                        </div>
                                        <div className='each-detail flex-column align-center'>
                                            <span className='summary-title'>Staff</span>
                                            <span className='summary-money'>{_get(transaction, 'staffName')}</span>
                                        </div>
                                        <div className='each-detail flex-column align-center'>
                                            <span className='summary-title'>Terminal</span>
                                            <span className='summary-money'>{_get(transaction, 'terminalName')}</span>
                                        </div>
                                        <div className='each-detail flex-column align-center'>
                                            <span className='summary-title'>Sync</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ExpansionPanelSummary>
                        {/* <ExpansionPanelDetails>
                            <Typography>
                                We are synching in background...
                            </Typography>
                        </ExpansionPanelDetails> */}
                    </ExpansionPanel>
                </div>
            </Grid>)
        })
    }
    render() {
        if (this.state.isLoading) {
            return (<CircularProgress size={24} />)
        }
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Grid container spacing={24}>
                    {this.mapTransaction()}
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(Transactions);
