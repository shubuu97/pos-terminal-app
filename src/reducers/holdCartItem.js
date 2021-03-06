
const holdCartItem = (state = { holdedItems: [], }, action) => {
    switch (action.type) {
        case 'HOLD_CART_ITEM':
            return Object.assign({}, state, {
                holdedItems: [...state.holdedItems, action.data]
            });
            break;
        case 'DELETE_HOLD_CART_ITEM':
            return Object.assign({}, state, {
                holdedItems: action.data
            });
            break;
        case 'ON_HOLD_DATA':
            return Object.assign({}, state, {
                unHoldedItem: action.data
            });
    }
    return state;
}




export default holdCartItem;