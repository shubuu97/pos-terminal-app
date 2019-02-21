import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import Button from '@material-ui/core/Button'

/* Material import */

/* Redux Imports */

/* Component Imports */;
const denominationTypes = [{
    id: 1,
    name: "Pennies",
    stateName: 'pennies',
    value: 0.01
}, {
    id: 2,
    name: "Nickles",
    stateName: 'nickles',
    value: 0.05
},
{
    id: 3,
    name: "Dimes",
    stateName: 'dimes',
    value: 0.1
},
{
    id: 4,
    name: "Quarters",
    stateName: 'quaters',
    value: 0.25
},
{
    id: 5,
    name: "Fifty Cent",
    stateName: 'fifyCent',
    value: 0.5
},
{
    id: 6,
    name: "1 Dollar Coin",
    stateName: 'oneCoin',
    value: 1
},
{
    id: 7,
    name: "$1 Bill",
    stateName: 'one',
    value: 1
},
{
    id: 8,
    name: "$2 Bill",
    stateName: 'two',
    value: 2
}, {
    id: 9,
    name: "$5 Bill",
    stateName: 'five',
    value: 5
}, {
    id: 10,
    name: "$10 Bill",
    stateName: 'ten',
    value: 10
}, {
    id: 11,
    name: "$20 Bill",
    stateName: 'twenty',
    value: 20
}, {
    id: 12,
    name: "$50 Bill",
    stateName: 'fifty',
    value: 50
}, {
    id: 13,
    name: "$100 Bill",
    stateName: 'hundred',
    value: 100
}];


class DenominationDetailsForm extends React.Component {

    constructor() {
        super();
        this.state = {
            pennies:'',
            nickles:'',
            dimes:'',
            quaters:'',
            fifyCent:'',
            oneCoin:'',
            one:'',
            two:'',
            five:'',
            ten:'',
            twenty:'',
            fifty:'',
            hundred:''

        }
    }
    currentFocus = (fieldValue) => {
        this.setState({ currentFocus: fieldValue })
    }
    handleInputChange = num => event => {
        debugger;
        let currentFocus = this.state.currentFocus;
        let currenctFocusValue = this.state[currentFocus]
        if (num != '<') {
            currenctFocusValue = currenctFocusValue + num;
        }
        else {
            currenctFocusValue = ''
        }

        this.setState({
            [currentFocus]: currenctFocusValue,
        })
    }
    handleChange = name => event => {

        this.setState({
            [name]: event.target.value,
        });
    };
    calculateTotalValue = (type)=>{
        return type.value*(parseFloat(this.state[type.stateName])||0)
    }
    mapTablerows = () => {

        return denominationTypes.map((type) => {
            return (<tr>
                <td>{type.name}</td>
                <td>*</td>
                <td> 
                    <input
                    autoFocus = {type.id==7?true:false}
                    onFocus={() => this.currentFocus(type.stateName)}
                    id={type.id}
                    value={this.state[type.stateName]}
                    onChange={this.handleChange(type.stateName)} 
                />
                </td>
                <td>=</td>
                <td>{this.calculateTotalValue(type)}</td>
            </tr>)
        })

    }
    startNewSession = ()=>{

    }
    render() {
       let extraClass =  _get(this.props,'location.pathname','')=="/DenominationDetailsForm"?'session-parent':''
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
                        </table>
                        <Button
                        color='primary'
                        variant='contained'
                        onclick={this.startNewSession}
                        >
                        Start New Session
                        </Button>
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
                    </div>
                    
                    </div>
                </div>
            </div>
        );
    }
}

export default DenominationDetailsForm;

