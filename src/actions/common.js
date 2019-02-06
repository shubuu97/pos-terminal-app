
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

export const fetchAddressFromZip = (subreddit, zipCode) => dispatch => {
    
    dispatch(requestAddressFromZip(subreddit));
    
    fetch(COMMON_CONSTANTS.COMMON_URL+"/zipCodes/"+zipCode+"/details", { method: 'GET',
    headers: {
        "Content-type": "application/json"
    },
    // body: JSON.stringify(data)
    })
    .then(response => {
        status = response.status;
         
        return response.json() } 
    )
    .then(json => { return dispatch(receiveAddressFromZip(subreddit, json, status )) } )
    .catch(err => { return dispatch(receiveAddressFromZipError(subreddit,err,500)) } )
}