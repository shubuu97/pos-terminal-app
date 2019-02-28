import React, { Component } from 'react';

import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty'

import moment from 'moment';

/* Material Imports */
import CircularProgress from '@material-ui/core/CircularProgress';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';

/* Redux Imports */
import { connect } from 'react-redux';

import { getData } from '../../Redux/getAction';
import genericPostData from '../../Global/dataFetch/genericPostData';
import BalanceSheet from './BalanceSheet/BalanceSheet';
import IncomeStatement from './IncomeStatement/IncomeStatement';
import CashFlow from './CashFlow/CashFlow';

import queryString from 'query-string';

import { APPLICATION_BFF_URL, APP_QUICKBOOK_KEY } from '../../Redux/urlConstants';

var jwtDecode = require('jwt-decode');



class GetAccountingDetails extends Component {

    constructor() {
        super();
        this.state = {
            searchItem: '',
            loading: false,
            value: 0,

            balanceSheet: {},
            incomeStatement: {},
            cashFlow: {},

            valueType: 'Numbers',
            summarizeType: 'Year',

            // Default set dates
            startDate: (parseInt(new Date().getFullYear()) - 2) + "-01-01",
            endDate: moment(new Date()).format("YYYY-MM-DD"),
        }
    }

    componentDidMount() {


        //If user already has been loggedin in and DB contains Accounting System info -
        // than show financial data without OAuth Redirection
        if (_get(this, 'props.screeningInfo.value')) {
            this.getBalanceSheet('balanceSheet');

        } else {// Else verify with OAuth Redirection than show data
            let paramm = queryString.parse(this.props.location.search);

            if (this.props.stateId === paramm.state && this.props.companyID) {
                this.setState({ loading: true });

                let rUrl = `${APPLICATION_BFF_URL}/api/quickbook/oauth2redirect?code=${paramm.code}&realmId=${paramm.realmId}&state=${paramm.state}&uid=${this.props.companyID}`;

                this.getAPICall(rUrl, 'quickBook').then(data => {
                    this.setState({ status: 'success' });
                    this.getBalanceSheet('balanceSheet');
                    this.submitSMB(paramm.realmId);

                }).catch(err => {
                    this.setState({ status: 'error', loading: false });
                })

            }
        }
    }

    // Save quick book connection info in DB
    submitSMB = (realmId) => {
        let reqObj = {
            id: this.props.companyID
        };

        reqObj.screeningInfo = [{
            // "key": APP_QUICKBOOK_KEY,
            // "value": realmId,
            // "flag": true
        }]

        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: { ...reqObj },
            url: '/api/SaveSMB',
            constants: {
                init: 'quickBookSMB_init',
                success: 'quickBookSMB_success',
                error: 'quickBookSMB_error'
            },
            identifier: 'quickBookSMB_init',
            successText: 'You have successfully connected to quickbook accounting system.',
        })
    }


    // Get Financial data from server
    getBalanceSheet = (url) => {
        let rUrl = `${APPLICATION_BFF_URL}/api/quickbook/${url}?uid=${this.props.companyID}` +
            `&start_date=${moment(new Date(this.state.startDate)).format("YYYY-MM-DD")}` +
            `&end_date=${moment(new Date(this.state.endDate)).format("YYYY-MM-DD")}` +
            `&summarize_column_by=${this.state.summarizeType}`;
            
        this.setState({ loading: true });
        this.getAPICall(rUrl, url).then(data => {
            this.setState({
                [url]: data,
            })
            this.setState({ loading: false });
        }).catch(err => {
            this.setState({ loading: false });
        })
    }


    getAPICall = (url, identifier) => {
        return this.props.dispatch(
            getData(url, identifier, {
                init: `${identifier}_init`,
                success: `${identifier}_success`,
                error: `${identifier}_error`
            })
        )
    }


    // save tab values into react state
    handleChange = (event, value) => {
        this.setState({ value });
    };

    // save calendar values into react state
    handleCalChange = (key, date) => {
        this.setState({ [key]: date });
    }

    // save value type(By number or Percentage) into react state
    handleValueType = (event, valueType) => {
        this.setState({ valueType })
    };
    decideFinancialAPICall = (value) => {
        // Decide which api to call based on active tab value
        switch (value) {
            case 0: {
                this.getBalanceSheet('balanceSheet');
                break;
            }
            case 1: {
                this.getBalanceSheet('cashFlow');
                break;
            }
            case 2: {
                this.getBalanceSheet('incomeStatement');
                break;
            }
            default: {
                console.log("------");
            }
        }
    }

    // Save summarizeType(By year or month) into react state and call api to get new data
    handleSummarizeType = (event, summarizeType) => {
        this.setState({ summarizeType }, function () {
            // Call api to get data after change in summarizeType
            this.decideFinancialAPICall(this.state.value);
        });

    };

    // On date change, call api to get new data 
    getFinancialDataOnDateChange = () => {
        this.decideFinancialAPICall(this.state.value)
    }

    render() {

        const { value } = this.state;

        return (
            <React.Fragment>
                <div className="user-table-section loan-request form-load-layover">
                    <React.Fragment>
                        <div className="mui-row align-items-center">
                            <div className="mui-col-sm-12">
                                <h1>{this.props.companyName} - Accounting Monitoring Activation</h1>
                            </div>
                            {/* <div className="col-sm-6 d-flex justify-content-end "></div> */}
                        </div>
                        <div className="cardwrapper">
                            {/* Tabs */}
                            {/* <Tabs
                                value={this.state.value}
                                onChange={this.handleChange}
                                indicatorColor="primary"
                                textColor="primary"
                                centered
                                className="mb-20"
                                style={{ borderBottom: '1px solid #ddd' }}
                            >
                                <Tab label="Balance Sheet" onClick={() => this.getBalanceSheet('balanceSheet')} />
                                <Tab label="Cash Flow" onClick={() => this.getBalanceSheet('cashFlow')} />
                                <Tab label="Income Statement" onClick={() => this.getBalanceSheet('incomeStatement')} />
                            </Tabs> */}
                            {/* Calendar */}
                            <div className="mui-row mb-50">
                                <div className="mui-col-xs-6">
                                    <div className="mb-10">
                                        <span className="onboarding-sub-title">
                                            Please select a date range
                                    </span>
                                    </div>
                                    <div className="mui-row">
                                        <div className="mui-col-xs-4">
                                            
                                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                                <DatePicker
                                                    id="startDate"
                                                    label="Start Date"

                                                    value={this.state.startDate}
                                                    //disableFuture
                                                    //openTo="year"
                                                    format="DD/MM/YYYY"
                                                    views={['year', 'month', 'day']}
                                                    onChange={(date) => this.handleCalChange('startDate', date)}
                                                    minDate={(parseInt(new Date().getFullYear()) - 2) + "-01-01"}
                                                    maxDate={moment(new Date()).format("YYYY-MM-DD")}
                                                />
                                            </MuiPickersUtilsProvider>
                                        </div>
                                        <div className="mui-col-xs-4">
                                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                                <DatePicker
                                                    id="endDate"
                                                    label="End Date"

                                                    value={this.state.endDate}
                                                    disableFuture

                                                    format="DD/MM/YYYY"
                                                    views={['year', 'month', 'day']}
                                                    onChange={(date) => this.handleCalChange('endDate', date)}
                                                    minDate={(parseInt(new Date().getFullYear()) - 2) + "-01-01"}
                                                    maxDate={moment(new Date()).format("YYYY-MM-DD")}
                                                />
                                            </MuiPickersUtilsProvider>

                                        </div>
                                        <div className="mui-col-xs-4">
                                            <Button variant="contained" color="primary"
                                                onClick={this.getFinancialDataOnDateChange}>
                                                Get Data
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="mui-col-xs-6">
                                    <div className="mui-row mb-10">
                                        {/* <div className="mui-col-xs-12">
                                            <ToggleButtonGroup
                                                id="valueType"
                                                className="float-right"
                                                value={this.state.valueType}
                                                exclusive
                                                onChange={this.handleValueType}>
                                                <ToggleButton value="Numbers">
                                                    COMMON SIZE STATEMENT
                                                </ToggleButton>
                                                <ToggleButton value="Percentage">
                                                    INTERPERIOD % CHANGES
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                        </div> */}
                                    </div>

                                    <div className="mui-row">
                                        <div className="mui-col-xs-12">
                                            {/* <ToggleButtonGroup
                                                id="summarizeType"
                                                className="float-right"
                                                value={this.state.summarizeType}
                                                exclusive
                                                onChange={this.handleSummarizeType}>
                                                <ToggleButton value="Year">
                                                    Yearly
                                                </ToggleButton>
                                                <ToggleButton value="Quarter">
                                                    Quarterly
                                                </ToggleButton>
                                                <ToggleButton value="Month">
                                                    Monthly
                                                </ToggleButton>
                                            </ToggleButtonGroup> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                (value === 0 && !_isEmpty(this.state.balanceSheet)) &&
                                <BalanceSheet
                                    data={this.state.balanceSheet}
                                    isloading={this.state.loading}
                                    valueType={this.state.valueType}
                                />
                            }
                            {
                                (value === 1 && !_isEmpty(this.state.cashFlow)) &&
                                <CashFlow
                                    data={this.state.cashFlow}
                                    isloading={this.state.loading}
                                    valueType={this.state.valueType}
                                />
                            }
                            {
                                (value === 2 && !_isEmpty(this.state.incomeStatement)) &&
                                <IncomeStatement
                                    data={this.state.incomeStatement}
                                    isloading={this.state.loading}
                                    valueType={this.state.valueType}
                                />
                            }

                            {
                                this.state.status === 'error' &&
                                <div className="center-align">Something went wrong...</div>
                            }

                        </div>
                    </React.Fragment>

                    {
                        this.state.loading &&
                        <div className="layover">
                            <div className="loader">
                                <CircularProgress size={50} />
                            </div>
                        </div>
                    }
                </div>
            </React.Fragment >
        )
    }
}




function mapStateToProps(state) {
    // // Get screeningInfo from redux store to check, user needs to login or not
    // let screeningInfo = {};
    // _get(state, 'BasicInfo.lookUpData.companyDetails.screeningInfo', []).map(item => {
    //     if (item.key === APP_QUICKBOOK_KEY)
    //         screeningInfo = item;
    // })
    // return {
    //     stateId: _get(state, 'staticReducers.stateUuid.uid', ''),
    //     companyID: _get(state, 'BasicInfo.lookUpData.companyDetails.id'),
    //     companyName: _get(state, 'BasicInfo.lookUpData.companyDetails.legalName'),
    //     screeningInfo
    // }
    return {}
}

export default connect(mapStateToProps)(GetAccountingDetails)
