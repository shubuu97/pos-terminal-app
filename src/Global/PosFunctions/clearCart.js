import { commonActionCreater } from '../../Redux/commonAction';



const clearCart = (dispatch) => {
    let cartDiscountObj = {}
    cartDiscountObj.type = ''
    cartDiscountObj.cartDiscount = 0
    cartDiscountObj.cartItems = []
    dispatch(commonActionCreater(cartDiscountObj, 'ADD_DISCOUNT_TO_CART'));
    dispatch(commonActionCreater({}, 'ADD_CUSTOMER_TO_CART'));
    dispatch(commonActionCreater('', 'SALE_COMMENT'));
    dispatch(commonActionCreater(0, 'ADD_EMPLOYEE_DISCOUNT'));
    dispatch(commonActionCreater([], 'CART_ITEM_LIST')); // ! Always call in last


}

export default clearCart;