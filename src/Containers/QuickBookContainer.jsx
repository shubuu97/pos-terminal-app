import React, { Component } from 'react';
import _get from 'lodash/get';
/* Material Imports */
import Input from '@material-ui/core/Input';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';

/* Redux Imports */
import { connect } from 'react-redux';

import {
    APPLICATION_BFF_URL,
    APP_QUICKBOOK_SCOPE,
    APP_QUICKBOOK_CLIENT_ID,
    APP_QUICKBOOK_REDIRECT_URI,
    APP_QUICKBOOK_RESPONSE_TYPE,
    APP_QUICKBOOK_KEY
} from '../Redux/urlConstants';
/* Global Imports */

/* Components */

/* Images */
import quickBookImg from '../assets/images/quickbooks-logo.jpg';
// import yodleeImg from '../../Assets/images/Yodlee.png';

import queryString from 'query-string';
import generateV1uuid from '../db_utills/uuid';
import { commonActionCreater } from '../Redux/commonAction';
import {withRouter}  from 'react-router-dom';
var jwtDecode = require('jwt-decode');



class QuickBookContainer extends Component {

    constructor() {
        super();
        this.state = {
            searchItem: ''
        }
    }

    componentDidMount() {
        let paramm = queryString.parse(this.props.location.search);
        console.log(paramm, 'paramm');
        if (this.props.stateId === paramm.state) {
            console.log(paramm.state, 'paramm -----------');
        }
    }

    handleChange = (event) => {
        console.log(event, 'event');
        this.setState({ searchItem: '' });
    }

    connectToQuickBook = () => {
        //If user already has been loggedin in and DB contains Accounting System info -
        // than show financial data without login to Accounting System
        if (_get(this, 'props.screeningInfo.value')) {
            this.props.history.push('/accounting/details');

        } else { // Else fisrt login than show data
            let uid = generateV1uuid();
            // Save UUID to redux store to compare accounting state data 
            this.props.dispatch(commonActionCreater({
                uid: uid,
            }, 'SAVE_ACCOUNTING_STATE_UUID'));


            let queryParam = 'client_id=' + APP_QUICKBOOK_CLIENT_ID +
                '&redirect_uri=' + encodeURIComponent(APP_QUICKBOOK_REDIRECT_URI) +
                '&response_type=' + APP_QUICKBOOK_RESPONSE_TYPE +
                '&scope=' + APP_QUICKBOOK_SCOPE +
                '&state=' + uid +
                '&uid=' + this.props.companyID;

            let url = 'https://appcenter.intuit.com/connect/oauth2?' + queryParam;
            window.open(url, '_top', 'location=1,height=570,width=720,scrollbars=yes,status=yes');
        }
    }


    render() {
        return (
            <React.Fragment>
                <div className="user-table-section loan-request">
                    <div className="mui-row align-items-center">
                        {/* <div className="mui-col-xs-12">
                            <h1>{this.props.companyName} - Accounting Monitoring Activation</h1>
                        </div> */}
                        {/* <div className="col-sm-6 d-flex justify-content-end "></div> */}
                    </div>
                    <div className="cardwrapper">
                        <div className="text-center mt-30 header-20px-600">Connect with your Accounting Service</div>
                        <div className="text-center">Securely connect your accounting system with your Sale transcations</div>
                        {/* Block for serching Account Monitoring system */}
                        {/* <div className="text-center mt-20">
                            <Input
                                placeholder="Enter your accounting system name"
                                style={{ width: '45%' }}
                                inputProps={{
                                    'aria-label': 'Description',
                                }}
                                onChange={this.handleChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton>
                                            <SearchIcon />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </div> */}
                        {/* <div className="text-center mt-30">or select one from list</div> */}
                        <div className="flex-row justify-center">
                            <div className="accounting-images m-10 cursor-pointer"
                                onClick={this.connectToQuickBook}>
                                <img src={quickBookImg} className='width-100-percent' />
                            </div>
                            {/* <div className="accounting-images m-10"
                                onClick={() => this.props.history.push('/accounting/yodlee')}>
                                <img src={yodleeImg} className='width-100-percent' />

                            </div> */}
                            {/*<div className="accounting-images m-10">
                                <img src={quickBookImg} className='width-100-percent' />
                            </div> */}
                        </div>
                        <div className="text-center mt-50">
                            <div>
                                <svg style={{ width: '24px', height: '24px' }} viewBox="0 0 24 24">
                                    <path fill="#66cf47" d="M12,12H19C18.47,16.11 15.72,19.78 12,20.92V12H5V6.3L12,3.19M12,1L3,5V11C3,16.55 6.84,21.73 12,23C17.16,21.73 21,16.55 21,11V5L12,1Z" />
                                </svg>
                            </div>
                            <div className="mt-10">Privacy and security of your information is our top priority.</div>
                        </div>
                    </div>
                </div>
            </React.Fragment >
        )
    }
}


function mapStateToProps(state) {
    // Get screeningInfo from redux store to check, user needs to login or not
    let screeningInfo = {};
    _get(state, 'BasicInfo.lookUpData.companyDetails.screeningInfo', []).map(item => {
        if (item.key === APP_QUICKBOOK_KEY)
            screeningInfo = item;
    })
    return {
        stateId: _get(state, 'staticReducers.stateUuid.uid', ''),
        companyID: _get(state, 'BasicInfo.lookUpData.companyDetails.id'),
        companyName: _get(state, 'BasicInfo.lookUpData.companyDetails.legalName'),
        screeningInfo
    }
}

export default connect(mapStateToProps)(withRouter(QuickBookContainer))
