import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */

/* Redux Imports */

/* Component Imports */

/* style */

class PaymentSection extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }

    render() {
        return (
            <div className='pos-payment m-50'>
                <div className='card payment-card'>
                    <span className='card-title'>Payment Methods</span>
                    <div className='flex-row justify-center'>
                        <div className='each-payment-method'>
                            Cash Payment
                        </div>
                        <div className='each-payment-method'>
                            Debit/Credit Card
                        </div>
                        <div className='each-payment-method'>
                            Employee
                        </div>
                        <div className='each-payment-method'>
                            Gift Card
                        </div>
                    </div>
                </div>
                <div className='flex-row'>
                    <div className='card transaction-card'>
                        <span className='card-title'>Transactions</span>

                    </div>




                    <div className='card numpad-card'>
                        <span className='card-title'>Numpad</span>
                        <div className='flex-row flex-wrap justify-center pt-15'>
                            <div className='key'>1</div>
                            <div className='key'>2</div>
                            <div className='key'>3</div>
                            <div className='key'>4</div>
                            <div className='key'>5</div>
                            <div className='key'>6</div>
                            <div className='key'>7</div>
                            <div className='key'>8</div>
                            <div className='key'>9</div>
                            <div className='key'>.</div>
                            <div className='key'>0</div>
                            <div className='key'>clr</div>
                            <div className='key'></div>
                            <div className='key'></div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default PaymentSection;