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

const customerData = [
    {
        id: 2314,
        customerName: 'Mayuk Agarwal',
        age: 24,
        time: "05:30 PM",
        medId: 2345678,
        state: 'CO',
        type: 'Medical'
    },
    {
        id: 3424,
        customerName: 'Yogendra Jain',
        age: 25,
        time: "05:40 PM",
        medId: 5344232,
        state: 'AL',
        type: 'Adult'
    },
    {
        id: 5464,
        customerName: 'Shubham Chitransh',
        age: 23,
        time: "06:30 PM",
        state: 'CO',
        type: 'Adult'
    }
]

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
    };

    populateCustomerQueue = () => {
        let customerQueue = this.props.customerQueue
        let view = []
        customerQueue.map((data, index) => {
            view.push(
                <div className='card' id={data.id} onClick={() => this.selectCustomer(data.id, data)} style={
                    this.state.selectedCustomer ?
                        { width: '90%' } : { width: '40%' }
                }>
                    <div className='flex-row justify-space-between'>
                        <div className='flex-row align-center'>
                            {
                                _get(data, 'customerType', 1) == 2 ?
                                    <HealingIcon style={{ paddingRight: '10px' }} /> :
                                    <SpaIcon style={{ paddingRight: '10px' }} />
                            }
                            <span className='card-title'>{_get(data, 'customer.firstName', '')} {_get(data, 'customer.lastName', '')}</span>
                        </div>
                        <DeleteIcons style={{ color: '#ff000096', fontSize: '1.5em' }} />
                    </div>
                    <div className='flex-row justify-space-between'>
                        <div className='flex-column des'>
                            <span className='des-title'>Age</span>
                            <span>{data.age}</span>
                        </div>
                        <div className='flex-column des'>
                            <span className='des-title'>Time</span>
                            <span>{data.time}</span>

                        </div>
                        <div className='flex-column des'>
                            <span className='des-title'>Med Id</span>
                            <span>{_get(data, 'medId', '...')}</span>
                        </div>
                        <div className='flex-column des'>
                            <span className='des-title'>State</span>
                            <span>{data.state}</span>
                        </div>
                    </div>
                </div>
            )
        })
        return (
            <div className='guest-queue overflow-x flex-row flex-wrap'>
                {view}
            </div>
        )
    }

    selectCustomer = (id, data) => {
        if (this.state.selectedCustomer != id) {
            if (this.state.selectedCustomer) {
                document.getElementById(this.state.selectedCustomer).classList.remove("card-active");
            }
            this.setState({
                selectedCustomer: id,
                customerData: data
            })
            document.getElementById(id).classList.add("card-active");
        }
        else {
            if (this.state.selectedCustomer) {
                document.getElementById(this.state.selectedCustomer).classList.remove("card-active");
            }
            this.setState({
                selectedCustomer: '',
                customerData: ''
            })
        }
    }

    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    onInputChange = (newValue) => {
        this.setState({ value: newValue });
        return newValue;
    }
    addCustomerToQueue = (doc) => {
        let customerQueue = this.props.customerQueue
        if(_find(customerQueue, customerQueue => customerQueue.id == doc.value.id )){
            console.log('Customer Already In Queue')
        }
        else{
            customerQueue.push(doc.value);
        }
        this.props.dispatch(commonActionCreater(customerQueue, 'UPDATE_CUSTOMER_QUEUE'));
        
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
            successCb: (data) => {  }
        }).then((data)=>{
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

    render() {
        console.log('Value')
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
                                    <CheckInForm />
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
                                            <span className='heading'>Cutomer Info</span>
                                            <div className='flex-row flex-wrap justify-space-between pt-20'>
                                                <div className='flex-column fwidth pt-215pb-10 '>
                                                    <span className='info-heading'>Name</span>
                                                    <span className='info-value'>{this.state.customerData.customerName}</span>
                                                </div>
                                                <div className='flex-column halfwidth pt-15 pb-10'>
                                                    <span className='info-heading'>Age</span>
                                                    <span className='info-value'>{this.state.customerData.age}</span>
                                                </div>
                                                <div className='flex-column halfwidth pt-15 pb-10'>
                                                    <span className='info-heading'>Time</span>
                                                    <span className='info-value'>{this.state.customerData.time}</span>
                                                </div>
                                                <div className='flex-column halfwidth pt-15 pb-10'>
                                                    <span className='info-heading'>Med ID</span>
                                                    <span className='info-value'>{this.state.customerData.medId}</span>
                                                </div>
                                                <div className='flex-column halfwidth pt-15 pb-10'>
                                                    <span className='info-heading'>State</span>
                                                    <span className='info-value'>{this.state.customerData.state}</span>
                                                </div>
                                                <div className='flex-column halfwidth pt-15 pb-10'>
                                                    <span className='info-heading'>ID</span>
                                                    <span className='info-value'>{this.state.customerData.id}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='customer-action'>
                                            <Button
                                                className='mr-10'
                                                variant='outlined'
                                                color="error"
                                            //onClick={}
                                            >
                                                Delete
                                            </Button>
                                            <Button
                                                className='mr-10'
                                                variant='contained'
                                                color="primary"
                                            //onClick={}
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

    return {
        customerQueue
    }
}

CustomerDialogue.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withStyles(styles)(CustomerDialogue));