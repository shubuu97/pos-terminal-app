import showMessage from '../../Redux/toastAction';

const showErrorAlert = ({ dispatch: dispatch, error: error }) => {
    if (typeof error == 'string')
        dispatch(showMessage({ text: error, isSuccess: false }));
    console.log(error);
    if (error.code == 500) {
        if (error.detail)
            dispatch(showMessage({ text: error.detail, isSuccess: false }));

    }
    setTimeout(() => {
        dispatch(showMessage({}));
    }, 2000);
}

export default showErrorAlert