import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */
import Button from '@material-ui/core/Button';
/* Material Icons */
import PersonAdd from '@material-ui/icons/PersonAddOutlined';
/* Redux Imports */

/* Global Imports */
import ReactSelect from '../../../Global/Components/ReactSelect/async-react-select';
import genericPostData from '../../../Global/dataFetch/genericPostData';
/* Component Imports */
import CalculationSection from './CalculationSection';
import PouchDb from 'pouchdb';
import { commonActionCreater } from '../../../Redux/commonAction';

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

        }
    }
    onInputChange = (newValue) => {
        //const inputValue = newValue.replace(/\W/g, '');
        this.setState({ newValue });
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
            fields: ['customer.firstName', 'customer.lastName', 'email', 'phoneNumber.phoneNumber'],
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
      let value = _get(doc,'value');
     //populating cart reducer with customer
     this.props.dispatch(commonActionCreater(doc.value, 'ADD_CUSTOMER_TO_CART'));

      //mapped data to state 
      let billingAddress = value.billingAddress;
       let customer = value.customer;
       let email = value.email;
       let phoneNumber = value.phoneNumber;
       this.setState({billingAddress,customer,email,phoneNumber});

    }

    render() {
        let { checkoutactionArea, checkoutMainPart, checkoutCustomerArea, checkoutcalcArea, checkoutcartArea } = this.props
        return (
            <div className="customer-section" style={{ height: checkoutMainPart }}>
                <div className="customer-main" style={{ height: checkoutcartArea }}>
                    <div className='search-section flex-row'>
                        <ReactSelect
                            onInputChange={this.onInputChange}
                            cacheOptions
                            defaultOptions
                            onChange={this.onChange}
                            loadOptions={this.loadOptions}
                            className='fwidth'
                        />
                        <div className='add-customer flex-row align-center justify-center'>
                            <PersonAdd style={{ fontSize: '1.3em', color: 'rgba(0,0,0,0.5)' }} />
                        </div>
                    </div>
                    <div className='flex-column'>
                        <div className='customer-info'>
                            <div className='each-info'>
                                <div className='info-title'>Name</div>
                                <div className='info-data'>{_get(this.state,'customer.firstName')} {_get(this.state,'customer.lastName')}</div>
                            </div>
                            <div className='each-info'>
                                <div className='info-title'>Phone</div>
                                <div className='info-data'>{_get(this.state,'phoneNumber.countryCode')}{_get(this.state,'phoneNumber.phoneNumber')}</div>
                            </div>
                            <div className='each-info'>
                                <div className='info-title'>Email</div>
                                <div className='info-data'>{this.state.email}</div>
                            </div>
                        </div>
                        <div className='customer-billing-info'>
                            <div className='each-info'>
                                <div className='info-title'>Billing Address</div>
                                <div className='info-data'>{_get(this.state,'billingAddress.addressLine1')}, {_get(this.state,'billingAddress.addressLine2')}, {_get(this.state,'billingAddress.city')}, {_get(this.state,'billingAddress.state')}, {_get(this.state,'billingAddress.country')} - {_get(this.state,'billingAddress.postalCode')}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <CalculationSection
                    checkoutcalcArea={checkoutcalcArea}
                />

                <div className='button-section flex-row ' style={{ height: checkoutactionArea }}>
                    <div>
                        <Button className='mr-20' variant="outlined" onClick={this.props.handleClickOpen}>Hold</Button>
                        <Button className='mr-20' variant="outlined">Proceed as Guest</Button>
                        <Button variant="contained">Proceed</Button>
                    </div>

                </div>
            </div>
        );
    }
}

export default CustomerTab;