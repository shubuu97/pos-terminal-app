import React, { Component } from 'react';
import _get from 'lodash/get';
/* Material Imports*/
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';

import Radio from '@material-ui/core/Radio';
/* Redux Imports */


class RadioBoxFilter extends Component {

    constructor() {
        super();
        this.state = {
            value: ''
        }
    }

    populateRadiobox = () => {
        let checboxArr = _get(this, "props.data.values", [])
        let filterCheckbox = []
        filterCheckbox = checboxArr.map((data, index) => {
            return (
                <FormControlLabel
                    control={
                        <Radio
                            checked={this.state[this.props.data.name]}
                            onChange={this.handleChange()}
                            value={data}
                            name={this.props.data.name}
                        // aria-label={`${index}`}
                        />
                    }
                    label={data}
                />
            )
        })

        return filterCheckbox
    }

    handleChange = event => {
        this.setState({ value: event.target.value });
        this.props.filterUpdationHandler(event.target.value, this.props.data.name,this.props.data.keyname, "radio")
    };

    render() {
        console.log("Filter Data Type - ", this.props.data.type, this.props.data)
        let radioboxArr = _get(this, "props.data.values", [])
        return (
            <div className="mt-10">
                <RadioGroup
                    aria-label={this.props.data.name}
                    name={this.props.data.name}
                    value={this.state.value}
                    onChange={this.handleChange}
                >
                    {radioboxArr.map((data, index) => (
                        <FormControlLabel
                            key={index}
                            disabled={this.props.disabled}
                            value={radioboxArr[index]}
                            control={<Radio />}
                            label={data} />
                    ))}

                </RadioGroup>
            </div>
        )
    }
}

export default RadioBoxFilter;