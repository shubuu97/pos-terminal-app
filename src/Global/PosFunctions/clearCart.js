import { commonActionCreater } from '../../Redux/commonAction';

const clearCart = (dispatch) => {
    dispatch(commonActionCreater(0, 'ADD_DISCOUNT_TO_CART'));
    dispatch(commonActionCreater({}, 'ADD_CUSTOMER_TO_CART'));
    dispatch(commonActionCreater('', 'SALE_COMMENT'));
    dispatch(commonActionCreater([], 'CART_ITEM_LIST')); // ! Always call in last
}

export default clearCart;