import _get from 'lodash/get';
import roundUp from '../Global/PosFunctions/roundUp';
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
    let remAmt = ((parseFloat(totalAmt) - parseFloat(paymentAmt)) || 0).toFixed(2);
    return remAmt;

}
const roundUpAmount = (amount) => {
    debugger
    let decimalCount = decimalPlaces(amount);
    if (decimalCount > 2) {
        amount = roundUp(amount, 2);
        return parseFloat(amount);
    }
    return (parseFloat(amount) || 0);
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
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount)
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            cashAmount = roundUpAmount(cashAmount);
            if (paymentAmount > parseFloat(totalAmount)) {
                let amountExceeded = paymentAmount - parseFloat(totalAmount);
                cashAmount = roundUpAmount(parseFloat(cashAmount) - parseFloat(amountExceeded));
                remainingAmount = 0;
            }
            return (Object.assign({}, state, { cashAmount, remainingAmount }));
            break;
        case 'CARD_REFUND_INPUT_HANDLER':
            let amountAvailToRedeem = action.data.paidThroughCard;;
            let enteredAmount = action.data.cardAmount;
            let expPaymentAmount = calcPaymentAmount(cashAmount, enteredAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount);
            let expRemainingAmount = calcRemainingAmount(totalAmount, expPaymentAmount);
            if (parseFloat(amountAvailToRedeem) >= (parseFloat(enteredAmount) || 0) && expRemainingAmount >= 0) {
                paymentAmount = expPaymentAmount;
                remainingAmount = expRemainingAmount;
                cardAmount = roundUpAmount(enteredAmount);
                return (Object.assign({}, state, { cardAmount, remainingAmount }));
                break;
            }
            else {
                let amountExceeded = expPaymentAmount - parseFloat(totalAmount);
                cardAmount = roundUpAmount(parseFloat(enteredAmount) - parseFloat(amountExceeded));
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
        // cardAmount = roundUpAmount(cardAmount);
        // remainingAmount = roundUpAmount(remainingAmount)
        // let cardRefrenceId = action.data.cardRefrenceId
        // return (Object.assign({}, state, { cardAmount, remainingAmount, cardRefrenceId }));
        // break;
        case 'GIFTCARD_REFUND_INPUT_HANDLER':
            giftCardAmount = action.data.giftCardAmount;
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount)
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            giftCardAmount = roundUpAmount(giftCardAmount);
            remainingAmount = roundUpAmount(remainingAmount);
            if (paymentAmount > parseFloat(totalAmount)) {
                let amountExceeded = paymentAmount - parseFloat(totalAmount);
                giftCardAmount = roundUpAmount(parseFloat(giftCardAmount) - parseFloat(amountExceeded));
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