import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _find from 'lodash/find';
import _indexOf from  'lodash/indexOf'
/* Material import */

/* Redux Imports */
import {commonActionCreater} from '../../Redux/commonAction'
/* Component Imports */
import SideDrawer from '../SideDrawer'
/* dummy images */
import img1 from '../../assets/images/flowers/flower1.jpg'
import img2 from '../../assets/images/flowers/flower2.jpg'
import img3 from '../../assets/images/flowers/flower3.jpg'
import img4 from '../../assets/images/flowers/flower4.jpg'
import img5 from '../../assets/images/flowers/flower5.jpg'
import img6 from '../../assets/images/flowers/flower6.jpg'
import img7 from '../../assets/images/flowers/flower7.jpg'
import img8 from '../../assets/images/flowers/flower8.JPG'
import img9 from '../../assets/images/flowers/flower9.jpg'
import img10 from '../../assets/images/flowers/flower10.jpg'


class ProductsSection extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }

    handleAddToCart(selectedProducts) {
        let cartItem = this.state.cart;
        let productID = selectedProducts.id;
        let productQty = selectedProducts.quantity;
        if (this.checkProduct(productID)) {
            let index = cartItem.findIndex((x => x.id == productID));
            cartItem[index].quantity = Number(cartItem[index].quantity) + 1;
            this.setState({
                cart: cartItem
            })
        } else {
            cartItem.push(selectedProducts);
        }
        this.setState({
            cart: cartItem,
            cartBounce: true,
        });
        setTimeout(function () {
            this.setState({
                cartBounce: false,
                quantity: 1
            });
            console.log(this.state.quantity);
            console.log(this.state.cart);
        }.bind(this), 1000);
        this.sumTotalItems(this.state.cart);
        this.sumTotalAmount(this.state.cart);
        this.forceUpdate();
    }

    addToCart = (index) => {
        let cartItems = _get(this, 'props.CartItems', [])
        let data =  _get(this, `props.productList.lookUpData[${index}]`, {})
        let reqObj
        if(_isEmpty(_find(cartItems, data))){
            reqObj = [
                ...cartItems,
                { ...data, cartQuantity: 1 }
            ]
        }
        else{
            let cartQuantity = (_find(cartItems, data)).cartQuantity + 1
            let index = _indexOf(cartItems, data);
            debugger;
            reqObj = [
                ...cartItems
            ]
            debugger
            reqObj[index].cartQuantity = cartQuantity
            debugger
        }
        
        this.props.dispatch(commonActionCreater(reqObj, 'CART_ITEM_LIST'));
    }

    populateProducts = () => {
        let productList = _get(this, 'props.productList.lookUpData', [])
        let products = []
        productList.map((data, index) => {
            products.push(
                <div className='each-tile white-background flex-row relative' onClick={()=>this.addToCart(index)}>
                    <div className='absolute added-item-position'>
                        <div className='added-item-count'></div>
                    </div>
                    <div className='flex-column fwidth'>
                        <div className='truncate'>
                            <span className="each-card-name">{_get(data, 'name', 'undefined')}</span>
                        </div>
                        <div className='truncate'>
                            <span className="each-card-code-head">Code : </span>
                            <span className='each-card-code'>{_get(data, 'id', '')}</span>
                        </div>
                        <div className="each-card-price flex-row">
                            {_get(data, 'salePrice.currencyCode', '')} {_get(data, 'salePrice.price', 'NaN')}
                            <div className='indicator'></div>
                        </div>
                        <span className="quick-view each-card-more" title="View Details"></span>
                    </div>
                </div>
            )
        })

        return (
            <div className='pos-products' style={{ height: this.props.productListHeight }}>
                {products}
            </div>
        )
    }

    render() {
        let { windowHeight, productListHeight, headerHeight, categoriesHeight } = this.props
        return (
            <div className='pos-products-collection' style={{ height: windowHeight }}>

                {/* 
                // * Header Component
                */}
                <div className='pos-header' style={{ height: headerHeight }}>
                    <div className="header-top" >
                        <SideDrawer />
                    </div>
                    <div className='header-bottom'>

                    </div>
                </div>


                {/* 
                // * Product Categories Component
                */}
                <div className='product-catogories' style={{ height: categoriesHeight }}>
                    <div className='each-tile blue-background'>
                        <span className='category-text'>
                            Hello
                            </span>
                    </div>
                    <div className='each-tile blue-background'>
                        <span className='category-text'>
                            Hello
                            </span>
                    </div>
                    <div className='each-tile blue-background'>
                        <span className='category-text'>
                            Hello
                            </span>
                    </div>
                    <div className='each-tile blue-background'>
                        <span className='category-text'>
                            Hello
                            </span>
                    </div>
                </div>

                {/* 
                // * Products List Component
                */}


                {this.populateProducts()}

            </div>
        );
    }
}

export default ProductsSection;