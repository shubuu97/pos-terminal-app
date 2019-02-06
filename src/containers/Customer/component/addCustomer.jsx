import React from 'react';
//formik import
import { Formik } from 'formik';
import ReactDrawer from 'react-drawer';
import _set from 'lodash/set';
import Panel from 'react-bootstrap/lib/Panel';
import _get from 'lodash/get';
import FormControl from "react-bootstrap/lib/FormControl";
import { fetchAddressFromZip } from '../../../actions/common';
import PanelGroup from 'react-bootstrap/lib/PanelGroup';
import SaveButton from "../../../components/common/SaveButton.jsx";
import { GenericInput } from '../../../components/common/TextValidation.jsx';
import drawer_close from '../../../assets/images/close.png';
import _find from 'lodash/find';
import { postCustomerRegistrationData} from '../../../actions/products';



//yup import
import Yup from 'yup';
export default class AddCustomer extends React.Component
{
constructor(props)
{
    super(props)
    this.state = {openCustomer:false};
    this.customerData = {};
    this.billingAddress = {};


}
onValueChangedCustomerData = (props, event) => {
    debugger;

    if (props.handleChange)
        props.handleChange(event);
    _set(this.customerData, event.target.name, event.target.value);
    if (event.target.name === 'firstName' || event.target.name === 'lastName') {
        _set(this.billingAddress, event.target.name, event.target.value);
    }

    this.forceUpdate();
}

onValueChangedBillingAddressData = (event) => {

    if (event.target.name == "zipCode") {
        let zipCode = parseInt(event.target.value);
        _set(this.billingAddress, event.target.name, zipCode);

    }
    else {
        _set(this.billingAddress, event.target.name, event.target.value);
    }

    this.forceUpdate();
}
handleAddressBlur = (event) => {
    if (event.target.name == "zipCode") {
        let zipCode = parseInt(event.target.value);
        // _set(this.billingAddress, event.target.name, zipCode);
        const { dispatch, commonsReducer } = this.props;
        this.getAddressFlag = true;
        dispatch(fetchAddressFromZip(commonsReducer, zipCode));
    }
}

handleSelectChange = (id, name, props) => {
    // let customerArray = _find(this.customerType.data, {'value':id})
    _set(this.customerData, name, id);
    props.setValues(this.customerData);
    props.validateForm();
    this.forceUpdate();
}

blurHandler = (props, name, event) => {
    _set(props.touched, name, true);
    this.forceUpdate();
}
toggleClass() {
    this.setState({ subscribeToNewsLetter: !this.state.subscribeToNewsLetter });
    _set(this.customerData, "subscribeNewsLetter", this.state.subscribeToNewsLetter);
};
handlerSave = event => {

    const { dispatch, productReducer } = this.props;
    this.customerName = this.customerData.firstName + " " + this.customerData.lastName;
    this.customerTypeValue = _find(this.customerType.data, { 'value': this.customerData.customerType })
    _set(this.customerData, "salesExecutive", localStorage.getItem('userId'));
    _set(this.customerData, "customerType", this.customerTypeValue.displayText);
    const customerFullData = Object.assign({}, this.customerData, { billingAddress: this.billingAddress });
    const data = Object.assign({}, customerFullData)
    this.customerSubmitted = true;
    dispatch(postCustomerRegistrationData(data, productReducer));
    this.setState({ openCustomer: !this.state.openCustomer });
    this.customerDataForShow = { ...this.customerData };
    this.customerBillingAddress = { ...this.billingAddress };
    this.customerData = {};
    this.billingAddress = {};

}
render()
{
return(<div className="right-drawer">


    <h2>{!this.showCustomerHistory ? 'New Customer' : ''} <a onClick={this.onDrawerCloseCustomer} className="drawer-close"><img src={drawer_close} /></a></h2>

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
                    {!this.showCustomerHistory &&
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
                    }



                    <div className="row d-flex">
                        <div className="col-sm-6">
                            <div className="form-d">
                                <label className="control-label">First Name <em>*</em></label>
                                <GenericInput
                                    htmlFor="password" displayName="First Name"
                                    inputName="firstName" defaultValue={_get(this.customerData, 'firstName', '')}
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
                                    inputName="middleName" defaultValue={_get(this.customerData, 'middleName', '')}
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
                                    inputName="lastName" defaultValue={_get(this.customerData, 'lastName', '')}
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
                                    inputName="email" defaultValue={_get(this.customerData, 'email', '')}
                                    onChange={this.onValueChangedCustomerData.bind(this, props)}
                                    onBlur={props.handleBlur} errorMessage={props.errors.email}
                                    error={props.errors} errorValue={props.errors.email} className="text-input error"
                                    touched={props.touched} touchedValue={props.touched.email}
                                />
                            </div>
                        </div>

                        {/* <div className="col-sm-6 nc-drop">
                            <div className="form-d">
                                <label className="control-label">Chose group <em>*</em></label>
                                <AutoComplete
                                    type="single" name="customerType"
                                    placeholder="Chose group"
                                    id={'choseGroup'}
                                    data={_get(this.customerType, 'data', [])}
                                    value={_get(this.customerData, 'customerType', '')}
                                    changeHandler={(id) => { this.handleSelectChange(id, "customerType", props) }}
                                    errorCheck={true}
                                    errorMessage={props.errors.customerType}
                                    error={props.errors} errorValue={props.errors.customerType}
                                    className="text-input error"
                                    touched={props.touched} touchedValue={props.touched.customerType}
                                    blurHandler={this.blurHandler.bind(this, props, 'customerType')}
                                />
                            </div>
                        </div> */}

                        <div className="col-sm-6">
                            <div className="form-d">
                                <label className="control-label">Driving License ID <em>*</em></label>
                                <GenericInput
                                    htmlFor="drivingLicenseId" displayName="Driving License"
                                    inputName="drivingLicenseId" defaultValue={_get(this.customerData, 'drivingLicenseId', '')}
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
                                    inputName="medicalId" defaultValue={_get(this.customerData, 'medicalId', '')}
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
                                <input type="checkbox" value={_get(this.customerData, 'subscribeNewsletter', false)} />
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
                                    value={_get(this.billingAddress, 'firstName', '')}
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
                                    value={_get(this.billingAddress, 'lastName', '')}
                                    onChange={this.onValueChangedBillingAddressData.bind(this)}
                                />
                            </div>
                        </div>

                        {/* <div className="col-sm-6">
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
                        </div> */}

                        <div className="col-sm-6">
                            <div className="form-d">
                                <label className="control-label">Phone</label>
                                <FormControl
                                    type="text"
                                    name="phone"
                                    placeholder=""
                                    value={_get(this.billingAddress, 'phone', '')}
                                    onChange={this.onValueChangedBillingAddressData.bind(this)}
                                />
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="form-d">
                                <label className="control-label">Zip Code</label>
                                <FormControl
                                    type="number"
                                    name="zipCode"
                                    placeholder=""
                                    value={_get(this.billingAddress, 'zipCode', '')}
                                    onBlur={this.handleAddressBlur}
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
                                    value={_get(this.billingAddress, 'streetAddress1', '')}
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
                                    value={_get(this.billingAddress, 'streetAddress2', '')}
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
                                    value={_get(this.billingAddress, 'city', '')}
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
                                    value={_get(this.billingAddress, 'country', '')}
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
                                    value={_get(this.billingAddress, 'state', '')}
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