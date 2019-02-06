import {
  REQUEST_ADD_NEW_ENTRY_FOR_SUPPLIER, 
  RECEIVED_ADD_NEW_ENTRY_FOR_SUPPLIER,
  REG_FORM_RESPONSE,
  REG_FORM_REQUEST,
  SUPPLIER_LIST,
  REQUEST_SUPPLIER_LIST,
  RECEIVED_SUPPLIER_LIST,
  REQUEST_SUPPLIER_HISTORY,
  RECEIVED_SUPPLIER_HISTORY,
  VIEW_HOSTORY,
  
} from '../constants';

let itemStatusCode = '';

import {
    ADD_NEW_ENTRY_STEP1, SUPPLIER_REG
} from '../constants'

export const requestPosts = subreddit => ({
  type: REQUEST_ADD_NEW_ENTRY_FOR_SUPPLIER,
  subreddit
})

export const receivePosts = (subreddit, json) => ({
  type: RECEIVED_ADD_NEW_ENTRY_FOR_SUPPLIER,
  subreddit,
  posts: json,
  receivedAt: Date.now()
});

const fetchPosts = (subreddit, url) => dispatch => {
  dispatch(requestPosts(subreddit))
  return fetch(url || ADD_NEW_ENTRY_STEP1,
    { method: 'GET', redirect: 'follow'})
    .then(response => response.json())
    .then(json => dispatch(receivePosts(subreddit, json)))
}

const shouldFetchPosts = (state, subreddit) => {
  const posts = state.initialReducer[subreddit]
  if (!posts) {
    return true
  }
  if (posts.isFetching) {
    return false
  }
  return posts.didInvalidate
}

export const fetchPostsIfNeeded = (subreddit, url) => (dispatch, getState) => {
    return dispatch(fetchPosts(subreddit, url))
}

/*

*/

export const request1 = subreddit => ({
  type: REG_FORM_REQUEST,
  subreddit
})

export const postGetSupplierReg = (data ,subreddit) => (dispatch, getState) => {
    return dispatch(supplierRegistration(data,subreddit))
}

export const receiveSupplierRegistration = (subreddit, json) => ({
  type: REG_FORM_RESPONSE,
  subreddit,
  posts: json,
  receivedAt: Date.now()
})

export const supplierRegistration  = (data,subreddit) => dispatch => {
  dispatch(request1(subreddit));
  fetch(SUPPLIER_REG, { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(json => dispatch(receiveSupplierRegistration(data, json)))
}


/*fetchSupplierList */



export const requestList = subreddit => ({
  type: REQUEST_SUPPLIER_LIST,
  subreddit
})

export const receiveList = (subreddit, json) => ({
  type: RECEIVED_SUPPLIER_LIST,
  subreddit,
  posts: json,
  receivedAt: Date.now()
});

const fetchList = subreddit => dispatch => {
  dispatch(requestList(subreddit))
  return fetch(SUPPLIER_LIST)
    .then(response => response.json())
    .then(json => dispatch(receiveList(subreddit, json)))
}

export const fetchSupplierList = subreddit => (dispatch, getState) => {
 // if (shouldFetchPosts(getState(), subreddit)) {
    return dispatch(fetchList(subreddit));
 // }
}

/** */





export const requestHistory = subreddit => ({
  type: REQUEST_SUPPLIER_HISTORY,
  subreddit
})

export const receiveHistory = (subreddit, json) => ({
  type: RECEIVED_SUPPLIER_HISTORY,
  subreddit,
  posts: json,
  receivedAt: Date.now()
});

const fetchsupplierHistoryList = (subreddit,id) => dispatch => {
  dispatch(requestHistory(subreddit))
  return fetch(id)
    .then(response => response.json())
    .then(json => dispatch(receiveHistory(subreddit, json)))
}

export const fetchsupplierHistory = (subreddit, id )=> (dispatch, getState) => {
 // if (shouldFetchPosts(getState(), subreddit)) {
    return dispatch(fetchsupplierHistoryList(subreddit,id));
 // }
}

