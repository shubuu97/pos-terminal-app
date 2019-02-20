
import _get from 'lodash/get'

const cartItem = (state = { cartItems: [], }, action) => {
    switch (action.type) {
        case 'CART_ITEM_LIST':
            let cartTotal = 0;
            let itemsDiscount = 0;
            let totalQuantity = 0;
            action.data.forEach(item => {
                if(item.itemDiscount){
                    itemsDiscount += parseFloat(item.itemDiscount)
                    item.subTotal = (_get(item,'doc.product.salePrice.price') * item.cartQuantity) - parseFloat(item.itemDiscount);
                }
                else{
                    item.subTotal = (_get(item,'doc.product.salePrice.price') * item.cartQuantity)
                }
                cartTotal += item.subTotal;
                totalQuantity +=item.cartQuantity
            });
            return Object.assign({}, state, {
                cartItems: action.data,
                cartTotal:cartTotal.toFixed(2),
                itemsDiscount,
                totalQuantity
            });
            break;
        case 'ADD_DISCOUNT_TO_CART':
            let newState = Object.assign({}, state, {
                cartDiscount: action.data,
            });
            return newState
            break;
            case 'ADD_CUSTOMER_TO_CART':
            debugger;
            return Object.assign({}, state, {
                customer: action.data,
            });
            break;
        

    }
    return state;
}




export default cartItem;