import { combineReducers } from 'redux';
import _get from 'lodash/get';
import {
    REQUEST_ADDRESS_FROM_ZIP,
    RECEIVED_ADDRESS_FROM_ZIP,
    RECEIVED_ADDRESS_FROM_ZIP_ERROR,
  } from '../constants/common';
  const commonReducer = (state = 'commonState', action) => {
    switch (action.type) {
      default:
        return state
    }
  }



const commonData = (state = {
    isFetching: false,
    didInvalidate: false,
    type: '',
    status: '',
    addressData:[],
  }, action) => {
    switch (action.type) {
        case REQUEST_ADDRESS_FROM_ZIP:
        return Object.assign({}, state, {
          isFetching: false,addressData: [],status:'',
          type: action.type, lastUpdated: action.receivedAt
        });
        case RECEIVED_ADDRESS_FROM_ZIP:
        return Object.assign({}, state, {
          isFetching: false,
          type: action.type, status: action.status,
          didInvalidate: false, addressData: action.data,
          lastUpdated: action.receivedAt
        });
        case RECEIVED_ADDRESS_FROM_ZIP_ERROR:
        return Object.assign({}, state, {
          isFetching: false,
          type: action.type, status: action.status,
          didInvalidate: false, addressData: action.error,
          lastUpdated: action.receivedAt
        });
  
      default:
        return state
    
    }
}


export {
    commonData
}

export default commonReducer;