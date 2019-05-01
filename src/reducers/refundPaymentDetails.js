import _get from 'lodash/get';
import twoDecimals from '../Global/PosFunctions/twoDecimals';
import decimalPlaces from '../Global/PosFunctions/decimalPlaces';

const calcPaymentAmount = (a, b, c, d, e, f) => {
    let paymentAmount = (parseFloat(a) || 0) +
        (parseFloat(b) || 0) +
        (parseFloat(c) || 0) +
        (parseFloat(d) || 0) +
        (parseFloat(e) || 0) +
        (parseFloat(f) || 0)

    return paymentAmount;
};

const calcRemainingAmount = (totalAmt, paymentAmt) => {
    let remAmt = (parseFloat(totalAmt) - parseFloat(paymentAmt)) || 0.00;
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
    let totalAmount = _get(action, 'data.amount', 0);
    let remainingAmount = 0;
    let cashAmount = state.cashAmount;
    let cardAmount = state.cardAmount;
    let employeePay = state.employeePay;
    let giftCardAmount = state.giftCardAmount;
    let loyaltyRedeem = state.loyaltyRedeem;
    let costCenterAmount = state.costCenterAmount;
    let costCenterType = '';
    let costCenterDepartment = '';
    switch (action.type) {
        case 'CASH_REFUND_INPUT_HANDLER':
            cashAmount = action.data.cashAmount;
            cashAmount = twoDecimalsTrunk(cashAmount);
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount)
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            if (paymentAmount > parseFloat(totalAmount)) {
                let amountExceeded = paymentAmount - parseFloat(totalAmount);
                cashAmount = twoDecimalsTrunk(parseFloat(cashAmount) - parseFloat(amountExceeded));
                remainingAmount = 0;
            }
            return (Object.assign({}, state, { cashAmount, remainingAmount }));
            break;
        case 'CARD_REFUND_INPUT_HANDLER':
            let amountAvailToRedeem = action.data.paidThroughCard;;
            let enteredAmount = action.data.cardAmount;
            enteredAmount = twoDecimalsTrunk(enteredAmount);
            let expPaymentAmount = calcPaymentAmount(cashAmount, enteredAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount);
            let expRemainingAmount = calcRemainingAmount(totalAmount, expPaymentAmount);
            if (parseFloat(amountAvailToRedeem) >= (parseFloat(enteredAmount) || 0) && expRemainingAmount >= 0) {
                paymentAmount = expPaymentAmount;
                remainingAmount = expRemainingAmount;
                cardAmount = twoDecimalsTrunk(enteredAmount);
                return (Object.assign({}, state, { cardAmount, remainingAmount }));
                break;
            }
            else {
                let amountExceeded = expPaymentAmount - parseFloat(totalAmount);
                cardAmount = twoDecimalsTrunk(parseFloat(enteredAmount) - parseFloat(amountExceeded));
                remainingAmount = 0;
                if (parseFloat(cardAmount) > amountAvailToRedeem) {
                    remainingAmount = parseFloat(cardAmount) - amountAvailToRedeem;
                    cardAmount = amountAvailToRedeem;
                }
                return (Object.assign({}, state, { cardAmount, remainingAmount }));
                break;
            }
            break;


        // cardAmount = action.data.cardAmount;
        //  let paidThroughCard = action.data.paidThroughCard;
        // paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount)
        // remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
        // cardAmount = twoDecimalsTrunk(cardAmount);
        // remainingAmount = twoDecimalsTrunk(remainingAmount)
        // let cardRefrenceId = action.data.cardRefrenceId
        // return (Object.assign({}, state, { cardAmount, remainingAmount, cardRefrenceId }));
        // break;
        case 'GIFTCARD_REFUND_INPUT_HANDLER':
            giftCardAmount = action.data.giftCardAmount;
            giftCardAmount = twoDecimalsTrunk(giftCardAmount);
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount)
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            remainingAmount = twoDecimalsTrunk(remainingAmount);
            if (paymentAmount > parseFloat(totalAmount)) {
                let amountExceeded = paymentAmount - parseFloat(totalAmount);
                giftCardAmount = twoDecimalsTrunk(parseFloat(giftCardAmount) - parseFloat(amountExceeded));
                remainingAmount = 0;
            }
            return (Object.assign({}, state, { giftCardAmount, remainingAmount }));
            break;
        case 'GET_REFUND_REMAINING_AMOUNT':
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount);
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount)
            return (Object.assign({}, state, { remainingAmount }));
        case 'RESET_REFUND_REDUCER':
            return (Object.assign({}, state, {cashAmount:'',cardAmount:'',giftCardAmount:'',remainingAmount:totalAmount}));
        default:
            break;
    }
    return state;
}

export default refundReducer;