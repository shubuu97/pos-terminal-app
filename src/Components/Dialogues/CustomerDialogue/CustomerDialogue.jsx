import React from 'react';
import PropTypes from 'prop-types';
import moment from "moment";
import PouchDb from 'pouchdb';
import PAM from "pouchdb-adapter-memory";
/* Lodash Imports */
import _get from 'lodash/get';
import _find from 'lodash/find';
/* Redux Imports */
import { connect } from 'react-redux';
import { commonActionCreater } from '../../../Redux/commonAction'
/* Global Imports */
import genericPostData from '../../../Global/dataFetch/genericPostData';
import ReactSelect from '../../../Global/Components/ReactSelect/async-react-select';
import applyCart from '../../../Global/PosFunctions/applyCart'
/* Material Imports */
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
/* Material Icons */
import DeleteIcons from '@material-ui/icons/DeleteOutline';
import HealingIcon from '@material-ui/icons/HealingOutlined';
import AddLocationIcon from '@material-ui/icons/AddLocationOutlined';
import LocalHospitalIcon from '@material-ui/icons/LocalHospitalOutlined';
import SpaIcon from '@material-ui/icons/SpaOutlined';
import SearchIcon from '@material-ui/icons/SearchOutlined'
/*  */
import CheckInForm from './CheckInForm';

PouchDb.plugin(PAM);
PouchDb.plugin(require('pouchdb-quick-search'));

const styles = {
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
};

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class CustomerDialogue extends React.Component {

    state = {
        amount: '',
        password: '',
        weight: '',
        weightRange: '',
        showPassword: false,
        selectedCustomer: '',
        value: '',
        searchText: '',
        iconSelected: false,
    };

    componentDidMount() {
        this.getQueueList()
    }

    getQueueList = () => {
        let id = localStorage.getItem('storeId')
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: { id },
            url: 'Get/CustomerQueue/Active',
            dontShowMessage: true,
            constants: {
                init: 'GET_ACTIVE_CUSTOMERS_INIT',
                success: 'GET_ACTIVE_CUSTOMERS_SUCCESS',
                error: 'GET_ACTIVE_CUSTOMERS_ERROR'
            },
            identifier: 'GET_ACTIVE_CUSTOMERS',
            successCb: (data) => { }
        }).then((data) => {
            this.props.dispatch(commonActionCreater(data.queueItems, 'UPDATE_CUSTOMER_QUEUE'));
        })
    }

    populateCustomerQueue = () => {
        let customerQueue = this.props.customerQueue
        let view = []
        customerQueue.map((data, index) => {
            view.push(
                <div
                    className={data.customer.id == this.state.selectedCustomer ? 'card relative card-active' : 'card relative'}
                    id={data.customer.id}
                    onClick={() => this.handleQueueItemClick(data)}
                    style={
                        this.state.selectedCustomer ?
                            { width: '90%' } : { width: '40%' }
                    }>
                    {
                        _get(data, 'status', 0) == 2 ?
                            <div className="absolute status-code"></div> : null
                    }
                    <div className='flex-row justify-space-between'>
                        <div className='flex-row align-center'>
                            {
                                _get(data, 'customer.customerType', 1) == 1 ?
                                    <HealingIcon style={{ paddingRight: '10px' }} /> :
                                    <SpaIcon style={{ paddingRight: '10px' }} />
                            }
                            <span className='card-title'>{_get(data, 'customer.customer.firstName', '')} {_get(data, 'customer.customer.lastName', '')}</span>
                        </div>
                        {/* <DeleteIcons
                            onMouseLeave={() => this.setState({ iconSelected: false })}
                            onMouseEnter={() => this.setState({ iconSelected: true })}
                            onClick={() => this.deleteCustomerFromQueue(data)}
                            style={{ color: '#ff000096', fontSize: '1.5em' }}
                        /> */}
                    </div>
                    <div className='flex-row justify-space-between'>
                        <div className='flex-column des'>
                            <span className='des-title'>Age</span>
                            <span>{moment().diff(_get(data, 'customer.dob', 0), 'years')} yrs</span>
                        </div>
                        <div className='flex-column des'>
                            <span className='des-title'>Time</span>
                            <span>{moment(_get(data, 'checkIn.seconds', 0) * 1000).format('h:mm a')}</span>

                        </div>
                        {
                            _get(data, 'customer.medicalLicenseNumber', false) ?
                                <div className='flex-column des'>
                                    <span className='des-title'>Med Id</span>
                                    <span>{_get(data, 'customer.medicalLicenseNumber', '...')}</span>
                                </div> : null
                        }

                        <div className='flex-column des'>
                            <span className='des-title'>State</span>
                            <span>{_get(data, 'customer.billingAddress.state', '...')}</span>
                        </div>
                    </div>
                </div >
            )
        })
        return (
            <div className='guest-queue overflow-x flex-row flex-wrap'>
                {view}
            </div>
        )
    }

    handleQueueItemClick = (data) => {
        this.setState({ selectedCustomer: data.customer.id, customerData: data })
    }

    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    onInputChange = (newValue) => {
        this.setState({ value: newValue });
        return newValue;
    }

    loadOptions = (searchText, callback) => {
        let reqObj = {
            "text": searchText,
            "offset": 0,
            "limit": 20,
            "filters": [
                {
                    "field": "retailerId",
                    "value": localStorage.getItem('retailerId')
                }
            ]
        }
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: reqObj,
            url: 'Search/Customers',
            dontShowMessage: true,
            constants: {
                init: 'ELASTIC_SEARCH_CUSTOMERS_INIT',
                success: 'ELASTIC_SEARCH_CUSTOMERS_SUCCESS',
                error: 'ELASTIC_SEARCH_CUSTOMERS_ERROR'
            },
            identifier: 'ELASTIC_SEARCH_CUSTOMERS_RULES',
            successCb: (data) => { }
        }).then((data) => {
            callback(this.mapCustomer(data))
        })
    };

    mapCustomer = (data) => {
        let customers = _get(data, 'customers', [])
        return customers.map(rowObj => {
            let doc = rowObj;
            let objectToReturn = {};
            objectToReturn.label = `${_get(doc, 'customer.firstName')} ${_get(doc, 'customer.lastName')}`;
            objectToReturn.value = doc;
            return objectToReturn;
        });
    };

    addCustomerToQueue = (customer) => {
        let customerQueue = this.props.customerQueue
        if (_find(customerQueue, customerQueue => customerQueue.id == customer.value.id)) {
            console.log('Customer Already In Queue')
        }
        else {
            let reqObj = {
                storeId: localStorage.getItem('storeId'),
                customerId: customer.value.id,
                status: 1,
                checkIn: {
                    seconds: parseInt(Date.now() / 1000)
                },
            }
            genericPostData({
                dispatch: this.props.dispatch,
                reqObj: reqObj,
                url: 'Add/CustomerQueue',
                dontShowMessage: true,
                constants: {
                    init: 'ADD_CUSTOMER_TO_QUEUE_INIT',
                    success: 'ADD_CUSTOMER_TO_QUEUE_SUCCESS',
                    error: 'ADD_CUSTOMER_TO_QUEUE_ERROR'
                },
                identifier: 'ADD_CUSTOMER_TO_QUEUE',
                successCb: (data) => { }
            }).then((data) => {
                this.props.dispatch(commonActionCreater(data.queueItems, 'UPDATE_CUSTOMER_QUEUE'));
            })
        }
    }

    deleteCustomerFromQueue = (customer) => {
        let id = customer.queueId
        if (customer.queueId == this.props.checkoutCustomer.queueId) {
            this.props.dispatch(commonActionCreater({}, 'CUSTOMER_SERVING'));
        }
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: { id },
            url: 'Remove/CustomerQueueById',
            dontShowMessage: true,
            constants: {
                init: 'REMOVE_CUSTOMER_TO_QUEUE_INIT',
                success: 'REMOVE_CUSTOMER_TO_QUEUE_SUCCESS',
                error: 'REMOVE_CUSTOMER_TO_QUEUE_ERROR'
            },
            identifier: 'REMOVE_CUSTOMER_TO_QUEUE',
            successCb: (data) => { }
        }).then((data) => {
            if (customer.customer.id == this.state.selectedCustomer) {
                this.setState({ selectedCustomer: '' })
            }
            this.props.dispatch(commonActionCreater(data.queueItems, 'UPDATE_CUSTOMER_QUEUE'));
        })
    }

    proceedToCheckout = (customer) => {
        let reqObj = []
        if (this.props.checkoutCustomer.queueId) {
            reqObj.push({
                queueId: this.props.checkoutCustomer.queueId,
                status: 1
            })
        }
        reqObj.push({
            queueId: customer.queueId,
            status: 2
        })
        reqObj.map((data) => {
            genericPostData({
                dispatch: this.props.dispatch,
                reqObj: data,
                url: 'Update/CustomerQueue',
                dontShowMessage: true,
                constants: {
                    init: 'CUSTOMER_UPDATE_INIT',
                    success: 'CUSTOMER_UPDATE_SUCCESS',
                    error: 'CUSTOMER_UPDATE_ERROR'
                },
                identifier: 'CUSTOMER_UPDATE',
                successCb: (data) => { }
            }).then((data) => {
                this.setState({ selectedCustomer: '' })
                if (data.queueItem.status == 2) {
                    this.props.dispatch(commonActionCreater(data.queueItem, 'CUSTOMER_SERVING'));
                    this.props.dispatch(commonActionCreater(data.queueItem.customer, 'ADD_CUSTOMER_TO_CART'));
                }
                this.getQueueList()
            })
        })
        this.props.handleClose();

    }

    render() {
        const { classes } = this.props;
        return (
            <div className='customer-dialogue'>
                <Dialog
                    fullScreen
                    open={this.props.open}
                    onClose={this.props.handleClose}
                    TransitionComponent={Transition}
                >
                    <div className='customer-dialogue-section'>
                        <div className='customer-header'>
                            <IconButton color="inherit" onClick={this.props.handleClose} aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                            <span className='ml-20'>Customers</span>
                        </div>
                        <div className='customer-main flex-row'>
                            <div className='check-in-area flex-column'>
                                <span className='heading'>Check-In</span>
                                <div className='previous-search flex-row'>
                                    <ReactSelect
                                        value={this.state.value}
                                        onInputChange={this.onInputChange}
                                        //defaultOptions
                                        onChange={this.addCustomerToQueue}
                                        loadOptions={this.loadOptions}
                                        className='fwidth'
                                    />
                                </div>
                                <div className='align-self-center'>or</div>
                                <div className='add-new-area'>
                                    <CheckInForm
                                        addCustomerToQueue={this.addCustomerToQueue}
                                    />
                                </div>
                            </div>
                            <div
                                className='queue-area flex-column'
                                style={
                                    this.state.selectedCustomer ?
                                        { width: '30%' } : { width: '65%' }
                                }
                            >
                                <span className='heading'>Queue</span>
                                {this.populateCustomerQueue()}
                            </div >
                            {
                                this.state.selectedCustomer ?
                                    <div className='customer-info-area flex-column justify-space-between align-flex-end'>
                                        <div className='flex-column fwidth'>
                                            <div className='flex-row justify-space-between align-center'>
                                                <span className='heading'>Customer Info</span>
                                                <DeleteIcons
                                                    onClick={() => this.deleteCustomerFromQueue(_get(this.state, 'customerData'))}
                                                    style={{ color: '#ff000096', fontSize: '1.8em' }}
                                                />
                                            </div>

                                            <div className='flex-row flex-wrap justify-space-between pt-20'>
                                                <div className='flex-column fwidth pt-215pb-10 '>
                                                    <span className='info-heading'>Name</span>
                                                    <span className='info-value'>{_get(this.state, 'customerData.customer.customer.firstName', '')} {_get(this.state, 'customerData.customer.customer.lastName', '')}</span>
                                                </div>
                                                <div className='flex-column halfwidth pt-15 pb-10'>
                                                    <span className='info-heading'>Age</span>
                                                    <span className='info-value'>{moment().diff(_get(this.state, 'customerData.customer.dob', 0), 'years')} yrs
                                                    </span>
                                                </div>
                                                <div className='flex-column halfwidth pt-15 pb-10'>
                                                    <span className='info-heading'>State</span>
                                                    <span className='info-value'>{_get(this.state, 'customerData.customer.billingAddress.state', '...')}</span>
                                                </div>
                                                <div className='flex-column halfwidth pt-15 pb-10'>
                                                    <span className='info-heading'>Med ID</span>
                                                    <span className='info-value'>{_get(this.state, 'customerData.customer.medicalLicenseNumber', '...')}</span>
                                                </div>
                                                <div className='flex-column halfwidth pt-15 pb-10'>
                                                    <span className='info-heading'>ID</span>
                                                    <span className='info-value'>{_get(this.state, 'customerData.customer.id', '...')}</span>
                                                </div>
                                                <div className='flex-column halfwidth pt-15 pb-10'>
                                                    <span className='info-heading'>Gram Limit</span>
                                                    <span className='info-value'>{_get(this.state, 'customerData.customer.gramLimit', '...')}</span>
                                                </div>
                                                <div className='flex-column halfwidth pt-15 pb-10'>
                                                    <span className='info-heading'>Plant Count Limit</span>
                                                    <span className='info-value'>{_get(this.state, 'customerData.customer.plantCountLimit', '...')}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='customer-action'>
                                            {/* <Button
                                                className='mr-10'
                                                variant='outlined'
                                                color="error"
                                                onClick={() => this.deleteCustomerFromQueue(_get(this.state, 'customerData'))}
                                            >
                                                Delete
                                            </Button> */}
                                            <Button
                                                className='mr-10'
                                                disabled={this.state.customerData.status == 2}
                                                variant='contained'
                                                color="primary"
                                                onClick={() => this.proceedToCheckout(_get(this.state, 'customerData'))}
                                            >
                                                Proceed To Checkout
                                            </Button>
                                        </div>
                                    </div> : null
                            }
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state) {
    let customerQueue = _get(state, 'customerQueue.queue', []);
    let checkoutCustomer = _get(state, 'customerQueue.customer', {})

    return {
        customerQueue,
        checkoutCustomer,
    }
}

CustomerDialogue.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withStyles(styles)(CustomerDialogue));