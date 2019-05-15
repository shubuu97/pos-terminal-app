import { commonActionCreater } from '../../Redux/commonAction';
import _get from 'lodash/get'

const applyCart = (dispatch, data) => {
    let cartDiscountObj = {}
    cartDiscountObj.cartItems = data.cartItems
    cartDiscountObj.prevCart = data
    dispatch(commonActionCreater(data.customer, 'ADD_CUSTOMER_TO_CART'));
    dispatch(commonActionCreater(cartDiscountObj, 'CART_ITEM_LIST')); // ! Always call this at last
}

export default applyCart;