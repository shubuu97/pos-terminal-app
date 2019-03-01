const paymentReducer = (state = {
    cashAmount: 0,
    cardAmount: 0,
    giftCardAmount: 0,
    employeePay: 0
}, action) => {
    calcRemainingAmount = () => {

    }
    switch (action.type) {
        case 'CASH':
            let paymentAmount =
                (parseFloat(action.cashAmount) || 0) +
                (parseFloat(state.cardAmount) || 0)
                + (parseFloat(state.giftCardAmount || 0)) +
                (parseFloat(state.employeePay || 0));
            let totalAmount = _get(action, 'totalAmount.amount', 0);
            let remainingAmount = parseFloat(totalAmount) - parseFloat(paymentAmount);
            return (remainingAmount || 0).toFixed(2);
            break;
        case 'CARD':
            let paymentAmount =
                (parseFloat(state.cashAmount) || 0) +
                (parseFloat(action.cardAmount) || 0)
                + (parseFloat(state.giftCardAmount || 0)) +
                (parseFloat(state.employeePay || 0));
            let totalAmount = _get(action, 'totalAmount.amount', 0);
            let remainingAmount = parseFloat(totalAmount) - parseFloat(paymentAmount);
            return (remainingAmount || 0).toFixed(2);
            break;
        case 'EMPLOYEE':
            let paymentAmount =
                (parseFloat(state.cashAmount) || 0) +
                (parseFloat(state.cardAmount) || 0)
                + (parseFloat(state.giftCardAmount || 0)) +
                (parseFloat(action.employeePay || 0));
            let totalAmount = _get(action, 'totalAmount.amount', 0);
            let remainingAmount = parseFloat(totalAmount) - parseFloat(paymentAmount);
            return (remainingAmount || 0).toFixed(2);
            break;
        case 'GIFT':
            let paymentAmount =
                (parseFloat(state.cashAmount) || 0) +
                (parseFloat(state.cardAmount) || 0)
                + (parseFloat(action.giftCardAmount || 0)) +
                (parseFloat(state.employeePay || 0));
            let totalAmount = _get(action, 'totalAmount.amount', 0);
            let remainingAmount = parseFloat(totalAmount) - parseFloat(paymentAmount);
            return (remainingAmount || 0).toFixed(2);
            break;
        default:
            break;
    }
}