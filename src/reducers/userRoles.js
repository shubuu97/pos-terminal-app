import { combineReducers } from 'redux';
import _get from 'lodash/get';
import {
  RECEIVED_USER_ROLE,
  RECEIVED_USER_ROLE_ERROR,
  REQUEST_USER_ROLE

} from '../constants/userRoles';

const userRoleReducer = (state = 'userRoleState', action) => {
  switch (action.type) {
    default:
      return state
  }
}


const userRolesData = (state = {
  isFetching: false,
  didInvalidate: false,
  type: '',
  status: '',
  userRolesData: []
}, action) => {
  switch (action.type) {
    case REQUEST_USER_ROLE:
      return Object.assign({}, state, {
        isFetching: true, status:'',
        type: action.type, lastUpdated: action.receivedAt
      });
    case RECEIVED_USER_ROLE:
      return Object.assign({}, state, {
        isFetching: false,
        type: action.type, status: action.status,
        didInvalidate: false, userRolesData: action.data,
        lastUpdated: action.receivedAt
      });
    case RECEIVED_USER_ROLE_ERROR:
    return Object.assign({}, state, {
      isFetching: false,
      type: action.type, status: action.status,
      didInvalidate: false, userRolesData: action.error,
      lastUpdated: action.receivedAt
    });

    default:
      return state
  }
}


export {
  userRolesData
}

export default userRoleReducer;