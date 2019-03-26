import _get from 'lodash/get'
import * as COMMON_CONSTANTS from '../constants/common';

const zipCodeReducer = (
    state = { addressData: {},
    }, action ) => {
    switch (action.type) {
        case COMMON_CONSTANTS.REQUEST_ADDRESS_FROM_ZIP:
            return Object.assign({}, state, {
                isFetching: true,
                type: action.type,
                lastUpdated: action.receivedAt,
            });
            break;
        case COMMON_CONSTANTS.RECEIVED_ADDRESS_FROM_ZIP:
            return Object.assign({}, state, {
                error: '',
                isFetching: false,
                type: action.type,
                addressData: action.data,
                status: action.status,
                lastUpdated: action.receivedAt,
            });
            break;
        case COMMON_CONSTANTS.RECEIVED_ADDRESS_FROM_ZIP_ERROR:
            return Object.assign({}, state, {
                isFetching: false,
                type: action.type,
                error: action.error,
                lastUpdated: action.receivedAt
            });
            break;
    }
    return state;
}

export default zipCodeReducer;