
const manageCustomerCannabis = (state = {}, action) => {
    switch (action.type) {
        case 'UPDATE_CUSTOMER_QUEUE':
            return Object.assign({}, state, {
                queue: action.data
            });
            break;
        case 'CUSTOMER_SERVING':
            return Object.assign({}, state, {
                customer: action.data
            });
            break;
    }
    return state;
}

export default manageCustomerCannabis;