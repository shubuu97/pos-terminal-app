import React from 'react';
import moment from "moment";
/* Lodash Imports */
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
/* Material import */
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
/* Redux Imports */
import { connect } from 'react-redux';
import { commonActionCreater } from '../../../Redux/commonAction'
/* Global Imports */
import genericPostData from '../../../Global/dataFetch/genericPostData';

/* Component Imports */
import { DatePicker } from 'material-ui-pickers';
import Dropzone from 'react-dropzone'

class CheckInForm extends React.Component {
    constructor() {
        super();
        this.state = {
            userType: 'Adult',
            loyaltyCheckbox: false,
            disableSubmit: true,
            isEdit: false,
            documentName: '',
            documentUrl: ''
        }
    }

    componentDidMount() {
        if (!_isEmpty(this.props.customerData)) {
            const { customerData } = this.props
            this.setState({
                isEdit: true,
                userType: _get(customerData, 'customer.customerType', 0) == 1 ? 'Medical' : 'Adult',
                customerId: _get(customerData, 'customer.id', ''),
                firstName: _get(customerData, 'customer.customer.firstName', ''),
                middleName: _get(customerData, 'customer.customer.middleName', ''),
                lastName: _get(customerData, 'customer.customer.lastName', ''),
                State: _get(customerData, 'customer.billingAddress.state', ''),
                dob: _get(customerData, 'customer.dob', ''),
                medCardNo: _get(customerData, 'customer.medicalLicenseNumber', ''),
                plantCount: _get(customerData, 'customer.plantCountLimit', ''),
                gramLimit: _get(customerData, 'customer.gramLimit', ''),
                loyaltyCheckbox: _get(customerData, 'customer.loyalty', ''),
                mmrExp: _get(customerData, 'customer.medicalLicenseExpiration', ''),
            })
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
        if (name == 'dob') {
            this.handleAgeValidation(date)
        }
    }

    clearFormValues = () => {
        this.setState({
            isEdit: false,
            userType: '',
            firstName: '',
            middleName: '',
            lastName: '',
            State: '',
            dob: moment(new Date()),
            medCardNo: '',
            plantCount: '',
            gramLimit: '',
            loyaltyCheckbox: false,
            mmrExp: ''
        })
    }

    handleAgeValidation = (date) => {
        let newDate = moment().diff(date, 'years')
        if (this.state.userType == 'Medical' && newDate < 18) {
            this.setState({ disableSubmit: true, ageError: true })
        }
        else if (this.state.userType == 'Adult' && newDate < 21) {
            this.setState({ disableSubmit: true, ageError: true })
        }
        else {
            this.setState({ disableSubmit: false, ageError: false })
        }
    }

    addCustomerMoveInQueue = async () => {
        let p1 = this.addCustomerForm()
        p1.then((data) => {
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
            loyalty: true,

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
            loyalty: _get(this.state, 'loyaltyCheckbox', false)
        }
        if (this.state.userType == 'Medical') {
            reqObj.customerType = 1
            reqObj.tempMedicalLicense = _get(this.state, 'medLicense', false)
            reqObj.medicalLicenseNumber = _get(this.state, 'medCardNo', '')
            reqObj.medicalLicenseExpiration = _get(this.state, 'mmrExp', '')
            reqObj.gramLimit = parseInt(_get(this.state, 'gramLimit', 0))
            reqObj.plantCountLimit = parseInt(_get(this.state, 'plantCount', 0))
            reqObj.attachments = [{
                name: _get(this.state,'documentName',''),
                url: _get(this.state,'documentUrl',''),
            }]
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
            this.clearFormValues()
            return data
        })
    }

    updateCustomer = () => {
        let reqObj = {
            retailerId: localStorage.getItem('retailerId'),
            id: _get(this.state, 'customerId', ''),
            customer: {
                firstName: _get(this.state, 'firstName', ''),
                middleName: _get(this.state, 'middleName', ''),
                lastName: _get(this.state, 'lastName', '')
            },
            billingAddress: {
                state: _get(this.state, 'State', '')
            },
            dob: _get(this.state, 'dob', ''),
            loyalty: _get(this.state, 'loyaltyCheckbox', false)
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
            url: 'Customer/Update',
            dontShowMessage: true,
            constants: {
                init: 'UPDATE_CANNABIS_CUSTOMER_INIT',
                success: 'UPDATE_CANNABIS_CUSTOMER_SUCCESS',
                error: 'UPDATE_CANNABIS_CUSTOMER_ERROR'
            },
            identifier: 'UPDATE_CANNABIS_CUSTOMER',
            successCb: (data) => { }
        }).then((data) => {
            debugger
            this.props.handleCancel(data)
            this.props.getQueueList()
            this.clearFormValues()
            return data
        })
    }

    handleFileUpload = (acceptedFiles) => {
        const file = acceptedFiles[0]
        this.setState({ file })
        const formData = new FormData();
        formData.append('file', file);

        return genericPostData({
            dispatch: this.props.dispatch,
            reqObj: formData,
            url: 'Upload/File',
            dontShowMessage: true,
            constants: {
                init: 'UPLOAD_IMAGE_INIT',
                success: 'UPLOAD_IMAGE_SUCCESS',
                error: 'UPLOAD_IMAGE_ERROR'
            },
            identifier: 'UPLOAD_IMAGE',
            successCb: (data) => { }
        }).then((data) => {
            this.setState({ documentUrl:  data.url, imageUploaded: true })
        })
    }

    render() {
        return (
            <div className='flex-column'>
                <div className='flex-row pl-10 pr-10 pt-10 justify-space-between align-center'>
                    <span className='sub-heading'>{this.state.isEdit ? 'Edit Customer' : 'Add New Customer'}</span>
                    <div className='flex-row'>
                        {this.state.isEdit ? '' : <span><Button
                            className='mr-10'
                            variant={this.state.userType == 'Medical' ? 'contained' : 'outlined'}
                            color="primary"
                            onClick={() => {
                                this.setState({ userType: 'Medical' }, () => {
                                    this.handleAgeValidation(this.state.dob)
                                })
                            }}
                        >
                            Medical
                        </Button>
                            <Button
                                variant={this.state.userType == 'Adult' ? 'contained' : 'outlined'}
                                color="primary"
                                onClick={() => {
                                    this.setState({ userType: 'Adult' }, () => {
                                        this.handleAgeValidation(this.state.dob)
                                    })
                                }}
                            >
                                Recreational
                        </Button></span>}
                    </div>
                </div>
                <div className='pad-10 flex-row flex-wrap justify-space-between'>
                    <TextField
                        id="outlined-name"
                        label="First Name"
                        value={this.state.firstName}
                        onChange={this.handleTextfieldChange('firstName')}
                        margin="normal"
                        variant="outlined"
                        style={{ width: '32%' }}
                    />
                    <TextField
                        id="outlined-name"
                        label="Middle Name"
                        value={this.state.middleName}
                        onChange={this.handleTextfieldChange('middleName')}
                        margin="normal"
                        variant="outlined"
                        style={{ width: '32%' }}
                    />
                    <TextField
                        id="outlined-name"
                        label="Last Name"
                        value={this.state.lastName}
                        onChange={this.handleTextfieldChange('lastName')}
                        margin="normal"
                        variant="outlined"
                        style={{ width: '32%' }}
                    />
                    <TextField
                        id="outlined-name"
                        label="State"
                        value={this.state.State}
                        onChange={this.handleTextfieldChange('State')}
                        margin="normal"
                        variant="outlined"
                        style={{ width: '48%' }}

                    />
                    <DatePicker
                        disableFuture
                        margin="normal"
                        label="Date of birth"
                        value={this.state.dob}
                        onChange={this.handleDateChange('dob')}
                        style={{ width: '48%' }}
                        variant="outlined"
                        //openTo="year"
                        format="MM/DD/YYYY"
                        error={this.state.ageError}
                    //views={["year", "month", "date"]}
                    />
                    <div class='flex-column checkbox-style'>
                        <span>Loyalty Program</span>
                        <div>
                            <Checkbox
                                checked={this.state.loyaltyCheckbox}
                                onChange={this.handleCheckboxChange('loyaltyCheckbox')}
                                value="loyaltyCheckbox"
                                color='secondary'
                            />
                            <span>Member</span>
                        </div>
                    </div>
                </div>
                {
                    this.state.userType == 'Medical' ?
                        <div className='pad-10 flex-row flex-wrap justify-space-between med-customer-form'>
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
                                //openTo="year"
                                format="MM/DD/YYYY"
                            //views={["year", "month", "date"]}
                            />
                            <TextField
                                id="outlined-name"
                                label="Plant Count"
                                type="number"
                                value={this.state.plantCount}
                                onChange={this.handleTextfieldChange('plantCount')}
                                margin="normal"
                                variant="outlined"
                                style={{ width: '48%' }}

                            />
                            <TextField
                                id="outlined-name"
                                label="Gram Limit"
                                type="number"
                                value={this.state.gramLimit}
                                onChange={this.handleTextfieldChange('gramLimit')}
                                margin="normal"
                                variant="outlined"
                                style={{ width: '48%' }}
                            />
                            {!this.state.isEdit ? <div><span style={{ display: 'flex', alignItems: 'center'}}>
                                <Dropzone onDrop={this.handleFileUpload}>
                                {({ getRootProps, getInputProps }) => (
                                    <section>
                                        <div {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            <Button variant="outlined" 
                                                style={{ height: "55px", width: "92%", marginRight: '20px'}} >
                                                Upload Document<CloudUploadIcon />
                                            </Button>
                                        </div>
                                    </section>
                                )}
                            </Dropzone>
                            <TextField
                                id="outlined-name"
                                label="Document Name"
                                type="text"
                                value={this.state.documentName}
                                onChange={this.handleTextfieldChange('documentName')}
                                margin="normal"
                                variant="outlined"
                                style={{ width: '48%' }}
                            />
                            <br />
                            
                            </span>
                            {this.state.imageUploaded ? 
                                <div>{_get(this.state,'file.name','')}</div> : ''
                            }
                            </div> : ''}
                        </div> : null
                }
                <div className='fwidth flex-row justify-flex-end form-actions '>
                    {/* <Button
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
                    </Button> */}
                    {!this.state.isEdit ? <Button
                        className='mr-10'
                        variant='contained'
                        color="primary"
                        disabled={this.state.disableSubmit}
                        onClick={this.addCustomerMoveInQueue}
                    >
                        Check In
                    </Button> :
                        <div>
                            <Button
                                className='mr-10'
                                variant='contained'
                                color="primary"
                                // disabled={this.state.disableSubmit}
                                onClick={()=>this.props.handleCancel(this.props.customerData)}
                            >
                                Cancel
                    </Button>
                            <Button
                                className='mr-10'
                                variant='contained'
                                color="primary"
                                // disabled={this.state.disableSubmit}
                                onClick={this.updateCustomer}
                            >
                                Save
                    </Button></div>}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {

}

export default connect(mapStateToProps)(CheckInForm);