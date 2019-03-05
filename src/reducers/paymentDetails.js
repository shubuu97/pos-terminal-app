import _get from 'lodash/get';
const paymentReducer = (state = {
    cashAmount: '',
    cardAmount: '',
    giftCardAmount: '',
    employeePay: ''
}, action) => {
    let paymentAmount = 0;
    let totalAmount = _get(action, 'data.totalAmount.amount', 0);
    let remainingAmount = 0;
    switch (action.type) {
        case 'CASH_INPUT_HANDLER':
            paymentAmount =
                (parseFloat(action.data.cashAmount) || 0) +
                (parseFloat(state.cardAmount) || 0)
                + (parseFloat(state.giftCardAmount || 0)) +
                (parseFloat(state.employeePay || 0));
            remainingAmount = (parseFloat(totalAmount) - parseFloat(paymentAmount)) || 0;
            return (Object.assign({}, state, { cashAmount: action.data.cashAmount, remainingAmount }));
            break;
        case 'CARD_INPUT_HANDLER':
            paymentAmount =
                (parseFloat(state.cashAmount) || 0) +
                (parseFloat(action.data.cardAmount) || 0)
                + (parseFloat(state.giftCardAmount || 0)) +
                (parseFloat(state.employeePay || 0));
            remainingAmount = parseFloat(totalAmount) - parseFloat(paymentAmount);
            return (Object.assign({}, state, { cardAmount: action.data.cardAmount, remainingAmount }));
            break;
        case 'EMPLOYEE':
            paymentAmount =
                (parseFloat(state.cashAmount) || 0) +
                (parseFloat(state.cardAmount) || 0)
                + (parseFloat(state.giftCardAmount || 0)) +
                (parseFloat(action.data.employeePay || 0));
            remainingAmount = parseFloat(totalAmount) - parseFloat(paymentAmount);
            return (Object.assign({}, state, { employeePay: action.data.employeePay, remainingAmount }));
            break;

        case 'GIFT_USE_MAX':
            paymentAmount =
                (parseFloat(state.cashAmount) || 0) +
                (parseFloat(state.cardAmount) || 0)
                + (parseFloat(state.giftCardAmount || 0)) +
                (parseFloat(state.employeePay || 0));
            remainingAmount = parseFloat(totalAmount) - parseFloat(paymentAmount);
            amountAvailToRedeem = parseFloat(_get(state, 'giftCardData.value.amount'));
            if (amountAvailToRedeem >= remainingAmount) {
                let effectiveAmount = paymentAmount-remainingAmount
                return (Object.assign({}, state, { giftCardAmount: remainingAmount, remainingAmount:effectiveAmount }));
            }
            else {
                let effectiveRemainingAmount =  parseFloat(totalAmount) - parseFloat(paymentAmount)-amountAvailToRedeem;
                return (Object.assign({}, state, { giftCardAmount: amountAvailToRedeem, remainingAmount:effectiveRemainingAmount }));
            }
            break;
        case 'GIFT_AMOUNT_TO_REDEEM':
            let amountAvailToRedeem = parseFloat(_get(state, 'giftCardData.value.amount'));
            let enteredAmount = parseFloat(action.data.giftCardAmount) || 0;
            paymentAmount =
                (parseFloat(state.cashAmount) || 0) +
                (parseFloat(state.cardAmount) || 0)
                + (parseFloat(action.data.giftCardAmount || 0)) +
                (parseFloat(state.employeePay || 0));
            let expRemainingAmount = parseFloat(totalAmount) - parseFloat(paymentAmount);
            if (amountAvailToRedeem >= enteredAmount && expRemainingAmount >= 0) {
                paymentAmount =
                    (parseFloat(state.cashAmount) || 0) +
                    (parseFloat(state.cardAmount) || 0)
                    + (parseFloat(action.data.giftCardAmount || 0)) +
                    (parseFloat(state.employeePay || 0));
                remainingAmount = parseFloat(totalAmount) - parseFloat(paymentAmount);

                return (Object.assign({}, state, { giftCardAmount: action.data.giftCardAmount, remainingAmount }));
                break;
            }
            break;

        case 'GIFT_CARD_NUMBER':
            return (Object.assign({}, state, { giftPayNumber: action.data.giftPayNumber }))

        case 'GET_REMAINING_AMOUNT':
            paymentAmount =
                (parseFloat(state.cashAmount) || 0) +
                (parseFloat(state.cardAmount) || 0)
                + (parseFloat(state.giftCardAmount || 0)) +
                (parseFloat(state.employeePay || 0));
            remainingAmount = parseFloat(totalAmount) - parseFloat(paymentAmount);
            return (Object.assign({}, state, { remainingAmount }));
        case 'GET_GIFT_CARD__DATA_SUCCESS':
            console.log(action.data)
            return (Object.assign({}, state, { giftCardData: action.data }));
        default:
            break;
    }
    return state;
}

export default paymentReducer