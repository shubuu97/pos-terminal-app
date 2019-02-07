import PouchDb from 'pouchdb';
import * as PRODUCT_CONSTANT from '../constants/products'
import { debug } from 'util';
let jsonData = [{ "$class": "com.aob.pos.Receipt", "id": "40599xijragpqb6", "terminal": "resource:com.aob.pos.Terminal#T1", "productsSold": [{ "$class": "com.aob.pos.ProductSold", "productId": "P1", "productName": "Original Skywalker OG", "costPrice": 10, "sellingPrice": 12, "quantitySold": 2 }, { "$class": "com.aob.pos.ProductSold", "productId": "P30", "productName": "Renewal Complexion Treatment - Day", "costPrice": 10, "sellingPrice": 12, "quantitySold": 3 }, { "$class": "com.aob.pos.ProductSold", "productId": "P31", "productName": "Skin Replenishing Lotion", "costPrice": 10, "sellingPrice": 12, "quantitySold": 3 }, { "$class": "com.aob.pos.ProductSold", "productId": "P2", "productName": "King Louis XIII", "costPrice": 10, "sellingPrice": 12, "quantitySold": 3 }], "customer": "resource:com.aob.pos.Customer#C1", "salesExecutive": "resource:com.aob.pos.SalesExecutive#SE1", "paymentMethod": "CASH", "amountPaid": 132, "promoCode": "1234", "totalAmount": 132, "dueAmount": 0, "timestamp": "2019-01-24T10:16:17.015Z", "transactionId": "fb0e874aaa80b091a806ede305010396c7b436b92d0bb1def97e6ec4377c0a24", "ReedemPoint": 0, "ReedemAmount": 0, "rewardPoints": 132, "totalChange": 0 }]
let status = '';

const requestLookupData = (subreddit) => ({
    type: PRODUCT_CONSTANT.REQUEST_PRODUCT_DATA,
    subreddit
});

const requestAsyncLookupData = (subreddit) => ({
    type: PRODUCT_CONSTANT.REQUEST_ASYNC_PRODUCT_DATA,
    subreddit
});

const receiveLookupData = (subreddit, data) => ({
    type: PRODUCT_CONSTANT.RECEIVE_PRODUCT_DATA,
    subreddit,
    data,
    receivedAt: Date.now()
});
const receiveLookupDataError = (subreddit, error) => ({
    type: PRODUCT_CONSTANT.RECEIVE_PRODUCT_DATA_ERROR,
    subreddit,
    error,
    receivedAt: Date.now()
})

// Lookup data call
export const fetchLookupData = (subreddit, url) => dispatch => {

    if(localStorage.getItem('offline')=="false")
    {
    dispatch(requestLookupData(subreddit))

    return fetch(url || PRODUCT_CONSTANT.PRODUCT_LOOKUP_URL + '/retailer/' + localStorage.getItem('retailerID') + '/store/' + localStorage.getItem('storeID') + '/products',
        { method: 'GET', redirect: 'follow' })
        .then(response => response.json())
        .then(json => { return dispatch(receiveLookupData(subreddit, json)) })
        .catch((err, status) => dispatch(
            receiveLookupDataError(subreddit,
                err || new Error('Something Went Wrong'),
                status || 500)))
            }
}

export const fetchAsyncLookupData = (subreddit, url) => dispatch => {
    dispatch(requestAsyncLookupData(subreddit))

    return fetch(url || PRODUCT_CONSTANT.PRODUCT_LOOKUP_URL + '/retailer/' + localStorage.getItem('retailerID') + '/store/' + localStorage.getItem('storeID') + '/products',
        { method: 'GET', redirect: 'follow' })
        .then(response => response.json())
        .then(json => { return dispatch(receiveLookupData(subreddit, json)) })
        .catch((err, status) => dispatch(
            receiveLookupDataError(subreddit,
                err || new Error('Something Went Wrong'),
                status || 500)))
}

const requestSaleTransactionData = (subreddit) => ({
    type: PRODUCT_CONSTANT.REQUEST_SALE_TRANSACTION_DATA,
    subreddit
});

const receiveSaleTransactionData = (subreddit, data, status) => {
    return {
        type: PRODUCT_CONSTANT.RECEIVE_SALE_TRANSACTION_DATA,
        subreddit,
        data,
        status: status,
        receivedAt: Date.now()
    }
};

// Sale Transaction Call
export const postSaleTransactionData = (subreddit, data, url) => dispatch => {
    console.log(data, "postSaleTransactionData")
    dispatch(requestSaleTransactionData(subreddit))
    return fetch(PRODUCT_CONSTANT.SALE_TRANSACTION_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            status = response.status;
            return response.json()
        })
        .then(json => dispatch(receiveSaleTransactionData(subreddit, json, status)))
}
// Sale offline Transaction Call
export const postCustomerSearchDataOffline = (data, url, subreddit) => dispatch => {
    //logic of api clone will come here
    dispatch(receiveSaleTransactionData(subreddit, jsonData, 200)
    )
};

//sale transaction call when we are back online
export const postSaleTransactionDataWhenOnline = (subreddit, data, url) => dispatch => {
    console.log(data, "postSaleTransactionData")
    dispatch(requestSaleTransactionData(subreddit))
    return fetch(PRODUCT_CONSTANT.SALE_TRANSACTION_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
}

const requestCustomerRegistrationData = (subreddit) => ({
    type: PRODUCT_CONSTANT.REQUEST_CUSTOMER_REGISTRATION_DATA,
    subreddit
});

const receiveCustomerRegistrationData = (subreddit, data, status) => ({
    type: PRODUCT_CONSTANT.RECEIVE_CUSTOMER_REGISTRATION_DATA,
    subreddit,
    data,
    status: status,
    receivedAt: Date.now()
});
const receiveCustomerRegistrationDataError = (subreddit, error, status) => ({
    type: PRODUCT_CONSTANT.RECEIVE_CUSTOMER_REGISTRATION_DATA_ERROR,
    subreddit,
    error: error,
    status: status,
    receivedAt: Date.now()
});

// Sale Transaction Call
export const postCustomerRegistrationData = (data, url, subreddit) => dispatch => {
    dispatch(requestCustomerRegistrationData(subreddit))
    return fetch(url || PRODUCT_CONSTANT.NEW_CUSTOMER_REGISTRATION_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            status = response.status;
            return response.json()
        })
        .then(json => dispatch(receiveCustomerRegistrationData(subreddit, json, status)))
        .catch((err, status) => dispatch(
            receiveCustomerRegistrationDataError(subreddit,
                err || new Error('Something Went Wrong'),
                status || 500)))
}

const requestCustomerSearchData = (subreddit) => ({
    type: PRODUCT_CONSTANT.REQUEST_CUSTOMER_SEARCH_DATA,
    subreddit
});

const receiveCustomerSearchData = (subreddit, data, status) => ({
    type: PRODUCT_CONSTANT.RECEIVE_CUSTOMER_SEARCH_DATA,
    subreddit,
    data,
    status: status,
    receivedAt: Date.now()
});
const receiveCustomerSearchDataError = (subreddit, error, status) => ({
    type: PRODUCT_CONSTANT.RECEIVE_CUSTOMER_SEARCH_DATA_ERROR,
    subreddit,
    error,
    status: status,
    receivedAt: Date.now()
});

export const postCustomerSearchData = (data, url, subreddit) => dispatch => {
    if(localStorage.getItem('offline')=="false")
    {
    dispatch(requestCustomerSearchData(subreddit))
    return fetch(url || PRODUCT_CONSTANT.CUSTOMER_SEARCH_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            status = response.status;
            return response.json()
        })
        .then(json => dispatch(receiveCustomerSearchData(subreddit, json, status)))
        .catch((err, status) => dispatch(
            receiveCustomerSearchDataError(
                subreddit,
                err || new Error('Something Went Wrong',
                    status || 500

                ))
        )
        )
    }
    else {
        //todo code for offline customer search will come here
    }
};




const requestRewardEarnRule = (subreddit) => ({
    type: PRODUCT_CONSTANT.REQUEST_REWARD_EARN_RULE,
    subreddit
});

const receiveRewardEarnRuleError = (subreddit, err, errCode) => ({
    type: PRODUCT_CONSTANT.RECEIVED_REWARD_EARN_RULE_ERROR,
    subreddit,
    error: err,
    errorCode: errCode
})

const receiveRewardEarnRule = (subreddit, json, status) => ({
    type: PRODUCT_CONSTANT.RECEIVED_REWARD_EARN_RULE,
    subreddit,
    data: json,
    status: status,
    receivedAt: Date.now()
})

export const fetchRewardEarnRule = (subreddit, url) => dispatch => {

    dispatch(requestRewardEarnRule(subreddit));

   return  fetch(PRODUCT_CONSTANT.PRODUCT_LOOKUP_URL + url, {
        method: 'GET',
        headers: {
            "Content-type": "application/json"
        },
        // body: JSON.stringify(data)
    })
        .then(response => {
            status = response.status;

            return response.json()
        }
        )
        .then(json => { return dispatch(receiveRewardEarnRule(subreddit, json, status)) })
        .catch(err => { return dispatch(receiveRewardEarnRuleError(subreddit, err, 500)) })
}

