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
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';

// const styles = {
//     Dialog: {
//       position: 'relative',
//       width: '80%'
//     },
//     flex: {
//       flex: 1,
//     },
//   };

class Customer extends React.Component {

  formSubmitHandler = (values) => {
    let retailerId = localStorage.getItem('retailerId');
    values.retailerId = retailerId
    values.phoneNumber = {}
    values.phoneNumber.countryCode = 91
    values.phoneNumber.phoneNumber = Number(values.phone)
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
  }

  handleAddCustomerError = (err) => {
      console.log(err, 'add customer error')
  }

  handleClickOpen = () => {
      this.setState({ open: true})
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
            <DialogTitle id="form-dialog-title">Create Customer</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(this.formSubmitHandler)}>
                    <FormSection name='customer'>
                        <Field
                            label="First Name"
                            placeholder="First Name"
                            name="firstName"
                            component={GlobalTextField}
                            variant="outlined"
                            fullWidth="true"
                        />
                        
                        <Field
                            label="Middle Name"
                            placeholder="Middle Name"
                            name="middleName"
                            component={GlobalTextField}
                            variant="outlined"
                            fullWidth="true"
                        />
                        <Field
                            label="Last Name"
                            placeholder="Last Name"
                            name="lastName"
                            component={GlobalTextField}
                            variant="outlined"
                            fullWidth="true"
                        />
                    </FormSection>
                        <Field
                            label="Email"
                            placeholder="Email"
                            name="email"
                            component={GlobalTextField}
                            variant="outlined"
                            fullWidth="true"
                        />
                        <Field
                            label="Phone No"
                            placeholder="Phone No"
                            name="phone"
                            type="number"
                            component={GlobalTextField}
                            variant="outlined"
                            fullWidth="true"
                        />
                    <FormSection name='billingAddress'>
                        <Field
                            label="Address Line 1"
                            placeholder="Address Line 1"
                            name="addressLine1"
                            component={GlobalTextField}
                            variant="outlined"
                            fullWidth="true"
                        />
                        <Field
                            label="Address Line 2"
                            placeholder="Address Line 2"
                            name="addressLine2"
                            component={GlobalTextField}
                            variant="outlined"
                            fullWidth="true"
                        />
                        <Field
                            label="City"
                            placeholder="City"
                            name="city"
                            component={GlobalTextField}
                            variant="outlined"
                            fullWidth="true"
                        />
                        <Field
                            label="State"
                            placeholder="State"
                            name="state"
                            component={GlobalTextField}
                            variant="outlined"
                            fullWidth="true"
                        />
                        <Field
                            label="Country"
                            placeholder="Country"
                            name="country"
                            component={GlobalTextField}
                            variant="outlined"
                            fullWidth="true"
                        />
                        <Field
                            label="Postal Code"
                            placeholder="Postal Code"
                            name="postalCode"
                            component={GlobalTextField}
                            variant="outlined"
                            fullWidth="true"
                        />
                    </FormSection>
                    <DialogActions>
                        <Button onClick={this.props.closeModal} color="primary">
                            Cancel
                        </Button>
                        <Button type="submit" onClick={this.props.closeModal} color="primary">
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
    form: 'CustomerForm'
})(Customer)

export default Customer;