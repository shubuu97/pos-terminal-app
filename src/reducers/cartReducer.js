import _get from 'lodash/get'
import _findIndex from 'lodash/findIndex'
/* Dinero Import */
import Dinero from "dinero.js";
import { stat } from 'fs';
/* Global Imports */
import splitDotWithInt from '../Global/PosFunctions/splitDotWithInt'
import taxCalculations from '../Global/cannabisFunctions/taxCalculations';

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
        case 'GET_LOYALTY_REDEMPTION_RULES':
            return Object.assign({}, state, {
                redemptionRules: action.data,
            });
            break;
        case 'GET_CANNABIS_STORE_TAXES':
            return Object.assign({}, state, {
                cannabisTaxes: action.data,
            });
            break;
        case 'CART_ITEM_LIST':
            let maxAllowedDiscountMoney = DineroFunc(0)
            const employeeDiscountPercent = _get(state, 'empDiscount', 0);
            let regularTotalMoney = DineroFunc(0)
            let cartQty = 0
            // Discounts 
            let loyaltyPoints = parseInt(_get(action, 'data.loyaltyPoints', _get(action, 'data.prevCart.loyaltyPoints', 0)))
            let discountableMoney = DineroFunc(0)
            let employeeDiscountMoney = DineroFunc(0)
            let cartDiscountMoney = _get(state, 'cartDiscount.cartDiscountMoney', DineroFunc(0))
            let allowedCartDiscountMoney = maxAllowedDiscountMoney
            let allowedLoyaltyDiscountMoney = maxAllowedDiscountMoney
            let totalItemDiscountMoney = DineroFunc(0)
            let loyaltyDiscountMoney = DineroFunc(0)
            let totalDiscountMoney = DineroFunc(0)
            // After Discount
            let netTotalMoney = DineroFunc(0)
            // Tax
            let totalTaxAmount = DineroFunc(0)
            // After Tax
            let totalMoney = DineroFunc(0)
            let cartDiscount = {}
            let earningLoyaltyRules = {
                minimumSaleAmount: _get(state, 'earningRules.earningRule.minimumSaleAmount', 0),
                earningMultiplier: _get(state, 'earningRules.earningRule.earningMultiplier', 0)
            }
            let redeemLoyaltyRules = {
                redemptionMultiplier: _get(state, 'redemptionRules.redemptionRule.redemptionMultiplier', 0),
                minimumSaleAmount: _get(state, 'redemptionRules.redemptionRule.minimumSaleAmount.amount', 0),
            }
            let discountableItemsIndex = []
            let discountableItems = []
            let cannabisTaxes = _get(state, 'cannabisTaxes', {} )

            _get(action, 'data.cartItems', _get(action, 'data.prevCart.cartItems', [])).forEach((item, index) => {
                item.itemSalesPriceMoney = DineroFunc((_get(item, 'doc.product.salePrice.amount', 0)))
                item.itemRegularTotalMoney = item.itemSalesPriceMoney.multiply(_get(item, 'qty', 0))
                regularTotalMoney = regularTotalMoney.add(item.itemRegularTotalMoney);
                if (_get(item, 'doc.product.discountable', false)) {
                    let totalItemPrice = DineroFunc(_get(item, 'doc.product.salePrice.amount', 0))
                    let subTotal = totalItemPrice.multiply(_get(item, 'qty', 0))
                    discountableMoney = discountableMoney.add(subTotal)
                    discountableItemsIndex.push(index)
                    discountableItems.push(subTotal.getAmount())
                }
            })
            // * Calculating max discount
            maxAllowedDiscountMoney = discountableMoney.percentage(80);
            // ************ Cart Discount ************
            // * Deciding if discount in "Absolute" or "Percent"
            let isPercentage = false
            let cartDiscountPercent
            if (_get(action, 'data.isPercentage', _get(action, 'prevCart.cartDiscount.isPercentage'), false)) {
                cartDiscountPercent = _get(action, 'data.cartDiscount', 0);
                cartDiscountMoney = discountableMoney.percentage(cartDiscountPercent);
                isPercentage = true
            }
            else {
                // * Converting "Absolute" to "Percentage" and saving both to reducer
                if (action.data.cartDiscount >= 0) {
                    cartDiscountMoney = DineroFunc(action.data.cartDiscount)
                }
                else {
                    cartDiscountMoney = _get(action, 'data.prevCart.cartDiscount.cartDiscountMoney', DineroFunc(0))
                }
                cartDiscountPercent = (cartDiscountMoney.getAmount() / discountableMoney.getAmount()) * 100
                isPercentage = false
            }

            if (cartDiscountMoney.getAmount() + employeeDiscountMoney.getAmount() <= maxAllowedDiscountMoney.getAmount()) {
                cartDiscount = {
                    cartDiscountPercent,
                    cartDiscountMoney,
                    isPercentage
                }
            }
            else {
                cartDiscount = {
                    cartDiscountPercent: 0,
                    cartDiscountMoney: DineroFunc(0)
                }
                cartDiscountAllocation = []
            }

            allowedCartDiscountMoney = discountableMoney.percentage(80)
            allowedLoyaltyDiscountMoney = discountableMoney.percentage(80)
            let discountableMoneyAllocation = []
            if (discountableItems.length > 0) {
                discountableMoneyAllocation = allowedCartDiscountMoney.allocate(discountableItems)
            }
            // * Cart Discount Allocation
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
            // ************ Loyalty Discount ************
            let loyaltyDiscountAllocation = []
            if (loyaltyPoints && regularTotalMoney.getAmount() > redeemLoyaltyRules.minimumSaleAmount) {
                loyaltyDiscountMoney = DineroFunc(parseInt(loyaltyPoints * parseFloat(redeemLoyaltyRules.redemptionMultiplier)))
                if (discountableItems.length > 0) {
                    loyaltyDiscountAllocation = loyaltyDiscountMoney.allocate(discountableItems)
                }
            }
            // ************ Item Discount ************
            _get(action, 'data.cartItems', _get(action, 'data.prevCart.cartItems', [])).forEach((item, index) => {
                // item.itemSalesPriceMoney = DineroFunc((_get(item, 'doc.product.salePrice.amount', 0)))
                // item.itemRegularTotalMoney = item.itemSalesPriceMoney.multiply(_get(item, 'qty', 0))
                // ****** Item Discounts calculations ****** //
                // * Checking if item is discountable
                if (_get(item, 'doc.product.discountable', false)) {
                    item.itemDiscountableMoney = DineroFunc(0)
                    let key = _findIndex(discountableItemsIndex, discountableItemsIndex => discountableItemsIndex == index)
                    if (key >= 0) {
                        item.itemDiscountableMoney = discountableMoneyAllocation[key]
                        item.cartDiscountMoney = cartDiscountAllocation[key] || DineroFunc(0)
                        item.loyaltyDiscountMoney = loyaltyDiscountAllocation[key] || DineroFunc(0)
                        item.empDiscountMoney = employeeDiscountAllocation[key] || DineroFunc(0)
                        item.allowedItemDiscountMoney = item.itemDiscountableMoney.subtract(item.empDiscountMoney).subtract(item.cartDiscountMoney).subtract(item.loyaltyDiscountMoney)
                        item.allowedCartDiscountPercent = ((item.allowedItemDiscountMoney).getAmount() / (item.itemRegularTotalMoney).getAmount()) * 100
                    } else {
                        item.itemDiscountableMoney = DineroFunc(0)
                        item.cartDiscountMoney = DineroFunc(0);
                        item.loyaltyDiscountMoney = DineroFunc(0)
                        item.empDiscountMoney = DineroFunc(0);
                        item.allowedItemDiscountMoney = DineroFunc(0);
                        item.allowedCartDiscountPercent = 0
                    }
                } else {
                    item.itemDiscountableMoney = DineroFunc(0)
                    item.cartDiscountMoney = DineroFunc(0);
                    item.loyaltyDiscountMoney = DineroFunc(0)
                    item.empDiscountMoney = DineroFunc(0);
                    item.allowedItemDiscountMoney = DineroFunc(0);
                    item.allowedCartDiscountPercent = 0
                }
                item.itemDiscountMoney = _get(item, 'itemDiscountMoney', DineroFunc(0))
                item.itemDiscountPercent = _get(item, 'itemDiscountPercent', 0)
                item.isPercent = _get(item, 'isPercent', false)
                // * check if item qty changed
                if (item.isPercent) {
                    if (!(item.itemRegularTotalMoney.percentage(item.itemDiscountPercent).equalsTo(item.itemDiscountMoney))) {
                        item.itemDiscountMoney = item.itemRegularTotalMoney.percentage(item.itemDiscountPercent)
                    }
                }
                // * Checking if Item Discount Exceeds or not
                let totalItemDiscount = item.cartDiscountMoney.add(item.empDiscountMoney).add(item.loyaltyDiscountMoney).add(item.itemDiscountMoney)
                if (item.itemDiscountableMoney.lessThan(totalItemDiscount)) {
                    item.itemDiscountMoney = DineroFunc(0);
                    totalItemDiscount = item.cartDiscountMoney.add(item.empDiscountMoney).add(item.itemDiscountMoney).add(item.loyaltyDiscountMoney)
                }
                // * Checking if Loyalty Discount Exceeds or not
                if (((item.itemDiscountableMoney).getAmount() + 1) < (totalItemDiscount.getAmount())) {
                    cartDiscount = {
                        cartDiscountPercent: 0,
                        cartDiscountMoney: DineroFunc(0)
                    }
                    item.cartDiscountMoney = DineroFunc(0)
                    cartDiscountAllocation = []
                    totalItemDiscount = item.cartDiscountMoney.add(item.empDiscountMoney).add(item.itemDiscountMoney).add(item.loyaltyDiscountMoney)
                }
                // * Checking if Loyalty Discount Exceeds or not
                if (((item.itemDiscountableMoney).getAmount() + 1) < (totalItemDiscount.getAmount())) {
                    loyaltyDiscountMoney = DineroFunc(0)
                    item.loyaltyDiscountMoney = DineroFunc(0)
                    loyaltyPoints = 0
                    loyaltyDiscountAllocation = []
                    totalItemDiscount = item.cartDiscountMoney.add(item.empDiscountMoney).add(item.itemDiscountMoney).add(item.loyaltyDiscountMoney)
                }

                // * Calculating Allowed Cart Discount
                allowedCartDiscountMoney = allowedCartDiscountMoney.subtract(item.itemDiscountMoney).subtract(item.empDiscountMoney).subtract(item.loyaltyDiscountMoney)
                // * Calculating Allowed Cart Discount
                allowedLoyaltyDiscountMoney = allowedLoyaltyDiscountMoney.subtract(item.itemDiscountMoney).subtract(item.empDiscountMoney).subtract(item.cartDiscountMoney)

                // * Calculating SubTotal = Total - Discounts
                item.subTotal = item.itemRegularTotalMoney.subtract(item.cartDiscountMoney).subtract(item.empDiscountMoney).subtract(item.itemDiscountMoney).subtract(item.loyaltyDiscountMoney)

                totalItemDiscountMoney = totalItemDiscountMoney.add(item.itemDiscountMoney)

                // ****** Tax Calculations ****** //
                let isTaxable = ("isTaxable" in item.doc.product)
                let itemTaxPercent = 0
                if (isTaxable) {
                    if (localStorage.getItem('cannabisStore')) {
                        itemTaxPercent = Number(taxCalculations(item, cannabisTaxes))
                        item.itemTaxAmount = item.subTotal.percentage(itemTaxPercent)
                        console.log(item.itemTaxAmount.getAmount(), 'Mayuk - Tax Cannabis')
                        debugger
                    }
                    else {
                        let federalTaxRate = localStorage.getItem('federalTaxRate')
                        let stateTaxRate = localStorage.getItem('stateTaxRate')
                        let countyTaxRate = localStorage.getItem('countyTaxRate')
                        itemTaxPercent = Number(federalTaxRate) + Number(stateTaxRate) + Number(countyTaxRate);
                        item.itemTaxAmount = item.subTotal.percentage(itemTaxPercent)
                    }
                }
                else {
                    item.itemTaxAmount = DineroFunc(0)
                }

                item.itemEffectiveTotal = item.subTotal.add(item.itemTaxAmount);

                //regularTotalMoney = regularTotalMoney.add(item.itemRegularTotalMoney);
                cartQty += _get(item, 'qty', 0);
                netTotalMoney = netTotalMoney.add(item.subTotal);
                totalTaxAmount = totalTaxAmount.add(item.itemTaxAmount);
                totalMoney = totalMoney.add(item.itemEffectiveTotal);
            })
            totalDiscountMoney = employeeDiscountMoney.add(cartDiscountMoney).add(totalItemDiscountMoney);

            if (!(_get(state, 'customer.guest', false)) && netTotalMoney.getAmount() > earningLoyaltyRules.minimumSaleAmount) {
                let loyaltyEarned = Math.round(netTotalMoney.getAmount() * earningLoyaltyRules.earningMultiplier);
            }
            let allowedCartDiscount = Math.round((allowedCartDiscountMoney.getAmount() / discountableMoney.getAmount()) * 100)
            let allowedLoyaltyPoints = parseInt(allowedLoyaltyDiscountMoney.getAmount() / (parseFloat(redeemLoyaltyRules.redemptionMultiplier) * 100))

            return Object.assign({}, state, {
                cartItems: _get(action, 'data.cartItems', _get(action, 'data.prevCart.cartItem', [])),
                allowedCartDiscount,
                allowedCartDiscountMoney,
                allowedLoyaltyDiscountMoney,
                discountableMoney,
                cartDiscount,
                employeeDiscountMoney,
                totalItemDiscountMoney,
                regularTotalMoney,
                cartQty,
                totalDiscountMoney,
                netTotalMoney,
                totalTaxAmount,
                totalMoney,
                allowedLoyaltyPoints,
                loyaltyPoints,
                loyaltyDiscountMoney,
            });

            break;
    }
    return state;
}

export default cartItem;