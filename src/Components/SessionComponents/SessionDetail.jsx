import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import SessionDialog from './SessionDialog';
import { connect } from 'react-redux';
import _get from 'lodash/get';
import genericPostData from '../../Global/dataFetch/genericPostData';
import moment from 'moment';
import CircularProgress from '@material-ui/core/CircularProgress';
import TransactionModal from './TransactionModal';
import closeSession from '../../Global/PosFunctions/closeSession';
import PutMoneyInOutDialog from './PutMoneyInOut';
import ReasonDialog from './ReasonDialog';
import withDialog from '../DialogHoc';
import ZReport from './ZReport';
import DialogHoc from '../../Global/Components/HOC/CommonDialogHoc';
let ZReportDialog = DialogHoc(ZReport);

class SessionDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            closeSessionDialog: false,
            realClosingBalance: 0,
            stateDetails: {},
            transactions: [],
            closeReason: ''
        }
    }

    handlecloseSessionDialog = () => {
        this.setState({ closeSessionDialog: true })
    }
    handleClose = () => {
        this.setState({ closeSessionDialog: false })
    }
    setClosingBalnce = (denominationDetails, stateDetails, realClosingBalance) => {
        this.setState({ denominationDetails, stateDetails, realClosingBalance })
    }

    componentWillReceiveProps(nextProps) {
        if (_get(this.props, 'selectedSession.id') !== _get(nextProps, 'selectedSession.id')) {
            this.setState({ isLoading: true })
            genericPostData({
                dispatch: this.props.dispatch,
                reqObj: { id: _get(nextProps, 'selectedSession.id') },
                url: 'Session/AllData',
                constants: {
                    init: 'GET_SESSION_DATA_BY_ID_INIT',
                    success: 'GET_SESSION_DATA_BY_ID_SUCCESS',
                    error: 'GET_SESSION_DATA_BY_ID_ERROR'
                },
                identifier: 'GET_SESSION_DATA_BY_ID',
                successCb: this.handleSuccessFetchSessionData,
                errorCb: this.handleErrorFetchSessionData,
                dontShowMessage: true
            })
        }
    }
    componentDidMount() {
        if (_get(this.props, 'selectedSession.id')) {
            genericPostData({
                dispatch: this.props.dispatch,
                reqObj: { id: _get(this.props, 'selectedSession.id') },
                url: 'Session/AllData',
                constants: {
                    init: 'GET_SESSION_DATA_BY_ID_INIT',
                    success: 'GET_SESSION_DATA_BY_ID_SUCCESS',
                    error: 'GET_SESSION_DATA_BY_ID_ERROR'
                },
                identifier: 'GET_SESSION_DATA_BY_ID',
                successCb: this.handleSuccessFetchSessionData,
                errorCb: this.handleErrorFetchSessionData,
                dontShowMessage: true
            })
        }
    }
    handleSuccessFetchSessionData = (data) => {
        this.setState({ isLoading: false })
        this.setState({
            manager: _get(data, 'manager'),
            session: _get(data, 'session'),
            transactions: _get(data, 'transactions')

        })
    }
    handleErrorFetchSessionData = (err) => {
        this.setState({ isLoading: false })

    }
    showPlusTransactionDialog = () => {
        this.setState({ showTransactionDialog: true, type: 'positive' })
    }
    showNegativeTransactionDialog = () => {
        this.setState({ showTransactionDialog: true, type: 'negative' })
    }
    closePlusTransactionDialog = () => {
        this.setState({ showTransactionDialog: false })
    }
    handleEndSession = () => {
        if (this.state.realClosingBalance) {
            if (this.calDiffrence() != 0 && this.state.closeReason == '') {
                this.setState({ showReasonModal: true });
                return;
            }
            this.setState({ isLoading: true })
            closeSession({
                dispatch: this.props.dispatch,
                handleSuccess: this.handleSessionCloseSuccess,
                handleError: this.handleSessionCloseError,
                reason: this.state.closeReason,
                amount: this.state.realClosingBalance,
                denominationDetails: this.state.denominationDetails,
                id: _get(this.state, 'session.id')
            })
        }
        else {
            this.setState({ closeSessionDialog: true })
        }
    }
    handleSessionCloseSuccess = (data) => {
        this.setState({ isLoading: false });
        localStorage.setItem('sessionId', 'nil');
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: { id: localStorage.getItem('terminalId') },
            url: 'Session/ByTerminal',
            constants: {
                init: 'GET_SESSION_DATA_INIT',
                success: 'GET_SESSION_DATA_SUCCESS',
                error: 'GET_SESSION_DATA_ERROR'
            },
            identifier: 'GET_SESSION_DATA',
            successCb: this.handleGetSessionData,
            errorCb: this.handleGetSessionDataError,
            dontShowMessage: true
        });
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: { id: _get(this.props, 'selectedSession.id') },
            url: 'Session/AllData',
            constants: {
                init: 'GET_SESSION_DATA_BY_ID_INIT',
                success: 'GET_SESSION_DATA_BY_ID_SUCCESS',
                error: 'GET_SESSION_DATA_BY_ID_ERROR'
            },
            identifier: 'GET_SESSION_DATA_BY_ID',
            successCb: this.handleSuccessFetchSessionData,
            errorCb: this.handleErrorFetchSessionData,
            dontShowMessage: true
        })


    }
    handleSessionCloseError = () => {
        this.setState({ isLoading: false });
    }
    showPutMoneyInOutDialog = () => {
        this.setState({
            openPutMoneyInOutDialog: true,
            txType: 'in'
        })
    }
    showPutMoneyOutDialog = () => {
        this.setState({
            openPutMoneyInOutDialog: true,
            txType: 'out'
        })
    }
    closePutMoneyInOutDialog = () => {
        this.setState({ openPutMoneyInOutDialog: false })
    }
    handlePutMoenyIn = (reason, amount) => {
        let reqObj = {};
        let url
        reqObj.SessionId = _get(this.state, 'session.id');
        reqObj.amount = { currencyCode: "$", amount: parseFloat(amount) };
        reqObj.reason = reason;
        if (this.state.txType == 'in') {
            reqObj.adjustmentType = 'CASHIN';
            url = 'Session/PutMoneyIn';
        }
        else {
            reqObj.adjustmentType = 'CASHOUT';
            url = 'Session/TakeMoneyOut'
        }
        this.closePutMoneyInOutDialog();
        this.setState({ isLoading: true })
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj,
            url,
            constants: {
                init: 'PUT_MONEY_IN_INIT',
                success: 'PUT_MONEY_IN_SUCCESS',
                error: 'PUT_MONEY_IN_ERROR'
            },
            identifier: 'PUT_MONEY_IN',
            successCb: this.handlePutMoneySuccess,
            errorCb: this.handlePutMoneyError,
            dontShowMessage: true
        })

    }
    handlePutMoneySuccess = () => {
        this.setState({ isLoading: false });
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: { id: localStorage.getItem('terminalId') },
            url: 'Session/ByTerminal',
            constants: {
                init: 'GET_SESSION_DATA_INIT',
                success: 'GET_SESSION_DATA_SUCCESS',
                error: 'GET_SESSION_DATA_ERROR'
            },
            identifier: 'GET_SESSION_DATA',
            successCb: this.handleGetSessionData,
            errorCb: this.handleGetSessionDataError,
            dontShowMessage: true
        });
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: { id: _get(this.props, 'selectedSession.id') },
            url: 'Session/AllData',
            constants: {
                init: 'GET_SESSION_DATA_BY_ID_INIT',
                success: 'GET_SESSION_DATA_BY_ID_SUCCESS',
                error: 'GET_SESSION_DATA_BY_ID_ERROR'
            },
            identifier: 'GET_SESSION_DATA_BY_ID',
            successCb: this.handleSuccessFetchSessionData,
            errorCb: this.handleErrorFetchSessionData,
            dontShowMessage: true
        })


    }
    handlePutMoneyError = () => {
        this.setState({ isLoading: false });

    }
    calcPlusTxnVal = () => {
        let total = 0;

        this.state.transactions.map((transaction) => {
            if (transaction.adjustmentType == 'SALE' || transaction.adjustmentType == 'CASHIN') {
                total = total + _get(transaction, 'amount.amount')
            }
        })
        return total;

    }
    calcNegTxnVal = () => {
        let total = 0;

        this.state.transactions.map((transaction) => {
            if (transaction.adjustmentType == 'CASHOUT') {
                total = total + _get(transaction, 'amount.amount')
            }
        })
        return total;

    }
    calDiffrence = () => {
        let difference = _get(this.state, 'session.currentBalance.amount', 0) - this.state.realClosingBalance
        return difference;
    }
    specifyReason = (closeReason) => {
        this.setState({ closeReason, showReasonModal: false });
        this.handleEndSession()
    }
    handlePrintZReport = () => {
        this.setState({ showZReportDialog: true });
    }
    printZReportRecipet = ()=>{
        this.setState({ showZReportDialog: false,firePrint:true });
    }


    render() {
        let manager = _get(this.state, 'manager');
        let session = _get(this.state, 'session');
        let status = _get(session, 'status');
        let transactions = _get(this.state, 'transactions', []);
        let person = _get(manager, 'person');
        let staffName = `${_get(person, 'firstName', '')} ${_get(person, 'lastName', '')}`;
        let openingTime = moment(_get(session, 'openingTimeStamp.seconds') * 1000).format('dddd DD MMM,YYYY hh:mm A')
        let terminal = _get(session, 'terminalId');

        let closingTime = _get(session, 'closingTimeStamp.seconds') * 1000;
        if (closingTime) {
            closingTime = moment(closingTime).format('dddd DD MMM,YYYY hh:mm A');
        }
        let openingBalance = _get(session, 'openingBalance.amount', '');

        if (this.state.isLoading) {
            return <CircularProgress size={300} />
        }
        return (
            <div className="mui-container tertiary-color">
                <div className='mui-row'>
                    <div className='mui-col-md-12 date-header'>
                        <span className="secondary-color">{moment(_get(session, 'openingTimeStamp.seconds') * 1000).format('dddd D MMM,YYYY')}</span>
                    </div>
                </div>

                <div className="staff-row">
                    <div className='mui-row'>
                        <div className='mui-col-md-3 secondary-color'>Staff</div>
                        <div className='mui-col-md-3'>{staffName}</div>
                        <div className='mui-col-md-3 secondary-color'>Opened</div>
                        <div className='mui-col-md-3 no-pad'>{openingTime}</div>
                    </div>
                </div>
                <div>
                    <div className='mui-row pos-row'>
                        <div className='mui-col-md-3 secondary-color'>POS</div>
                        <div className='mui-col-md-3'>{terminal}</div>

                        {closingTime ?
                            <React.Fragment>
                                <div className='mui-col-md-3 secondary-color'>Closed</div>
                                <div className='mui-col-md-3 no-pad'>{closingTime}</div>
                            </React.Fragment>
                            : null}

                    </div>
                </div>
                <div>
                    <div className='mui-row opening-bal-row'>
                        <div className='mui-col-md-3 secondary-color'>Opening Balance</div>
                        <div className='mui-col-md-3'>${openingBalance}</div>
                        <div className="mui-col-md-6 real-closing-bal">
                            <div className='mui-col-md-6 secondary-color'>Real Closing Balance</div>
                            <div className='mui-col-md-6'>${this.state.realClosingBalance}</div>
                        </div>
                    </div>
                    <div className='mui-row trans-row-1'>
                        <div className='mui-col-md-3 primary-color' onClick={this.showPlusTransactionDialog}>+ Transactions</div>
                        <div className='mui-col-md-3'>{this.calcPlusTxnVal()}</div>
                        <div className="mui-col-md-6 difference">
                            <div className='mui-col-md-6 secondary-color'>Diffrence</div>
                            <div className='mui-col-md-6'>{this.calDiffrence()}</div>
                        </div>
                    </div>
                    <div className='mui-row trans-row-2'>
                        <div className='mui-col-md-3 primary-color' onClick={this.showNegativeTransactionDialog}>- Transactions</div>
                        <div className='mui-col-md-3'>{this.calcNegTxnVal()}</div>
                        <div className='mui-col-md-6'>
                            {status == 'open' ? <div class="mui-col-md-6 text-right">
                                <Button
                                    variant='flat'
                                    color='primary'
                                    onClick={this.showPutMoneyInOutDialog}
                                >Put Money In</Button>
                            </div> : null}
                            {status == 'open' ? <div class="mui-col-md-6 text-left">
                                <Button
                                    onClick={this.showPutMoneyOutDialog}
                                    variant='flat'
                                    color='primary'>Take Money Out</Button>
                            </div> : null}
                        </div>
                    </div>
                    <div className='mui-row closing-bal'>
                        <div className='mui-col-md-3 secondary-color'>Theoratical Closing Balance</div>
                        <div className='mui-col-md-3'>${_get(this.state, 'session.currentBalance.amount')}</div>
                        {status == 'open' ? <div className='mui-col-md-6 text-center'>
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={this.handlecloseSessionDialog}
                            >Set Closing Balance</Button></div> : null}
                    </div>
                </div>
                {/* <div>
                    <div className='mui-row cash-payment-row'>
                        <div className='mui-col-md-1'>Icon</div>
                        <div className='mui-col-md-3'>Cash Payment</div>
                        <div className='mui-col-md-2'></div>
                        <div className='mui-col-md-6 text-right'>Sale: $857475784</div>
                    </div>
                </div> */}
                <div className='mt-10'>
                    <div className='mui-row'>
                        <div className="mui-col-md-12 text-center">
                            <Button
                                variant='outlined'
                                color='primary' style={{ marginRight: "1%" }}>Open Cash Drawer</Button>
                            <Button
                                onClick={() => this.props.goBackToCheckOut()}
                                variant='outlined'
                                color='primary'>Go To Checkout</Button>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='mui-row print-row'>
                        <div className="mui-col-md-12">
                            <div className={status == 'open' ? "mui-col-md-6 text-left" : "mui-col-md-12 text-left"}>
                                <Button onClick={this.handlePrintZReport} variant='outlined' color='primary' style={{ marginRight: "1%" }} className="printBtn">Print</Button>
                            </div>

                            {status == 'open' ? <div className="mui-col-md-6 text-left">
                                <Button variant='contained'
                                    onClick={this.handleEndSession}
                                    color='primary' style={{ marginRight: "1%" }} className="printBtn">End of Session</Button>
                            </div> : null}

                        </div>
                    </div>
                </div>
                <SessionDialog
                    open={this.state.closeSessionDialog}
                    handleClose={this.handleClose}
                    close={true}
                    stateDetails={this.state.stateDetails}
                    setClosingBalnce={this.setClosingBalnce}

                />
                <TransactionModal
                    open={this.state.showTransactionDialog}
                    type={this.state.type}
                    handleClose={this.closePlusTransactionDialog}
                    transactions={transactions}
                />
                <PutMoneyInOutDialog
                    txType={this.state.txType}
                    open={this.state.openPutMoneyInOutDialog}
                    handleClose={this.closePutMoneyInOutDialog}
                    handlePutMoenyIn={this.handlePutMoenyIn}
                />
                <ReasonDialog
                    open={this.state.showReasonModal}
                    handleClose={() => this.setState({ showReasonModal: false })}
                    specifyReason={this.specifyReason}
                />
                <ZReportDialog
                    open={this.state.showZReportDialog}
                    actionName = 'Print'
                    title = {'Z-Report'}
                    hide={true}
                    firePrint={this.state.firePrint}
                    handleClose = {()=>this.setState({showZReportDialog:false})}
                    actionHandler={this.printZReportRecipet}
                />

            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        selectedSession: _get(state, 'selectedSession.lookUpData')
    }
}

export default connect(mapStateToProps)(SessionDetail);