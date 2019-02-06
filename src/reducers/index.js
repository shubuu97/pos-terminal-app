import combineReducers from 'redux/lib/combineReducers';
import _get from 'lodash/get';
import userRoleReducer, { userRolesData as userRolesReducer } from './userRoles';
import storeReducer, { storesData as storesReducer } from './store';
import productReducer, { productData as productsReducer } from './products';
import orderHistoryReducer, { orderHistoryData as orderHistoriesReducer} from './orderHistory';
import headerReducer, { headersData as headersReducer } from './header';
import common1Reducer, { commonData as commonsReducer } from './common';

const commonReducer = (state = 'initialState', action) => {
  switch (action.type) {
    default:
      return state
  }
}

const commonReducer1 = (state = 'initialState1', action) => {
  switch (action.type) {
    default:
      return state
  }
}




const rootReducer = combineReducers({
  commonReducer,  
  commonReducer1,  
  userRoleReducer,
  userRolesReducer, 
  productReducer,
  productsReducer,
  storeReducer,
  storesReducer,
  orderHistoryReducer,
  orderHistoriesReducer,
  headerReducer,
  headersReducer,
  common1Reducer,
  commonsReducer,

})

export default rootReducer;
