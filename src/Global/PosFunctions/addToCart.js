/* Lodash Imports */
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _findIndex from 'lodash/findIndex';
import Dinero from 'dinero.js';
import _find from 'lodash/find'
/* Redux Imports */
import { commonActionCreater } from '../../Redux/commonAction';

const addToCart = (product, cartItems, cart, quantity, dispatch) => {
    let reqObj = []
    if (_isEmpty(_find(cartItems, product))) {
        reqObj = [
            ...cartItems,
            {
                ...product,
                qty: quantity,
                saleType: 0
            }
        ];
    } else {
        let qty = (_find(cartItems, product)).qty + (quantity)
        let index = _findIndex(cartItems, ['doc._id', product.doc._id]);
        reqObj = [
            ...cartItems
        ]
        reqObj[index].qty = qty;
        // this.setState({ qty })
    }
    let cartDiscountObj = {}
    if (_get(cart, 'cartDiscount.isPercentage', false)) {
        cartDiscountObj.type = '%'
        cartDiscountObj.cartDiscount = _get(cart, 'cartDiscount.cartDiscountPercent', 0)
    }
    else {
        cartDiscountObj.type = '$'
        cartDiscountObj.cartDiscount = _get(cart, 'cartDiscount.cartDiscountMoney', 0).getAmount();
    }
    cartDiscountObj.cartItems = reqObj
    dispatch(commonActionCreater(cartDiscountObj, 'CART_ITEM_LIST'));
}

export default addToCart;