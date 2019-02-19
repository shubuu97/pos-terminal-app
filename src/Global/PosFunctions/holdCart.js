import { commonActionCreater } from '../../Redux/commonAction';

const holdCart = (dispatch, cart, title, customerName) => {
    let reqObj = {};
    reqObj.cart = { ...cart };
    reqObj.title = title;
    reqObj.customerName = customerName;
    reqObj.time = new Date();
    dispatch(commonActionCreater(reqObj, 'HOLD_CART_ITEM'));
    // dispatch(commonActionCreater(0, 'ADD_DISCOUNT_TO_CART'));
}

export default holdCart;