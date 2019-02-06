import React, { Component } from 'react';
import {render} from "react-dom";
// import HeaderLayout from './components/common/HeaderNav.jsx';
import Alert from 'react-s-alert';

import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

class EmptyLayout extends Component {
  render() {
    return (
      <div className="login-container">
        {/* <HeaderLayout /> */}
        <React.Fragment>
            
            {this.props.children}
        </React.Fragment>
        <Alert stack={{ limit: 3 }} />
        {/* <div className="footer">
              { `Copyright \u00A9 2018 All On Block Inc.` }
        </div> */}
      </div>
    );
  }
}
export default EmptyLayout;