import _get from 'lodash/get';
import Dinero from 'dinero.js'

let dineroObj = (amount, currency) => {
    return Dinero({
        amount: parseInt(amount) || 0,
        currency: currency || 'USD'
    });
}

const calcPaymentAmount = (a, b, c, d, e, f, g) => {
    let paymentAmount = dineroObj(0);
    a = dineroObj(a * 100);
    b = dineroObj(b * 100);
    c = dineroObj(c * 100);
    d = dineroObj(d * 100);
    e = dineroObj(e * 100);
    f = dineroObj(f * 100);
    g = dineroObj(g * 100);
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
    let totalAmount = _get(action, 'data.totalAmount') || dineroObj(0, 'USD')
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
            if (paymentAmount.greaterThan(totalAmount)) {
                let amountExceeded = paymentAmount.subtract(totalAmount);
                cardAmount = (Dinero({ amount: cardAmount * 100, currency: 'USD', precision: 2 }).subtract(amountExceeded)).toUnit(2);
                remainingAmount = dineroObj(0, 'USD');
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
            if (paymentAmount.greaterThan(totalAmount)) {
                let amountExceeded = paymentAmount.subtract(totalAmount);
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
            costCenterAmount = dineroObj(_get(action, 'data.costCenterAmount', 0), 'USD');
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount, decliningBalance);
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            if (paymentAmount.greaterThan(totalAmount)) {
                let amountExceeded = paymentAmount.subtract(totalAmount);
                costCenterAmount = costCenterAmount.subtract(amountExceeded);
                remainingAmount = 0;
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
                let amountExceeded = paymentAmount.subtract(totalAmount);
                decliningBalance = (Dinero({ amount: decliningBalance * 100, currency: 'USD', precision: 2 }).subtract(amountExceeded)).toUnit(2);
                remainingAmount = dineroObj(0, 'USD');
            }
            return (Object.assign({}, state, {
                decliningBalance,
                remainingAmount
            }));
            break;
        case 'EMPLOYEE_PAYROLL':
            amountAvailToRedeem = dineroObj(_get(state, 'employeeAvailableAmount.limit.amount'));
            employeePay = _get(action, 'data.employeePay', 0)
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount, decliningBalance)
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);


            if (amountAvailToRedeem.greaterThanOrEqual(remainingAmount)) {
                if (paymentAmount.greaterThan(totalAmount)) {
                    let amountExceeded = paymentAmount.subtract(totalAmount);
                    employeePay = (Dinero({ amount: employeePay * 100, currency: 'USD', precision: 2 }).subtract(amountExceeded)).toUnit(2);
                    remainingAmount = dineroObj(0, 'USD');
                }
                return (Object.assign({}, state, {
                    employeePay,
                    remainingAmount
                }));
                break;
            }
            else {
                employeePay = amountAvailToRedeem.toUnit()
                paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount, decliningBalance)
                remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
                return (Object.assign({}, state, {
                    employeePay,
                    remainingAmount
                }));

            }
            // else {
            //     let amountExceeded = paymentAmount.subtract(totalAmount);
            //     employeePay = employeePay.subtract(amountExceeded);
            //     remainingAmount = dineroObj(0, 'USD');
            //     if (employeePay.greaterThan(amountAvailToRedeem)) {
            //         remainingAmount = employeePay.subtract(amountAvailToRedeem);
            //         employeePay = amountAavilToRedeem;
            //     }
            //     return (Object.assign({}, state, {
            //         employeePay,
            //         remainingAmount
            //     }));
            //     break;
            // }
            break;
        case 'GIFT_AMOUNT_TO_REDEEM':
            let amountAvailToRedeem = _get(state, 'giftCardData.value.amount');
            let enteredAmount = action.data.giftCardAmount;
            let expPaymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, enteredAmount, loyaltyRedeem, costCenterAmount,decliningBalance);
            let expRemainingAmount = calcRemainingAmount(totalAmount, expPaymentAmount);
            if (amountAvailToRedeem.greaterThanOrEqual(enteredAmount) && expRemainingAmount.greaterThanOrEqual(dineroObj(0, 'USD'))) {
                paymentAmount = expPaymentAmount;
                remainingAmount = expRemainingAmount;
                giftCardAmount = enteredAmount;
                return (Object.assign({}, state, {
                    giftCardAmount,
                    remainingAmount
                }));
                break;
            }
            break;

        case 'GIFT_USE_MAX':
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount, decliningBalance);
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount)
            amountAvailToRedeem = dineroObj(_get(state, 'giftCardData.value.amount', 0), 'USD');
            if (amountAvailToRedeem.greaterThanOrEqual(remainingAmount)) {
                giftCardAmount = remainingAmount;
                remainingAmount = 0;
                return (Object.assign({}, state, {
                    giftCardAmount,
                    remainingAmount
                }));
            } else {
                giftCardAmount = amountAvailToRedeem;
                remainingAmount = remainingAmount.subtract(amountAvailToRedeem);
                return (Object.assign({}, state, {
                    giftCardAmount,
                    remainingAmount
                }));
            }
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