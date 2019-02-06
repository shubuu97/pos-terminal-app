import React from 'react';
import {render} from "react-dom";
// import HeaderLayout from './components/common/HeaderNav.jsx';
import Alert from 'react-s-alert';

import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

class EmptyLayout extends React.Component {
  render() {
    return (
      <div className="login-container">
        {/* <HeaderLayout /> */}
        <React.Fragment>
            {this.props.children}
        </React.Fragment>
        <Alert stack={{ limit: 3 }} />
      </div>
    );
  }
}
export default EmptyLayout;