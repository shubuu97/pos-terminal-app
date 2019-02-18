import {combineReducers} from 'redux';
import {reducer as formReducer}  from 'redux-form';
import loginReducerFun from './commonReducer';
import storeReducerFun from './commonReducer';

import staticReducers from './staticReducers'

let loginReducer = loginReducerFun('login');
let  storeReducer = storeReducerFun('store');


/* Static Reducer */




let rootRducer = combineReducers({
    loginReducer,
    storeReducer
})

export default rootRducer;