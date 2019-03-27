
import * as COMMON_CONSTANTS from '../constants/common';

var status='';

const requestAddressFromZip = (subreddit)=> ({
    type: COMMON_CONSTANTS.REQUEST_ADDRESS_FROM_ZIP,
    subreddit
});

const receiveAddressFromZipError = (subreddit,err,errCode) => ({
    type: COMMON_CONSTANTS.RECEIVED_ADDRESS_FROM_ZIP_ERROR,
    subreddit,
    error: err,
    errorCode: errCode
})

const receiveAddressFromZip = (subreddit, json, status )=> ({
    type: COMMON_CONSTANTS.RECEIVED_ADDRESS_FROM_ZIP,
    subreddit,
    data: json,
    status: status,
    receivedAt: Date.now()
})

export const fetchAddressFromZip = (subreddit, data) => dispatch => {
    
    dispatch(requestAddressFromZip(subreddit));
    
    fetch("http://13.126.59.19:20029/api/Reference/GetZipCodeData", { method: 'POST',
    headers: {
        "Content-type": "application/json",
        "Authorization":`Bearer ${localStorage.getItem("Token")}`
    },
    body: JSON.stringify(data)
    })
    .then(response => {
        status = response.status;
         
        return response.json() } 
    )
    .then(json => { return dispatch(receiveAddressFromZip(subreddit, json, status )) } )
    .catch(err => { return dispatch(receiveAddressFromZipError(subreddit,err,500)) } )
}