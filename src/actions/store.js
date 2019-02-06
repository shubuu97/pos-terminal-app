import * as STORE_CONSTANTS from '../constants/store'

// Action start for post login

let status = '';

const requestStore = (subreddit)=> ({
    type: STORE_CONSTANTS.REQUEST_STORE,
    subreddit
});

const receiveStoreError = (subreddit,err,errCode) => ({
    type: STORE_CONSTANTS.RECEIVED_STORE_ERROR,
    subreddit,
    error: err,
    errorCode: errCode
})

const receiveStore = (subreddit, json, status )=> ({
    type: STORE_CONSTANTS.RECEIVED_STORE,
    subreddit,
    data: json,
    status: status,
    receivedAt: Date.now()
})

export const fetchStore = (subreddit, data) => dispatch => {
    
    dispatch(requestStore(subreddit));
    
    fetch(STORE_CONSTANTS.STORE_URL+"/stores/"+data, { method: 'GET',
    headers: {
        "Content-type": "application/json"
    },
    // body: JSON.stringify(data)
    })
    .then(response => {
        status = response.status;
         
        return response.json() } 
    )
    .then(json => { return dispatch(receiveStore(subreddit, json, status )) } )
    .catch(err => { return dispatch(receiveStoreError(subreddit,err,500)) } )
}

const requestTerminal = (subreddit)=> ({
    type: STORE_CONSTANTS.REQUEST_TERMINAL,
    subreddit
});

const receiveTerminalError = (subreddit,err,errCode) => ({
    type: STORE_CONSTANTS.RECEIVED_TERMINAL_ERROR,
    subreddit,
    error: err,
    errorCode: errCode
})

const receiveTerminal = (subreddit, json, status )=> ({
    type: STORE_CONSTANTS.RECEIVED_TERMINAL,
    subreddit,
    data: json,
    status: status,
    receivedAt: Date.now()
})

export const fetchTerminal = (subreddit, url) => dispatch => {
    
    dispatch(requestTerminal(subreddit));
    
    fetch(url, { method: 'GET',
    headers: {
        "Content-type": "application/json"
    },
    // body: JSON.stringify(data)
    })
    .then(response => {
        status = response.status;
         
        return response.json() } 
    )
    .then(json => { return dispatch(receiveTerminal(subreddit, json, status )) } )
    .catch(err => { return dispatch(receiveTerminalError(subreddit,err,500)) } )
}




const requestPOSLogin = (subreddit)=> ({
    type: STORE_CONSTANTS.REQUEST_POS_LOGIN,
    subreddit
});
const clearPOSLogin = (subreddit)=>({
    type: STORE_CONSTANTS.CLEAR_POS_LOGIN,
    subreddit
})

const receivePOSLoginError = (subreddit,err,errCode) => ({
    type: STORE_CONSTANTS.RECEIVED_POS_LOGIN_ERROR,
    subreddit,
    error: err,
    errorCode: errCode
})

const receivePOSLogin = (subreddit, json, status )=> ({
    type: STORE_CONSTANTS.RECEIVED_POS_LOGIN,
    subreddit,
    data: json,
    status: status,
    receivedAt: Date.now()
})

export const postPOSLogin = (subreddit, data) => dispatch => {
    
    dispatch(requestPOSLogin(subreddit));
    
    fetch(STORE_CONSTANTS.STORE_URL+"/login", { method: 'POST',
    headers: {
        "Content-type": "application/json"
    },
    body: JSON.stringify(data)
    })
    .then(response => {
        status = response.status;
         
        return response.json() } 
    )
    .then(json => { return dispatch(receivePOSLogin(subreddit, json, status )) } )
    .catch(err => { return dispatch(receivePOSLoginError(subreddit,err,500)) } )
}

export const clearPOSLoginData = (subreddit) => dispatch => {
    dispatch(clearPOSLogin(subreddit));
}
// Action end for post login