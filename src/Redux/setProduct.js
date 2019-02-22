const setProduct = (data, lastItemId, actionConstant) => dispatch => {
    dispatch({
        type: actionConstant,
        data: data,
        lastItemId
    })
}

export default setProduct;