import _get from 'lodash/get';
import Dinero from 'dinero.js'
import twoDecimals from '../Global/PosFunctions/twoDecimals';
import decimalPlaces from '../Global/PosFunctions/decimalPlaces';
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

// };
const calcPaymentAmount = (a, b, c, d, e, f) => {
    let paymentAmount = dineroObj(0);
    a = dineroObj(splitDot(a));
    b = dineroObj(splitDot(b));
    c = dineroObj(splitDot(c));
    d = dineroObj(splitDot(d));
    e = dineroObj(splitDot(e));
    f = dineroObj(splitDot(f));
    paymentAmount = paymentAmount.add(a).add(b).add(c).add(d).add(e).add(f)
    return paymentAmount;
};
const calcRemainingAmount = (totalAmt, paymentAmt) => {
    let remAmt = totalAmt.subtract(paymentAmt) || dineroObj(0, 'USD')
    return remAmt;
}
const twoDecimalsTrunk = (amount) => {
    let decimalCount = decimalPlaces(amount);
    if (decimalCount > 2) {
        amount = twoDecimals(amount);
        return parseFloat(amount);
    }
    return amount;
}


const refundReducer = (state = {
    cashAmount: '',
    cardAmount: '',
    giftCardAmount: ''
}, action) => {
    let paymentAmount = 0;
    let totalAmount =dineroObj(_get(action, 'data.amount', 0));
    let remainingAmount = 0;
    let cashAmount = state.cashAmount;
    let cardAmount = state.cardAmount;
    let employeePay = state.employeePay;
    let giftCardAmount = state.giftCardAmount;
    let loyaltyRedeem = state.loyaltyRedeem;
    let costCenterAmount = state.costCenterAmount;
    let amountExceeded = dineroObj(0, 'USD');
    let amountAvailToRedeem = dineroObj(0, 'USD');
    switch (action.type) {
        case 'CASH_REFUND_INPUT_HANDLER':
            cashAmount = _get(action, 'data.cashAmount', '')
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount)
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            if (paymentAmount.greaterThanOrEqual(totalAmount)) {
                amountExceeded = paymentAmount.subtract(totalAmount);
                cashAmount = dineroObj(splitDot(cashAmount)).subtract(amountExceeded)
                cashAmount = cashAmount.isNegative() ? '' : cashAmount.toUnit(2);
                paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount)
                remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            }
            return (Object.assign({}, state, {
                cashAmount,
                remainingAmount,
            }));
            break;
        case 'CARD_REFUND_INPUT_HANDLER':
            debugger;
            amountAvailToRedeem = dineroObj(action.data.paidThroughCard);
            cardAmount = _get(action, 'data.cardAmount', 0)
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount)
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            let cardAmountMoney = dineroObj(splitDot(cardAmount))

            if (amountAvailToRedeem.greaterThanOrEqual(cardAmountMoney)) {
                if (paymentAmount.greaterThan(totalAmount)) {
                    amountExceeded = paymentAmount.subtract(totalAmount)
                    cardAmount = cardAmountMoney.subtract(amountExceeded);
                    cardAmount = cardAmount.isNegative() ? '' : cardAmount.toUnit(2);
                    paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount)
                    remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
                    return (Object.assign({}, state, {
                        cardAmount,
                        remainingAmount
                    }));
                }

                return (Object.assign({}, state, {
                    cardAmount,
                    remainingAmount
                }));
                break;
            } else {
                cardAmount = amountAvailToRedeem.toUnit(2);
                let cardAmountMoney = dineroObj(splitDot(cardAmount))
                paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount)
                remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
                if (paymentAmount.greaterThan(totalAmount)) {
                    amountExceeded = paymentAmount.subtract(totalAmount)
                    cardAmount = cardAmountMoney.subtract(amountExceeded);
                    cardAmount = cardAmount.isNegative() ? '' : cardAmount.toUnit(2);
                    paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount)
                    remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
                    return (Object.assign({}, state, {
                        cardAmount,
                        remainingAmount
                    }));
                }

                return (Object.assign({}, state, {
                    cardAmount,
                    remainingAmount
                }));
                break;

            }
        case 'GIFTCARD_REFUND_INPUT_HANDLER':
            giftCardAmount = _get(action, 'data.giftCardAmount', '')
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount)
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            if (paymentAmount.greaterThanOrEqual(totalAmount)) {
                amountExceeded = paymentAmount.subtract(totalAmount);
                giftCardAmount = dineroObj(splitDot(giftCardAmount)).subtract(amountExceeded)
                giftCardAmount = giftCardAmount.isNegative() ? '' : giftCardAmount.toUnit(2);
                paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount)
                remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            }
            return (Object.assign({}, state, {
                giftCardAmount,
                remainingAmount,
            }));
            break;
        case 'GET_REFUND_REMAINING_AMOUNT':
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount);
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount)
            return (Object.assign({}, state, { remainingAmount }));
        case 'RESET_REFUND_REDUCER':
            return (Object.assign({}, state, { cashAmount: '', cardAmount: '', giftCardAmount: '', remainingAmount: totalAmount }));
        default:
            break;
    }
    return state;
}

export default refundReducer;