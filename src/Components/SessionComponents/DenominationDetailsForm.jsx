import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import Button from '@material-ui/core/Button'

/* Material import */

/* Redux Imports */

/* Component Imports */;
import currencyTypes from '../../Global/PosFunctions/currencyTypes';
import getDenominationDetails from '../../Global/PosFunctions/getDenominationDetails'
import genericPostData from '../../Global/dataFetch/genericPostData';
import { connect } from 'react-redux'
import startSession from '../../Global/PosFunctions/startSession';
import getDenominationTotal from '../../Global/PosFunctions/getDenominationTotal';
import { commonActionCreater } from '../../Redux/commonAction';
import closeSession from '../../Global/PosFunctions/closeSession'; 

class DenominationDetailsForm extends React.Component {

    constructor() {
        super();
        this.state = {
            pennies: '',
            nickles: '',
            dimes: '',
            quaters: '',
            fifyCent: '',
            oneCoin: '',
            one: '',
            two: '',
            five: '',
            ten: '',
            twenty: '',
            fifty: '',
            hundred: '',
            amount: 0

        }
    }
    currentFocus = (fieldValue) => {
        this.setState({ currentFocus: fieldValue })
    }
    handleInputChange = num => event => {
        let currentFocus = this.state.currentFocus;
        let currenctFocusValue = this.state[currentFocus]
        if (num != '<') {
            currenctFocusValue = currenctFocusValue + num;
        }
        else {
            currenctFocusValue = ''
        }
        this.state[currentFocus] = currenctFocusValue;
        this.setState({
            [currentFocus]: currenctFocusValue,
            amount: getDenominationTotal(this.state)

        })
    }
    handleChange = name => event => {

        this.setState({
            [name]: event.target.value,
            amount: getDenominationTotal({...this.state,[name]: event.target.value})
        });
    };
    calculateTotalValue = (type) => {
        return type.value * (parseFloat(this.state[type.stateName]) || 0)
    }
    mapTablerows = () => {
        return currencyTypes.map((type) => {
            return (<tr>
                <td>{type.name}</td>
                <td>*</td>
                <td>
                    <input
                        autoFocus={type.id == 7 ? true : false}
                        onFocus={() => this.currentFocus(type.stateName)}
                        id={type.id}
                        type='number'
                        value={this.state[type.stateName]}
                        onChange={this.handleChange(type.stateName)}
                    />
                </td>
                <td>=</td>
                <td>{this.calculateTotalValue(type)}</td>
            </tr>)
        })

    };

    startNewSession = () => {
        startSession({
            dispatch: this.props.dispatch,
            handleSuccess: this.props.handleSuccessAddSession,
            handleError: this.handleError,
            stateObj: this.state,
            amount: this.state.amount
        })
        // closeSession({
        //     dispatch: this.props.dispatch,
        //     handleSuccess:this.handleSuccess,
        //     handleError:this.handleError,
        //     stateObj: this.state,
        //     amount: this.state.amount,
        //     reason:'some reason'
        // });
    }
    handleSuccess = (data) => {
        localStorage.setItem('sessionId', 'data.id')
        this.props.dispatch(commonActionCreater(true, 'SESSION_START_REDIRECT_TO_LOGIN'));
        this.props.history.push('/login');
    }
    handleError = (error) => {
    }

    setClosingBalnce = () => {
        this.props.setClosingBalnce(
            getDenominationDetails(this.state),
            this.state,
            this.state.amount);
        this.props.handleClose()
    }
    buttonDecider = () => {
        if (this.props.close) {
            return (<Button
                color='secondary'
                fullWidth
                variant='raised'
                onClick={this.setClosingBalnce}>
                Set Closing Balance
                </Button>)
        }

        else {
            return (<Button
                color='primary'
                variant='contained'
                fullWidth
                onClick={this.startNewSession}>
                Start New Session</Button>)
        }
    }
    componentDidMount(){
        if(this.props.stateDetails)
        {
        this.setState(this.props.stateDetails);
        }
    }
    render() {
        let extraClass = _get(this.props, 'location.pathname', '') == "/DenominationDetailsForm" ? 'session-parent' : ''
        return (
            <div className={`mui-container-fluid ${extraClass}`}>
                <div class="mui-row">
                    <div class="mui-col-md-6">
                        <table class="mui-table mui-table--bordered">
                            <thead>
                                <tr>
                                    <th>Coin/Bill Value</th>
                                    <th>*</th>
                                    <th>Number of Coins/Bills</th>
                                    <th>=</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.mapTablerows()}
                            </tbody>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>   <span className="bold">{this.state.amount}</span></td>
                            </tr>
                        </table>
                        {/* <div className="flex flex-row justify-space-between">
                       
                      
                        </div> */}
                    </div>

                    <div className="mui-col-md-6 numpad-box">
                        <div className="middle">
                            <div className='card numpad-card'>
                                <span className='card-title'>Numpad</span>
                                <div className='flex-row flex-wrap justify-center pt-15'>
                                    <div className='key small-key' onClick={this.handleInputChange('1')}>1</div>
                                    <div className='key small-key' onClick={this.handleInputChange('2')}>2</div>
                                    <div className='key small-key' onClick={this.handleInputChange('3')}>3</div>
                                    <div className='key small-key' onClick={this.handleInputChange('4')}>4</div>
                                    <div className='key small-key' onClick={this.handleInputChange('5')}>5</div>
                                    <div className='key small-key' onClick={this.handleInputChange('6')}>6</div>
                                    <div className='key small-key' onClick={this.handleInputChange('7')}>7</div>
                                    <div className='key small-key' onClick={this.handleInputChange('8')}>8</div>
                                    <div className='key small-key' onClick={this.handleInputChange('9')}>9</div>
                                    <div className='key small-key' onClick={this.handleInputChange('.')}>.</div>
                                    <div className='key small-key' onClick={this.handleInputChange('0')}>0</div>
                                    <div className='key small-key' onClick={this.handleInputChange('<')}>clr</div>
                                    <div className='small-key'></div>
                                    <div className='key big-key'>Enter</div>
                                </div>
                            </div>
                            <div className="flex flex-row justify-center mt-16">
                                {this.buttonDecider()}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps() {
    return {};
}

export default connect(mapStateToProps)(DenominationDetailsForm);

