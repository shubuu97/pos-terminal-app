import React, { Component } from 'react';
import { render } from "react-dom";
import Products from '../../components/Products';
import Pagination from '../../components/Pagination';
import Footer from '../../components/Footer';
import QuickView from '../../components/QuickView';
import { ProductsData } from '../../products.js';
// import { customersData } from '../../customers.js'
import Form from "react-bootstrap/lib/Form";
import connect from 'react-redux/lib/connect/connect';
import NavBar from '../../containers/NavBar.jsx';
import profile_pic from '../../assets/images/profile_pic.png';
import Counter from '../../components/Counter';
import MaterialUiDialog from '../../components/MaterialUiDialog';
import TransactionDialog from '../../components/DialogForTransaction';
import SecurePinDialog from '../../components/SecurePinModal';
import NewCustomerDialog from '../../components/NewCustomerDialog';
import AutoComplete from '../../components/Elements/AutoComplete.jsx';
// import SaveButton from "../../components/common/SaveButton.jsx";
import SaveButton from "../../components/common/SaveButton.jsx";
import FormControl from "react-bootstrap/lib/FormControl";
import Panel from 'react-bootstrap/lib/Panel';
import PanelGroup from 'react-bootstrap/lib/PanelGroup';
import _find from 'lodash/find';
import _isEmpty from 'lodash/isEmpty';
import _set from 'lodash/set';
import _get from 'lodash/get';
import _findIndex from 'lodash/findIndex';
import { postCustomerRegistrationData, postCustomerSearchData } from '../../actions/products';
import { postPOSLogin, clearPOSLoginData } from '../../actions/store';
import UserOptions from '../../components/UserOptions';
import Categories from '../../components/categories';

import '../../scss/styles.scss';
import ReactDrawer from 'react-drawer';
import 'react-drawer/lib/react-drawer.css';
import { fetchLookupData, postSaleTransactionData } from '../../actions/products';
import { RECEIVE_SALE_TRANSACTION_DATA, RECEIVE_CUSTOMER_REGISTRATION_DATA, REQUEST_CUSTOMER_REGISTRATION_DATA, REQUEST_CUSTOMER_SEARCH_DATA } from '../../constants/products'
import {REQUEST_POS_LOGIN, RECEIVED_POS_LOGIN} from '../../constants/store';

import drawer_close from '../../assets/images/close.png'

import { Formik } from 'formik';
import { GenericInput } from '../../components/common/TextValidation.jsx';
import Yup from 'yup';
import Alert from 'react-s-alert';
import Redirect from 'react-router/Redirect';

class NewCustomer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };

    }

    render() {
        return(
            <div>
<h2> New Customer <a onClick={this.onDrawerCloseCustomer} className="drawer-close"><img src={drawer_close} /></a></h2>
<Formik
    initialValues={{}}
    // validate = {validate1}
    validationSchema={NewCustomerFormSchema}
    handleChange={this.props.handleChange}
    handleBlur={this.props.handleBlur}
    enableReinitialize={true}
    onSubmit={() => { }}
    values={{ ...this.customerData }}
    render={(props) => {
        return (



            <div className="drawer-body">
                <div className="form-d">
                    <div className="row">
                        <div className="col-sm-6">
                            <SaveButton Class_Name="btn-default" buttonDisplayText={'Cancel'} handlerSearch={this.handleCloseCustomer} />
                        </div>
                        <div className="col-sm-6 text-right">
                            <SaveButton Class_Name="btn-info" buttonDisplayText={'Save'} disabled={!props.isValid} handlerSearch={this.handlerSave} />
                        </div>
                    </div>
                </div>



                <div className="row d-flex">
                    <div className="col-sm-6">
                        <div className="form-d">
                            <label className="control-label">First Name <em>*</em></label>
                            <GenericInput
                                htmlFor="password" displayName="First Name"
                                inputName="firstName" defaultValue={this.customerData.firstName}
                                onChange={this.onValueChangedCustomerData.bind(this, props)}
                                onBlur={props.handleBlur} errorMessage={props.errors.firstName}
                                error={props.errors} errorValue={props.errors.firstName} className="text-input error"
                                touched={props.touched} touchedValue={props.touched.firstName}
                            />
                        </div>
                    </div>

                    <div className="col-sm-6">
                        <div className="form-d">
                            <label className="control-label">Middle Name</label>
                            <GenericInput
                                htmlFor="middleName" displayName="Middle Name"
                                inputName="middleName" defaultValue={this.customerData.middleName}
                                onChange={this.onValueChangedCustomerData.bind(this, props)}
                                onBlur={props.handleBlur} errorMessage={props.errors.middleName}
                                error={props.errors} errorValue={props.errors.middleName} className="text-input error"
                                touched={props.touched} touchedValue={props.touched.middleName}
                            />
                        </div>
                    </div>

                    <div className="col-sm-6">
                        <div className="form-d">
                            <label className="control-label">Last Name <em>*</em></label>
                            <GenericInput
                                htmlFor="lastName" displayName="Last Name"
                                inputName="lastName" defaultValue={this.customerData.lastName}
                                onChange={this.onValueChangedCustomerData.bind(this, props)}
                                onBlur={props.handleBlur} errorMessage={props.errors.lastName}
                                error={props.errors} errorValue={props.errors.lastName} className="text-input error"
                                touched={props.touched} touchedValue={props.touched.lastName}
                            />
                        </div>


                    </div>



                    <div className="col-sm-6">
                        <div className="form-d">
                            <label className="control-label">Email <em>*</em></label>
                            <GenericInput
                                htmlFor="email" displayName="Email Id"
                                inputName="email" defaultValue={this.customerData.email}
                                onChange={this.onValueChangedCustomerData.bind(this, props)}
                                onBlur={props.handleBlur} errorMessage={props.errors.email}
                                error={props.errors} errorValue={props.errors.email} className="text-input error"
                                touched={props.touched} touchedValue={props.touched.email}
                            />
                        </div>
                    </div>

                    <div className="col-sm-6 nc-drop">
                        <div className="form-d">
                            <label className="control-label">Chose group <em>*</em></label>
                            <AutoComplete
                                type="single" name="customerType"
                                placeholder="Chose group"
                                data={_get(this.customerType, 'data', [])}
                                value={this.customerData.customerType}
                                changeHandler={(id) => { this.handleSelectChange(id, "customerType", props) }}
                                errorCheck={true}
                                errorMessage={props.errors.customerType}
                                error={props.errors} errorValue={props.errors.customerType}
                                className="text-input error"
                                touched={props.touched} touchedValue={props.touched.customerType}
                                blurHandler={this.blurHandler.bind(this, props, 'customerType')}
                            />
                        </div>
                    </div>

                    <div className="col-sm-6">
                        <div className="form-d">
                            <label className="control-label">Driving License ID <em>*</em></label>
                            <GenericInput
                                htmlFor="drivingLicenseId" displayName="Driving License"
                                inputName="drivingLicenseId" defaultValue={this.customerData.drivingLicenseId}
                                onChange={this.onValueChangedCustomerData.bind(this, props)}
                                onBlur={props.handleBlur} errorMessage={props.errors.drivingLicenseId}
                                error={props.errors} errorValue={props.errors.drivingLicenseId} className="text-input error"
                                touched={props.touched} touchedValue={props.touched.drivingLicenseId}
                            />
                        </div>
                    </div>

                    <div className="col-sm-6">
                        <div className="form-d">
                            <label className="control-label">Medical ID <em>*</em></label>
                            <GenericInput
                                htmlFor="medicalId" displayName="Medical Id"
                                inputName="medicalId" defaultValue={this.customerData.medicalId}
                                onChange={this.onValueChangedCustomerData.bind(this, props)}
                                onBlur={props.handleBlur} errorMessage={props.errors.medicalId}
                                error={props.errors} errorValue={props.errors.medicalId} className="text-input error"
                                touched={props.touched} touchedValue={props.touched.medicalId}
                            />
                        </div>
                    </div>

                    <div className="col-sm-6">
                        <label className="control-label inline-label">Subscribe Newsletter</label>
                        <label className="switch">
                            <input type="checkbox" value={this.customerData.subscribeNewsletter} />
                            <span onClick={this.toggleClass.bind(this)} className="slider"><span className="on">On</span> <span className="off">Off</span></span>
                        </label>
                    </div>
                </div>
            </div>)
    }} />
<div className="drawer-body-nopad">
    <PanelGroup
        accordion
        id="accordion-controlled-example-customer"
        activeKey={this.state.activeKey}
        onSelect={this.handleSelect}
        className="noborder-panel"
    >
        <Panel eventKey="1">
            <Panel.Heading>
                <Panel.Title toggle>Billing Address</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="form-d">
                            <label className="control-label">First Name</label>
                            <FormControl
                                type="text"
                                name="firstName"
                                placeholder=""
                                value={this.billingAddress.firstName}
                                onChange={this.onValueChangedBillingAddressData.bind(this)}
                            />
                        </div>
                    </div>

                    <div className="col-sm-6">
                        <div className="form-d">
                            <label className="control-label">Last Name</label>
                            <FormControl
                                type="text"
                                name="lastName"
                                placeholder=""
                                value={this.billingAddress.lastName}
                                onChange={this.onValueChangedBillingAddressData.bind(this)}
                            />
                        </div>
                    </div>

                    <div className="col-sm-6">
                        <div className="form-d">
                            <label className="control-label">Company</label>
                            <FormControl
                                type="text"
                                name="company"
                                placeholder=""
                                value={this.billingAddress.company}
                                onChange={this.onValueChangedBillingAddressData.bind(this)}
                            />
                        </div>
                    </div>

                    <div className="col-sm-6">
                        <div className="form-d">
                            <label className="control-label">Phone</label>
                            <FormControl
                                type="text"
                                name="phone"
                                placeholder=""
                                value={this.billingAddress.phone}
                                onChange={this.onValueChangedBillingAddressData.bind(this)}
                            />
                        </div>
                    </div>

                    <div className="col-sm-6">
                        <div className="form-d">
                            <label className="control-label">Street 1</label>
                            <FormControl
                                type="text"
                                name="streetAddress1"
                                placeholder=""
                                value={this.billingAddress.streetAddress1}
                                onChange={this.onValueChangedBillingAddressData.bind(this)}
                            />
                        </div>
                    </div>

                    <div className="col-sm-6">
                        <div className="form-d">
                            <label className="control-label">Street 2</label>
                            <FormControl
                                type="text"
                                name="streetAddress2"
                                placeholder=""
                                value={this.billingAddress.streetAddress2}
                                onChange={this.onValueChangedBillingAddressData.bind(this)}
                            />
                        </div>
                    </div>

                    <div className="col-sm-6">
                        <div className="form-d">
                            <label className="control-label">City</label>
                            <FormControl
                                type="text"
                                name="city"
                                placeholder=""
                                value={this.billingAddress.city}
                                onChange={this.onValueChangedBillingAddressData.bind(this)}
                            />
                        </div>
                    </div>

                    <div className="col-sm-6">
                        <div className="form-d">
                            <label className="control-label">Zip Code</label>
                            <FormControl
                                type="text"
                                name="zipCode"
                                placeholder=""
                                value={this.billingAddress.zipCode}
                                onChange={this.onValueChangedBillingAddressData.bind(this)}
                            />
                        </div>
                    </div>

                    <div className="col-sm-6">
                        <div className="form-d">
                            <label className="control-label">Country</label>
                            <FormControl
                                type="text"
                                name="country"
                                placeholder=""
                                value={this.billingAddress.country}
                                onChange={this.onValueChangedBillingAddressData.bind(this)}
                            />
                        </div>
                    </div>

                    <div className="col-sm-6">
                        <div className="form-d">
                            <label className="control-label">State or Province</label>
                            <FormControl
                                type="text"
                                name="state"
                                placeholder=""
                                value={this.billingAddress.state}
                                onChange={this.onValueChangedBillingAddressData.bind(this)}
                            />
                        </div>
                    </div>

                </div>



            </Panel.Body>
        </Panel>
    </PanelGroup>

        </div> 
        </div>)
    }
    
}

const NewCustomerFormSchema = Yup.object().shape({

    email: Yup.string()
        .email('email is not valid')
        .required('Email is required'),

    firstName: Yup.string()
        .required('First Name is required'),

    lastName: Yup.string()
        .required('Last Name is required'),

    drivingLicenseId: Yup.string()
        .required('Driving License is required'),

    medicalId: Yup.string()
        .required('Medical Id is required'),

    customerType: Yup.string()
        .nullable()
        .required('Please Select a Group'),

});

export default NewCustomer;