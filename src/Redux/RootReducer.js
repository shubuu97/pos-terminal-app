import {combineReducers} from 'redux';
import {reducer as formReducer}  from 'redux-form';

/* Static Reducer */
import staticReducers from './staticReducers'


/* COMMON Reducers*/ 
import loginReducerFun from './commonReducer';
import storeReducerFun from './commonReducer';
import productData from './commonReducer';


let loginReducer = loginReducerFun('POST_LOGIN_DATA');
let  storeReducer = storeReducerFun('GET_STORE_DATA');
let productList = productData('GET_PRODUCT_DATA');


let rootRducer = combineReducers({
    loginReducer,
    storeReducer,
    productList
})

export default rootRducer;