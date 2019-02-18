const staticReducers = (state = { data: {}, }, action) => {
    switch (action.type) {
        case 'CART_ITEM_LIST':
            return Object.assign({}, state, {
                type: action.type,
                CartItems: action.data
            });
    }
    return state;
}



export default staticReducers;