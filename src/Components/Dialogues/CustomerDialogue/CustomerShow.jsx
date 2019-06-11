import React, { Component } from 'react';
import _get from 'lodash/get';
import moment from 'moment';

class CustomerShow extends Component {
    constructor() {
        super();
        this.props = {

        }
    }

    render() {
        return (
            <div className='flex-row flex-wrap justify-space-between pt-20'>
                <div className='flex-column fwidth pt-215pb-10 '>
                    <span className='info-heading'>Name</span>
                    <span className='info-value'>{_get(this.props, 'customerData.customer.customer.firstName', '')} {_get(this.props, 'customerData.customer.customer.lastName', '')}</span>
                </div>
                <div className='flex-column halfwidth pt-15 pb-10'>
                    <span className='info-heading'>Age</span>
                    <span className='info-value'>{moment().diff(_get(this.props, 'customerData.customer.dob', 0), 'years')} yrs
                                                    </span>
                </div>
                <div className='flex-column halfwidth pt-15 pb-10'>
                    <span className='info-heading'>State</span>
                    <span className='info-value'>{_get(this.props, 'customerData.customer.billingAddress.state', '...')}</span>
                </div>
                <div className='flex-column halfwidth pt-15 pb-10'>
                    <span className='info-heading'>Med ID</span>
                    <span className='info-value'>{_get(this.props, 'customerData.customer.medicalLicenseNumber', '...')}</span>
                </div>
                <div className='flex-column halfwidth pt-15 pb-10'>
                    <span className='info-heading'>ID</span>
                    <span className='info-value'>{_get(this.props, 'customerData.customer.id', '...')}</span>
                </div>
                <div className='flex-column halfwidth pt-15 pb-10'>
                    <span className='info-heading'>Gram Limit</span>
                    <span className='info-value'>{_get(this.props, 'customerData.customer.gramLimit', '...')}</span>
                </div>
                <div className='flex-column halfwidth pt-15 pb-10'>
                    <span className='info-heading'>Plant Count Limit</span>
                    <span className='info-value'>{_get(this.props, 'customerData.customer.plantCountLimit', '...')}</span>
                </div>
            </div>
        )
    }
}

export default CustomerShow;