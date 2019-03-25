import { APPLICATION_BFF_URL } from '../../Redux/urlConstants';
import { postData } from '../../Redux/postAction'
import _get from 'lodash/get';
import showMessage from '../../Redux/toastAction';

function genericPostData({ dispatch, reqObj, url, constants, identifier, successText, successCb, successTimeOutCb, errorCb, errorTimeOutCb, dontShowMessage }) {
    return dispatch(
        postData(`${APPLICATION_BFF_URL}${url}`, reqObj, identifier, constants)
    ).then((data) => {
        if (!dontShowMessage) {
            dispatch(showMessage({ text: successText || 'Updated SuccessFully', isSuccess: true }));
        }
        if (successCb)
            successCb(data);
        // this.basicDataFetcher();

        setTimeout(() => {
            dispatch(showMessage({}));
            if (successTimeOutCb)
                successTimeOutCb()
        }, 1000);

    })
        .catch((err) => {
            if (typeof err == 'string')
                dispatch(showMessage({ text: err, isSuccess: false }));
            console.log(err);
            if (err.code == 500) {
                if (err.detail)
                    dispatch(showMessage({ text: err.detail, isSuccess: false }));

            }

            if (errorCb)
                errorCb(err)
            setTimeout(() => {
                dispatch(showMessage({}));
                if (errorTimeOutCb)
                    errorTimeOutCb()
            }, 6000);
        })
}

export default genericPostData;