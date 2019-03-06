import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */
import Button from '@material-ui/core/Button';
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
import { commonActionCreater } from '../../../Redux/commonAction';
import Customer from '../Customer';

PouchDb.plugin(require('pouchdb-quick-search'));
let productsdb = new PouchDb('customersdb');
productsdb.search({
    fields: ['customer.firstName', 'customer.lastName', 'email', 'phoneNumber.phoneNumber'],
    build: true
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
        productsdb.search({
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

    render() {
        let { checkoutactionArea, checkoutMainPart, checkoutCustomerArea, checkoutcalcArea, checkoutcartArea,guest,employee} = this.props
        return (
            <div className="customer-section" >
                <div className="customer-main" style={{ height: checkoutcartArea }}>
                    <div className='search-section flex-row'>
                        <ReactSelect
                            value={this.state.value}
                            onInputChange={this.onInputChange}
                            defaultOptions
                            onChange={this.onChange}
                            loadOptions={this.loadOptions}
                            className='fwidth'
                        />
                        <div className='add-customer flex-row align-center justify-center'>
                            <PersonAdd onClick={this.handleOpen} style={{ fontSize: '1.3em', color: 'rgba(0,0,0,0.5)', cursor: 'pointer' }} />
                        </div>
                        <Customer
                            open={this.state.open}
                            closeModal={this.handleClose}
                            fullScreen={false}
                        />
                    </div>
                    <div className='d-flex mt-20'>
                             <div className='customer-info'>
                                <div className='each-info'>
                                    <div className='info-title'>Name</div>
                                    <div className='info-data'>{_get(this.props, 'customer.firstName')} {_get(this.props, 'customer.lastName')}</div>
                                </div>
                                {!guest?<div className='each-info'>
                                    <div className='info-title'>Phone</div>
                                    <div className='info-data'>+{_get(this.props, 'phoneNumber.countryCode')} {_get(this.props, 'phoneNumber.phoneNumber')}</div>
                                </div>:null}
                                {!guest?<div className='each-info'>
                                    <div className='info-title'>Email</div>
                                    <div className='info-data'>{this.props.email}</div>
                                </div>:null}
                                {employee?<div className='each-info'>
                                    <div className='info-title'>Employee Id</div>
                                    <div className='info-data'>{this.props.employeeId}</div>
                                </div>:null}
                            </div>
                           
                            <div onClick={this.props.handleHistoryOpen} className='add-customer flex-row align-center justify-center'>
                                <History style={{ fontSize: '2.3em', color: 'rgba(0,0,0,0.5)' }} />
                            </div>
                     </div>
                        
                  
                </div>
                <div className="order-amount-section">
                    <CalculationSection
                        checkoutcalcArea={checkoutcalcArea}
                    />
                    <div className='button-section flex-row ' style={{ height: checkoutactionArea }}>
                        <Button className='mr-20 btnsecondary' variant="outlined" onClick={this.handleClearCart}>Clear</Button>
                        <Button className='mr-20 btnsecondary' variant="outlined" onClick={this.props.handleClickOpen}>Hold</Button>
                        <Button className="btnprimary" style={{ flex: 1 }} onClick={this.handleClickProceed} variant="contained">Proceed</Button>
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

export default connect(mapStateToProps)(CustomerTab);

