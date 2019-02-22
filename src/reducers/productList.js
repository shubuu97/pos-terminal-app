const ProductList = (state = {
    type: '',
    error: '',
    isFetching: false,
    lookUpData: [],
    lastItemId: ''
}, action) => {
    switch (action.type) {
    case 'GET_PRODUCT_DATA_INIT':
        return Object.assign({}, state, {
        isFetching: true,
        type: action.type,
        lastUpdated: action.receivedAt,
        });
    case 'GET_PRODUCT_DATA_SUCCESS':
        return Object.assign({}, state, {
        error: '',
        isFetching: false,
        type: action.type,
        lookUpData: action.data,
        lastItemId: action.lastItemId,
        lastUpdated: action.receivedAt,
        });
    case 'GET_PRODUCT_DATA_ERROR':
        return Object.assign({}, state, {
        isFetching: false,
        type: action.type,
        error: action.error,
        lookUpData: [],
        lastItemId: '',
        lastUpdated: action.receivedAt
        });

    }
    return state;
}

export default ProductList;