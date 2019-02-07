import { combineReducers } from 'redux';
import _get from 'lodash/get';
import { persistentReducer } from 'redux-pouchdb-plus';

import {
  REQUEST_PRODUCT_DATA,
  REQUEST_ASYNC_PRODUCT_DATA,
  RECEIVE_PRODUCT_DATA,
  RECEIVE_PRODUCT_DATA_ERROR,
  REQUEST_SALE_TRANSACTION_DATA,
  RECEIVE_SALE_TRANSACTION_DATA,
  REQUEST_CUSTOMER_REGISTRATION_DATA,
  RECEIVE_CUSTOMER_REGISTRATION_DATA,
  RECEIVE_CUSTOMER_REGISTRATION_DATA_ERROR,
  REQUEST_CUSTOMER_SEARCH_DATA,
  RECEIVE_CUSTOMER_SEARCH_DATA,
  REQUEST_REWARD_EARN_RULE,
  RECEIVED_REWARD_EARN_RULE,
  RECEIVED_REWARD_EARN_RULE_ERROR,
  RECEIVE_CUSTOMER_SEARCH_DATA_ERROR

} from '../constants/products';

const productReducer = (state = 'productState', action) => {
  switch (action.type) {
    default:
      return state
  }
}


let productData = (state = {
  isFetching: false,
  didInvalidate: false,
  type: '',
  productData: [],
  getSaleTransaction: [],
  getCustomerRegistration: [],
  customerSearchData: []

}, action) => {
  switch (action.type) {

    case REQUEST_PRODUCT_DATA:
      return Object.assign({}, state, {
        isFetching: true, type: action.type, status: '',
        lastUpdated: action.receivedAt
      });
    case REQUEST_ASYNC_PRODUCT_DATA:
      return Object.assign({}, state, {
        isFetching: false, type: action.type, status: '',
        lastUpdated: action.receivedAt
      });
    case RECEIVE_PRODUCT_DATA:
      return Object.assign({}, state, {
        isFetching: false,
        type: action.type, didInvalidate: false, status: action.status,
        productData: action.data, lastUpdated: action.receivedAt
      });
      case RECEIVE_PRODUCT_DATA_ERROR:
      return Object.assign({}, state, {
        isFetching: false,
        type: action.type, didInvalidate: false, status: action.status,
        productDataError: action.error, lastUpdated: action.receivedAt
      });

    case REQUEST_SALE_TRANSACTION_DATA:
      return Object.assign({}, state, {
        isFetching: true, type: action.type,status: '',
        getSaleTransaction:[], lastUpdated: action.receivedAt
      });

    case RECEIVE_SALE_TRANSACTION_DATA:
      return Object.assign({}, state, {
        isFetching: false,
        type: action.type, didInvalidate: false, status: action.status,
        getSaleTransaction: action.data, lastUpdated: action.receivedAt
      });

    case REQUEST_CUSTOMER_REGISTRATION_DATA:
      return Object.assign({}, state, {
        isFetching: true, type: action.type, status: '',
        lastUpdated: action.receivedAt
      });

    case RECEIVE_CUSTOMER_REGISTRATION_DATA:
      return Object.assign({}, state, {
        isFetching: false,
        type: action.type, didInvalidate: false, status: action.status,
        getCustomerRegistration: action.data, lastUpdated: action.receivedAt
      });
    case RECEIVE_CUSTOMER_REGISTRATION_DATA_ERROR:
      return Object.assign({}, state, {
        isFetching: false,
        type: action.type, didInvalidate: false, status: action.status,
        getCustomerRegistration: action.error, lastUpdated: action.receivedAt
      });

    case REQUEST_CUSTOMER_SEARCH_DATA:
      return Object.assign({}, state, {
        isFetching: true, type: action.type, status: '', customerSearchData: [],
        lastUpdated: action.receivedAt
      });

    case RECEIVE_CUSTOMER_SEARCH_DATA:
      return Object.assign({}, state, {
        isFetching: false,
        type: action.type, didInvalidate: false, status: action.status,
        customerSearchData: action.data, lastUpdated: action.receivedAt
      });
      case RECEIVE_CUSTOMER_SEARCH_DATA_ERROR:
      return Object.assign({}, state, {
        isFetching: false,
        type: action.type, didInvalidate: false, status: action.status,
        customerSearchData: action.error, lastUpdated: action.receivedAt
      });
    case REQUEST_REWARD_EARN_RULE:
      return Object.assign({}, state, {
        isFetching: true,rewardEarnRules:[],
        type: action.type, lastUpdated: action.receivedAt
      });
    case RECEIVED_REWARD_EARN_RULE:
      return Object.assign({}, state, {
        isFetching: false,
        type: action.type, status: action.status,
        didInvalidate: false,rewardEarnRules: action.data, 
        lastUpdated: action.receivedAt
      });
    case RECEIVED_REWARD_EARN_RULE_ERROR:
      return Object.assign({}, state, {
        isFetching: false,rewardEarnRules: action.error,
        type: action.type, lastUpdated: action.receivedAt
      });
    default:
      return state
  }
}
productData = persistentReducer(productData, {name: 'Product Data'});


export {
  productData
}

export default persistentReducer(productReducer, {name: 'Product Reducer'});