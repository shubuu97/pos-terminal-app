import React, {Component} from 'react';
import Button from '@material-ui/core/Button';

class SessionDetail extends Component {
    render() {
        return (
            <div className="mui-container">
                <div className='mui-row'>
                    <div className='mui-col-md-12'>
                        <span>Wednesday 3 Oct, 2017</span>
                    </div>
                </div>

                <div>   
                    <div className='mui-row'>
                        <div className='mui-col-md-3'>Staff</div>
                        <div className='mui-col-md-3'>shreveportadmin</div>
                        <div className='mui-col-md-3'>Opened</div>
                        <div className='mui-col-md-3'>Wednesday 3 Oct, 2017 1:12 PM</div>
                    </div>
                </div>
                <div>   
                    <div className='mui-row'>
                        <div className='mui-col-md-3'>POS</div>
                        <div className='mui-col-md-3'>shreveportadmin</div>
                    </div>
                </div>
                <div>   
                    <div className='mui-row'>
                        <div className='mui-col-md-3'>Opening Balance</div>
                        <div className='mui-col-md-3'>$200</div>
                        <div className='mui-col-md-3'>Real Closing Balance</div>
                        <div className='mui-col-md-3'>$1.00</div>
                    </div>
                    <div className='mui-row'>
                        <div className='mui-col-md-3'>+ Transactions</div>
                        <div className='mui-col-md-3'>$128868.8</div>
                        <div className='mui-col-md-3'>Difference</div>
                        <div className='mui-col-md-3'>$74646363636</div>
                    </div>
                    <div className='mui-row'>
                        <div className='mui-col-md-3'>- Transactions</div>
                        <div className='mui-col-md-3'>$8675746</div>
                        <div className='mui-col-md-3'><Button variant='contained' color='primary'>Put Money In</Button></div>
                        <div className='mui-col-md-3'><Button variant='contained' color='primary'>Take Money Out</Button></div>
                    </div>
                    <div className='mui-row'>
                        <div className='mui-col-md-3'>Theoratical Closing Balance</div>
                        <div className='mui-col-md-3'>$968857575</div>
                        <div className='mui-col-md-6'><Button variant='contained' color='primary'>Set Closing Balance</Button></div>
                    </div>
                </div>
                <div>
                    <div className='mui-row'>
                        <div className='mui-col-md-1'>Icon</div>
                        <div className='mui-col-md-3'>Cash Payment</div>
                        <div className='mui-col-md-2'></div>
                        <div className='mui-col-md-6'>Sale: $857475784</div>
                    </div>
                </div>
                <div>
                    <div className='mui-row'>
                        <div className='mui-col-md-3'></div>
                        <div className='mui-col-md-3'><Button variant='contained' color='primary'>Open Cash Drawer</Button></div>
                        <div className='mui-col-md-3'><Button variant='contained' color='primary'>Go To Check Out</Button></div>
                        <div className='mui-col-md-3'></div>
                    </div>
                </div>
                <div>
                    <div className='mui-row'>
                        <div className='mui-col-md-6'><Button variant='contained' color='primary'>Print</Button></div>
                        <div className='mui-col-md-6'><Button variant='contained' color='primary'>End of Session</Button></div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SessionDetail;