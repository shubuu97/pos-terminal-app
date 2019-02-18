import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */
import Button from '@material-ui/core/Button';
import SvgIcon from '@material-ui/core/SvgIcon';
/* Redux Imports */

/* Global Imports */
import ReactSelect from '../../../Global/Components/ReactSelect/async-react-select'
/* Component Imports */





class OrdersTab extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }

    render() {
        let {checkoutactionArea, checkoutMainPart, checkoutCustomerArea } = this.props
        return (
            <div className="customer-section" style={{ height: checkoutMainPart }}>
                <div className="customer-main" style={{height: checkoutCustomerArea}}>
                    <div className='search-section flex-row'>
                        <ReactSelect 
                            className='fwidth'
                        />
                        <div className='add-customer flex-row align-center justify-center'> + </div>
                    </div>
                </div>
                
                <div className='button-section flex-row ' style={{ height: checkoutactionArea }}>
                    <div>
                        <Button className='mr-20' variant="outlined">Hold</Button>
                        <Button className='mr-20' variant="outlined">Proceed as Guest</Button>
                        <Button variant="contained">Proceed</Button>
                    </div>

                </div>
            </div>
        );
    }
}

export default OrdersTab;