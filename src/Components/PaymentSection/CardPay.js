import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';
import { commonActionCreater } from '../../Redux/commonAction';

/* Redux Imports */

/* Component Imports */


class CardPay extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
        this.props.dispatch(commonActionCreater({cardAmount:event.target.value,totalAmount:this.props.totalAmount},'CARD_INPUT_HANDLER'));

    };
    componentDidMount(){
        //setting to the remaining amount
        this.props.dispatch(commonActionCreater({cardAmount:this.props.remainingAmount,totalAmount:this.props.totalAmount},'CARD_INPUT_HANDLER'));
    }
    componentWillUnmount(){
        debugger;
        //setting to the 0 again on unmouning
        this.props.dispatch(commonActionCreater({cardAmount:'',totalAmount:this.props.totalAmount},'CARD_INPUT_HANDLER'));

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
                            onFocus={() => this.props.currentFocus({fieldValue:'cardAmount',handler:'CARD_INPUT_HANDLER'})}
                            id="outlined-name"
                            label="Amount"
                            value={this.props.cardAmount}
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

function mapStateMapToProps(state){
    let totalAmount = _get(state,'cart.totalAmount');
    let cardAmount = _get(state,'PaymentDetails.cardAmount');
    let remainingAmount = _get(state,'PaymentDetails.remainingAmount')

    return {totalAmount,cardAmount,remainingAmount};
}

export default connect(mapStateMapToProps)(CardPay);