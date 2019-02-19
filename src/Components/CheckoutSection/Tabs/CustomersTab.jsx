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
import CalculationSection from './CalculationSection'




class OrdersTab extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }

    render() {
        let { checkoutactionArea, checkoutMainPart, checkoutCustomerArea, checkoutcalcArea, checkoutcartArea } = this.props
        return (
            <div className="customer-section" style={{ height: checkoutMainPart }}>
                <div className="customer-main" style={{ height: checkoutcartArea }}>
                    <div className='search-section flex-row'>
                        <ReactSelect
                            className='fwidth'
                        />
                        <div className='add-customer flex-row align-center justify-center'> + </div>
                    </div>
                    <div className='flex-column'>
                        <div className='customer-info'>
                            <div className='each-info'>
                                <div className='info-title'>Name</div>
                                <div className='info-data'>Mayuk Agarwal</div>
                            </div>
                            <div className='each-info'>
                                <div className='info-title'>Phone</div>
                                <div className='info-data'>+918947900747</div>
                            </div>
                            <div className='each-info'>
                                <div className='info-title'>Email</div>
                                <div className='info-data'>mayukagarwal@gmail.com</div>
                            </div>
                        </div>
                        <div className='customer-billing-info'>
                            <div className='each-info'>
                                <div className='info-title'>Billing Address</div>
                                <div className='info-data'>74/153 Tagore Lane, Shipra Path, Mansarovar, Jaipur, Rajasthan, India - 302020</div>
                            </div>
                        </div>
                    </div>
                </div>

                <CalculationSection
                    checkoutcalcArea={checkoutcalcArea}
                />

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