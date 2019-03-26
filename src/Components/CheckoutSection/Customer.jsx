import React from 'react';
// Action Import
import { commonActionCreater } from '../../Redux/commonAction';
// Global Import
import axiosFetcher from '../../Global/dataFetch/axiosFetcher';
// Redux Form Imports
import { reduxForm, Field, FormSection } from 'redux-form';
// MaterialUi Imports
import GlobalTextField from '../../Global/Components/GlobalTextField'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { fetchAddressFromZip } from '../../actions/common';
import {connect} from 'react-redux';

// const styles = {
//     Dialog: {
//       position: 'relative',
//       width: '80%'
//     },
//     flex: {
//       flex: 1,
//     },
//   };

const DialogTitle = withStyles(theme => ({
    root: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing.unit * 2,
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing.unit,
        top: theme.spacing.unit,
        color: theme.palette.grey[500],
    },
}))(props => {
    const { children, classes, onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

class Customer extends React.Component {

    formSubmitHandler = (values) => {
        let retailerId = localStorage.getItem('retailerId');
        values.retailerId = retailerId
        axiosFetcher({
            method: 'POST',
            url: 'Customer/Create',
            reqObj: values,
            successCb: this.handleAddCustomerSuccess,
            errorCb: this.handleAddCustomerError
        })
    }

    handleAddCustomerSuccess = (customerData) => {
        this.props.dispatch(commonActionCreater(customerData.data, 'ADD_CUSTOMER_TO_CART'))
        this.props.closeModal()
    }

    handleAddCustomerError = (err) => {
        // Alert('Error Occured in Saving Customer, Please Try Again')
    }

    handleClickOpen = () => {
        this.setState({ open: true })
    }

    handleZipCode = (data, postalCode) => {
        let reqObj = {
            zipCode: postalCode,
            countryShortCode: "US"
        }
        this.props.dispatch(fetchAddressFromZip('', reqObj))
    }

    componentWillReceiveProps(props) {
        if(props.type == "RECEIVED_ADDRESS_FROM_ZIP") {
            if(props.status == 200) {
                const { city, state, country } = props.addressData
                props.autofill('billingAddress.city', city);
                props.autofill('billingAddress.state', state);
                props.autofill('billingAddress.country', country);
            
            } 
        } else if(props.type == "RECEIVED_ADDRESS_FROM_ZIP_ERROR") {
            props.autofill('billingAddress.city', '');
            props.autofill('billingAddress.state', '');
            props.autofill('billingAddress.country', '');
        }
    }

    render() {
        let { handleSubmit, fullScreen } = this.props;
        return (
            <div>
                <Dialog
                    fullWidth='100%'
                    open={this.props.open}
                    onClose={this.props.closeModal}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="customized-dialog-title" onClose={this.props.handleClose}>
                        Create Customer
                    </DialogTitle>
                    <DialogContent>
                        <form onSubmit={handleSubmit(this.formSubmitHandler)}>
                            <FormSection name='customer'>
                            <div className="mui-row">
                            <div className="mui-col-md-4">
                                <Field
                                    label="First Name"
                                    name="firstName"
                                    component={GlobalTextField}
                                    variant="outlined"
                                    fullWidth="true"
                                    margin='normal'
                                />
                                </div>
                                 <div className="mui-col-md-4">
                                <Field
                                    label="Middle Name"
                                    name="middleName"
                                    component={GlobalTextField}
                                    variant="outlined"
                                    fullWidth="true"
                                    margin='normal'

                                />
                                </div>
                                 <div className="mui-col-md-4">
                                <Field
                                    label="Last Name"
                                    name="lastName"
                                    component={GlobalTextField}
                                    variant="outlined"
                                    fullWidth="true"
                                    margin='normal'
                                />
                                </div>
                                </div>
                            </FormSection>
                            <Field
                                label="Email"
                                name="email"
                                component={GlobalTextField}
                                variant="outlined"
                                fullWidth="true"
                                margin='normal'

                            />

                            <FormSection name="phoneNumber">
                            <div className="mui-row">
                            <div className="mui-col-md-6">
                                <Field
                                    label="Country Code"
                                    name="countryCode"
                                    type="number"
                                    parse={value => parseInt(value, 10)}
                                    component={GlobalTextField}
                                    variant="outlined"
                                    fullWidth="true"
                                    margin='normal'

                                />
                                </div>
                                <div className="mui-col-md-6">
                                <Field
                                    label="Phone No"
                                    name="phoneNumber"
                                    type="number"
                                    parse={value => parseInt(value, 10)}
                                    component={GlobalTextField}
                                    variant="outlined"
                                    fullWidth="true"
                                    margin='normal'

                                />
                                </div>
                                </div>
                            </FormSection>


                            <FormSection name='billingAddress'>
                                <Field
                                    label="Address Line 1"
                                    name="addressLine1"
                                    component={GlobalTextField}
                                    variant="outlined"
                                    fullWidth="true"
                                    margin='normal'

                                />
                                <Field
                                    label="Address Line 2"
                                    name="addressLine2"
                                    component={GlobalTextField}
                                    variant="outlined"
                                    fullWidth="true"
                                    margin='normal'

                                />
                                 <div className="mui-row">
                                 <div className="mui-col-md-6">
                                    <Field
                                        label="Postal Code"
                                        name="postalCode"
                                        component={GlobalTextField}
                                        variant="outlined"
                                        fullWidth="true"
                                        margin='normal'
                                        onBlur={(data, postalCode) => this.handleZipCode(data, postalCode)} 
                                    />
                                </div>
                                <div className="mui-col-md-6">
                                    <Field
                                        label="City"
                                        name="city"
                                        component={GlobalTextField}
                                        variant="outlined"
                                        fullWidth="true"
                                        margin='normal'

                                    />
                                </div>
                                </div>
                                <div className="mui-row">
                                    <div className="mui-col-md-6">
                                        <Field
                                            label="State"
                                            name="state"
                                            component={GlobalTextField}
                                            variant="outlined"
                                            fullWidth="true"
                                            margin='normal'
                                        />
                                    </div>
                                    <div className="mui-col-md-6">
                                        <Field
                                            label="Country"
                                            name="country"
                                            component={GlobalTextField}
                                            variant="outlined"
                                            fullWidth="true"
                                            margin='normal'

                                        />
                                    </div>
                                    
                                </div>
                            </FormSection>
                          
                            <DialogActions>
                            
                                <Button onClick={this.props.closeModal} className='btnmodalsecondary' variant="outlined">
                                    Cancel
                                </Button>
                                <Button type="submit" className='btnmodalprimary' variant="outlined">
                                    Save
                                </Button>
                            
                            </DialogActions>
                           
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}

Customer = reduxForm({
    form: 'CustomerForm',
    destroyOnUnmount: true
})(Customer)

const mapStateToProps = state => {
    const { zipCodeReducer } = state
    const {addressData, type, status } = zipCodeReducer || {}
    return {
        addressData,
        type,
        status
    }
}

export default connect(mapStateToProps)(Customer);