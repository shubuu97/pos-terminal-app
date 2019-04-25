import { commonActionCreater } from '../../Redux/commonAction';
import _get from 'lodash/get'

const applyCart = (dispatch, data) => {

    let cartDiscountObj = {}
    if (_get(data, 'cartAbsoluteValue', false)) {
        cartDiscountObj.type = '$'
        cartDiscountObj.cartDiscount = _get(data, 'cartAbsoluteValue', 0)
    }
    else {
        cartDiscountObj.type = '%'
        cartDiscountObj.cartDiscount = _get(data, 'cartDiscountPercent', 0)
    }
    cartDiscountObj.cartItems = data.cartItems

    dispatch(commonActionCreater(cartDiscountObj, 'ADD_DISCOUNT_TO_CART'));
    dispatch(commonActionCreater(data.customer, 'ADD_CUSTOMER_TO_CART'));
    dispatch(commonActionCreater(data.cartItems, 'CART_ITEM_LIST')); // ! Always call in last
}

export default applyCart;