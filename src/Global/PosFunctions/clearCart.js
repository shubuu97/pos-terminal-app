import { commonActionCreater } from '../../Redux/commonAction';

const clearCart = (dispatch)=>{
dispatch(commonActionCreater([], 'CART_ITEM_LIST')); 
dispatch(commonActionCreater(0, 'ADD_DISCOUNT_TO_CART'));
}

export default clearCart;