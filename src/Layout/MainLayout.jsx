// import React from 'react';
// import "../assets/stylesheets/reset.css";
// //import HeaderLayout from './components/common/HeaderNav.jsx';
// // import NavBar from './containers/NavBar.jsx';
// import "../assets/stylesheets/main.css";
// import Alert from 'react-s-alert';
// import Header from '../components/Header';
// import _set from 'lodash/set';
// import connect from 'react-redux/lib/connect/connect';

// import _isEmpty from 'lodash/isEmpty';
// import SecurePinDialog from '../components/SecurePinModal';
// import MisProductDialog from '../components/MisProductModal';
// import ReactDrawer from 'react-drawer';
// import 'react-drawer/lib/react-drawer.css';
// import 'react-s-alert/dist/s-alert-default.css';
// import 'react-s-alert/dist/s-alert-css-effects/slide.css';
// import Redirect from 'react-router/Redirect';
// import Link from 'react-router-dom/Link';
// import IdleTimer from 'react-idle-timer';


// export default class MainLayout extends React.Component {

//   constructor(props){
//     super(props);
//     this.state = {
//       open: false,
//       rightDrawerOpen: false,
//     }
//   }  

//   componentWillReceiveProps(props){
    
//     if (!_isEmpty(props.posLogin)) {
//       if (props.posLogin.status === 200) {                    
//           return (
//             <Redirect to="/" />
//           )
//           // this.showAlert(false,'logged out successfully.')
//       } else {
//           this.showAlert(true, props.posLogin.message)
//       }             
//         localStorage.clear();
    
//     }
//     if(props.refreshTime && props.refreshTime!==''){
//       this.refreshTime = props.refreshTime.toString().substring(4,21);
//       this.forceUpdate();
//     }
// }



//   render() {
//     return (
//           <IdleTimer
//         ref="idleTimer"
//         element={document}
//         activeAction={this._onActive}
//         idleAction={this._onIdle}
//         timeout={900000}>
//       <div>
//         <div>
//           <Header
//             // cartBounce={this.state.cartBounce}
//             toggleDrawer={() => this.props.toggleDrawer()}
            
//             total={10}
//             totalItems={3}
//             cartItems={[]}
//             // removeProduct={this.handleRemoveProduct}
//             handleSearch={(searchParam)=>this.props.handleSearch(searchParam)}
//             handleScanProduct={this.props.handleScanProduct}
//             handleMobileSearch={this.props.handleMobileSearch}
//             handleCategory={this.props.handleCategory}
//             categoryTerm={this.state.category}
//             updateQuantity={this.props.updateQuantity}
//             productQuantity={this.state.moq}
//             userName={localStorage.getItem('userName')}
//             loggedInTime={localStorage.getItem('loggedInTime')}
//             userId={localStorage.getItem('userId')}
//             toggleRightDrawer={this.props.toggleRightDrawer}
//             showHome={() => this.props.showHome()}
//             toggleShowSecurePin={() => this.props.toggleShowSecurePin()}
//             toggleMisProduct = {this.props.toggleMisProduct}
//             showSecurePin={this.props.showSecurePin}
//             itemFound={this.state.itemFound}
//             checkoutFormOpen={this.props.checkoutFormOpen}
//             drawerClose={() => this.props.checkoutFormClose()}
//             openCustomerHistory={this.props.openCustomerHistory}
//             showBackButton = {this.props.showBackButton}
//             onCustomerHistoryClose={() => this.props.onCustomerHistoryClose()}
//           />
//         </div>
//         <SecurePinDialog
//             // product={this.props.quickViewProducts}
//             // openModal={this.props.showSecurePin}
//             closeModal={() => this.props.closeSecurePin()}
//             open={this.props.showSecurePin}
//             pin={localStorage.getItem('userPin')}
//             validateUser={() =>  this.props.validateUser() }
//             onLogout={() => this.props.onLogout()}
//         />
//          <MisProductDialog
//             closeModal={() => this.props.closeMisProduct()}
//             open={this.props.showMisProduct}
//             dispatch = {this.props.dispatch}
//         />
//         {/* <div className="right-drawer">
//                     <ReactDrawer
//                         open={this.props.rightDrawerOpen}
//                         position={'right'}
//                         onClose={this.props.onRightDraweClose}
//                         noOverlay={false}
//                     >
//                         <div>
//                         <div className="drawer-list" onClick={()=>this.props.refreshProducts()}>
//                                 Refresh Products
//                                 <span className="pull-right">{"last Refreshed:"+this.refreshTime}</span>
//                             </div>
//                             <div  className="drawer-list" onClick={()=>this.props.openCustomerHistory()}>
//                                 Order History
//                             </div>
//                             <div className="drawer-list" onClick={()=>this.props.onLogout()}>
//                                 LogOut
//                             </div>
//                         </div>
//                     </ReactDrawer>
//                 </div> */}
//         <div >
//           { this.props.children }
//         </div>
//         <Alert stack={{ limit: 3 }} />

//       </div>
//       </IdleTimer>


//     );
//   }
// }



