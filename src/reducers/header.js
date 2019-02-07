import { combineReducers } from 'redux';
import _get from 'lodash/get';
import {
    HEADER_TOGGLE_CAT,
    HEADER_SHOW_HOME_PAGE,
    HEADER_SHOW_LEFT_BACK_BUTTON,
    HEADER_HIDE_LEFT_BACK_BUTTON,
    HEADER_ORDER_HISTORY_OPEN,
    HEADER_SEARCH_PRODUCT,
    HEADER_SCAN_PRODUCT,
    HEADER_REFRESH_PRODUCT,
    HEADER_SET_REFRESH_TIME,
    HEADER_ONHOLD_HISTORY_OPEN,
    HEADER_ADD_MISC_PRODUCT

} from '../constants/header';

const headerReducer = (state = 'headerState', action) => {
    switch (action.type) {
        default:
            return state
    }
}


const headersData = (state = {
    isFetching: false,
    didInvalidate: false,
    type: '',
    status: '',
    leftDrawerOpen: false,
    isRefreshProduct: false,
}, action) => {
    switch (action.type) {
        case HEADER_TOGGLE_CAT:
            
            return Object.assign({}, state, {
                isFetching: false,
                type: action.type,
                leftDrawerOpen: action.leftDrawerOpen,
            });
        case HEADER_SHOW_HOME_PAGE:
            return Object.assign({}, state, {
                isFetching: false,
                type: action.type, homePage: action.homePage, leftDrawerOpen: false
            });
        case HEADER_SHOW_LEFT_BACK_BUTTON:
            return Object.assign({}, state, {
                isFetching: false,
                type: action.type, showBackButton: action.showBackButton
            });
        case HEADER_HIDE_LEFT_BACK_BUTTON:
            return Object.assign({}, state, {
                isFetching: false,
                type: action.type, showBackButton: action.showBackButton,
                closeCheckoutOrOrderDrawer: action.closeCheckoutOrOrderDrawer
            });
        case HEADER_ORDER_HISTORY_OPEN:
            return Object.assign({}, state, {
                isFetching: false,
                type: action.type,
                orderHistoryOpen: action.orderHistoryOpen,
            });
            case HEADER_ONHOLD_HISTORY_OPEN:
            return Object.assign({}, state, {
                isFetching: false,
                type: action.type,
                onHoldHistoryOpen: action.onHoldHistoryOpen,
            });
        case HEADER_SEARCH_PRODUCT:
            return Object.assign({}, state, {
                isFetching: false,
                type: action.type, searchParam: action.searchParam,
                searchProduct: action.searchProduct,
            });
        case HEADER_SCAN_PRODUCT:
            return Object.assign({}, state, {
                isFetching: false,
                type: action.type, scanProduct: action.scanProduct,
                scanParam: action.scanParam,
            });
        case HEADER_REFRESH_PRODUCT:
            return Object.assign({}, state, {
                isFetching: false,
                type: action.type, isRefreshProduct: action.isRefreshProduct,
            });
        case HEADER_SET_REFRESH_TIME:
            return Object.assign({}, state, {
                isFetching: false,
                type: action.type, refreshTime: action.refreshTime,
            });
            case HEADER_ADD_MISC_PRODUCT:
            return Object.assign({}, state, {
                isFetching: false,
                type: action.type, 
                addMisProduct: action.addMisProduct,
                miscProduct:action.product
            });
        default:
            return state
    }
}


export {
    headersData
}

export default headerReducer;