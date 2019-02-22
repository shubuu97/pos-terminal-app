import React, {Component} from 'react';
import Button from '@material-ui/core/Button';

class SessionDetail extends Component {
    render() {
        return (
            <div className="mui-container tertiary-color">
                <div className='mui-row'>
                    <div className='mui-col-md-12 date-header'>
                        <span className="secondary-color">Wednesday 3 Oct, 2017</span>
                    </div>
                </div>

                <div className="staff-row">   
                    <div className='mui-row'>
                        <div className='mui-col-md-3 secondary-color'>Staff</div>
                        <div className='mui-col-md-3'>shreveportadmin</div>
                        <div className='mui-col-md-3 secondary-color'>Opened</div>
                        <div className='mui-col-md-3 no-pad'>Wednesday 3 Oct, 2017 1:12 PM</div>
                    </div>
                </div>
                <div>   
                    <div className='mui-row pos-row'>
                        <div className='mui-col-md-3 secondary-color'>POS</div>
                        <div className='mui-col-md-3'>shreveportadmin</div>
                    </div>
                </div>
                <div>   
                    <div className='mui-row opening-bal-row'>
                        <div className='mui-col-md-3 secondary-color'>Opening Balance</div>
                        <div className='mui-col-md-3'>$200</div>
                        <div className="mui-col-md-6 real-closing-bal">
                            <div className='mui-col-md-6 secondary-color'>Real Closing Balance</div>
                            <div className='mui-col-md-6'>$1.00</div>
                        </div>
                    </div>
                    <div className='mui-row trans-row-1'>
                        <div className='mui-col-md-3 primary-color'>+ Transactions</div>
                        <div className='mui-col-md-3'>$128868.8</div>
                        <div className="mui-col-md-6 difference">
                            <div className='mui-col-md-6 secondary-color'>Difference</div>
                            <div className='mui-col-md-6'>$74646363636</div>
                        </div>
                    </div>
                    <div className='mui-row trans-row-2'>
                        <div className='mui-col-md-3 primary-color'>- Transactions</div>
                        <div className='mui-col-md-3'>$8675746</div>
                        <div className='mui-col-md-6'>
                            <div class="mui-col-md-6 text-right">
                                <Button variant='contained' color='primary'>Put Money In</Button>
                            </div>
                            <div class="mui-col-md-6 text-left">
                                <Button variant='contained' color='primary'>Take Money Out</Button>
                            </div>
                        </div>
                    </div>
                    <div className='mui-row closing-bal'>
                        <div className='mui-col-md-3 secondary-color'>Theoratical Closing Balance</div>
                        <div className='mui-col-md-3'>$968857575</div>
                        <div className='mui-col-md-6 text-center'><Button variant='contained' color='primary'>Set Closing Balance</Button></div>
                    </div>
                </div>
                <div>
                    <div className='mui-row cash-payment-row'>
                        <div className='mui-col-md-1'>Icon</div>
                        <div className='mui-col-md-3'>Cash Payment</div>
                        <div className='mui-col-md-2'></div>
                        <div className='mui-col-md-6 text-right'>Sale: $857475784</div>
                    </div>
                </div>
                <div>
                    <div className='mui-row'>
                        <div className="mui-col-md-12 text-center">
                            <Button variant='contained' color='primary' style={{marginRight:"1%"}}>Open Cash Drawer</Button>
                            <Button variant='contained' color='primary'>Go To Checkout</Button>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='mui-row print-row'>
                        <div className="mui-col-md-12">
                            <div className="mui-col-md-6 text-right">
                               <Button variant='contained' color='primary' style={{marginRight:"1%"}} className="printBtn">Print</Button>
                            </div>

                            <div className="mui-col-md-6 text-left">
                               <Button variant='contained' color='primary' style={{marginRight:"1%"}} className="printBtn">End of Session</Button>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SessionDetail;