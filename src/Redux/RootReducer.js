import {combineReducers} from 'redux';
import {reducer as formReducer}  from 'redux-form';

/* Static Reducer */
import staticReducers from './staticReducers'

/* COMMON Reducer*/ 
import commonReducer from './commonReducer';

/* COMMON Static Reducer */
import commonStaticReducer from './commonStaticReducer';

/* SPECIFIC Reducers */
import cart from '../reducers/cartReducer';
import cartHoldData from '../reducers/holdCartItem';
import ShowToast from './toastReducer';
import PaymentDetails from '../reducers/paymentDetails';
import RefundPaymentDetails from '../reducers/refundPaymentDetails'
import productList from '../reducers/productList'
import zipCodeReducer from '../reducers/zipCodeReducer';
// !Cannabis Specific
import customerQueue from '../reducers/manageCustomersCannabis';
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
let resetCategory = commonStaticReducer('RESET_CATEGORY');
let resetProduct = commonStaticReducer('RESET_PRODUCT');

let lockTerminal = commonStaticReducer('LOCK_TERMINAL');
let loyaltyRedeem = commonStaticReducer('LOYALTY_INPUT_HANDLER');
let employeePayroll = commonStaticReducer('EMPLOYEE_PAYROLL')
let isCustomerTabOpen = commonStaticReducer('IS_CUSTOMER_DIALOGUE_OPEN')
let isHotProductActive = commonStaticReducer('IS_HOT_PRODUCT_ACTIVE');
let loginCreds = commonStaticReducer('LOGIN_CREDS_DECODE');
let storeClose = commonStaticReducer('STORE_CLOSE_INDICATOR');


// let cartOrderDetails = cartOrderDetailsFun('ORDER_DETAILS');


let rootRducer = combineReducers({
    form:formReducer,
    loginData,
    loginCreds,
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
    zipCodeReducer,
    loyaltyRedeem,
    employeePayroll,
    RefundPaymentDetails,
    resetProduct,
    resetCategory,
    isCustomerTabOpen,
    isHotProductActive,
    customerQueue,
    storeClose
})

export default rootRducer;