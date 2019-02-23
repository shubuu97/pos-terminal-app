
import _get from 'lodash/get'

const cartItem = (state = { cartItems: [], }, action) => {
    switch (action.type) {
        case 'UNSAFE_CART_ITEM_LIST':
            let grossTotal = 0;
            let itemsDiscount = 0;
            let discount = 0
            let totalQuantity = 0;
            action.data.forEach(item => {
                if (item.itemDiscount) {
                    discount = parseFloat(item.itemDiscount) * (_get(item, 'doc.product.salePrice.price') * item.cartQuantity) / 100;
                    itemsDiscount += discount
                    item.effectiveTotal = (_get(item, 'doc.product.salePrice.price') * item.cartQuantity) - parseFloat(discount);

                }
                else {
                    item.effectiveTotal = (_get(item, 'doc.product.salePrice.price') * item.cartQuantity)
                }
                grossTotal += (_get(item, 'doc.product.salePrice.price') * item.cartQuantity);
                totalQuantity += item.cartQuantity;
            });
            netTotal = grossTotal - (itemsDiscount || 0) - _get(state, 'cartDiscount', 0) - _get(state, 'empDiscount', 0)``
            return Object.assign({}, state, {
                cartItems: action.data,
                grossTotal: parseFloat(grossTotal.toFixed(2)),
                itemsDiscount: parseFloat(itemsDiscount.toFixed(2)),
                totalQuantity,
                netTotal: parseFloat(netTotal.toFixed(2))
            });
            break;
        case 'ADD_DISCOUNT_TO_CART':
            let newState = Object.assign({}, state, {
                cartDiscountPercent: action.data,
            });
            return newState
            break;
        case 'ADD_CUSTOMER_TO_CART':
            return Object.assign({}, state, {
                customer: action.data,
            });
        case 'SALE_COMMENT':
            return Object.assign({}, state, {
                saleComment: action.data,
            });
        case 'CART_ITEM_LIST':
            let employeeDiscountPercent = _get(state, 'empDiscount', 0)
            let regularTotal = 0
            let cartQty = 0
            let netTotal = 0
            let totalDiscount = 0
            let totalAmount = {
                currencyCode: '$',
                amount: 0
            }
            let itemDiscountAmount = {
                currencyCode: '$',
                amount: 0
            }
            let cartDiscountAmount = {
                currencyCode: '$',
                amount: 0
            }
            let employeeDiscountAmount = {
                currencyCode: '$',
                amount: 0
            }
            let totalTaxAmount = {
                currencyCode: '$',
                amount: 0
            }
            action.data.forEach(item => {
                item.itemRegularTotal = {
                    currencyCode: _get(item, 'doc.product.salePrice.currencyCode', '$'),
                    amount: parseFloat((parseFloat(_get(item, 'doc.product.salePrice.price', 0)) * _get(item, 'qty', 0)).toFixed(2))
                }
                item.cartDiscountPercent = parseFloat(_get(state, 'cartDiscountPercent', 0))
                item.employeeDiscountPercent = employeeDiscountPercent
                let totalPercentDiscount = parseFloat(_get(item, 'itemDiscountPercent', 0)) + parseFloat(_get(item, 'cartDiscountPercent', 0)) + parseFloat(_get(item, 'employeeDiscountPercent', 0))

                let thisItemDiscountAmount = (parseFloat(_get(item, 'itemRegularTotal.amount', 0)) * parseFloat(_get(item, 'itemDiscountPercent', 0)) / 100)
                let thisCartDiscountAmount = (parseFloat(_get(item, 'itemRegularTotal.amount', 0)) * parseFloat(_get(item, 'cartDiscountPercent', 0)) / 100)
                let thisEmployeemDiscountAmount = (parseFloat(_get(item, 'itemRegularTotal.amount', 0)) * parseFloat(_get(item, 'employeeDiscountPercent', 0)) / 100)

                item.itemTotalDiscountAmount = {
                    currencyCode: _get(item, 'doc.product.salePrice.currencyCode', '$'),
                    amount: parseFloat((parseFloat(_get(item, 'itemRegularTotal.amount', 0)) * totalPercentDiscount / 100).toFixed(2))
                }
                item.itemSubTotal = {
                    currencyCode: _get(item, 'doc.product.salePrice.currencyCode', '$'),
                    amount: parseFloat((parseFloat(_get(item, 'itemRegularTotal.amount', 0)) - parseFloat(_get(item, 'itemTotalDiscountAmount.amount', 0))).toFixed(2))
                }
                item.taxPercentage = _get(state, 'taxPercentage', 0)
                let taxAmount = _get(item, 'itemSubTotal.amount', 0) * _get(item, 'taxPercentage', 0) / 100
                item.itemEffectiveTotal = {
                    currencyCode: _get(item, 'doc.product.salePrice.currencyCode', '$'),
                    amount: parseFloat((parseFloat(_get(item, 'itemSubTotal.amount', 0)) + taxAmount).toFixed(2))
                }

                regularTotal += (parseFloat(_get(item, 'doc.product.salePrice.price')) * _get(item, 'qty', 0));
                cartQty += _get(item, 'qty', 0);
                netTotal += parseFloat(_get(item, 'itemSubTotal.amount', 0))
                totalAmount = {
                    currencyCode: _get(item, 'doc.product.salePrice.currencyCode', '$'),
                    amount: parseFloat((parseFloat(_get(totalAmount, 'amount', 0)) + parseFloat(_get(item, 'itemEffectiveTotal.amount', 0))).toFixed(2))
                }
                itemDiscountAmount = {
                    currencyCode: _get(item, 'doc.product.salePrice.currencyCode', '$'),
                    amount: parseFloat((parseFloat(_get(itemDiscountAmount, 'amount', 0)) + thisItemDiscountAmount).toFixed(2))
                }
                cartDiscountAmount = {
                    currencyCode: _get(item, 'doc.product.salePrice.currencyCode', '$'),
                    amount: parseFloat((parseFloat(_get(cartDiscountAmount, 'amount', 0)) + thisCartDiscountAmount).toFixed(2))
                }
                employeeDiscountAmount = {
                    currencyCode: _get(item, 'doc.product.salePrice.currencyCode', '$'),
                    amount: parseFloat((parseFloat(_get(employeeDiscountAmount, 'amount', 0)) + thisEmployeemDiscountAmount).toFixed(2))
                }
                totalTaxAmount = {
                    currencyCode: _get(item, 'doc.product.salePrice.currencyCode', '$'),
                    amount: parseFloat((parseFloat(_get(totalTaxAmount, 'amount', 0)) + taxAmount).toFixed(2))
                }
            });

            totalDiscount = {
                currencyCode: '$',
                amount: parseFloat(itemDiscountAmount.amount) + parseFloat(cartDiscountAmount.amount) + parseFloat(employeeDiscountAmount.amount)
            }

            return Object.assign({}, state, {
                cartItems: action.data,
                regularTotal: regularTotal.toFixed(2),
                totalAmount,
                cartQty,
                itemDiscountAmount,
                cartDiscountAmount,
                employeeDiscountAmount,
                totalTaxAmount,
                netTotal: netTotal.toFixed(2),
                totalDiscount
            });
            break;
    }
    return state;
}




export default cartItem;