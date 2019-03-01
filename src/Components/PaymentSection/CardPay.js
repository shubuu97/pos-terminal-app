import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close'

/* Redux Imports */

/* Component Imports */


class CardPay extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cardAmount:''
        }
    }
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
        this.props.handleKeyBoardValue('cardAmountValue',event.target.value)
    };
    componentWillReceiveProps(props){
        this.setState({cardAmount:props.value})
    }
    componentDidMount(){
        this.props.handleKeyBoardValue('cardAmountValue',this.props.initialValue)
    }

    render() {
        return (
            <div className="default-card-pay">
                <span>Card Pay</span>
                <div className="flex-row align-center justify-space-between">
                    <div style={{ width: '50%' }}>
                        <TextField
                        InputLabelProps={{ shrink: true }}
                            autoFocus
                            onFocus={() => this.props.currentFocus('cardAmount')}
                            id="outlined-name"
                            label="Amount"
                            type = "number"
                            value={this.state.cardAmount}
                            onChange={this.handleChange('cardAmount')}
                            margin="normal"
                            variant="outlined"
                        />
                    </div>
                    <span className="pay-button">
                        pay
              </span>
                    <CloseIcon
                        onClick={() => this.props.onRemovePaymentMethod('showCardPay')} />
                </div>
            </div>
        );
    }
}

export default CardPay;