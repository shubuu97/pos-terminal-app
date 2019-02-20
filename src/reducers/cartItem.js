
const cartItem = (state = { cartItems: [], }, action) => {
    switch (action.type) {
        case 'CART_ITEM_LIST':
            let cartTotal = 0;
            let itemsDiscount = 0;
            action.data.forEach(item => {
                if(item.itemDiscount){
                    itemsDiscount += parseFloat(item.itemDiscount)
                    item.subTotal = (item.salePrice.price * item.cartQuantity) - parseFloat(item.itemDiscount);
                }
                else{
                    item.subTotal = (item.salePrice.price * item.cartQuantity)
                }
                cartTotal += item.subTotal;
            });
            return Object.assign({}, state, {
                cartItems: action.data,
                cartTotal,
                itemsDiscount
            });
            break;
        case 'ADD_DISCOUNT_TO_CART':
            let newState = Object.assign({}, state, {
                cartDiscount: action.data,
            });
            return newState
            break;

    }
    return state;
}




export default cartItem;