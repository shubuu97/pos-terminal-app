import genericPostData from '../dataFetch/genericPostData';
import getDenominationDetails from './getDenominationDetails';

const startSession = ({dispatch,handleSuccess,handleError,stateObj,amount})=>{
    let session = {};
    session.terminalId = localStorage.getItem('terminalId');
    session.storeId = localStorage.getItem('storeId');
    session.operatorId = localStorage.getItem('userId');
    session.openingCashDetails = getDenominationDetails(stateObj);
    session.status = 'open';
    session.openingBalance = {currencyCode:'$',amount};
    session.terminalId = localStorage.getItem('terminalId');
    genericPostData({
        dispatch:dispatch,
        reqObj:session,
        url:'Session/Create',
        constants:{
        init:'START_SESSION_INIT',
        success:'START_SEESION_success',
        error:'START_SESSION_ERROR'
    },
    successCb:handleSuccess,
    error:handleError,
    })
    // this.state.closeSessionBody.id = _get(this.props, 'sessionData.session.id');
}

export default startSession;