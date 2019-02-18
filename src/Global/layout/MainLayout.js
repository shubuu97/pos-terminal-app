import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Header from './header';
import Snackbar from '@material-ui/core/Snackbar';
import _get from 'lodash/get'


const styles = theme => ({
  failure: {
    background: 'red',
    fontSize: '1rem'
  },
  success: {
    background: 'green',
    fontSize: '1rem'
  }
});

const priceFilterObject = {
  lessThan50: false,
  from50To100: false,
  from100To200: false,
  above200: false
}

/* Main layout for layouting (Needs cleaning) */
class MainLayout extends Component {


  render() {
    let { classes } = this.props;

    // if (!localStorage.getItem('authToken'))
    //   this.props.history.push('/');

    return (
      <div className="main-layout master">
        <div>
          <Header history={this.props.history} />
        </div>
        <div className="main-content">
          {
            this.props.companyStatus == 'PENDING_APPROVAL' ?
              <div style={{ color: 'white', backgroundColor: '#4CAF50' }}>
                Your details has been sent for admin approval please wait for further action..
            </div> : null
          }
          {this.props.children}
        </div>

        {/* Footer Content */}
        <footer class="page-footer font-small">
          <div class="container-fluid text-center text-md-left">
            {/* <div class="row">
              <div class="col-md-6 mt-md-0 mt-3">
                <h5 class="text-uppercase">Footer Content</h5>
                <p>Here you can use rows and columns here to organize your footer content.</p>
              </div>
              <hr class="clearfix w-100 d-md-none pb-3" />
              <div class="col-md-3 mb-md-0 mb-3">
                <h5 class="text-uppercase">Links</h5>
                <ul class="list-unstyled">
                  <li>
                    <a>Link 1</a>
                  </li>
                  <li>
                    <a>Link 2</a>
                  </li>
                  <li>
                    <a>Link 3</a>
                  </li>
                  <li>
                    <a>Link 4</a>
                  </li>
                </ul>
              </div>
              <div class="col-md-3 mb-md-0 mb-3">
                <h5 class="text-uppercase">Links</h5>
                <ul class="list-unstyled">
                  <li>
                    <a>Link 1</a>
                  </li>
                  <li>
                    <a>Link 2</a>
                  </li>
                  <li>
                    <a>Link 3</a>
                  </li>
                  <li>
                    <a>Link 4</a>
                  </li>
                </ul>
              </div>
            </div>*/}
          </div>
          <div class="footer-copyright text-center py-3">
            © 2018 Copyright:
            <a> Crelia Capital</a>
          </div>
        </footer>
        {/*  ----------------------- Snackbar--------------------- */}
        <div>
          {
            this.props.message.text &&
            <Snackbar
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
              message={
                <span id="message-id">
                  {this.props.message.text}
                </span>
              }
            />
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {

  let message = _get(state, 'ShowToast.message', '')
  let companyStatus = _get(state, 'BasicInfo.lookUpData.companyDetails.status');
  localStorage.setItem('companyStatus', companyStatus);

  if (companyStatus == "PENDING_APPROVAL") {
    localStorage.setItem('disabled', true)
  }
  return { message, companyStatus }
}

export default connect(mapStateToProps)(withStyles(styles)(MainLayout));
