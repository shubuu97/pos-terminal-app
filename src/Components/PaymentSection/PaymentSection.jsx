import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */

/* Redux Imports */

/* Component Imports */
import CashPay from './CashPay';
import CardPay from './CardPay';
import DefaultCardPay from './DefaultCardPay';
import GiftPay from './GiftPay';

/* style */

class PaymentSection extends React.Component {

    constructor() {
        super();
        this.state = {
         showCashPay:false,
         showCardPay:false,
         showDefaultCardPay:false,
         showGiftPay:false
        }
    }
    handleCashPayment = ()=>{
    this.setState({showCashPay:true})
    }
    handleCardPayment = ()=>{
    this.setState({showCardPay:true})

    }
    handleDefaultCardPayment = ()=>{
    this.setState({showDefaultCardPay:true})
    }
    handleGiftCardPayment = ()=>{
    this.setState({showGiftPay:true})
    }
    render() {
        return (
            <div className='pos-payment m-50'>
                <div className='card payment-card'>
                    <span className='card-title'>Payment Methods</span>
                    <div className='flex-row justify-center'>
                        <div onClick={this.handleCashPayment} className='each-payment-method'>
                            Cash Payment
                        </div>
                        <div onClick={this.handleCardPayment} className='each-payment-method'>
                            Debit/Credit Card
                        </div>
                        <div onClick={this.handleDefaultCardPayment} className='each-payment-method'>
                            Employee
                        </div>
                        <div onClick={this.handleGiftCardPayment} className='each-payment-method'>
                            Gift Card
                        </div>
                    </div>
                </div>
                <div className='flex-row'>
                    <div className='card transaction-card'>
                        <span className='card-title'>Transactions</span>
                         {this.state.showCashPay?<CashPay/>:null}
                         {this.state.showCardPay?<CardPay/>:null}
                         {this.state.showDefaultCardPay?<DefaultCardPay/>:null}
                         {this.state.showGiftPay?<GiftPay/>:null}
                    </div>




                    <div className='card numpad-card'>
                        <span className='card-title'>Numpad</span>
                        <div className='flex-row flex-wrap justify-center pt-15'>
                            <div className='key' onClick={this.handleInputChange('1')}>1</div>
                            <div className='key' onClick={this.handleInputChange('2')}>2</div>
                            <div className='key' onClick={this.handleInputChange('3')}>3</div>
                            <div className='key' onClick={this.handleInputChange('4')}>4</div>
                            <div className='key' onClick={this.handleInputChange('5')}>5</div>
                            <div className='key' onClick={this.handleInputChange('6')}>6</div>
                            <div className='key' onClick={this.handleInputChange('7')}>7</div>
                            <div className='key' onClick={this.handleInputChange('8')}>8</div>
                            <div className='key' onClick={this.handleInputChange('9')}>9</div>
                            <div className='key' onClick={this.handleInputChange('.')}>.</div>
                            <div className='key' onClick={this.handleInputChange('0')}>0</div>
                            <div className='key' onClick={this.handleInputChange('<')}>clr</div>
                            {/* <div className='key' onClick={this.handleInputChange('1')}>/div>
                            <div className='key' onClick={this.handleInputChange('1')}></div> */}
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default PaymentSection;