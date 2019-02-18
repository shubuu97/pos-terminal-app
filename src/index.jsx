/* Main Route Imports */
import HomeContainer from './Containers/HomeContainer';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import JssProvider from 'react-jss/lib/JssProvider';
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
/*Redux Persist Import */
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';
import { PersistGate } from 'redux-persist/integration/react';
/*Layout imports*/
import EmptyLayout from './Layout/EmptyLayout.jsx';
import RouteWithLayout from './Global/layout/RouteWithLayout';
/* Boilerplate Imports */
import pos from './xBoilerplate/pos';
/* Main Route Imports */
import HomeContainer from './Containers/HomeContainer';
import LoginContainer from './Containers/LoginContainer';



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
  key: 'SMEInvestorRoot',
  storage,
  stateReconciler: hardSet,
  blacklist: ['form', 'ShowToast']
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

  <Provider store={store}>
    {/* <PersistGate loading={null} persistor={persistor}> */}

    <Router>
      <Switch>

        <RouteWithLayout Layout={EmptyLayout} exact path="/boilerplate/pos" Component={pos} />

        <RouteWithLayout Layout={EmptyLayout} exact path="/" Component={HomeContainer} />
        <RouteWithLayout Layout={EmptyLayout} exact path="/login" Component={LoginContainer} />


      </Switch>
    </Router>
    {/* </PersistGate> */}

  </Provider>,
  //   </div>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();