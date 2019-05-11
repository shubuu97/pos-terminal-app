import _get from 'lodash/get';
import Dinero from 'dinero.js'

let dineroObj = (amount, currency) => {
    return Dinero({
        amount: parseInt(amount) || 0,
        currency: currency || 'USD',
        precision: 2
    });
}

let splitDot = (num) => {
    if (num !== undefined) {
        let b = num.toString().split(".");
        let c
        if (b[1] != undefined) {
            if (b[1].length == 0) {
                c = b[0] + b[1] + '00'
            }
            else if (b[1].length == 1) {
                c = b[0] + b[1] + '0'
            }
            else if (b[1].length == 2) {
                c = b[0] + b[1]

            }
        } else {
            c = b[0] + '00'
        }
        return c
    }
    else {
        return ''
    }

}

const calcPaymentAmount = (a, b, c, d, e, f, g) => {
    let paymentAmount = dineroObj(0);
    a = dineroObj(splitDot(a));
    b = dineroObj(splitDot(b));
    c = dineroObj(splitDot(c));
    d = dineroObj(splitDot(d));
    e = dineroObj(splitDot(e));
    f = dineroObj(splitDot(f));
    g = dineroObj(splitDot(g));
    paymentAmount = paymentAmount.add(a).add(b).add(c).add(d).add(e).add(f).add(g)
    return paymentAmount;
};

const calcRemainingAmount = (totalAmt, paymentAmt) => {
    let remAmt = totalAmt.subtract(paymentAmt) || dineroObj(0, 'USD')
    return remAmt;
}

const paymentReducer = (state = {
    cashAmount: '',
    cardAmount: '',
    giftCardAmount: '',
    employeePay: '',
    loyaltyRedeem: '',
    costCenterType: '',
    costCenterDepartment: '',
    costCenterAmount: ''
}, action) => {
    let totalAmount = _get(action, 'data.totalAmount') || dineroObj(0, 'USD') //it is already dinero object from cart reducer
    let paymentAmount = dineroObj(0, 'USD');
    let remainingAmount = dineroObj(0, 'USD');
    let cashAmount = state.cashAmount;
    let cardAmount = state.cardAmount;
    let employeePay = state.employeePay;
    let giftCardAmount = state.giftCardAmount;
    let loyaltyRedeem = state.loyaltyRedeem;
    let costCenterAmount = state.costCenterAmount;
    let costCenterType = '';
    let decliningBalance = state.decliningBalance
    let costCenterDepartment = '';
    let amountExceeded = dineroObj(0, 'USD');
    let amountAvailToRedeem = dineroObj(0, 'USD');
    switch (action.type) {
        case 'CASH_INPUT_HANDLER':
            cashAmount = _get(action, 'data.cashAmount', '')
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount, decliningBalance)
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            return (Object.assign({}, state, {
                cashAmount,
                remainingAmount
            }));
            break;
        case 'CARD_INPUT_HANDLER':
            cardAmount = _get(action, 'data.cardAmount', '')
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount, decliningBalance);
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            let cardRefrenceId = action.data.cardRefrenceId;
            if (paymentAmount.greaterThanOrEqual(totalAmount)) {
                amountExceeded = paymentAmount.subtract(totalAmount);
                cardAmount = dineroObj(splitDot(cardAmount)).subtract(amountExceeded)
                cardAmount = cardAmount.isNegative() ? '' : cardAmount.toUnit(2);
                paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount, decliningBalance)
                remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            }
            return (Object.assign({}, state, {
                cardAmount,
                remainingAmount,
                cardRefrenceId
            }));
            break;
        case 'LOYALTY_INPUT_HANDLER':
            loyaltyRedeem = _get(action, 'data.loyaltyRedeem') || dineroObj(0, 'USD');
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount, decliningBalance)
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            if (paymentAmount.greaterThanOrEqual(totalAmount)) {
                amountExceeded = paymentAmount.subtract(totalAmount);
                loyaltyRedeem = loyaltyRedeem.subtract(amountExceeded)
                remainingAmount = dineroObj(0, 'USD');
            }
            return (Object.assign({}, state, {
                loyaltyRedeem,
                remainingAmount
            }));
            break;
        case 'COST_CENTER_CHARGE':
            costCenterType = action.data.costCenterType
            costCenterDepartment = action.data.costCenterDepartment;
            costCenterAmount = _get(action, 'data.costCenterAmount', '')
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount, decliningBalance);
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            if (paymentAmount.greaterThanOrEqual(totalAmount)) {
                amountExceeded = paymentAmount.subtract(totalAmount);
                costCenterAmount = (dineroObj(splitDot(costCenterAmount)).subtract(amountExceeded));
                costCenterAmount = costCenterAmount.isNegative() ? '' : costCenterAmount.toUnit(2);
                paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount, decliningBalance)
                remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            }
            return (Object.assign({}, state, {
                costCenterType,
                costCenterDepartment,
                costCenterAmount,
                remainingAmount
            }));
            break;
        case 'DECLINING_BALANCE':
            decliningBalance = _get(action, 'data.decliningBalance');
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount, decliningBalance);
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            if (paymentAmount.greaterThan(totalAmount)) {
                amountExceeded = paymentAmount.subtract(totalAmount);
                decliningBalance = dineroObj(splitDot(decliningBalance)).subtract(amountExceeded)
                decliningBalance = decliningBalance.isNegative() ? '' : decliningBalance.toUnit(2);
                paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount, decliningBalance)
                remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            }
            return (Object.assign({}, state, {
                decliningBalance,
                remainingAmount
            }));
            break;
        case 'EMPLOYEE_PAYROLL':
            debugger;
            amountAvailToRedeem = dineroObj(_get(state, 'employeeAvailableAmount.limit.amount'));
            employeePay = _get(action, 'data.employeePay', 0)
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount, decliningBalance)
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            let emaployeePayMoney = dineroObj(splitDot(employeePay))

            if (amountAvailToRedeem.greaterThanOrEqual(emaployeePayMoney)) {
                if (paymentAmount.greaterThan(totalAmount)) {
                    amountExceeded = paymentAmount.subtract(totalAmount)
                    employeePay = emaployeePayMoney.subtract(amountExceeded);
                    employeePay = employeePay.isNegative() ? '' : employeePay.toUnit(2);
                    paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount, decliningBalance)
                    remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
                    return (Object.assign({}, state, {
                        employeePay,
                        remainingAmount
                    }));
                }

                return (Object.assign({}, state, {
                    employeePay,
                    remainingAmount
                }));
                break;
            } else {
                employeePay = amountAvailToRedeem.toUnit(2);
                emaployeePayMoney = dineroObj(splitDot(employeePay))
                paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount, decliningBalance)
                remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
                if (paymentAmount.greaterThan(totalAmount)) {
                    amountExceeded = paymentAmount.subtract(totalAmount)
                    employeePay = emaployeePayMoney.subtract(amountExceeded);
                    employeePay = employeePay.isNegative() ? '' : employeePay.toUnit(2);
                    paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount, decliningBalance)
                    remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
                    return (Object.assign({}, state, {
                        employeePay,
                        remainingAmount
                    }));
                }

                return (Object.assign({}, state, {
                    employeePay,
                    remainingAmount
                }));
                break;

            }
        case 'GIFT_AMOUNT_TO_REDEEM':

            amountAvailToRedeem = dineroObj(_get(state, 'giftCardData.value.amount'));
            giftCardAmount = _get(action, 'data.giftCardAmount', 0)
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount, decliningBalance)
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            let giftCardAmountMoney = dineroObj(splitDot(giftCardAmount))

            if (amountAvailToRedeem.greaterThanOrEqual(giftCardAmountMoney)) {
                if (paymentAmount.greaterThan(totalAmount)) {
                    amountExceeded = paymentAmount.subtract(totalAmount)
                    giftCardAmount = giftCardAmountMoney.subtract(amountExceeded);
                    giftCardAmount = giftCardAmount.isNegative() ? '' : giftCardAmount.toUnit(2);
                    paymentAmount = calcPaymentAmount(cashAmount, cardAmount, giftCardAmount, giftCardAmount, loyaltyRedeem, costCenterAmount, decliningBalance)
                    remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
                    return (Object.assign({}, state, {
                        giftCardAmount,
                        remainingAmount
                    }));
                }

                return (Object.assign({}, state, {
                    giftCardAmount,
                    remainingAmount
                }));
                break;
            } else {
                giftCardAmount = amountAvailToRedeem.toUnit(2);
                giftCardAmountMoney = dineroObj(splitDot(giftCardAmount))
                paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount, decliningBalance)
                remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
                if (paymentAmount.greaterThan(totalAmount)) {
                    amountExceeded = paymentAmount.subtract(totalAmount)
                    giftCardAmount = giftCardAmountMoney.subtract(amountExceeded);
                    giftCardAmount = giftCardAmount.isNegative() ? '' : giftCardAmount.toUnit(2);
                    paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount, decliningBalance)
                    remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
                    return (Object.assign({}, state, {
                        giftCardAmount,
                        remainingAmount
                    }));
                }

                return (Object.assign({}, state, {
                    giftCardAmount,
                    remainingAmount
                }));
                break;

            }

        case 'GIFT_USE_MAX':
            amountAvailToRedeem = dineroObj(_get(state, 'giftCardData.value.amount'));
            giftCardAmount = amountAvailToRedeem.toUnit(2);
            giftCardAmountMoney = dineroObj(splitDot(giftCardAmount))
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount, decliningBalance)
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            if (paymentAmount.greaterThan(totalAmount)) {
                amountExceeded = paymentAmount.subtract(totalAmount)
                giftCardAmount = giftCardAmountMoney.subtract(amountExceeded);
                giftCardAmount = giftCardAmount.isNegative() ? '' : giftCardAmount.toUnit(2);
                paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount, decliningBalance)
                remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
                return (Object.assign({}, state, {
                    giftCardAmount,
                    remainingAmount
                }));
            }

            return (Object.assign({}, state, {
                giftCardAmount,
                remainingAmount
            }));
            break;


        case 'GIFT_CARD_NUMBER':
            return (Object.assign({}, state, {
                giftPayNumber: action.data.giftPayNumber
            }))

        case 'GET_REMAINING_AMOUNT':
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount, decliningBalance);
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount)
            return (Object.assign({}, state, {
                remainingAmount
            }));
        case 'CHECK_GIFT_CARD_DATA_SUCCESS':
            return (Object.assign({}, state, {
                giftCardData: action.data
            }));
        case 'GET_EMPLOYEE_DATA_SUCCESS':
            return (Object.assign({}, state, {
                employeeAvailableAmount: action.data
            }));
        default:
            break;
    }
    return state;
}

export default paymentReducer