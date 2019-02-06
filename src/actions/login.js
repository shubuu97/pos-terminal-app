import * as LOGIN_CONSTANTS from '../constants/login'

// Action start for post login

let status = '';

const requestLogin = (subreddit)=> ({
    type: LOGIN_CONSTANTS.REQUEST_LOGIN,
    subreddit
});

const receiveLoginError = (subreddit,err,errCode) => ({
    type: LOGIN_CONSTANTS.RECEIVED_LOGIN_ERROR,
    subreddit,
    error: err,
    errorCode: errCode
})

const receiveLogin = (subreddit, json, status )=> ({
    type: LOGIN_CONSTANTS.RECEIVED_LOGIN,
    subreddit,
    data: json,
    status: status,
    receivedAt: Date.now()
})

export const postLogin = (subreddit, data) => dispatch => {
    
    dispatch(requestLogin(subreddit));
    
    fetch(LOGIN_CONSTANTS.LOGIN_URL, { method: 'POST',
    headers: {
        "Content-type": "application/json"
    },
    body: JSON.stringify(data)
    })
    .then(response => {
        status = response.status;
         
        return response.json() } 
    )
    .then(json => { return dispatch(receiveLogin(subreddit, json, status )) } )
    .catch(err => { return dispatch(receiveLoginError(subreddit,err,500)) } )
}

// Action end for post login