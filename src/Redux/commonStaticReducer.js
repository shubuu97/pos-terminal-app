import _reduce from 'lodash/reduce';
function commonReducerFunc(identifier)
{
const staticReducers = (state = { data: [], }, action) => {
    switch (action.type) {
        case `${identifier}`:
        if(identifier=='CART_ITEM_LIST'){
            let grandTotal = 0;
            action.data.forEach(item=>{
                grandTotal+=item.subTotal;
             });
            return Object.assign({}, state, {
                type: action.type,
                lookUpData: action.data,
                grandTotal
            });
        }
            return Object.assign({}, state, {
                type: action.type,
                lookUpData: action.data
            });
    }
    return state;
}
return staticReducers
}



export default commonReducerFunc;