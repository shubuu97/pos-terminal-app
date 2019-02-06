import * as USER_ROLE_CONSTANTS from '../constants/userRoles'

// Action start for post login

let status = '';

const requestUserRole = (subreddit)=> ({
    type: USER_ROLE_CONSTANTS.REQUEST_USER_ROLE,
    subreddit
});

const receiveUserRoleError = (subreddit,err,status) => ({
    type: USER_ROLE_CONSTANTS.RECEIVED_USER_ROLE_ERROR,
    subreddit,
    error: err,
    status: status
})

const receiveUserRole = (subreddit, json, status )=> ({
    type: USER_ROLE_CONSTANTS.RECEIVED_USER_ROLE,
    subreddit,
    data: json,
    status: status,
    receivedAt: Date.now()
})

export const fetchUserRole = (subreddit, data) => dispatch => {
    
    dispatch(requestUserRole(subreddit));
    
    fetch(USER_ROLE_CONSTANTS.USER_ROLE_URL, { method: 'POST',
    headers: {
        "Content-type": "application/json"
    },
    body: JSON.stringify(data)
    })
    .then(response => {
        status = response.status;
         
        return response.json() } 
    )
    .then(json => { return dispatch(receiveUserRole(subreddit, json, status )) } )
    .catch(err => { return dispatch(receiveUserRoleError(subreddit,err,500)) } )
}

// Action end for post login