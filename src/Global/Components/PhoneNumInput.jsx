import React, { Component } from 'react';
import { render } from 'react-dom';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input';
import _get from 'lodash/get';

class PhoneNumInput extends Component {
    constructor() {
        super();
        this.state = {
            phone: ''
        };
    }

    render() {
        return (
            <div>
                <PhoneInput
                    country="US"
                    placeholder="Enter Phone Number"
                    error={_get(this.props,'meta.error')}
                    value={this.props.input.value}
                    onChange={(phone)=>this.props.input.onChange(phone)}
                />
            </div>
        );
    }
}

export default PhoneNumInput