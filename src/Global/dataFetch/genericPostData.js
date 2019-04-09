import { APPLICATION_BFF_URL } from '../../Redux/urlConstants';
import { postData } from '../../Redux/postAction'
import _get from 'lodash/get';
import showMessage from '../../Redux/toastAction';

function genericPostData({ dispatch, reqObj, url, constants, identifier, successText, successCb, successTimeOutCb, errorCb, errorTimeOutCb, dontShowMessage }) {
    let p1 =  dispatch(
        postData(`${APPLICATION_BFF_URL}${url}`, reqObj, identifier, constants)
    )
    p1.then((data) => {
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
        .catch(({err,errCode}) => {
            if (typeof err == 'string')
                dispatch(showMessage({ text: err, isSuccess: false }));
            console.log(err);
            if (errCode == 500) {
                if (err.detail)
                    dispatch(showMessage({ text: err.detail, isSuccess: false }));

            }

            if (errorCb)
                errorCb(err,errCode)
            setTimeout(() => {
                dispatch(showMessage({}));
                if (errorTimeOutCb)
                    errorTimeOutCb()
            }, 6000);
        });
        return p1
}

export default genericPostData;