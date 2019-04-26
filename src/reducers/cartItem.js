import _get from 'lodash/get'

const cartItem = (state = {
    cartItems: [],
}, action) => {
    // ! Static limit for max discount set to 80%
    let maxAllowedDiscount = 80
    let employeeDiscountPercent = _get(state, 'empDiscount', 0)
    let cartDiscountRemoved = false
    switch (action.type) {
        case 'ADD_DISCOUNT_TO_CART':
            // * Calculating Discountable Total
            let discountableCartTotal = 0
            action.data.cartItems.forEach(item => {
                if (_get(item, 'doc.product.discountable', false)) {
                    discountableCartTotal += parseFloat((parseFloat(_get(item, 'doc.product.salePrice.price', 0)) * _get(item, 'qty', 0)).toFixed(2))
                }
            })
            // * Deciding if discount in "Absolute" or "Percent"
            let cartDiscountPercent, cartAbsoluteValue
            if (action.data.type === '%') {
                cartDiscountPercent = _get(action, 'data.cartDiscount', 0)
                cartAbsoluteValue = false
            }
            else {
                // * Converting "Absolute" to "Percentage" and saving both to reducer
                let discountValue = parseFloat(_get(action, 'data.cartDiscount', 0));
                let absolutePer = Number(discountValue / discountableCartTotal);
                cartDiscountPercent = parseFloat((absolutePer * 100).toFixed(2));
                cartAbsoluteValue = _get(action, 'data.cartDiscount', 0)
            }


            if (cartDiscountPercent + employeeDiscountPercent <= maxAllowedDiscount) {
                return Object.assign({}, state, {
                    cartDiscountPercent,
                    cartAbsoluteValue,
                    discountableCartTotal
                });
            }
            else {
                return Object.assign({}, state, {
                    cartDiscountPercent: 0,
                    cartAbsoluteValue: false,
                    cartDiscountRemoved: true,
                    discountableCartTotal
                });
            }

            break;
        case 'ADD_CUSTOMER_TO_CART':
            return Object.assign({}, state, {
                customer: action.data,
            });
        case 'SALE_COMMENT':
            return Object.assign({}, state, {
                saleComment: action.data,
            });
        case 'ADD_EMPLOYEE_DISCOUNT':
            return Object.assign({}, state, {
                empDiscount: action.data,
            });
        case 'GET_LOYALTY_EARNING_RULES':
            return Object.assign({}, state, {
                earningRules: action.data,
            });
            break;
        case 'CART_ITEM_LIST':

            // ****** Initializing Required Fields ******
            let cartDiscountPercentage = _get(state, 'cartDiscountPercent', 0)
            let sumDiscount = employeeDiscountPercent + cartDiscountPercentage
            let allowedCartDiscount = maxAllowedDiscount

            let regularTotal = 0
            let cartQty = 0
            let netTotal = 0
            let totalDiscount = 0
            let totalAmount = {
                currencyCode: '$',
                amount: 0
            }
            let discountableAmount = 0
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
            let earningLoyaltyRules = {
                minimumSaleAmount: _get(state, 'earningRules.earningRule.minimumSaleAmount', 0),
                earningMultiplier: _get(state, 'earningRules.earningRule.earningMultiplier', 0)
            }
            let loyaltyEarned = 0



            // ****** Looping through each Item in the Cart ******
            action.data.forEach(item => {
                let discountable = _get(item, 'doc.product.discountable', false)

                // * Calculating : RegularTotal = SalePrice * Qty
                item.itemRegularTotal = {
                    currencyCode: _get(item, 'doc.product.salePrice.currencyCode', '$'),
                    amount: parseFloat((parseFloat(_get(item, 'doc.product.salePrice.price', 0)) * _get(item, 'qty', 0)).toFixed(2))
                }


                // ****** Item Discount calculations ******

                // Checkinging if item is discountable
                if (discountable) {
                    item.cartDiscountPercent = parseFloat(_get(state, 'cartDiscountPercent', 0))
                    item.employeeDiscountPercent = employeeDiscountPercent
                    discountableAmount += parseFloat((parseFloat(_get(item, 'doc.product.salePrice.price', 0)) * _get(item, 'qty', 0)).toFixed(2))
                } else {
                    item.cartDiscountPercent = 0
                    item.employeeDiscountPercent = 0
                }


                let totalPercentDiscount = parseFloat(_get(item, 'itemDiscountPercent', 0)) + parseFloat(_get(item, 'cartDiscountPercent', 0)) + parseFloat(_get(item, 'employeeDiscountPercent', 0))
                let thisItemDiscountAmount = 0, thisCartDiscountAmount = 0, thisEmployeemDiscountAmount = 0

                if (totalPercentDiscount <= maxAllowedDiscount) {
                    thisItemDiscountAmount = (parseFloat(_get(item, 'itemRegularTotal.amount', 0)) * parseFloat(_get(item, 'itemDiscountPercent', 0)) / 100)
                    thisCartDiscountAmount = (parseFloat(_get(item, 'itemRegularTotal.amount', 0)) * parseFloat(_get(item, 'cartDiscountPercent', 0)) / 100)
                    thisEmployeemDiscountAmount = (parseFloat(_get(item, 'itemRegularTotal.amount', 0)) * parseFloat(_get(item, 'employeeDiscountPercent', 0)) / 100)
                    item.itemTotalDiscountAmount = {
                        currencyCode: _get(item, 'doc.product.salePrice.currencyCode', '$'),
                        amount: parseFloat((parseFloat(_get(item, 'itemRegularTotal.amount', 0)) * totalPercentDiscount / 100).toFixed(2))
                    }
                    item.itemSubTotal = {
                        currencyCode: _get(item, 'doc.product.salePrice.currencyCode', '$'),
                        amount: parseFloat((parseFloat(_get(item, 'itemRegularTotal.amount', 0)) - parseFloat(_get(item, 'itemTotalDiscountAmount.amount', 0))).toFixed(2))
                    }
                    item.allowedDiscountPercent = maxAllowedDiscount - totalPercentDiscount
                }
                else if (parseFloat(_get(item, 'cartDiscountPercent', 0)) + parseFloat(_get(item, 'employeeDiscountPercent', 0)) <= maxAllowedDiscount) {
                    thisItemDiscountAmount = 0
                    item.itemDiscountPercent = 0
                    thisCartDiscountAmount = (parseFloat(_get(item, 'itemRegularTotal.amount', 0)) * parseFloat(_get(item, 'cartDiscountPercent', 0)) / 100)
                    thisEmployeemDiscountAmount = (parseFloat(_get(item, 'itemRegularTotal.amount', 0)) * parseFloat(_get(item, 'employeeDiscountPercent', 0)) / 100)
                    item.itemTotalDiscountAmount = {
                        currencyCode: _get(item, 'doc.product.salePrice.currencyCode', '$'),
                        amount: parseFloat((parseFloat(_get(item, 'itemRegularTotal.amount', 0)) * (parseFloat(_get(item, 'cartDiscountPercent', 0)) + parseFloat(_get(item, 'employeeDiscountPercent', 0))) / 100).toFixed(2))
                    }
                    item.itemSubTotal = {
                        currencyCode: _get(item, 'doc.product.salePrice.currencyCode', '$'),
                        amount: parseFloat((parseFloat(_get(item, 'itemRegularTotal.amount', 0)) - parseFloat(_get(item, 'itemTotalDiscountAmount.amount', 0))).toFixed(2))
                    }
                    item.allowedDiscountPercent = maxAllowedDiscount - (parseFloat(_get(item, 'cartDiscountPercent', 0)) + parseFloat(_get(item, 'employeeDiscountPercent', 0)))
                }
                if (allowedCartDiscount >= item.allowedDiscountPercent) {
                    allowedCartDiscount = item.allowedDiscountPercent + parseFloat(_get(item, 'cartDiscountPercent', 0))
                }

                // ****** Tax Calculations ******
                let isTaxable = ("isTaxable" in item.doc.product)
                let itemTaxPercent = 0
                let taxAmount = 0;
                if (isTaxable) {
                    let federalTaxRate = localStorage.getItem('federalTaxRate')
                    let stateTaxRate = localStorage.getItem('stateTaxRate')
                    let countyTaxRate = localStorage.getItem('countyTaxRate')
                    itemTaxPercent = Number(federalTaxRate) + Number(stateTaxRate) + Number(countyTaxRate);
                    console.log(itemTaxPercent, 'itemTaxPercent')
                    taxAmount = (_get(item, 'itemSubTotal.amount', 0) * itemTaxPercent / 100).toFixed(2);

                }
                item.itemTaxAmount = {
                    currencyCode: _get(item, 'doc.product.salePrice.currencyCode', '$'),
                    amount: parseFloat(taxAmount)
                }
                item.itemTaxPercent = itemTaxPercent;
                item.itemEffectiveTotal = {
                    currencyCode: _get(item, 'doc.product.salePrice.currencyCode', '$'),
                    amount: parseFloat((parseFloat(_get(item, 'itemSubTotal.amount', 0)) + parseFloat(taxAmount)).toFixed(2))
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
                    amount: parseFloat((parseFloat(_get(totalTaxAmount, 'amount', 0)) + parseFloat(taxAmount)).toFixed(2))
                }
            });

            totalDiscount = {
                currencyCode: '$',
                amount: parseFloat(itemDiscountAmount.amount) + parseFloat(cartDiscountAmount.amount) + parseFloat(employeeDiscountAmount.amount)
            }

            if (!(_get(state, 'customer.guest', false)) && netTotal > earningLoyaltyRules.minimumSaleAmount) {
                loyaltyEarned = Math.round(netTotal * earningLoyaltyRules.earningMultiplier);
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
                totalDiscount,
                loyaltyEarned,
                discountableAmount,
                allowedCartDiscount
            });
            break;
    }
    return state;
}




export default cartItem;