import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close'

/* Redux Imports */

/* Component Imports */


class CardPay extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    render() {
        return (
            <div className="default-card-pay">
                <span>Card Pay</span>
                <div className="flex-row align-center justify-space-between">
                <div style={{width:'50%'}}>
                <TextField
                    id="outlined-name"
                    label="Refrence Number"
                    value={this.state.name}
                    onChange={this.handleChange('cardRefrenceNumber')}
                    margin="normal"
                    variant="outlined"
                />
                </div>
                <span className="pay-button">
                  pay
              </span>
                <CloseIcon/>
                </div>
            </div>
        );
    }
}

export default CardPay;