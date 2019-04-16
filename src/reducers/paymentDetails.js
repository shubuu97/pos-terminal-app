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
    let remAmt = (parseFloat(totalAmt) - parseFloat(paymentAmt)) || 0;
    return remAmt;

}
const roundUpAmount = (amount) => {
    let decimalCount = decimalPlaces(amount);
    if (decimalCount > 2) {
        amount = roundUp(amount, 2);
        return amount
    }
    return amount;
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
    let paymentAmount = 0;
    let totalAmount = _get(action, 'data.totalAmount.amount', 0);
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
        case 'CASH_INPUT_HANDLER':
            cashAmount = action.data.cashAmount;
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount)
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            cashAmount = roundUpAmount(cashAmount);
            return (Object.assign({}, state, { cashAmount, remainingAmount }));
            break;
        case 'LOYALTY_INPUT_HANDLER':
            loyaltyRedeem = action.data.loyaltyRedeem;
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount)
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            loyaltyRedeem = roundUpAmount(loyaltyRedeem);
            if (paymentAmount > parseFloat(totalAmount)) {
                let amountExceeded = paymentAmount - parseFloat(totalAmount);
                loyaltyRedeem = roundUpAmount(parseFloat(loyaltyRedeem) - parseFloat(amountExceeded));
                remainingAmount = 0;
            }
            return (Object.assign({}, state, { loyaltyRedeem, remainingAmount }));
            break;
        case 'CARD_INPUT_HANDLER':
            cardAmount = action.data.cardAmount;
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount)
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            cardAmount = roundUpAmount(cardAmount);
            let cardRefrenceId = action.data.cardRefrenceId
            if (paymentAmount > parseFloat(totalAmount)) {
                let amountExceeded = paymentAmount - parseFloat(totalAmount);
                cardAmount = roundUpAmount(parseFloat(cardAmount) - parseFloat(amountExceeded));
                remainingAmount = 0;
            }
            return (Object.assign({}, state, { cardAmount, remainingAmount, cardRefrenceId }));
            break;
        case 'COST_CENTER_CHARGE':
            costCenterType = action.data.costCenterType;
            costCenterDepartment = action.data.costCenterDepartment;
            costCenterAmount = action.data.costCenterAmount;
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount);
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            if (paymentAmount > parseFloat(totalAmount)) {
                let amountExceeded = paymentAmount - parseFloat(totalAmount);
                costCenterAmount = roundUpAmount(parseFloat(costCenterAmount) - parseFloat(amountExceeded));
                remainingAmount = 0;
            }
            return (Object.assign({}, state, { costCenterType, costCenterDepartment, costCenterAmount, remainingAmount }));
            break;
        case 'EMPLOYEE_PAYROLL':
            amountAvailToRedeem = _get(state, 'employeeAvailableAmount.limit.amount');
            employeePay = action.data.employeePay;
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount)
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            employeePay = roundUpAmount(employeePay);
            if (parseFloat(amountAvailToRedeem) >= (parseFloat(employeePay) || 0) && remainingAmount >= 0) {
                paymentAmount = paymentAmount;
                remainingAmount = remainingAmount;
                giftCardAmount = roundUpAmount(employeePay);
                return (Object.assign({}, state, { employeePay, remainingAmount }));
                break;
            }
            else {
                let amountExceeded = paymentAmount - parseFloat(totalAmount);
                employeePay = roundUpAmount(parseFloat(employeePay) - parseFloat(amountExceeded));
                remainingAmount = 0;
                if (parseFloat(employeePay) > amountAvailToRedeem) {
                    remainingAmount = parseFloat(employeePay) - amountAvailToRedeem;
                    employeePay = amountAvailToRedeem;
                }
                return (Object.assign({}, state, { employeePay, remainingAmount }));
                break;
            }
            break;
        case 'GIFT_AMOUNT_TO_REDEEM':
            let amountAvailToRedeem = _get(state, 'giftCardData.value.amount');
            let enteredAmount = action.data.giftCardAmount;
            let expPaymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, enteredAmount, loyaltyRedeem, costCenterAmount);
            let expRemainingAmount = calcRemainingAmount(totalAmount, expPaymentAmount);
            if (parseFloat(amountAvailToRedeem) >= (parseFloat(enteredAmount) || 0) && expRemainingAmount >= 0) {
                paymentAmount = expPaymentAmount;
                remainingAmount = expRemainingAmount;
                giftCardAmount = roundUpAmount(enteredAmount);
                return (Object.assign({}, state, { giftCardAmount, remainingAmount }));
                break;
            }
            break;

        case 'GIFT_USE_MAX':
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount);
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount)
            amountAvailToRedeem = _get(state, 'giftCardData.value.amount');
            if (parseFloat(amountAvailToRedeem) >= remainingAmount) {
                giftCardAmount = roundUpAmount(remainingAmount);
                remainingAmount = 0;
                return (Object.assign({}, state, { giftCardAmount, remainingAmount }));
            }
            else {
                giftCardAmount = roundUpAmount(amountAvailToRedeem);
                remainingAmount = remainingAmount - parseFloat(amountAvailToRedeem);
                remainingAmount = roundUpAmount(remainingAmount);
                return (Object.assign({}, state, { giftCardAmount, remainingAmount }));
            }
            break;

        case 'GIFT_CARD_NUMBER':
            return (Object.assign({}, state, { giftPayNumber: action.data.giftPayNumber }))

        case 'GET_REMAINING_AMOUNT':
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount);
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount)
            return (Object.assign({}, state, { remainingAmount }));
        case 'CHECK_GIFT_CARD_DATA_SUCCESS':
            return (Object.assign({}, state, { giftCardData: action.data }));
        case 'GET_EMPLOYEE_DATA_SUCCESS':
            return (Object.assign({}, state, { employeeAvailableAmount: action.data }));
        default:
            break;
    }
    return state;
}

export default paymentReducer