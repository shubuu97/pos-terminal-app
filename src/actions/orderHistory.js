import * as ORDERHISTORY_CONSTANTS from '../constants/orderHistory'

// Action start for post login

let status = '';

const requestOrderHistory = (subreddit)=> ({
    type: ORDERHISTORY_CONSTANTS.REQUEST_ORDERHISTORY,
    subreddit
});

const receiveOrderHistoryError = (subreddit,err,errCode) => ({
    type: ORDERHISTORY_CONSTANTS.RECEIVED_ORDERHISTORY_ERROR,
    subreddit,
    error: err,
    errorCode: errCode
})

const receiveOrderHistory = (subreddit, json, status )=> ({
    type: ORDERHISTORY_CONSTANTS.RECEIVED_ORDERHISTORY,
    subreddit,
    data: json,
    status: status,
    receivedAt: Date.now()
})

export const fetchOrderHistory = (subreddit, url) => dispatch => {
    
    dispatch(requestOrderHistory(subreddit));
    
   return  fetch(ORDERHISTORY_CONSTANTS.ORDERHISTORY_URL+url, { method: 'GET',
    headers: {
        "Content-type": "application/json"
    },
    // body: JSON.stringify(data)
    })
    .then(response => {
        status = response.status;
         
        return response.json() } 
    )
    .then(json => { return dispatch(receiveOrderHistory(subreddit, json, status )) } )
    .catch(err => { return dispatch(receiveOrderHistoryError(subreddit,err,500)) } )
}


const requestOrderHistoryData = (subreddit)=> ({
    type: ORDERHISTORY_CONSTANTS.REQUEST_ORDERHISTORY_DATA,
    subreddit
});

const receiveOrderHistoryDataError = (subreddit,err,errCode) => ({
    type: ORDERHISTORY_CONSTANTS.RECEIVED_ORDERHISTORY_DATA_ERROR,
    subreddit,
    error: err,
    errorCode: errCode
})

const receiveOrderHistoryData = (subreddit, json, status )=> ({
    type: ORDERHISTORY_CONSTANTS.RECEIVED_ORDERHISTORY_DATA,
    subreddit,
    data: json,
    status: status,
    receivedAt: Date.now()
})

export const fetchOrderHistoryData = (subreddit, url) => dispatch => {
    
    dispatch(requestOrderHistoryData(subreddit));
    
   return  fetch(ORDERHISTORY_CONSTANTS.ORDERHISTORY_URL+url, { method: 'GET',
    headers: {
        "Content-type": "application/json"
    },
    // body: JSON.stringify(data)
    })
    .then(response => {
        status = response.status;
         
        return response.json() } 
    )
    .then(json => { return dispatch(receiveOrderHistoryData(subreddit, json, status )) } )
    .catch(err => { return dispatch(receiveOrderHistoryDataError(subreddit,err,500)) } )
}

const clearOrder = (subreddit)=> ({
    type: ORDERHISTORY_CONSTANTS.REQUEST_ORDERHISTORY_CLEAR,
    subreddit
});

export const clearOrderType = (subreddit, url) => dispatch => {
    
    dispatch(clearOrder(subreddit));
    
    
}