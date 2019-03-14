import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
/* Redux Imports */
import { connect } from 'react-redux';
import { commonActionCreater } from '../../../Redux/commonAction';

let regex = /^\d*[\.\d]+$/;

class CardPay extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }
    handleChange = name => event => {
        let value = event.target.value;
        if (regex.test(value)) {
            this.props.dispatch(commonActionCreater({ cardAmount: value, totalAmount: this.props.totalAmount }, 'CARD_INPUT_HANDLER'));
        }
        else if (regex.test(value.substring(0, value.length - 1))) {
            this.props.dispatch(commonActionCreater({ cardAmount: value.substring(0, value.length - 1), totalAmount: this.props.totalAmount }, 'CARD_INPUT_HANDLER'));

        }
        else {
            this.props.dispatch(commonActionCreater({ cardAmount: '', totalAmount: this.props.totalAmount }, 'CARD_INPUT_HANDLER'));
        }

    };
    componentDidMount() {
        //setting to the remaining amount
        this.props.dispatch(commonActionCreater({ cardAmount: this.props.remainingAmount, totalAmount: this.props.totalAmount }, 'CARD_INPUT_HANDLER'));
    }
    componentWillUnmount() {
        //setting to the 0 again on unmouning
        this.props.dispatch(commonActionCreater({ cardAmount: '', totalAmount: this.props.totalAmount }, 'CARD_INPUT_HANDLER'));

    }

    render() {
        return (
            <div className="default-card-pay">
                <span className='payment-title'>Card Pay</span>
                <div className="flex-row align-center justify-space-between relative">
                    <div style={{ width: '80%' }}>
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            autoFocus
                            onFocus={() => this.props.currentFocus({ fieldValue: 'cardAmount', handler: 'CARD_INPUT_HANDLER' })}
                            id="outlined-name"
                            label="Amount"
                            value={this.props.cardAmount}
                            onChange={this.handleChange('cardAmount')}
                            margin="normal"
                            variant="outlined"
                            fullWidth
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

function mapStateMapToProps(state) {
    let totalAmount = _get(state, 'cart.totalAmount');
    let cardAmount = _get(state, 'PaymentDetails.cardAmount');
    let remainingAmount = _get(state, 'PaymentDetails.remainingAmount')

    return { totalAmount, cardAmount, remainingAmount };
}

export default connect(mapStateMapToProps)(CardPay);