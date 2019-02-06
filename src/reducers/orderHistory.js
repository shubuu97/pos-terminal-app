import { combineReducers } from 'redux';
import _get from 'lodash/get';
import {
  REQUEST_ORDERHISTORY,
  REQUEST_ORDERHISTORY_DATA,
  RECEIVED_ORDERHISTORY,
  RECEIVED_ORDERHISTORY_DATA,
  RECEIVED_ORDERHISTORY_DATA_ERROR,
  RECEIVED_ORDERHISTORY_ERROR,
  REQUEST_ORDERHISTORY_CLEAR

} from '../constants/orderHistory';

const orderHistoryReducer = (state = 'orderHistorytate', action) => {
  switch (action.type) {
    default:
      return state
  }
}


const orderHistoryData = (state = {
  isFetching: false,
  didInvalidate: false,
  type: '',
  status: '',
  orderHistory: [],
  selectedOrderHistoryData: [],
}, action) => {
  switch (action.type) {
    case REQUEST_ORDERHISTORY:
      return Object.assign({}, state, {
        isFetching: true,orderHistory:[],
        type: action.type, lastUpdated: action.receivedAt
      });
    case RECEIVED_ORDERHISTORY:
      return Object.assign({}, state, {
        isFetching: false,
        type: action.type, status: action.status, selectedOrderHistoryData:[],
        didInvalidate: false, orderHistory: action.data,
        lastUpdated: action.receivedAt
      });
    case REQUEST_ORDERHISTORY_DATA:
      return Object.assign({}, state, {
        isFetching: true,selectedOrderHistoryData:[],
        type: action.type, lastUpdated: action.receivedAt
      });
    case RECEIVED_ORDERHISTORY_DATA:
      return Object.assign({}, state, {
        isFetching: false,
        type: action.type, status: action.status, selectedOrderHistoryData:action.data,
        didInvalidate: false, 
        lastUpdated: action.receivedAt
      });
    case RECEIVED_ORDERHISTORY_DATA_ERROR:
      return Object.assign({}, state, {
        isFetching: false,
        type: action.type, didInvalidate: false, status: action.status,
        selectedOrderHistoryData: action.error, lastUpdated: action.receivedAt
      });
    case RECEIVED_ORDERHISTORY_ERROR:
      return Object.assign({}, state, {
        isFetching: false,
        type: action.type, didInvalidate: false, status: action.status,
        orderHistory: action.error, lastUpdated: action.receivedAt
      });
    case REQUEST_ORDERHISTORY_CLEAR:
    return Object.assign({}, state, {
      isFetching: false,
      type: action.type, didInvalidate: false, status: action.status,
      orderHistory: [], lastUpdated: [], selectedOrderHistoryData: [],
    });

    default:
      return state
  }
}


export {
    orderHistoryData
}

export default orderHistoryReducer;