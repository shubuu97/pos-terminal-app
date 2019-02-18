const dynamicActionWrapper = ({
    id,
    path,
    uploadConfig,
    isFormData,
    formData,
    method,
    body,
    headers,
    initCb,
    successCb,
    failureCb,
    subreddit,
    wrapperActionType,
    mode,
    redirect,
    credentials,
    cache,
    referrer,
    referrerPolicy,
    integrity,
    keepalive,
    signal,
    successCbPassOnParams,
    resolve,
    reject,
    constants
  }) => ({
    type: wrapperActionType,
    subreddit,
    id,
    successCbPassOnParams,
    constants,
    uploadConfig,
    fetchConfig: {
      path,
      method,
      isFormData,
      formData,
      body,
      headers,
      initHandler: initCb,
      success: successCb,
      failure: failureCb,
      resolve,
      reject,
      passOnParams: {
        mode,
        redirect,
        credentials,
        cache,
        referrer,
        referrerPolicy,
        integrity,
        keepalive,
        signal,
      },
    },
  });
  
  export const actionReqName = actionName => `REQUEST_${actionName}`;
  
  export const actionSuccessName = actionName => `RECEIVED_${actionName}_SUCCESS`;
  
  export const actionFailName = actionName => `RECEIVED_${actionName}_FAILURE`;
  
  export const actionFetchName = actionName => `FETCH_${actionName}_DATA`;
  
  export default dynamicActionWrapper;
  