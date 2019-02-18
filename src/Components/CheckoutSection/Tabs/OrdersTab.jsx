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

    mapCartItems = () => {
        return this.props.cartItems.map((item) => {
            return (
                <div className='p-rel each-checkout-item flex-row'>
                    <div className='p-abs delete-item'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            <path d="M0 0h24v24H0z" fill="none" />
                        </svg>
                    </div>
                    <div className='each-img'>
                        <img src={item.image} alt="img" />
                    </div>
                    <div className='each-product-des flex-column'>
                        <span className='title'>{item.name}</span>
                        <span className='code'>{item.sku}</span>
                        <span className='code'>{item.cartQuantity}</span>
                        <span className='code'>{`${_get(item,'salePrice.currencyCode')}${_get(item,'salePrice.price')}`}</span>
                    </div>
                    <div className='each-product-price flex-column justify-center'>
                        $ 1000
                   </div>
                </div>)
        })
    }

    render() {
        let { checkoutcalcArea, checkoutactionArea, checkoutcartArea, checkoutMainPart } = this.props
        return (
            <div className="orders-section" style={{ height: checkoutMainPart }}>
                <div className="items-section flex-column" style={{ height: checkoutcartArea }}>
                {this.mapCartItems()}
                </div>




                <div className='calculation-section flex-row' style={{ height: checkoutcalcArea }}>
                    <div className="calc-first-part">
                        <div className="cart-details">
                            <div className='cart-each-details'>
                                <span className='cart-title'>Total Items </span>
                                <span className='cart-amount'>$ 3000</span>
                            </div>
                            <div className='cart-each-details'>
                                <span className='cart-title'>Discount </span>
                                <span className='cart-amount'>- $ 1200</span>
                            </div>
                            <div className='cart-each-details'>
                                <span className='cart-title'>Est.Tax </span>
                                <span className='cart-amount'>$ 200.89</span>
                            </div>
                        </div>
                    </div>
                    <div className="calc-second-part flex-column justify-space-between">
                        <div className="cart-details">
                            <div className='cart-each-details'>
                                <span className='cart-title'>Order Total </span>
                                <span className='cart-amount'>$ 3000</span>
                            </div>
                            <div className='cart-each-details'>
                                <span className='cart-title'>Discount </span>
                                <span className='cart-amount'>- $ 1200</span>
                            </div>
                            <div className='cart-each-details'>
                                <span className='cart-title'>Est.Tax </span>
                                <span className='cart-amount'>$ 200.89</span>
                            </div>
                        </div>
                        <div className="cart-total">
                            <span className='total-text'>Total </span>
                            <span className='total-amount'>$ 2000.89</span>
                        </div>
                    </div>
                </div>




                <div className='button-section flex-row ' style={{ height: checkoutactionArea }}>
                    <div>
                        <Button className='mr-20' variant="outlined">Clear</Button>
                        <Button className='mr-20' variant="outlined">Hold</Button>
                        <Button variant="contained">Proceed</Button>
                    </div>

                </div>
            </div>
        );
    }
}

export default OrdersTab;