import { commonActionCreater } from '../../Redux/commonAction';
import clearCart from './clearCart'

const holdCart = (dispatch, cart, title, customerName) => {
    let reqObj = {};
    reqObj.cart = { ...cart };
    reqObj.title = title;
    reqObj.customerName = customerName;
    reqObj.time = new Date();
    dispatch(commonActionCreater(reqObj, 'HOLD_CART_ITEM'));
    clearCart(dispatch);
}

export default holdCart;