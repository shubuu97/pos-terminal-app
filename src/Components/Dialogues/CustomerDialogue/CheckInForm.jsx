import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
/* Redux Imports */
import { connect } from 'react-redux';
import { commonActionCreater } from '../../../Redux/commonAction'
/* Global Imports */
import genericPostData from '../../../Global/dataFetch/genericPostData';

/* Component Imports */
import { DatePicker } from 'material-ui-pickers';

class CheckInForm extends React.Component {

    constructor() {
        super();
        this.state = {
            userType: 'Adult',
            loyaltyCheckbox: false,
        }
    }

    handleTextfieldChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleCheckboxChange = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    handleDateChange = name => date => {
        this.setState({ [name]: date });
    };

    resetForm = () => {

    }

    addCustomerMoveInQueue = async () => {
        let p1 =  this.addCustomerForm()
        p1.then((data)=>{
            let customer = {
                value: data
            }
            this.props.addCustomerToQueue(customer)
        })
    }

    addCustomerForm = async () => {
        let fullCustomerObj = {
            retailerId: localStorage.getItem(''),
            customer: {
                firstName: '',
                middleName: '',
                lastName: ''
            },
            email: '',
            billingAddress: {
                addressLine1: '',
                addressLine2: '',
                city: '',
                state: '',
                country: '',
                postalCode: '',
            },
            phoneNumber: {
                countryCode: 1,
                phoneNumber: 0,
            },
            rewardPoints: 0,
            guest: false,

            //Cannabis Attributes
            customerType: 1, // MEDICAL = 1; ADULT = 2;
            gender: 1, // Male=1; Female=2; Other=3
            dob: '', // MM/DD/YYYY format string

            //MEDICAL CANNABIS CUSTOMER
            tempMedicalLicense: true,
            medicalLicenseNumber: '',
            medicalLicenseExpiration: '', // MM/DD/YYYY format string
            gramLimit: 0,
            plantCountLimit: 0,
            taxExempt: true,
            attachments: [
                {
                    name: 1,
                    url: 2,
                    info: 3,
                }
            ],
            age: 0,
        }

        let reqObj = {
            retailerId: localStorage.getItem('retailerId'),
            customer: {
                firstName: _get(this.state, 'firstName', ''),
                middleName: _get(this.state, 'middleName', ''),
                lastName: _get(this.state, 'lastName', '')
            },
            billingAddress: {
                state: _get(this.state, 'State', '')
            },
            dob: _get(this.state, 'dob', ''),
        }
        if (this.state.userType == 'Medical') {
            reqObj.customerType = 1
            reqObj.tempMedicalLicense = _get(this.state, 'medLicense', false)
            reqObj.medicalLicenseNumber = _get(this.state, 'medCardNo', '')
            reqObj.medicalLicenseExpiration = _get(this.state, 'mmrExp', '')
            reqObj.gramLimit = parseInt(_get(this.state, 'gramLimit', 0))
            reqObj.plantCountLimit = parseInt(_get(this.state, 'plantCount', 0))
        }
        else {
            reqObj.customerType = 2
        }

        return genericPostData({
            dispatch: this.props.dispatch,
            reqObj,
            url: 'Customer/Create',
            dontShowMessage: true,
            constants: {
                init: 'ADD_NEW_CANNABIS_CUSTOMER_INIT',
                success: 'ADD_NEW_CANNABIS_CUSTOMER_SUCCESS',
                error: 'ADD_NEW_CANNABIS_CUSTOMER_ERROR'
            },
            identifier: 'ADD_NEW_CANNABIS_CUSTOMER',
            successCb: (data) => { }
        }).then((data) => {
            return data
        })

    }



    render() {
        return (
            <div className='flex-column'>
                <div className='flex-row pl-10 pr-10 pt-10 justify-space-between align-center'>
                    <span className='sub-heading'>Add New Customer</span>
                    <div className='flex-row'>
                        <Button
                            className='mr-10'
                            variant={this.state.userType == 'Medical' ? 'contained' : 'outlined'}
                            color="primary"
                            onClick={() => { this.setState({ userType: 'Medical' }) }}
                        >
                            Medical
                        </Button>

                        <Button
                            variant={this.state.userType == 'Adult' ? 'contained' : 'outlined'}
                            color="primary"
                            onClick={() => { this.setState({ userType: 'Adult' }) }}
                        >
                            Adult
                        </Button>
                    </div>
                </div>

                <div className='pad-10 flex-row flex-wrap justify-space-between'>
                    <TextField
                        id="outlined-name"
                        label="*First Name"
                        value={this.state.firstName}
                        onChange={this.handleTextfieldChange('firstName')}
                        margin="normal"
                        variant="outlined"
                        style={{ width: '32%' }}
                    />
                    <TextField
                        id="outlined-name"
                        label="*Middle Name"
                        value={this.state.middleName}
                        onChange={this.handleTextfieldChange('middleName')}
                        margin="normal"
                        variant="outlined"
                        style={{ width: '32%' }}
                    />
                    <TextField
                        id="outlined-name"
                        label="*Last Name"
                        value={this.state.lastName}
                        onChange={this.handleTextfieldChange('lastName')}
                        margin="normal"
                        variant="outlined"
                        style={{ width: '32%' }}
                    />
                    <TextField
                        id="outlined-name"
                        label="*State"
                        value={this.state.State}
                        onChange={this.handleTextfieldChange('State')}
                        margin="normal"
                        variant="outlined"
                        style={{ width: '48%' }}

                    />
                    <DatePicker
                        disableFuture
                        margin="normal"
                        label="*Date of birth"
                        value={this.state.dob}
                        onChange={this.handleDateChange('dob')}
                        style={{ width: '48%' }}
                        variant="outlined"
                        openTo="year"
                        format="DD/MM/YYYY"
                        views={["year", "month", "date"]}
                    />

                    <div class='flex-column checkbox-style'>
                        <span>Loyalty Program</span>
                        <div>
                            <Checkbox
                                checked={this.state.loyaltyCheckbox}
                                onChange={this.handleCheckboxChange('loyaltyCheckbox')}
                                value="loyaltyCheckbox"
                            />
                            <span>Member</span>
                        </div>
                    </div>
                </div>


                {
                    this.state.userType == 'Medical' ?
                        <div className='pad-10 flex-row flex-wrap justify-space-between med-customer-form'>

                            <div class='flex-column checkbox-style'>
                                <span>Med License/Card</span>
                                <div>
                                    <Checkbox
                                        checked={this.state.medLicense}
                                        onChange={this.handleCheckboxChange('medLicense')}
                                        value="medLicense"
                                    />
                                    <span>Temporary</span>
                                </div>
                            </div>

                            <TextField
                                id="outlined-name"
                                label="Med Card Number"
                                value={this.state.medCardNo}
                                onChange={this.handleTextfieldChange('medCardNo')}
                                margin="normal"
                                variant="outlined"
                                style={{ width: '48%' }}
                            />
                            <DatePicker
                                margin="normal"
                                label="MMR Card Expiration"
                                value={this.state.mmrExp}
                                onChange={this.handleDateChange('mmrExp')}
                                style={{ width: '48%' }}
                                variant="outlined"
                                openTo="year"
                                format="DD/MM/YYYY"
                                views={["year", "month", "date"]}
                            />
                            <TextField
                                id="outlined-name"
                                label="*Plant Count"
                                type="number"
                                value={this.state.plantCount}
                                onChange={this.handleTextfieldChange('plantCount')}
                                margin="normal"
                                variant="outlined"
                                style={{ width: '48%' }}

                            />
                            <TextField
                                id="outlined-name"
                                label="*Gram Limit"
                                type="number"
                                value={this.state.gramLimit}
                                onChange={this.handleTextfieldChange('gramLimit')}
                                margin="normal"
                                variant="outlined"
                                style={{ width: '48%' }}
                            />
                            <div class='flex-column checkbox-style'>
                                <span>Primary Med Customer</span>
                                <div>
                                    <Checkbox
                                        checked={this.state.primaryMed}
                                        onChange={this.handleCheckboxChange('primaryMed')}
                                        value="primaryMed"
                                        color='primary'
                                    />
                                    <span>Yes, they're Primary</span>
                                </div>
                            </div>
                        </div> : null
                }

                <div className='fwidth flex-row justify-flex-end form-actions '>
                    <Button
                        className='mr-10'
                        variant='outlined'
                        color="error"
                        onClick={this.resetForm}
                    >
                        Reset
                    </Button>
                    <Button
                        className='mr-10'
                        variant='contained'
                        color="primary"
                        onClick={this.addCustomerForm}
                    >
                        Add
                    </Button>
                    <Button
                        className='mr-10'
                        variant='contained'
                        color="primary"
                        onClick={this.addCustomerMoveInQueue}
                    >
                        Add & Check In
                    </Button>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    
}

export default connect(mapStateToProps)(CheckInForm);