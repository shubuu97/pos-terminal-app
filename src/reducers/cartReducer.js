import _get from 'lodash/get'
import _findIndex from 'lodash/findIndex'
/* Dinero Import */
import Dinero from "dinero.js";
import { stat } from 'fs';

// * Init method for Dinero
const DineroFunc = (amount) => {
    return Dinero({
        amount: parseInt(amount),
        currency: 'USD'
    })
}

const cartItem = (state = {
    cartItems: [],
}, action) => {
    // ! Static limit for max discount set to 80%

    const maxAllowedDiscountPercent = 80;
    const employeeDiscountPercent = _get(state, 'empDiscount', 0);

    switch (action.type) {
        case 'ADD_CUSTOMER_TO_CART':
            return Object.assign({}, state, {
                customer: action.data,
            });
            break;
        case 'SALE_COMMENT':
            return Object.assign({}, state, {
                saleComment: action.data,
            });
            break;
        case 'ADD_EMPLOYEE_DISCOUNT':
            return Object.assign({}, state, {
                empDiscount: action.data,
            });
            break;
        case 'GET_LOYALTY_EARNING_RULES':
            return Object.assign({}, state, {
                earningRules: action.data,
            });
            break;
        case 'CART_ITEM_LIST':
            let maxAllowedDiscountMoney = DineroFunc(0)
            const employeeDiscountPercent = _get(state, 'empDiscount', 0);

            let regularTotalMoney = DineroFunc(0)
            let cartQty = 0
            // Discounts 
            let discountableMoney = DineroFunc(0)
            let employeeDiscountMoney = DineroFunc(0)
            let cartDiscountMoney = DineroFunc(0)
            let allowedCartDiscountMoney = maxAllowedDiscountMoney
            let totalItemDiscountMoney = DineroFunc(0)
            let loyaltyDiscountMoney = DineroFunc(0)
            let totalDiscountMoney = DineroFunc(0)
            // After Discount
            let netTotalMoney = DineroFunc(0)
            // Tax
            let taxMoney = DineroFunc(0)
            // After Tax
            let totalMoney = DineroFunc(0)

            let cartDiscount = {}
            let earningLoyaltyRules = {
                minimumSaleAmount: _get(state, 'earningRules.earningRule.minimumSaleAmount', 0),
                earningMultiplier: _get(state, 'earningRules.earningRule.earningMultiplier', 0)
            }


            let discountableItemsIndex = []
            let discountableItems = []
            action.data.cartItems.forEach((item, index) => {
                if (_get(item, 'doc.product.discountable', false)) {
                    // ! MAYUK - To be changed When Marine gives us the right format
                    let totalItemPrice = DineroFunc((_get(item, 'doc.product.salePrice.price', 0) * 100))
                    let subTotal = totalItemPrice.multiply(_get(item, 'qty', 0))
                    discountableMoney = discountableMoney.add(subTotal)
                    discountableItemsIndex.push(index)
                    discountableItems.push(subTotal.getAmount())
                }
            })
            maxAllowedDiscountMoney = discountableMoney.percentage(80);
            let cartDiscountAllocation = []
            if (discountableItems.length > 0) {
                cartDiscountAllocation = cartDiscountMoney.allocate(discountableItems)
            }

            // ************ Employee Discount ************
            employeeDiscountMoney = discountableMoney.percentage(employeeDiscountPercent);
            let employeeDiscountAllocation = []
            if (discountableItems.length > 0) {
                employeeDiscountAllocation = employeeDiscountMoney.allocate(discountableItems)
            }


            // ************ Cart Discount ************
            // * Deciding if discount in "Absolute" or "Percent"
            let cartDiscountPercent
            if (action.data.type === '%') {
                cartDiscountPercent = _get(action, 'data.cartDiscount', 0);
                cartDiscountMoney = discountableMoney.percentage(cartDiscountPercent);
            }
            else {
                // * Converting "Absolute" to "Percentage" and saving both to reducer
                // ! Static Currency
                cartDiscountMoney = DineroFunc((_get(action, 'data.cartDiscount', 0)))
                cartDiscountPercent = (cartDiscountMoney.getAmount() / discountableMoney.getAmount()) * 100
            }

            if (cartDiscountMoney.getAmount() + employeeDiscountMoney.getAmount() <= maxAllowedDiscountMoney.getAmount()) {
                cartDiscount = {
                    cartDiscountPercent,
                    cartDiscountMoney
                }
            }
            else {
                cartDiscount = {
                    cartDiscountPercent: 0,
                    cartDiscountMoney: DineroFunc(0)
                }
            }

            // ************ Item Discount ************
            action.data.cartItems.forEach((item, index) => {
                item.itemSalesPriceMoney = DineroFunc((_get(item, 'doc.product.salePrice.price', 0) * 100))
                item.itemRegularTotalMoney = item.itemSalesPriceMoney.multiply(_get(item, 'qty', 0))

                // ****** Item Discounts calculations ****** //
                // * Checking if item is discountable
                if (_get(item, 'doc.product.discountable', false)) {
                    item.itemDiscountableMoney = DineroFunc(0)
                    let key = _findIndex(discountableItemsIndex, discountableItemsIndex => discountableItemsIndex == index)
                    if (key >= 0) {
                        item.itemDiscountableMoney = DineroFunc(discountableItems[key])
                        item.cartDiscountMoney = cartDiscountAllocation[key]
                        item.empDiscountMoney = employeeDiscountAllocation[key]
                        item.allowedItemDiscountMoney = item.itemDiscountableMoney.subtract(item.empDiscountMoney).subtract(item.cartDiscountMoney)
                    } else {
                        item.cartDiscountMoney = DineroFunc(0);
                        item.empDiscountMoney = DineroFunc(0);
                        item.allowedItemDiscountMoney = DineroFunc(0);
                    }
                } else {
                    item.cartDiscountMoney = DineroFunc(0);
                    item.empDiscountMoney = DineroFunc(0);
                    item.allowedItemDiscountMoney = DineroFunc(0);
                }

                item.itemDiscountMoney = Dinero(_get(item, 'itemDiscountMoney', { amount: 0, currency: 'USD' }))

                // * Checking if Item Discount Exceeds or not
                console.log(item.cartDiscountMoney, item.empDiscountMoney, item.itemDiscountMoney, 'mayuk')
                let totalItemDiscount = item.cartDiscountMoney.add(item.empDiscountMoney).add(item.itemDiscountMoney)
                if (item.itemDiscountableMoney.lessThan(totalItemDiscount)) {
                    item.itemDiscountMoney = DineroFunc(0);
                    totalItemDiscount = item.cartDiscountMoney.add(item.empDiscountMoney).add(item.itemDiscountMoney)
                }


                // * Checking if Cart Discount Exceeds or not
                if (item.itemDiscountableMoney.lessThan(totalItemDiscount)) {
                    cartDiscount = {
                        cartDiscountPercent: 0,
                        cartDiscountMoney: DineroFunc(0)
                    }
                    totalItemDiscount = item.cartDiscountMoney.add(item.empDiscountMoney).add(item.itemDiscountMoney)
                }

                // * Calculating Allowed Cart Discount
                if (allowedCartDiscountMoney.greaterThan(totalItemDiscount.subtract(item.cartDiscountMoney))) {
                    allowedCartDiscountMoney = totalItemDiscount.subtract(item.cartDiscountMoney)
                }

                // * Calculating SubTotal = Total + Discounts
                item.subTotal = item.itemRegularTotalMoney.subtract(item.cartDiscountMoney).subtract(item.empDiscountMoney).subtract(item.itemDiscountMoney)

                totalItemDiscountMoney = totalItemDiscountMoney.add(item.itemDiscountMoney)

                // ****** Tax Calculations ****** //
                let isTaxable = ("isTaxable" in item.doc.product)
                let itemTaxPercent = 0
                if (isTaxable) {
                    let federalTaxRate = localStorage.getItem('federalTaxRate')
                    let stateTaxRate = localStorage.getItem('stateTaxRate')
                    let countyTaxRate = localStorage.getItem('countyTaxRate')
                    itemTaxPercent = Number(federalTaxRate) + Number(stateTaxRate) + Number(countyTaxRate);
                    item.itemTaxAmount = item.subTotal.percentage(itemTaxPercent)
                }
                else {
                    item.itemTaxAmount = DineroFunc(0)
                }

                item.itemEffectiveTotal = item.subTotal.add(item.itemTaxAmount);

                regularTotalMoney = regularTotalMoney.add(item.itemRegularTotalMoney);
                cartQty += _get(item, 'qty', 0);
                netTotalMoney = netTotalMoney.add(item.subTotal);
                taxMoney = taxMoney.add(item.itemTaxAmount);
                totalMoney = totalMoney.add(item.itemEffectiveTotal);
            })
            totalDiscountMoney = employeeDiscountMoney.add(cartDiscountMoney).add(totalItemDiscountMoney);

            if (!(_get(state, 'customer.guest', false)) && netTotalMoney.getAmount() > earningLoyaltyRules.minimumSaleAmount) {
                let loyaltyEarned = Math.round(netTotalMoney.getAmount() * earningLoyaltyRules.earningMultiplier);
            }

            return Object.assign({}, state, {
                cartItems: action.data.cartItems,
                allowedCartDiscountMoney,
                discountableMoney,
                cartDiscount,
                employeeDiscountMoney,
                totalItemDiscountMoney,
                regularTotalMoney,
                cartQty,
                totalDiscountMoney,
                netTotalMoney,
                taxMoney,
                totalMoney,
            });

            break;
    }
    return state;
}

export default cartItem;