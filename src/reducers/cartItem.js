
import _get from 'lodash/get'

const cartItem = (state = { cartItems: [], }, action) => {
    switch (action.type) {
        case 'CART_ITEM_LIST':
            let grossTotal = 0;
            let itemsDiscount = 0;
            let discount = 0
            let totalQuantity = 0;
            let netTotal = 0;
            action.data.forEach(item => {
                if (item.itemDiscount) {
                    debugger;
                    discount = parseFloat(item.itemDiscount)*(_get(item, 'doc.product.salePrice.price') * item.cartQuantity)/100;
                    itemsDiscount+=discount
                    item.effectiveTotal = (_get(item, 'doc.product.salePrice.price') * item.cartQuantity) - parseFloat(discount);

                }
                else {
                    item.effectiveTotal = (_get(item, 'doc.product.salePrice.price') * item.cartQuantity)
                }
                grossTotal += (_get(item, 'doc.product.salePrice.price') * item.cartQuantity);
                totalQuantity +=item.cartQuantity;
            });
            netTotal = grossTotal - (itemsDiscount||0) - _get(state,'cartDiscount',0)-_get(state,'empDiscount',0)
            return Object.assign({}, state, {
                cartItems: action.data,
                grossTotal:grossTotal.toFixed(2),
                itemsDiscount:itemsDiscount.toFixed(2),
                totalQuantity,
                netTotal:netTotal.toFixed(2)
            });
            break;
        case 'ADD_DISCOUNT_TO_CART':
            let newState = Object.assign({}, state, {
                cartDiscount: action.data,
            });
            return newState
            break;
        case 'ADD_CUSTOMER_TO_CART':
            return Object.assign({}, state, {
                customer: action.data,
            });
            break;


    }
    return state;
}




export default cartItem;