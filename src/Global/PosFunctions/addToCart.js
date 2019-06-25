/* Lodash Imports */
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _findIndex from 'lodash/findIndex';
import Dinero from 'dinero.js';
import _find from 'lodash/find'
import showMessage from '../../Redux/toastAction';
/* Redux Imports */
import { commonActionCreater } from '../../Redux/commonAction';

const addToCart = (product, cartItems, cart, quantity, dispatch, selectedPackage, handleClickOpenCustomer) => {
    let saleType = 0
    _get(product.doc.product, 'isGiftCard') ? saleType = 1 : saleType = 0
    let reqObj = []
    let cannabisStore = localStorage.getItem('cannabisStore')
    let productType = _get(product, 'doc.product.productType', 3)
    if (cannabisStore && !(productType == 3) ) {
        let packages = []
        cartItems.map((data, index) => {
            if(!(_get(data, 'doc.product.productType', 3) == 3)){
                packages = [...packages, ...data.packages]
            }
        })
        product.packages = [selectedPackage]
        if (_isEmpty(_find(packages, selectedPackage))) {
            reqObj = [
                ...cartItems,
                {
                    ...product,
                    qty: selectedPackage.quantity,
                    packages: [selectedPackage],
                    saleType
                }
            ];
        } else {
            reqObj = [
                ...cartItems
            ]
        }
    }
    else {
        if (_isEmpty(_find(cartItems, product))) {
            reqObj = [
                ...cartItems,
                {
                    ...product,
                    qty: quantity,
                    saleType
                }
            ];
        } else {
            let qty = (_find(cartItems, product)).qty + (quantity)
            let index = _findIndex(cartItems, ['doc.product.id', product.doc.product.id]);
            reqObj = [
                ...cartItems
            ]
            reqObj[index].qty = qty;
            // this.setState({ qty })
        }
    }
    let cartDiscountObj = {}
    cartDiscountObj.cartItems = reqObj
    cartDiscountObj.prevCart = cart
    if (localStorage.getItem('cannabisStore') && !(_get(cart, 'customer.customerType', 0) != 0)) {
        dispatch(showMessage({ text: 'Please Select a Customer', isSuccess: false }));
        setTimeout(() => {
            dispatch(showMessage({}));
        }, 3000);
        debugger
        handleClickOpenCustomer()
        return
    }
    dispatch(commonActionCreater(cartDiscountObj, 'CART_ITEM_LIST'));
}

export default addToCart;