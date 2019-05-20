/* Main Route Imports */
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import JssProvider from 'react-jss/lib/JssProvider';
import { SnackbarProvider } from 'notistack';
/* Redux Imports*/
import { createStore, applyMiddleware, compose } from 'redux';
import axiosMiddleWare from './Redux/axiosMiddleware';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from './Redux/RootReducer';
import { Provider } from 'react-redux';
/* Stylesheet */
import './assets/stylesheets/main.less'
/*Material UI Imports*/
import { createGenerateClassName } from '@material-ui/core/styles';
import theme from './Global/MaterialUiSettings/theme';
import { MuiThemeProvider } from '@material-ui/core/styles';
/*Redux Persist Import */
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';
import { PersistGate } from 'redux-persist/integration/react';
import SetTransform  from './Redux/reduxPersistTransform';

/*Layout imports*/
import EmptyLayout from './Layout/EmptyLayout.jsx';
import RouteWithLayout from './Global/layout/RouteWithLayout';
/* Boilerplate Imports */
import pos from './xBoilerplate/pos';
/* Main Route Imports */
import HomeContainer from './Containers/HomeContainer';
import LoginContainer from './Containers/LoginContainer';
import StoreContainer from './Containers/StoreContainer';
import SessionContainer from './Containers/SessionContainer';
import DenominationDetailsForm from './Components/SessionComponents/DenominationDetailsForm'
import OfflineTransactions from './Containers/OfflineTransactionContainer';

import QuickBookContainer from './Containers/QuickBookContainer'
import ThankYou from './Components/QuickBook/ThankYou'

import * as serviceWorker from './serviceWorker';

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: true,
  productionPrefix: 'c',
});

const middleware = [thunk, axiosMiddleWare];
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger());
};
const persistConfig = {
  key: 'POS',
  storage,
  stateReconciler: hardSet,
  transforms: [SetTransform],
  blacklist: ['form', 'ShowToast', 'PaymentDetails', 'RefundPaymentDetails', 'resetProduct', 'resetCategory',]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

let store;

if (process.env.NODE_ENV !== 'production') {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  store = createStore(persistedReducer,
    composeEnhancers(applyMiddleware(...middleware))
  );
}
else {
  store = createStore(persistedReducer, applyMiddleware(...middleware));
}

const persistor = persistStore(store);


// @todo: drive url routes from a config file for central control
ReactDOM.render(
  //   <div>
  //     <Favicon url="/src/assets/images/favicon.ico" />

  <JssProvider generateClassName={generateClassName}>
    <MuiThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={8} autoHideDuration={4000} style={{width: '100%'}}>
        <Provider store={store}>
          {/* <PersistGate loading={null} persistor={persistor}> */}
          <Router>
            <Switch>
              <RouteWithLayout Layout={EmptyLayout} exact path="/" Component={HomeContainer} />
              <RouteWithLayout Layout={EmptyLayout} exact path="/boilerplate/pos" Component={pos} />
              <RouteWithLayout Layout={EmptyLayout} exact path="/login" Component={LoginContainer} />
              <RouteWithLayout Layout={EmptyLayout} exact path="/store" Component={StoreContainer} />
              <RouteWithLayout Layout={EmptyLayout} exact path="/session" Component={SessionContainer} />
              <RouteWithLayout Layout={EmptyLayout} exact path="/DenominationDetailsForm" Component={DenominationDetailsForm} />
              <RouteWithLayout Layout={EmptyLayout} exact path="/OfflineTransactions" Component={OfflineTransactions} />
              <RouteWithLayout Layout={EmptyLayout} exact path="/QuickBookContainer" Component={QuickBookContainer} />
              <RouteWithLayout Layout={EmptyLayout} exact path="/QuickBook" Component={ThankYou} />
            </Switch>
          </Router>
          {/* </PersistGate> */}
        </Provider>
      </SnackbarProvider>
    </MuiThemeProvider>
  </JssProvider>,
  //   </div>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();