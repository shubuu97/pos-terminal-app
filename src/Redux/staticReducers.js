const staticReducers = (state = { data: {}, }, action) => {
    switch (action.type) {
        case 'SAVE_FUND_REQ_ID':
            return Object.assign({}, state, {
                type: action.type,
                fund: action.data
            });
        case 'SAVE_fund_transactionIds':
            return Object.assign({}, state, {
                type: action.type,
                fund: action.data
            });
        case 'SAVE_ACCOUNTING_STATE_UUID':
            return Object.assign({}, state, {
                type: action.type,
                stateUuid: action.data
            });
    }
    return state;
}



export default staticReducers;