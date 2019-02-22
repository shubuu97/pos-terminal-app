import genericPostData from '../dataFetch/genericPostData';
import getDenominationDetails from './getDenominationDetails';

const closeSession = ({dispatch,handleSuccess,handleError,stateObj,reason,amount,id})=>{
    let closeSessionBody = {};
    closeSessionBody.terminalId = localStorage.getItem('terminalId');
    closeSessionBody.storeId = localStorage.getItem('storeId');
    closeSessionBody.operatorId = localStorage.getItem('userId');
    closeSessionBody.closingCashDetails = getDenominationDetails(stateObj);
    closeSessionBody.status = 'closed';
    closeSessionBody.closingBalance = {currencyCode:'$',amount};
    closeSessionBody.id ="0612ed94-f117-40cf-b6f9-36917886966f";
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