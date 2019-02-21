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
import Button from '@material-ui/core/Button';
import {connect} from 'react-redux';
import genericPostData from '../../Global/dataFetch/genericPostData';


/* style */

class PaymentSection extends React.Component {

    constructor() {
        super();
        this.state = {
            showCashPay: false,
            showCardPay: false,
            showDefaultCardPay: false,
            showGiftPay: false,
            cardAmountValue: '',
            defaultcardAmountValue: '',
            cashPayValue: '',
            giftPayNumberValue: ''

        }
    }
    handleCashPayment = () => {
        this.setState({ showCashPay: true })
    }
    handleCardPayment = () => {
        this.setState({ showCardPay: true })

    }
    handleDefaultCardPayment = () => {
        this.setState({ showDefaultCardPay: true })
    }
    handleGiftCardPayment = () => {
        this.setState({ showGiftPay: true })
    }

    handleInputChange = num => event => {
        debugger;
        let currentFocus = this.state.currentFocus;
        let currenctFocusValue = this.state[`${currentFocus}Value`]
        if (num != '<') {
            currenctFocusValue = currenctFocusValue + num;
        }
        else {
            currenctFocusValue = ''
        }

        this.setState({
            [`${currentFocus}Value`]: currenctFocusValue,
        })
    }
    currentFocus = (fieldValue) => {
        this.setState({ currentFocus: fieldValue })
    }
    onRemovePaymentMethod = (fieldValue) => {
        this.setState({ [fieldValue]: false })
    }
    handleSaleTransaction = ()=>{
        debugger;
    let {customer,cartItems,cartTotal} = this.props;
    let saleItems =   cartItems.map((item)=>{
            let obj = {}
            obj.productId=item.doc.product.id;
            obj.qty = item.cartQuantity;
            return obj;
        });
        let paymentAmount = 
        (parseFloat(this.state.cardAmountValue)||0)+
        (parseFloat(this.state. defaultcardAmountValue)||0)
        + (parseFloat(this.state.cashPayValue||0))+
        (parseFloat(this.state.giftPayNumberValue)||0)
      let reqObj = {
        customerId:customer.id,
        storeId:localStorage.getItem('storeId'),
        terminalId:localStorage.getItem('terminalId'),
        operatorId:localStorage.getItem('userId'),
        saleItem:saleItems,
        miscSaleItems:[],
        sessionId:'',
        totalAmount:parseFloat(cartTotal),
        paymentAmount:paymentAmount,
        paymentMethod:'CASH',
        paymentReference:''
    };
    genericPostData({
        dispatch:this.props.dispatch,
        reqObj,
        url:'Sale/CreateSaleTransaction',
        constants:{
            init:'POST_SALE_TRANSACTION_INIT',
            success:'POST_SALE_TRANSACTION_SUCCESS',
            error:'POST_SALE_TRANSACTION_ERROR'
        },
        identifier:'SALE_TRANSACTION_INIT',
        successCb:this.handleSaleTransactionTransactionSuccess,
        errorCb:this.handleSaleTransactionTransactionError

    })
    
    }

    handleSaleTransactionTransactionSuccess = ()=>{
        debugger;
    }
    handleSaleTransactionTransactionError = ()=>{
        debugger;
    }
    render() {
        return (
            <div className='pos-payment m-50'>
                <div className='card payment-card'>
                    <span className='card-title soft-text'>Payment Methods</span>
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
                        <span className='card-title soft-text'>Transactions</span>
                        {this.state.showCashPay ?
                            <CashPay
                                currentFocus={this.currentFocus}
                                value={this.state.cashPayValue}
                                onRemovePaymentMethod={this.onRemovePaymentMethod}
                            /> : null}
                        {this.state.showCardPay ?
                            <CardPay
                                currentFocus={this.currentFocus}
                                value={this.state.cardAmountValue}
                                onRemovePaymentMethod={this.onRemovePaymentMethod}
                            /> : null}
                        {this.state.showDefaultCardPay ?
                            <DefaultCardPay
                                value={this.state.defaultcardAmountValue}
                                currentFocus={this.currentFocus}
                                onRemovePaymentMethod={this.onRemovePaymentMethod}
                            /> : null}
                        {this.state.showGiftPay ?
                            <GiftPay
                                value={this.state.giftPayNumberValue}
                                currentFocus={this.currentFocus}
                                onRemovePaymentMethod={this.onRemovePaymentMethod}
                            /> : null}

                    </div>




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
                <div className="flex-row justify-flex-end">
                    <div style={{ width: '48%' }}>
                        <Button
                            color='primary'
                            fullWidth
                            variant='contained'
                            onClick={this.handleSaleTransaction}
                        >
                            Submit Transaction
                    </Button>
                    </div>
                </div>
            </div>

        );
    }
}

function mapStateToProps(state){
   let  cartItems = _get(state,'cart.cartItems');
   let  customer = _get(state,'cart.customer');
   let  cartTotal = _get(state,'cart.cartTotal')
   return {cartItems,customer,cartTotal}
}

export default connect(mapStateToProps)(PaymentSection);