
import _get from 'lodash/get'

const productList = (
    state = { productLists: [],
    }, action ) => {
    switch (action.type) {
        case `GET_PRODUCT_DATA_INIT`:
            return Object.assign({}, state, {
                isFetching: true,
                type: action.type,
                lastUpdated: action.receivedAt,
            });
            break;
        case `GET_PRODUCT_DATA_SUCCESS`:
            return Object.assign({}, state, {
                error: '',
                isFetching: false,
                type: action.type,
                //didInvalidate: false,
                lookUpData: action.data,
                lastUpdated: action.receivedAt,
            });
            break;
        case `GET_PRODUCT_DATA_ERROR`:
            return Object.assign({}, state, {
                isFetching: false,
                type: action.type,
                error: action.error,
                lookUpData: [],
                lastUpdated: action.receivedAt
            });
            break;


        case `GET_NEXT_PAGE_INIT`:
            return Object.assign({}, state, {
                isFetching: true,
                type: action.type,
                lastUpdated: action.receivedAt,
            });
            break;
        case `GET_NEXT_PAGE_SUCCESS`:
            return Object.assign({}, state, {
                error: '',
                isFetching: false,
                type: action.type,
                lookUpData: action.data,
                lastUpdated: action.receivedAt,
            });
            break;
        case `GET_NEXT_PAGE_ERROR`:
            return Object.assign({}, state, {
                isFetching: false,
                type: action.type,
                error: action.error,
                lookUpData: [],
                lastUpdated: action.receivedAt
            });
            break;


        case `GET_PREV_PAGE_INIT`:
            return Object.assign({}, state, {
                isFetching: true,
                type: action.type,
                lastUpdated: action.receivedAt,
            });
            break;
        case `GET_PREV_PAGE_SUCCESS`:
            return Object.assign({}, state, {
                error: '',
                isFetching: false,
                type: action.type,
                //didInvalidate: false,
                lookUpData: action.data,
                lastUpdated: action.receivedAt,
            });
            break;
        case `GET_PREV_PAGE_ERROR`:
            return Object.assign({}, state, {
                isFetching: false,
                type: action.type,
                error: action.error,
                lookUpData: [],
                lastUpdated: action.receivedAt
            });
            break;
    }
    return state;
}

export default productList;