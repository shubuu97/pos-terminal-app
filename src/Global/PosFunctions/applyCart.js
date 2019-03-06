import { commonActionCreater } from '../../Redux/commonAction';

const applyCart = (dispatch, data)=>{
    dispatch(commonActionCreater(data.cartDiscountPercent, 'ADD_DISCOUNT_TO_CART'));
    dispatch(commonActionCreater(data.customer, 'ADD_CUSTOMER_TO_CART'));
    dispatch(commonActionCreater(data.cartItems, 'CART_ITEM_LIST')); // ! Always call in last
}

export default applyCart;