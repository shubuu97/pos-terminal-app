import React from 'react';
import { Route } from 'react-router-dom';

const RouteWithLayout = ({ Layout, Component, ...rest }) => {

  return (
    <Route {...rest} render={props =>
      <Layout {...props} >
        <Component {...props} />
      </Layout>
    }
    />
  )
}

export default RouteWithLayout;