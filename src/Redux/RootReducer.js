import UpdateSMBFun from './commonReducer';
import {combineReducers} from 'redux';
import {reducer as formReducer}  from 'redux-form';

/* COMMON Reducers*/ 
import productData from './commonReducer'

/* Static Reducer */
import staticReducers from './staticReducers'

let productList = productData('GET_PRODUCT_DATA');


let rootRducer = combineReducers({
    productList
})

export default rootRducer;