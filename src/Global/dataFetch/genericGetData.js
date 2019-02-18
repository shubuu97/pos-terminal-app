import _get from 'lodash/get';
import _find from 'lodash/find'
import { getData } from '../../Redux/getAction';
import { APPLICATION_BFF_URL } from '../../Redux/urlConstants'
import showMessage from '../../Redux/toastAction';



const genericGetDataFetcher = ({ dispatch, url, constant, identifier }) => {
    return dispatch(
        getData(`${APPLICATION_BFF_URL}${url}`, identifier, constant)
    ).catch((err) => {
        dispatch(showMessage({ text: err.message, isSuccess: false }));
        setTimeout(() => {
            dispatch(showMessage({}));
        }, 3000);

    })
}

export default genericGetDataFetcher;