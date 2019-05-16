import { commonActionCreater } from '../../Redux/commonAction';
import _get from 'lodash/get'

const applyCart = (dispatch, data) => {
    let cartDiscountObj = {}
    if (_get(data, 'cartDiscount.isPercentage', false)) {
        cartDiscountObj.type = '%'
        cartDiscountObj.cartDiscount = _get(data, 'cartDiscount.cartDiscountPercent', 0)
    }
    else {
        cartDiscountObj.type = '$'
        cartDiscountObj.cartDiscount = _get(data, 'cartDiscount.cartDiscountMoney', 0).getAmount();
    }
    cartDiscountObj.cartItems = data.cartItems
    cartDiscountObj.prevCart = data
    dispatch(commonActionCreater(data.customer, 'ADD_CUSTOMER_TO_CART'));
    dispatch(commonActionCreater(cartDiscountObj, 'CART_ITEM_LIST')); // ! Always call this at last
}

export default applyCart;