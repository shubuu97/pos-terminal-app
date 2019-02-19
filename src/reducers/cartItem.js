
const cartItem = (state = { cartItems: [], }, action) => {
    switch (action.type) {
        case 'CART_ITEM_LIST':
            let total = 0;
            action.data.forEach(item => {
                total += item.subTotal;
            });
            return Object.assign({}, state, {
                cartItems: action.data,
                total
            });
            break;
        case 'ADD_DISCOUNT_TO_CART':
        debugger;
            // let total = 0;
            // action.data.forEach(item=>{
            //     total+=item.subTotal;
            //  });
            let newState =  Object.assign({}, state, {
                discount: action.data,
                // total
            });
            console.log(newState,"newState is here");
            return newState

    }
    return state;
}




export default cartItem;