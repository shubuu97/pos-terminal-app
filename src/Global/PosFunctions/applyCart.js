import { commonActionCreater } from '../../Redux/commonAction';
import _get from 'lodash/get'

const applyCart = (dispatch, data) => {
    let cartDiscountObj = {}
    cartDiscountObj.type = '$'
    cartDiscountObj.cartDiscount = _get(data, 'cartDiscount.cartDiscountMoney.amount', 0)
    cartDiscountObj.cartItems = data.cartItems
    dispatch(commonActionCreater(data.customer, 'ADD_CUSTOMER_TO_CART'));
    dispatch(commonActionCreater(cartDiscountObj, 'CART_ITEM_LIST')); // ! Always call in last
}

export default applyCart;