
const holdCartItem = (state = { holdedItems: [], }, action) => {
    switch (action.type) {
        case 'HOLD_CART_ITEM':
            return Object.assign({}, state, {
                holdedItems:[...state.holdedItems,action.data]
            });
            break;
    }
    return state;
}




export default holdCartItem;