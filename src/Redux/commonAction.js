export const commonActionCreater = (data, actionConstant) => dispatch => {
    dispatch({
        type: actionConstant,
        data: data
    })
}