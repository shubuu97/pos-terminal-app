import { commonActionCreater } from '../../Redux/commonAction';

const applyCart = (dispatch, cart)=>{
    dispatch(commonActionCreater(cart.cartItems, 'CART_ITEM_LIST')); 
    dispatch(commonActionCreater(cart.discount, 'ADD_DISCOUNT_TO_CART'));
}

export default applyCart;