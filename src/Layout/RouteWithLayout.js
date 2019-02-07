import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { requestHeaderToggleCat, requestHeaderShowHome, hideLeftBackButton, openCustomerHistoryDrawer, setProductSearchQuery, setScanerQuery, triggerRefreshProducts,openOnHoldHistoryDrawer } from '../actions/header';
import { postPOSLogin } from '../actions/store';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
class RouteWithLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      rightDrawerOpen: false,
    }
    this.leftDrawerOpen = false;
    this.showSecurePin = false;
    this.refreshTime = '';
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.openCustomerHistory = this.openCustomerHistory.bind(this);
    this.showHome = this.showHome.bind(this);
    this.checkoutFormClose = this.checkoutFormClose.bind(this);
    this.onCustomerHistoryClose = this.onCustomerHistoryClose.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleScanProduct = this.handleScanProduct.bind(this);
  }

  toggleDrawer() {
  
    console.log(this, "invoked this is here")
    const { dispatch, headersReducer } = this.props;
    this.leftDrawerOpen = !this.leftDrawerOpen;
    // this.setState({ open: !this.state.open });
    dispatch(requestHeaderToggleCat(headersReducer, this.leftDrawerOpen));
    this.forceUpdate();
  }
  toggleRightDrawer = () => {
  
    this.setState({ rightDrawerOpen: !this.state.rightDrawerOpen });
  }
  onRightDraweClose = () => {
    this.setState({
      rightDrawerOpen: false,
    })
  }
  showHome() {
    const { dispatch, headersReducer } = this.props;
    let homePage = true;
    dispatch(requestHeaderShowHome(headersReducer, homePage));
    this.forceUpdate();
  }
  onLogout = () => {
    this.onRightDraweClose();
    this.closeSecurePin();
    const { dispatch, storesReducer } = this.props;
    this.showSecurePin = false;
    let loginData = {
      salesExecutive: localStorage.getItem('userId'),
      terminal: localStorage.getItem('terminalID'),
      type: 'logout'
    }

    dispatch(postPOSLogin(storesReducer, loginData));
    this.forceUpdate();
    // this.forceUpdate();

  }

  openCustomerHistory() {
    this.onRightDraweClose();
    const { dispatch, headersReducer } = this.props;
    dispatch(openCustomerHistoryDrawer(headersReducer, true));
    this.forceUpdate();
  }
  //pin is here
  openOnHoldHistoryContainer=()=> {
    this.onRightDraweClose();
    const { dispatch, headersReducer } = this.props;
    dispatch(openOnHoldHistoryDrawer(headersReducer, true));
    this.forceUpdate();
  }
  showAlert(error, msg) {
    if (error) {
      Alert.error(msg || '', {
        position: 'bottom-right',
        effect: 'slide',
        timeout: 5000,
        html: true
      });
      this.forceUpdate();
    } else {
      Alert.success(msg || 'Successfull', {
        position: 'bottom-right',
        effect: 'slide',
        timeout: 3000,
        html: true
      });
    }

  }
  validateUser = () => {
    // alert('user is validated');
    this.closeSecurePin();
  }
  closeSecurePin = () => {
    this.showSecurePin = false;
    localStorage.setItem('showSecurePin', JSON.stringify(this.showSecurePin));
    this.forceUpdate();
  }
  toggleShowSecurePin = () => {
    this.showSecurePin = true;
    localStorage.setItem('showSecurePin', JSON.stringify(this.showSecurePin));
    this.forceUpdate();
  }
  closeMisProduct = () => {
    this.showMisProduct = false;
    this.forceUpdate();
  }
  toggleMisProduct = ()=>
  {
    this.showMisProduct = true;
    this.forceUpdate();
  }
  _onIdle = () => {
    this.showSecurePin = true;
    localStorage.setItem('showSecurePin', this.showSecurePin);
    // this.isIdle = true;
    // this.isActive = false;
    this.forceUpdate();
  }
  checkoutFormClose() {
    const { dispatch, headersReducer } = this.props;
    dispatch(hideLeftBackButton(headersReducer, false));
    this.forceUpdate();
  }
  refreshProducts = () => {
    const { dispatch, headersReducer } = this.props;
    dispatch(triggerRefreshProducts(headersReducer, true));
    this.onRightDraweClose();
    this.forceUpdate();
  }

  onCustomerHistoryClose() {
  
    const { dispatch, headersReducer } = this.props;
    dispatch(hideLeftBackButton(headersReducer, false));
    this.forceUpdate();
  }
  handleSearch(searchParam) {
    const { dispatch, headersReducer } = this.props;
    dispatch(setProductSearchQuery(headersReducer, searchParam, true));
    this.forceUpdate();
  }

  handleScanProduct(event) {
    const { dispatch, headersReducer } = this.props;
    dispatch(setScanerQuery(headersReducer, event.target.value, true));
    this.forceUpdate();
  }
  render() {
    console.log(this.toggleDrawer, "this function is here")
    let { Layout, Component, rest } = this.props;
    return (
      <Route {...rest} render={props =>
        <Layout
          {...props}
          {...this.props}
          toggleDrawer={() => this.toggleDrawer()}
          handleSearch={(searchParam)=>this.handleSearch(searchParam)}
          handleScanProduct={this.handleScanProduct}
          handleMobileSearch={this.handleMobileSearch}
          handleCategory={this.handleCategory}
          categoryTerm={this.state.category}
          updateQuantity={this.updateQuantity}
          toggleRightDrawer={this.toggleRightDrawer}
          showHome={() => this.showHome()}
          toggleShowSecurePin={() => this.toggleShowSecurePin()}
          toggleMisProduct = {this.toggleMisProduct}
          showSecurePin={this.showSecurePin}
          checkoutFormOpen={this.checkoutFormOpen}
          checkoutFormClose={() => this.checkoutFormClose()}
          openCustomerHistory={this.openCustomerHistory}
          onCustomerHistoryClose={() => this.onCustomerHistoryClose()}
          closeSecurePin={() => this.closeSecurePin()}
          open={this.showSecurePin}
          validateUser={() =>  this.validateUser() }
          onLogout={() => this.onLogout()}
          onRightDraweClose = {this.onRightDraweClose}
          refreshProducts = {this.refreshProducts}
          openCustomerHistory = {this.openCustomerHistory}
          onLogout = {this.onLogout}
          rightDrawerOpen={this.state.rightDrawerOpen}
          closeMisProduct = {this.closeMisProduct}
          showMisProduct = {this.showMisProduct}
          dispatch ={this.props.dispatch}
        >
          <Component 
          {...props} 
          toggleDrawer={this.toggleDrawer}
          refreshProducts = {this.refreshProducts}
          openCustomerHistory={this.openCustomerHistory}
          openOnHoldHistoryContainer={this.openOnHoldHistoryContainer} />
        </Layout>
      }
      />)
  }
}
const mapStateToProps = state => {
  const { headersReducer, storesReducer } = state;
  let { leftDrawerOpen, showBackButton, refreshTime } = headersReducer || false;
  let { posLogin } = storesReducer || {};

  return {
    headersReducer,
    leftDrawerOpen,
    posLogin,
    storesReducer,
    showBackButton,
    refreshTime
  }
}
export default connect(mapStateToProps)(RouteWithLayout);
