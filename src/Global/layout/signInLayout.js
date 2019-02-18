import React, { Component } from 'react';
import _get from 'lodash/get';
/* Redux  Imports */
import { connect } from 'react-redux';
/* Material Imports*/
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import CssBaseline from '@material-ui/core/CssBaseline';
/* Assets */
import logoimg from '../../Assets/images/logo-white.png';

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

class SignInLayout extends Component {

  render() {
    let { classes } = this.props;
    console.log(this.props, "here")
    return (
      <React.Fragment>
        <CssBaseline />
        <div className="container-fluid login-container master">
          <div className="row no-pad">
            <div className="col-sm-5 left-block">
              <div className="brand-block">
                <div className="logo"><img src={logoimg} /></div>
                <div className="caption-line">Please login to apply for business funding.</div>
              </div>
            </div>
            <div className="col-sm-7">
              <div className="right-block">
                <div className="login-wrapper">
                  <div className="text-right backtosite"><i className="material-icons">navigate_before</i> <a href="#">Back to Website</a></div>
                  {this.props.children}
                </div>
                <div className="text-right">2018 © Crelia Capital</div>
              </div>
            </div>
          </div>
        </div>
        <div> {this.props.message.text && <Snackbar
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
      </React.Fragment>)
  }
}

function mapStateToProps(state) {
  let message = _get(state, 'ShowToast.message', '')

  return { message }
}

export default connect(mapStateToProps)(withStyles(styles)((SignInLayout)));