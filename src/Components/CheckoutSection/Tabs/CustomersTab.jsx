import React from 'react';
import { Detector } from 'react-detect-offline';
/* Lodash Imports */
import _get from 'lodash/get';
import _findIndex from 'lodash/findIndex';
import _isArray from 'lodash/isArray';
/* Material import */
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles'
/* Material Icons */
import PersonAdd from '@material-ui/icons/PersonAddOutlined';
import History from '@material-ui/icons/History';
/* Redux Imports */
import { connect } from 'react-redux';
/* Global Imports */
import ReactSelect from '../../../Global/Components/ReactSelect/async-react-select';
import globalClearCart from '../../../Global/PosFunctions/clearCart';
import addGuestToCart from '../../../Global/PosFunctions/addGuestToCart';
/* Component Imports */
import CalculationSection from './CalculationSection';
import PouchDb from 'pouchdb';
import PAM from "pouchdb-adapter-memory";
import { commonActionCreater } from '../../../Redux/commonAction';
import Customer from '../Customer';
PouchDb.plugin(PAM);
PouchDb.plugin(require('pouchdb-quick-search'));
let customerdb = new PouchDb('customersdb');

const styles = theme => ({
    darkColor: {
        background: theme.palette.secondary.light,
        color: theme.palette.secondary.text,
        height: '50px'
    }
})

class CustomerTab extends React.Component {

    constructor() {
        super();
        this.state = {
            open: false,
            value: ''
        }
    }
    onInputChange = (newValue) => {
        //const inputValue = newValue.replace(/\W/g, '');
        this.setState({ value: newValue });
        return newValue;
    }
    mapCustomer = (data) => {
        return data.rows.map(rowObj => {
            //structure of rowObj {doc:{},id:'',score:''}   
            let doc = rowObj.doc;
            let objectToReturn = {};
            objectToReturn.label = `${_get(doc, 'customer.firstName')} ${_get(doc, 'customer.lastName')}`;
            objectToReturn.value = doc;
            return objectToReturn;
        }
        );
    };

    loadOptions = (searchText, callback) => {
        console.log(searchText, "");
        customerdb.search({
            query: searchText,
            fields: ['customer.firstName', 'customer.lastName', 'email', 'phoneNumber.phoneNumber', 'employeeId'],
            include_docs: true,
            limit: 20,
            skip: 0
        }).then((res) => {
            callback(this.mapCustomer(res))
        })
        // posdb.queryToView('customerView/byCustomerName', {
        //   include_docs: true,
        //   startkey:inputValue,
        //   endkey:`${inputValue}\ufff0`

        // }).then((data) => {
        //   console.log(data, "result is here")
        //   callback(this.mapCustomer(data))

        // });
    };
    onChange = (doc) => {
        let value = _get(doc, 'value');
        let employeeDiscount = _get(doc, 'value.employeeDiscount', 0);
        //populating cart reducer with customer
        this.setState({ value: '' })
        this.props.dispatch(commonActionCreater(employeeDiscount, 'ADD_EMPLOYEE_DISCOUNT'));
        this.props.dispatch(commonActionCreater(_get(this.props, 'cart.cartItems', []), 'CART_ITEM_LIST'));
        this.props.dispatch(commonActionCreater(doc.value, 'ADD_CUSTOMER_TO_CART'));

        //mapped data to state 
        let billingAddress = value.billingAddress;
        let customer = value.customer;
        let email = value.email;
        let phoneNumber = value.phoneNumber;
        this.setState({ billingAddress, customer, email, phoneNumber });

    }

    handleOpen = () => {
        this.setState({ open: true })
    }

    handleClose = () => {
        this.setState({ open: false })
    }

    handleClickProceed = () => {
        this.props.dispatch(commonActionCreater(3, 'SWITCH_TAB_NUMBER'))

    }

    handleClearCart = () => {
        globalClearCart(this.props.dispatch);
        addGuestToCart(this.props.dispatch);
    };

    handleHideWhenOffline = ({ online }, onlineContent, offlineContent) => {
        if (online) {
            return onlineContent
        }
        else
            return offlineContent
    }

    proceedAsGuest = () => {
        addGuestToCart(this.props.dispatch);
        this.handleClickProceed()
    }

    render() {
        let { checkoutactionArea, checkoutMainPart, checkoutCustomerArea, checkoutcalcArea, checkoutcartArea, guest, employee } = this.props
        return (
            <div className="customer-section" >
                <div className="customer-main flex-column align-center" style={{ height: checkoutcartArea }}>
                    <div className='search-section flex-row fwidth'>
                        <ReactSelect
                            value={this.state.value}
                            onInputChange={this.onInputChange}
                            defaultOptions
                            onChange={this.onChange}
                            loadOptions={this.loadOptions}
                            className='fwidth'
                        />
                        <Detector render={({ online }) => this.handleHideWhenOffline(
                            { online },
                            [<div className='add-customer flex-row align-center justify-center'>
                                <PersonAdd onClick={this.handleOpen} style={{ fontSize: '1.3em', color: 'rgba(0,0,0,0.5)', cursor: 'pointer' }} />
                            </div>],
                            [<div className='add-customer flex-row align-center justify-center disable-button'>
                                <PersonAdd onClick={this.handleOpen} style={{ fontSize: '1.3em', color: 'rgba(0,0,0,0.5)', cursor: 'pointer' }} />
                            </div>]
                        )} />
                        <Customer
                            open={this.state.open}
                            closeModal={this.handleClose}
                            fullScreen={false}
                        />
                    </div>
                    <div className='d-flex mt-20 fwidth'>
                        <div className='customer-info'>
                            <div className='each-info'>
                                <div className='info-title'>Name</div>
                                <div className='info-data'>{_get(this.props, 'customer.firstName')} {_get(this.props, 'customer.lastName')}</div>
                            </div>
                            {!guest ? <div className='each-info'>
                                <div className='info-title'>Phone</div>
                                <div className='info-data'>+{_get(this.props, 'phoneNumber.countryCode')} {_get(this.props, 'phoneNumber.phoneNumber')}</div>
                            </div> : null}
                            {!guest ? <div className='each-info'>
                                <div className='info-title'>Email</div>
                                <div className='info-data'>{this.props.email}</div>
                            </div> : null}
                            {employee ? <div className='each-info'>
                                <div className='info-title'>Employee Id</div>
                                <div className='info-data'>{this.props.employeeId}</div>
                            </div> : null}
                        </div>
                        <Detector render={({ online }) => this.handleHideWhenOffline(
                            { online },
                            [<div onClick={this.props.handleHistoryOpen} className='add-customer flex-row align-center justify-center'>
                                <History style={{ fontSize: '2.3em', color: 'rgba(0,0,0,0.5)' }} />
                            </div>],
                            [<div onClick={this.props.handleHistoryOpen} className='disable-button add-customer flex-row align-center justify-center'>
                                <History style={{ fontSize: '2.3em', color: 'rgba(0,0,0,0.5)' }} />
                            </div>]
                        )} />
                    </div>
                    {
                       !guest ? 
                        <div className='flex-column align-center justify-center'>
                            <div>Or</div>
                            <Button className={`${this.props.classes.darkColor} mt-20`} variant="contained" onClick={this.proceedAsGuest}>Proceed as Guest</Button>
                        </div> : null

                    }
                </div>
                <div className="order-amount-section">
                    <CalculationSection
                        checkoutcalcArea={checkoutcalcArea}
                    />
                    <div className='button-section flex-row ' style={{ height: checkoutactionArea }}>
                        <Button className='mr-20 btnsecondary' variant="outlined" onClick={this.handleClearCart}>Clear</Button>
                        <Button className={_get(this, 'props.cartItems', []).length ? 'mr-20 btnsecondary' : 'mr-20 btnsecondary disable-button'} variant="outlined" onClick={this.props.handleClickOpen}>Hold</Button>
                        <Button className={_get(this, 'props.cartItems', []).length ? 'btnprimary' : 'btnprimary disable-button'} style={{ flex: 1 }} onClick={this.handleClickProceed} variant="contained">Proceed</Button>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    let customer = _get(state, 'cart.customer');
    let cart = _get(state, 'cart');
    return { ...customer, cart }
}

export default connect(mapStateToProps)(withStyles(styles)(CustomerTab));

