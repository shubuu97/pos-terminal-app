import {combineReducers} from 'redux';
import {reducer as formReducer}  from 'redux-form';
import loginReducerFun from './commonReducer';
import storeReducerFun from './commonReducer';

import staticReducers from './staticReducers'

let loginReducer = loginReducerFun('login');
let  storeReducer = storeReducerFun('store');

/* COMMON Reducers*/ 
import productData from './commonReducer'

/* Static Reducer */

let productList = productData('GET_PRODUCT_DATA');


let rootRducer = combineReducers({
    loginReducer,
    storeReducer,
    productList
})

export default rootRducer;