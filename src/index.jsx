import React from "react";
import thunk from 'redux-thunk';
import ReactDom from "react-dom";
import { Switch } from "react-router-dom";
import Provider from 'react-redux/lib/components/Provider';
import { createLogger } from 'redux-logger/src/index';
import { compose, createStore, applyMiddleware } from 'redux'
import Router from 'react-router-dom/HashRouter';
import Route from 'react-router-dom/Route';
import Link from 'react-router-dom/Link';

import reducer from './reducers';

import MainLayout from './Layout/MainLayout.jsx'
import EmptyLayout from './Layout/EmptyLayout.jsx';


/* Boilerplate Imports */
import pos from './xBoilerplate/pos';
/* Main Route Imports */
import HomeContainer from './Containers/HomeContainer';





import PouchDB from 'pouchdb';
import { persistentStore } from 'redux-pouchdb-plus';
import * as serviceWorker from './serviceWorker';

import "./assets/stylesheets/main.less";

import RouteWithLayout from './Layout/RouteWithLayout';

const middleware = [thunk]
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}
const db = new PouchDB('posdb');
const applyMiddlewares = applyMiddleware(
  ...middleware
);
const createStoreWithMiddleware = compose(
  applyMiddlewares,
  persistentStore({ db })
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

        <RouteWithLayout Layout={EmptyLayout} exact path="/boilerplate/pos" Component={pos} />

        <RouteWithLayout Layout={EmptyLayout} exact path="/" Component={HomeContainer} />

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