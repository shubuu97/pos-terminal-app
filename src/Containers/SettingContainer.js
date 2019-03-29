import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch'
/* Redux Imports */

/* Component Imports */


class SettingContainer extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }
    handleChange = name => event => {
        if (event.target.checked) {
            localStorage.setItem("showOutOfStock", "true");
            this.props.getProductData();

        }
        else {
            localStorage.setItem("showOutOfStock", "false");
            this.props.getProductData() 

        }
        this.setState({ [name]: event.target.checked });

    };


    render() {
        return (
            <div className="mui-container">
                <FormGroup row>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={localStorage.getItem("showOutOfStock") == "true" ? true : false}
                                onChange={this.handleChange('showOutOfStock')}
                                value="showOutOfStock"
                            />
                        }
                        label="Show Out Of Stock Products"
                    />
                </FormGroup>

            </div>
        );
    }
}

export default SettingContainer;