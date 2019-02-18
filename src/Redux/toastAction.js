const  showMessage = (message) => dispatch => {
    dispatch({
        type: 'SHOW_TOAST_MESSAGE',
        data: message
    })
}

export default showMessage;