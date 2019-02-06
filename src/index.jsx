import React from "react";
import thunk from 'redux-thunk';
import ReactDom from "react-dom";
import { Switch } from "react-router-dom";
import Provider from 'react-redux/lib/components/Provider';
import { createLogger } from 'redux-logger/src/index';
import {compose,createStore,applyMiddleware} from 'redux'
import Router from 'react-router-dom/HashRouter';
import Route from 'react-router-dom/Route';
import Link from 'react-router-dom/Link';

import reducer from './reducers';

import MainLayout from './Layout/MainLayout.jsx'
import EmptyLayout from './Layout/EmptyLayout.jsx';

import LoginContainer from "./containers/LoginContainer/LoginContainer.jsx"
import "./assets/stylesheets/reset.css";

import Favicon from 'react-favicon';
import productHome from './containers/Products/productHome.jsx'
import StoreContainer from './containers/StoreContainer.jsx';
import Customer from './containers/Customer/customerContainer';
import SyncContainer from './containers/Sync/SyncContainer';
import AddCustomer from './containers/Customer/component/addCustomer';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';
import { PersistGate } from 'redux-persist/integration/react';
//import CarouselBoilerPlate from '../src/components/boilerPlate';

import PouchDB from 'pouchdb';
import { persistentStore } from 'redux-pouchdb-plus';
import * as serviceWorker from './serviceWorker';

import "./assets/stylesheets/main.css";

import RouteWithLayout from './Layout/RouteWithLayout';
import SomeDummy from '../src/containers/Kapil/GetAccountingDetails'
const middleware = [thunk]
if (process.env.NODE_ENV !== 'production') {

  middleware.push(createLogger())
}
const db = new PouchDB('posdb');
const applyMiddlewares = applyMiddleware(
  ...middleware
);
const createStoreWithMiddleware =  compose(
  applyMiddlewares,
  persistentStore({db})
)(createStore);

const store = createStoreWithMiddleware(reducer);


// @todo: drive url routes from a config file for central control
ReactDom.render(
  //   <div>
  //     <Favicon url="/src/assets/images/favicon.ico" />

  <Provider store={store}>
    {/* <PersistGate loading={null} persistor={persistor}> */}

      <Router>
        <Switch>
          <RouteWithLayout Layout={MainLayout} exact path="/product" Component={productHome} />
          <RouteWithLayout Layout={EmptyLayout} exact path="/" Component={LoginContainer} />
          <RouteWithLayout Layout={EmptyLayout} exact path="/store" Component={StoreContainer} />
          <RouteWithLayout Layout={EmptyLayout} exact path="/sync" Component={SyncContainer} />
          <RouteWithLayout Layout={EmptyLayout} exact path="/customer" Component={Customer} />
          <RouteWithLayout Layout={EmptyLayout} exact path="/addcustomer" Component={AddCustomer} />
          <RouteWithLayout Layout={EmptyLayout} exact path="/dummy" Component={SomeDummy} />


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