import {combineReducers} from 'redux';
import {reducer as formReducer}  from 'redux-form';

/* Static Reducer */
import staticReducers from './staticReducers'

/* COMMON Reducers*/ 
import loginReducerFun from './commonReducer';
import storeReducerFun from './commonReducer';
// import productDataFun from './commonReducer';
import terminalDataFun from './commonReducer';
import categoryListFun from './commonReducer';
import sessionListFun from './commonReducer';
import customerSaleListFun from './commonReducer';
import saleRefundFun from './commonReducer';
/* SPECIFIC Reducers */
import cart from '../reducers/cartItem';
import cartHoldData from '../reducers/holdCartItem';
import productList from '../reducers/productList';

// import cartItemFun from './commonStaticReducer';
// import cartOrderDetailsFun from './commonStaticReducer';


let loginData = loginReducerFun('POST_LOGIN_DATA');
let storeData = storeReducerFun('GET_STORE_DATA');
// let productList = productDataFun('GET_PRODUCT_DATA');
let terminalData = terminalDataFun('GET_TERMINAL_DATA');
let categoryList = categoryListFun('GET_CATEGORY_DATA');
let sessionList= sessionListFun('GET_SESSION_DATA');
let customerSalesList = customerSaleListFun('GET_CUSTOMER_SALE_DATA');
let saleRefund = saleRefundFun('SALE_REFUND');

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
    saleRefund,
})

export default rootRducer;