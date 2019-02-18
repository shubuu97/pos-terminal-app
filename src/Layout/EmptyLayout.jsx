import React from 'react';
import {render} from "react-dom";
// import HeaderLayout from './components/common/HeaderNav.jsx';

import Snackbar from '@material-ui/core/Snackbar';
import _get from 'lodash/get';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  failure: {
    background: 'red',
    fontSize: '1.2rem'
  },
  success: {
    background: 'green',
    fontSize: '1.2rem'
  }
});

class EmptyLayout extends React.Component {

  render() {
    let { classes } = this.props;

    return (
      <div className="login-container">
        {/* <HeaderLayout /> */}
        <React.Fragment>
            {this.props.children}
        </React.Fragment>
        <div>{this.props.message.text && <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={true}
          autoHideDuration={6000}
          onClose={() => { }}
          ContentProps={{
            'aria-describedby': 'message-id',
            classes: {
              root: this.props.message.isSuccess ? classes.success : classes.failure
            }
          }}
          message={<span id="message-id">{this.props.message.text}</span>}
        />}
        </div>
      </div>
    );
  }
  
  
}
function mapStateToProps(state) {
  let message = _get(state, 'ShowToast.message', '')

  return { message }
}
export default connect(mapStateToProps)(withStyles(styles)(EmptyLayout));