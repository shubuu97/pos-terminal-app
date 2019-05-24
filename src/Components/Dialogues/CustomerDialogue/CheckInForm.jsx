import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
/* Redux Imports */

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
                        label="*Name"
                        value={this.state.name}
                        onChange={this.handleTextfieldChange('name')}
                        margin="normal"
                        variant="outlined"
                        fullWidth
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
                        value={this.state.selectedDate}
                        onChange={this.handleDateChange('selectedDate')}
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
                        //onClick={}
                    >
                        Reset
                    </Button>
                    <Button
                        className='mr-10'
                        variant='contained'
                        color="primary"
                        //onClick={}
                    >
                        Add
                    </Button>
                    <Button
                        className='mr-10'
                        variant='contained'
                        color="primary"
                        //onClick={}
                    >
                        Add & Check In
                    </Button>
                </div>





            </div>
        );
    }
}

export default CheckInForm;