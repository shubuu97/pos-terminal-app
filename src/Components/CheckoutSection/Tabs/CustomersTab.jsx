import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */
import Button from '@material-ui/core/Button';
import SvgIcon from '@material-ui/core/SvgIcon';
/* Redux Imports */

/* Component Imports */

/* style */

/* dummy images */
import img1 from '../../../assets/images/flowers/flower1.jpg'
import img2 from '../../../assets/images/flowers/flower2.jpg'
import img3 from '../../../assets/images/flowers/flower3.jpg'
import img4 from '../../../assets/images/flowers/flower4.jpg'
import img5 from '../../../assets/images/flowers/flower5.jpg'
import img6 from '../../../assets/images/flowers/flower6.jpg'
import img7 from '../../../assets/images/flowers/flower7.jpg'
import img8 from '../../../assets/images/flowers/flower8.JPG'
import img9 from '../../../assets/images/flowers/flower9.jpg'
import img10 from '../../../assets/images/flowers/flower10.jpg'

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
                <div  style={{height: checkoutCustomerArea}}>
                    hello
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