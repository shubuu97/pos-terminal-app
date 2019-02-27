import {combineReducers} from 'redux';
import {reducer as formReducer}  from 'redux-form';

/* Static Reducer */
import staticReducers from './staticReducers'

/* COMMON Reducers*/ 
import loginReducerFun from './commonReducer';
import storeReducerFun from './commonReducer';
import productDataFun from './commonReducer';
import terminalDataFun from './commonReducer';
import categoryListFun from './commonReducer';
import sessionListFun from './commonReducer';
import customerSaleListFun from './commonReducer';
import saleRefundFun from './commonReducer';
import giftCardDataFun from './commonReducer';
import giftCardPaymentDataFun from './commonReducer';
import saveMiscProductDataFun from './commonReducer';
/* SPECIFIC Reducers */
import cart from '../reducers/cartItem';
import cartHoldData from '../reducers/holdCartItem';
import ShowToast from './toastReducer';


import sessionRedirectToLoginFun from './commonStaticReducer';
import afterSellRedirectToCartFun from './commonStaticReducer'
import selectedSessionFun from './commonStaticReducer'
// import cartOrderDetailsFun from './commonStaticReducer';


let loginData = loginReducerFun('POST_LOGIN_DATA');
let storeData = storeReducerFun('GET_STORE_DATA');
let productList = productDataFun('GET_PRODUCT_DATA');
let terminalData = terminalDataFun('GET_TERMINAL_DATA');
let categoryList = categoryListFun('GET_CATEGORY_DATA');
let sessionList= sessionListFun('GET_SESSION_DATA');
let customerSalesList = customerSaleListFun('GET_CUSTOMER_SALE_DATA');
let selectedSession = selectedSessionFun('GET_SELECTED_SESSION')
let sessionRedirectToLogin = sessionRedirectToLoginFun('SESSION_START_REDIRECT_TO_LOGIN');
let afterSellRedirectToCart = afterSellRedirectToCartFun('SWITCH_TAB_NUMBER')
let saleRefund = saleRefundFun('SALE_REFUND');
let giftCardData = giftCardDataFun('GET_GIFT_CARD__DATA');
let giftCardPaymentData = giftCardPaymentDataFun('GET_GIFT_CARD_PAYMENT_DATA');
let saveMiscProductData = saveMiscProductDataFun('SAVE_MISC_PRODUCT_DATA');

// let cartItems = cartItemFun('CART_ITEM_LIST');
// let cartOrderDetails = cartOrderDetailsFun('ORDER_DETAILS');


let rootRducer = combineReducers({
    form:formReducer,
    loginData,
    storeData,
    categoryList,
    productList,
    staticReducers,
    terminalData,
    cart,
    cartHoldData,
    sessionList,
    customerSalesList,
    sessionRedirectToLogin,
    selectedSession,
    saleRefund,
    afterSellRedirectToCart,
    giftCardData,
    giftCardPaymentData,
    saveMiscProductData,
    ShowToast
})

export default rootRducer;