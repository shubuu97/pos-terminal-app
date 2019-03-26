import {combineReducers} from 'redux';
import {reducer as formReducer}  from 'redux-form';

/* Static Reducer */
import staticReducers from './staticReducers'

/* COMMON Reducer*/ 
import commonReducer from './commonReducer';

/* COMMON Static Reducer */
import commonStaticReducer from './commonStaticReducer';

/* SPECIFIC Reducers */
import cart from '../reducers/cartItem';
import cartHoldData from '../reducers/holdCartItem';
import ShowToast from './toastReducer';
import PaymentDetails from '../reducers/paymentDetails';
import productList from '../reducers/productList'
import zipCodeReducer from '../reducers/zipCodeReducer';
// import cartOrderDetailsFun from './commonStaticReducer';


let loginData = commonReducer('POST_LOGIN_DATA');
let storeData = commonReducer('GET_STORE_DATA');
// let productList = commonReducer('GET_PRODUCT_DATA');
let terminalData = commonReducer('GET_TERMINAL_DATA');
let categoryList = commonReducer('GET_CATEGORY_DATA');
let sessionList= commonReducer('GET_SESSION_DATA');
let customerSalesList = commonReducer('GET_CUSTOMER_SALE_DATA');
let saleRefund = commonReducer('SALE_REFUND');
let giftCardData = commonReducer('GET_GIFT_CARD__DATA');
let giftCardPaymentData = commonReducer('GET_GIFT_CARD_PAYMENT_DATA');
let saveMiscProductData = commonReducer('SAVE_MISC_PRODUCT_DATA');
let sessionDataById = commonReducer('GET_SESSION_DATA_BY_ID')
let RedemptionRules = commonReducer('GET_LOYALTY_REDEMPTION_RULES');
let EarningRules = commonReducer('GET_LOYALTY_EARNING_RULES');


let selectedSession = commonStaticReducer('GET_SELECTED_SESSION');
let sessionRedirectToLogin = commonStaticReducer('SESSION_START_REDIRECT_TO_LOGIN');
let afterSellRedirectToCart = commonStaticReducer('SWITCH_TAB_NUMBER');
let lockTerminal = commonStaticReducer('LOCK_TERMINAL');


// let cartItems = cartItemFun('CART_ITEM_LIST');
// let cartOrderDetails = cartOrderDetailsFun('ORDER_DETAILS');


let rootRducer = combineReducers({
    form:formReducer,
    loginData,
    storeData,
    categoryList,
    RedemptionRules,
    EarningRules,
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
    ShowToast,
    PaymentDetails,
    lockTerminal,
    sessionDataById,
    productList,
    zipCodeReducer
})

export default rootRducer;