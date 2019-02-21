import { commonActionCreater } from '../../Redux/commonAction';

const applyCart = (dispatch, cart)=>{
    dispatch(commonActionCreater(cart.cartDiscount, 'ADD_DISCOUNT_TO_CART'));
    dispatch(commonActionCreater(cart.customer, 'ADD_CUSTOMER_TO_CART'));
    dispatch(commonActionCreater(cart.cartItems, 'CART_ITEM_LIST')); // ! Always call in last
}

export default applyCart;