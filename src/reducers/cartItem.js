
const cartItem = (state = { cartItems: [], }, action) => {
    switch (action.type) {
        case 'CART_ITEM_LIST':
            debugger
            let total = 0;
            let itemDiscountTotal = 0;
            action.data.forEach(item => {
                total += item.subTotal;
                if(item.itemDiscount)
                itemDiscountTotal += parseFloat(item.itemDiscount)
            });
            return Object.assign({}, state, {
                cartItems: action.data,
                total,
                itemDiscountTotal
            });
            break;
        case 'ADD_DISCOUNT_TO_CART':
            let newState = Object.assign({}, state, {
                discount: action.data,
            });
            console.log(newState, "newState is here");
            return newState
            break;

    }
    return state;
}




export default cartItem;