import UpdateSMBFun from './commonReducer';
import {combineReducers} from 'redux';
import {reducer as formReducer}  from 'redux-form';
/* INVESTOR Reducers*/ 
import LoginData from '../COMMON/Authorization/Reducer/login';
import ShowToast from './toastReducer';
import SignUpData from '../COMMON/Authorization/Reducer/signup';
import CountryList from '../COMMON/CompanyProfile/Reducers/Country';
import IndustryList from '../COMMON/CompanyProfile/Reducers/Industry';
import LegalEntities from '../COMMON/CompanyProfile/Reducers/LegalEntity';
import EmpTypeList from '../COMMON/CompanyProfile/Reducers/EmployeeType';
import BasicInfo from '../COMMON/Authorization/Reducer/basicData';
import SetPassword from '../COMMON/Authorization/Reducer/setPassword';
/* SMB Reducers*/

/* Static Reducer */
import staticReducers from './staticReducers'

/* COMMON Reducers*/ 
import parseDataFun from './commonReducer'
import CobPostFun from './commonReducer';
import CobPostMarketPlaceFun from './commonReducer';
import UpdateSMBUserFun from './commonReducer';
import AddTeamFun from './commonReducer';
import getEmployeeListFun from './commonReducer';
import shareHoldersFun from './commonReducer';
import currencyFun from './commonReducer';
import LoanFun from './commonReducer';
import ProfileHistoryFun from './commonReducer';
import TransactionDetailsFun from './commonReducer'
import OfferDataFun from './commonReducer';
import getLoanRequest from './commonReducer';
import filterMetaDataFun from './commonReducer';
import TaskListFun from './commonReducer';



let CobPost=CobPostFun('cobsave');
let CobPostMarketPlace=CobPostMarketPlaceFun('cob-post-marketplace');
let UpdateSMB = UpdateSMBFun('UpdateSMB');
let UpdateSMBUser = UpdateSMBUserFun('UpdateSMBUser');
let AddTeam = AddTeamFun('addTeam');
let EmployeeList = getEmployeeListFun('getEmployeeList');
let ParseData = parseDataFun('Parse_Data');
let shareHolders = shareHoldersFun('getshareHolderList');
let currency = currencyFun('currency');
let CreateLoan = LoanFun('create_loan');
let ProfileHistory  = ProfileHistoryFun('ProfileHistory');
let TransactionDetails = TransactionDetailsFun('TransactionDetails')
let LoanRequest = getLoanRequest('fetchingLoanRequestData');
let OfferData = OfferDataFun('OfferData');
let filterMetaData = filterMetaDataFun('filterMetaData');
let TaskList = TaskListFun('TaskList');



let rootRducer = combineReducers({
    form:formReducer,
    LoginData,
    ShowToast,
    SignUpData,
    CountryList,
    IndustryList,
    LegalEntities,
    EmpTypeList,
    BasicInfo,
    SetPassword,
    CobPost,
    CobPostMarketPlace,
    UpdateSMB,
    UpdateSMBUser,
    AddTeam,
    EmployeeList,
    ParseData,
    shareHolders,
    currency,
    CreateLoan,
    ProfileHistory,
    TransactionDetails,
    LoanRequest,
    staticReducers,
    OfferData,
    filterMetaData,
    TaskList
    
})

export default rootRducer;