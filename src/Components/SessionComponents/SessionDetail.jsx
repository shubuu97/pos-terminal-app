import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import SessionDialog from './SessionDialog';
import { connect } from 'react-redux';
import _get from 'lodash/get';
import genericPostData from '../../Global/dataFetch/genericPostData';
import moment from 'moment';
import CircularProgress  from '@material-ui/core/CircularProgress';
import PlusTransactionModal from './PlusTransactionModal';

class SessionDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            closeSessionDialog: false,
            realClosingBalance: 0,
            stateDetails: {}
        }
    }

    handlecloseSessionDialog = () => {
        debugger;
        this.setState({ closeSessionDialog: true })
    }
    handleClose = () => {
        this.setState({ closeSessionDialog: false })
    }
    setClosingBalnce = (denominatinDetails, stateDetails, realClosingBalance) => {
        this.setState({ denominatinDetails, stateDetails, realClosingBalance })
    }

    componentWillReceiveProps(nextProps) {
        if (_get(this.props, 'selectedSession.id') !== _get(nextProps, 'selectedSession.id')) {
            debugger;
            this.setState({isLoading:true})
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
                errorCb: this.handleErrorFetchSessionData
            })
        }
    }
    componentDidMount(){
        if (_get(this.props, 'selectedSession.id')){
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
                errorCb: this.handleErrorFetchSessionData
            })
        }
    }
    handleSuccessFetchSessionData = (data) => {
        debugger;
        this.setState({isLoading:false})
        this.setState({
            manager: _get(data, 'manager'),
            session: _get(data, 'session'),
            transactions: _get(data, 'transactions')

        })
    }
    handleErrorFetchSessionData = (err) => {
        this.setState({isLoading:false})

    }
    showPlusTransactionDialog = ()=>{
        this.setState({showPlusTransactionDialog:true})
    }
    closePlusTransactionDialog = ()=>{
        this.setState({showPlusTransactionDialog:false})
    }

    render() {
        let manager = _get(this.state, 'manager');
        let session = _get(this.state, 'session');
        let transactions = _get(this.state, 'transactions',[]);
        let person = _get(manager, 'person');
        let staffName = `${_get(person, 'firstName', '')} ${_get(person, 'lastName', '')}`;
        let openingTime = moment(_get(session, 'openingTimeStamp.seconds') * 1000).format('dddd DD MMM,YYYY hh:mm A')
        let terminal = _get(session, 'terminalId');
        
        let closingTime = _get(session, 'closingTimeStamp.seconds') * 1000;
        if(closingTime){
            closingTime = moment(closingTime).format('dddd DD MMM,YYYY hh:mm A');
        }
        let openingBalance = _get(session,'openingBalance.amount','');

        if(this.state.isLoading){
            return <CircularProgress size={300}/>
        }
        return (
            <div className="mui-container tertiary-color">
                <div className='mui-row'>
                    <div className='mui-col-md-12 date-header'>
                        <span className="secondary-color">Wednesday 3 Oct, 2017</span>
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
                        <div className='mui-col-md-3'>$128868.8</div>
                        <div className="mui-col-md-6 difference">
                            <div className='mui-col-md-6 secondary-color'>Difference</div>
                            <div className='mui-col-md-6'>$74646363636</div>
                        </div>
                    </div>
                    <div className='mui-row trans-row-2'>
                        <div className='mui-col-md-3 primary-color'>- Transactions</div>
                        <div className='mui-col-md-3'>$8675746</div>
                        <div className='mui-col-md-6'>
                            <div class="mui-col-md-6 text-right">
                                <Button variant='contained' color='primary'>Put Money In</Button>
                            </div>
                            <div class="mui-col-md-6 text-left">
                                <Button variant='contained' color='primary'>Take Money Out</Button>
                            </div>
                        </div>
                    </div>
                    <div className='mui-row closing-bal'>
                        <div className='mui-col-md-3 secondary-color'>Theoratical Closing Balance</div>
                        <div className='mui-col-md-3'>$968857575</div>
                        <div className='mui-col-md-6 text-center'>
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={this.handlecloseSessionDialog}
                            >Set Closing Balance</Button></div>
                    </div>
                </div>
                <div>
                    <div className='mui-row cash-payment-row'>
                        <div className='mui-col-md-1'>Icon</div>
                        <div className='mui-col-md-3'>Cash Payment</div>
                        <div className='mui-col-md-2'></div>
                        <div className='mui-col-md-6 text-right'>Sale: $857475784</div>
                    </div>
                </div>
                <div>
                    <div className='mui-row'>
                        <div className="mui-col-md-12 text-center">
                            <Button variant='contained' color='primary' style={{ marginRight: "1%" }}>Open Cash Drawer</Button>
                            <Button variant='contained' color='primary'>Go To Checkout</Button>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='mui-row print-row'>
                        <div className="mui-col-md-12">
                            <div className="mui-col-md-6 text-right">
                                <Button variant='contained' color='primary' style={{ marginRight: "1%" }} className="printBtn">Print</Button>
                            </div>

                            <div className="mui-col-md-6 text-left">
                                <Button variant='contained' color='primary' style={{ marginRight: "1%" }} className="printBtn">End of Session</Button>
                            </div>

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
                <PlusTransactionModal
                  open={this.state.showPlusTransactionDialog}
                  handleClose={this.closePlusTransactionDialog}
                  transactions={transactions}
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