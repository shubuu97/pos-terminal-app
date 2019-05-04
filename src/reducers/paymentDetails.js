import _get from 'lodash/get';
import roundUp from '../Global/PosFunctions/roundUp';
import decimalPlaces from '../Global/PosFunctions/decimalPlaces';
import Dinero from 'dinero.js'

let dineroObj = (amount, currency) => {
    return Dinero({ amount: parseInt(amount), currency });
}

const calcPaymentAmount = (a, b, c, d, e, f,g) => {
    let paymentAmount = dineroObj(0, 'USD')
    paymentAmount.add(a).add(b).add(c).add(d).add(e).add(f).add(g)
    return paymentAmount;
};

const calcRemainingAmount = (totalAmt, paymentAmt) => {
    let remAmt = (dineroObj(totalAmt, 'USD').subtract(dineroObj(paymentAmt, 'USD'))) || dineroObj(0, 'USD') 
    return remAmt;
}

const paymentReducer = (state = {
    cashAmount: dineroObj(0, 'USD'),
    cardAmount: dineroObj(0, 'USD'),
    giftCardAmount: dineroObj(0, 'USD'),
    employeePay: dineroObj(0, 'USD'),
    loyaltyRedeem: dineroObj(0, 'USD'),
    costCenterType: dineroObj(0, 'USD'),
    costCenterDepartment: dineroObj(0, 'USD'),
    costCenterAmount: dineroObj(0, 'USD')
}, action) => {

    let paymentAmount = dineroObj(0, 'USD');
    let totalAmount = dineroObj(_get(action, 'data.totalAmount.amount', 0), 'USD');
    let remainingAmount = dineroObj(0, 'USD');
    let cashAmount = state.cashAmount;
    let cardAmount = state.cardAmount;
    let employeePay = state.employeePay;
    let giftCardAmount = state.giftCardAmount;
    let loyaltyRedeem = state.loyaltyRedeem;
    let costCenterAmount = state.costCenterAmount;
    let costCenterType = '';
    let decliningBalance = ''
    let costCenterDepartment = '';
    switch (action.type) {
        case 'CASH_INPUT_HANDLER':
            cashAmount = dineroObj(_get(action,'data.cashAmount',0), 'USD');
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount,decliningBalance)
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            return (Object.assign({}, state, { cashAmount, remainingAmount }));
            break;
        case 'LOYALTY_INPUT_HANDLER':
            loyaltyRedeem = dineroObj(_get(action,'data.loyaltyRedeem',0), 'USD');
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount,decliningBalance)
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            if (paymentAmount.greaterThan(totalAmount)) {
                let amountExceeded = paymentAmount.subtract(totalAmount);
                loyaltyRedeem = loyaltyRedeem.subtract(amountExceeded)
                remainingAmount = dineroObj(0, 'USD');
            }
            return (Object.assign({}, state, { loyaltyRedeem, remainingAmount }));
            break;
        case 'CARD_INPUT_HANDLER':
            cardAmount = dineroObj(_get(action,'data.cardAmount',0), 'USD');
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount,decliningBalance)
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            let cardRefrenceId = action.data.cardRefrenceId
            if (paymentAmount.greaterThan(totalAmount)) {
                let amountExceeded = paymentAmount.subtract(totalAmount);
                cardAmount = cardAmount.subtract(amountExceeded);
                remainingAmount = 0;
            }
            return (Object.assign({}, state, { cardAmount, remainingAmount, cardRefrenceId }));
            break;
        case 'COST_CENTER_CHARGE':
            costCenterType = dineroObj(_get(action,'data.costCenterType',0), 'USD');
            costCenterDepartment = action.data.costCenterDepartment;
            costCenterAmount = dineroObj(_get(action,'data.costCenterAmount',0), 'USD');
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount,decliningBalance);
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            if (paymentAmount.greaterThan(totalAmount)) {
                let amountExceeded = paymentAmount.subtract(totalAmount);
                costCenterAmount = costCenterAmount.subtract(amountExceeded);
                remainingAmount = 0;
            }
            return (Object.assign({}, state, { costCenterType, costCenterDepartment, costCenterAmount, remainingAmount }));
            break;
        case 'DECLINING_BALANCE':
            decliningBalance = _get(action,'data.decliningBalance',0);
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount,decliningBalance);
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            if (paymentAmount.greaterThan(totalAmount)) {
                let amountExceeded = paymentAmount.subtract(totalAmount);
                decliningBalance = decliningBalance.subtract(amountExceeded);
                remainingAmount = 0;
            }
            return (Object.assign({}, state, { decliningBalance,remainingAmount }));
            break;
        case 'EMPLOYEE_PAYROLL':
            amountAvailToRedeem = dineroObj(_get(state, 'employeeAvailableAmount.limit.amount',0), 'USD');
            employeePay = _get(action,'data.employeePay',0);
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount,decliningBalance)
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount);
            if(amountAvailToRedeem.greaterThanOrEqual(employeePay) && remainingAmount.greaterThanOrEqual(dineroObj(0, 'USD'))) {
                paymentAmount = paymentAmount;
                remainingAmount = remainingAmount;
                giftCardAmount = employeePay;
                return (Object.assign({}, state, { employeePay, remainingAmount }));
                break;
            }
            else {
                let amountExceeded = paymentAmount.subtract(totalAmount);
                employeePay = employeePay.subtract(amountExceeded);
                remainingAmount = dineroObj(0, 'USD');
                if (employeePay.greaterThan(amountAvailToRedeem)) {
                    remainingAmount = employeePay.subtract(amountAvailToRedeem);
                    employeePay = amountAvailToRedeem;
                }
                return (Object.assign({}, state, { employeePay, remainingAmount }));
                break;
            }
            break;
        case 'GIFT_AMOUNT_TO_REDEEM':
            let amountAvailToRedeem = dineroObj(_get(state, 'giftCardData.value.amount',0), 'USD');
            let enteredAmount = dineroObj(_get(action,'data.giftCardAmount',0),'USD');
            let expPaymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, enteredAmount, loyaltyRedeem, costCenterAmount);
            let expRemainingAmount = calcRemainingAmount(totalAmount, expPaymentAmount);
            if(amountAvailToRedeem.greaterThanOrEqual(enteredAmount) && expRemainingAmount.greaterThanOrEqual(dineroObj(0, 'USD'))) {
                paymentAmount = expPaymentAmount;
                remainingAmount = expRemainingAmount;
                giftCardAmount = enteredAmount;
                return (Object.assign({}, state, { giftCardAmount, remainingAmount }));
                break;
            }
            break;

        case 'GIFT_USE_MAX':
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount,decliningBalance);
            remainingAmount = calcRemainingAmount(totalAmount, paymentAmount)
            amountAvailToRedeem = dineroObj(_get(state, 'giftCardData.value.amount',0), 'USD');
            if (amountAvailToRedeem.greaterThanOrEqual(remainingAmount)) {
                giftCardAmount = remainingAmount;
                remainingAmount = 0;
                return (Object.assign({}, state, { giftCardAmount, remainingAmount }));
            }
            else {
                giftCardAmount = amountAvailToRedeem;
                remainingAmount = remainingAmount.subtract(amountAvailToRedeem);
                return (Object.assign({}, state, { giftCardAmount, remainingAmount }));
            }
            break;

        case 'GIFT_CARD_NUMBER':
            return (Object.assign({}, state, { giftPayNumber: action.data.giftPayNumber }))

        case 'GET_REMAINING_AMOUNT':
            paymentAmount = calcPaymentAmount(cashAmount, cardAmount, employeePay, giftCardAmount, loyaltyRedeem, costCenterAmount,decliningBalance);
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