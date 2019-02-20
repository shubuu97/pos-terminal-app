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

/* SPECIFIC Reducers */
import cart from '../reducers/cartItem';
import cartHoldData from '../reducers/holdCartItem';


// import cartItemFun from './commonStaticReducer';
// import cartOrderDetailsFun from './commonStaticReducer';


let loginReducer = loginReducerFun('POST_LOGIN_DATA');
let  storeReducer = storeReducerFun('GET_STORE_DATA');
let productList = productDataFun('GET_PRODUCT_DATA');
let terminalData = terminalDataFun('GET_TERMINAL_DATA');
let categoryList = categoryListFun('GET_CATEGORY_DATA')
// let cartItems = cartItemFun('CART_ITEM_LIST');
// let cartOrderDetails = cartOrderDetailsFun('ORDER_DETAILS');


let rootRducer = combineReducers({
    loginReducer,
    storeReducer,
    categoryList,
    productList,
    staticReducers,
    terminalData,
    cart,
    cartHoldData
})

export default rootRducer;