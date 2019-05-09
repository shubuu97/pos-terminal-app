import genericPostData from '../dataFetch/genericPostData';
import splitDot from './splitDot';

const closeSession = ({dispatch,handleSuccess,handleError,denominationDetails,reason,amount,id})=>{
    let closeSessionBody = {};
    closeSessionBody.terminalId = localStorage.getItem('terminalId');
    closeSessionBody.storeId = localStorage.getItem('storeId');
    closeSessionBody.operatorId = localStorage.getItem('userId');
    closeSessionBody.closingCashDetails = denominationDetails;
    closeSessionBody.status = 'closed';
    closeSessionBody.closingBalance = {currency:'USD', amount:parseInt(splitDot(amount))};
    closeSessionBody.id = id
    closeSessionBody.reason = reason;
    genericPostData({
        dispatch:dispatch,
        reqObj:closeSessionBody,
        url:'Session/Close',
        constants:{
        init:'CLOSE_SESSION_INIT',
        success:'CLOSE_SEESION_success',
        error:'CLOSE_SESSION_ERROR'
    },
    successCb:handleSuccess,
    error:handleError,
    })
}
export default closeSession;