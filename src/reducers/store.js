import { combineReducers } from 'redux';
import _get from 'lodash/get';
import {
  RECEIVED_STORE,
  RECEIVED_STORE_ERROR,
  REQUEST_STORE,
  REQUEST_TERMINAL,
  RECEIVED_TERMINAL,
  RECEIVED_TERMINAL_ERROR,
  REQUEST_POS_LOGIN,
  RECEIVED_POS_LOGIN,
  CLEAR_POS_LOGIN

} from '../constants/store';

const storeReducer = (state = 'storeState', action) => {
  switch (action.type) {
    default:
      return state
  }
}


const storesData = (state = {
  isFetching: false,
  didInvalidate: false,
  type: '',
  status: '',
  storeData: [],
  terminalData: [],
  posLogin:[],
}, action) => {
  switch (action.type) {
    case REQUEST_STORE:
      return Object.assign({}, state, {
        isFetching: true,
        type: action.type, lastUpdated: action.receivedAt
      });
    case RECEIVED_STORE:
      return Object.assign({}, state, {
        isFetching: false,
        type: action.type, status: action.status,
        didInvalidate: false, storeData: action.data,
        lastUpdated: action.receivedAt
      });
    case REQUEST_TERMINAL:
      return Object.assign({}, state, {
        isFetching: true,terminalData:[],
        type: action.type, lastUpdated: action.receivedAt
      });
    case RECEIVED_TERMINAL:
      return Object.assign({}, state, {
        isFetching: false,
        type: action.type, status: action.status,
        didInvalidate: false, terminalData: action.data,
        lastUpdated: action.receivedAt
      });
      case REQUEST_POS_LOGIN:
      return Object.assign({}, state, {
        isFetching: true,posLogin:[],status:'',
        type: action.type, lastUpdated: action.receivedAt
      });
    case RECEIVED_POS_LOGIN:
      return Object.assign({}, state, {
        isFetching: false,
        type: action.type, status: action.status,
        didInvalidate: false, posLogin: action.data,
        lastUpdated: action.receivedAt
      });
      case CLEAR_POS_LOGIN:
      return Object.assign({}, state, {
        isFetching: false,
        type: action.type, status: '',
        didInvalidate: false, posLogin: [],
        lastUpdated: action.receivedAt
      });

    default:
      return state
  }
}


export {
    storesData
}

export default storeReducer;