import { commonActionCreater } from '../../Redux/commonAction';
import clearCart from './clearCart';
import addGuestToCart from './addGuestToCart';

const holdCart = (dispatch, cart, title, customerName) => {
    let reqObj = {};
    reqObj.cart = { ...cart };
    reqObj.title = title;
    reqObj.customerName = customerName;
    reqObj.time = new Date();
    dispatch(commonActionCreater(reqObj, 'HOLD_CART_ITEM'));
    clearCart(dispatch);
    addGuestToCart(this.props.dispatch);


}

export default holdCart;