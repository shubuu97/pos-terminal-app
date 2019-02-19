import { commonActionCreater } from '../../Redux/commonAction';

const holdCart = (dispatch,cart)=>{
dispatch(commonActionCreater([], 'CART_ITEM_LIST')); 
dispatch(commonActionCreater(0, 'ADD_DISCOUNT_TO_CART'));
}

export default holdCart;