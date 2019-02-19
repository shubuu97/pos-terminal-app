
const holdCartItem = (state = { holdItems: [], }, action) => {
    switch (action.type) {
        case 'HOLD_CART_ITEM':
            return Object.assign({}, state, {
                holdedItems:action.data
            });
            break;
    }
    return state;
}




export default holdCartItem;