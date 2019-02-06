
//async poll
import asyncPoll from 'react-async-poll';
import React, { Component } from 'react';

//lodash import
import _find from 'lodash/find';
import _isEmpty from 'lodash/isEmpty';
import _set from 'lodash/set';
import _get from 'lodash/get';
import _findIndex from 'lodash/findIndex';



//drawer import
import ReactDrawer from 'react-drawer';
import 'react-drawer/lib/react-drawer.css';

//style imports
import '../../scss/styles.scss';

//action imports
import {postCustomerSearchData, fetchAsyncLookupData, fetchRewardEarnRule,postCustomerSearchDataOffline,postSaleTransactionDataWhenOnline } from '../../actions/products';
import { requestHeaderShowHome, setHeaderBackButton, openCustomerHistoryDrawer, setProductSearchQuery, setScanerQuery, hideLeftBackButton, setRefreshTime, triggerRefreshProducts,requestHeaderToggleCat,openOnHoldHistoryDrawer,triggerAddMisProduct } from '../../actions/header';
import { postPOSLogin, clearPOSLoginData } from '../../actions/store';
import { fetchLookupData, postSaleTransactionData } from '../../actions/products';
import { fetchOrderHistory, fetchOrderHistoryData, clearOrderType } from '../../actions/orderHistory';

//constant imports
import { RECEIVE_SALE_TRANSACTION_DATA, RECEIVE_CUSTOMER_REGISTRATION_DATA, RECEIVE_CUSTOMER_REGISTRATION_DATA_ERROR, REQUEST_CUSTOMER_REGISTRATION_DATA, REQUEST_CUSTOMER_SEARCH_DATA } from '../../constants/products'
import { REQUEST_POS_LOGIN, RECEIVED_POS_LOGIN } from '../../constants/store';
import { RECEIVED_ORDERHISTORY, RECEIVED_ORDERHISTORY_DATA, RECEIVED_ORDERHISTORY_DATA_ERROR, RECEIVED_ORDERHISTORY_ERROR } from '../../constants/orderHistory';


import connect from 'react-redux/lib/connect/connect';


//mislaneous imports
import Alert from 'react-s-alert';
import Redirect from 'react-router/Redirect';

//material ui imports
import Badge from '@material-ui/core/Badge';


//component imports
import CartView from '../../components/CartView';
import CheckoutForm from '../../components/CheckoutForm';
import RecieptView from '../../components/recieptView';
import AlertDialogSlide from '../../components/Elements/AlertDIalog';
import CustomerHistory from '../../components/customerHistory';
import Products from '../../components/Products';
import MaterialUiDialog from '../../components/MaterialUiDialog';
import TransactionDialog from '../../components/DialogForTransaction';
import SecurePinDialog from '../../components/SecurePinModal';
import formatMoney from '../../global/normalizingMoneyField';
import CartItemViewDialog from '../../components/cartViewDialog';
import CategoriesSlickBar from '../../components/CategoriesSlickBar';
import OptionSideBar from '../../components/OptionSideBar';

//OnHold Container Imports
import OnHoldOrderContainer from '../OnHold/OnHoldOrderContainer'


//db related workes
import db from '../../db';
//moment imports
import * as moment from 'moment';

import { Detector } from "react-detect-offline";


let dbobjOffline =  new db('offlineposdb');
let dbObjOnline = new db('posdb');
let dbOnHold = new db('dbonhold');









class ProductHome extends React.Component {

    constructor(props) {
        super(props);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.state = {
            products: [],
            customers: [],
            cart: [],
            totalItems: 0,
            width: 0, height: 0,
            totalAmount: 0,
            term: '',
            customerSearch: '',
            category: '',
            cartBounce: false,
            quantity: 1,
            quickViewProduct: {},
            modalActive: false,
            open: false,
            position: 'left',
            positionCustomer: 'right',
            noOverlay: false,
            showBox: false,
            showAddNewCustomer: false,
            openCustomer: false,
            openSearchCustomer: false,
            subscribeToNewsLetter: true,
            showTransactionConfirm: false,
            rightDrawerOpen: false,
            cartProduct: {},

        };
        this.checkoutFormOpen = false;

        this.itemFound = false;
        this.modalActive = false;
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.getHoldData = false;
        this.closeDrawer = this.closeDrawer.bind(this);
        this.onDrawerClose = this.onDrawerClose.bind(this);
        this.toggleDrawerCustomer = this.toggleDrawerCustomer.bind(this);
        this.closeDrawerCustomer = this.closeDrawerCustomer.bind(this);
        this.onDrawerCloseCustomer = this.onDrawerCloseCustomer.bind(this);
        this.setPosition = this.setPosition.bind(this);
        this.setNoOverlay = this.setNoOverlay.bind(this);
        this.holdedCustomers = [];
        this.saleTransactionData = [];
        this.customerData = {};
        this.billingAddress = {};
        this.securePin = '1234';
        this.selectedProducts = [];
        this.customerSearchDataResponse = [];
        this.customerArr = [];
        this.customerSearchValue = '';
        this.customerSearchRequestBody = {
            searchField: '',
            retailer: '',
        }

        this.handleSearch = this.handleSearch.bind(this);
        this.handleScanProduct = this.handleScanProduct.bind(this)
        this.handleSearchCustomer = this.handleSearchCustomer.bind(this);
        this.handleMobileSearch = this.handleMobileSearch.bind(this);
        this.handleCategory = this.handleCategory.bind(this);
        this.handleAddToCart = this.handleAddToCart.bind(this);
        this.sumTotalItems = this.sumTotalItems.bind(this);
        this.sumTotalAmount = this.sumTotalAmount.bind(this);
        this.checkProduct = this.checkProduct.bind(this);
        this.updateQuantity = this.updateQuantity.bind(this);
        this.handleRemoveProduct = this.handleRemoveProduct.bind(this);
        this.onCategoryChange = this.onCategoryChange.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.showHome = this.showHome.bind(this);
        this.checkoutFormClose = this.checkoutFormClose.bind(this);
        this.quickViewProducts = {};
        this.userEmail = '';
        this.customerName = '';
        this.holdedCustomer = '';
        this.showTransactionConfirm = false;
        this.paymentMethod = 'CASH';
        this.amountPaid = 200;
        this.recieptId = 1;
        this.customerTypeValue = '';
        this.redirectToLogin = false;
        this.showSecurePin = JSON.parse(localStorage.getItem('showSecurePin')) || false;
        this.closeCheckout = false;
        this.customerId = '';
        this.showCustomerHistory = false;
        this.showReciept = false;
        this.closeReciept = this.closeReciept.bind(this);
        this.recieptData = {};
        this.openAlert = false;
        this.alertMessage = '';
        this.alertTitle = '';
        this.promptBtnText = 'Confirm';
        this.handleAlertClose = this.handleAlertClose.bind(this);
        this.handleAlertConfirm = this.handleAlertConfirm.bind(this);
        this.showConfirmationAlert = this.showConfirmationAlert.bind(this);
        this.inactivity = 0;
        this.onCustomerHistoryClose = this.onCustomerHistoryClose.bind(this);
        this.onCustomerHistoryOpen = this.onCustomerHistoryOpen.bind(this);
        this.handleOrderSearch = this.handleOrderSearch.bind(this);
        this.onSelectOrder = this.onSelectOrder.bind(this);
        this.openCustomerHistory = false;
        this.openOnholdHistory = false;
        this.showCustomerList = false;
        this.customerOrderHistory = [];
        this.customerOrderHistoryData = {};
        this.checkoutFormSubmitted = false;
        this.availableRewardPoints = 0;
        //this.props1;
        this.isReedem = false;
        this.fetchEarnRulesFlag = false;
        this.customerDataForShow = {};
        this.customerBillingAddress = {};
        this.customerSubmitted = false;


    }
    onHoldHistoryOpen = (genericView)=>
    {
        const { dispatch, orderHistoriesReducer, headersReducer } = this.props;
        this.showReciept = false;
        dispatch(setHeaderBackButton(headersReducer, true));

        if (genericView) {
            this.customerOrderHistory = [];
            this.customerOrderHistoryData = {};
            this.openOnholdHistory = true;
            dispatch(clearOrderType(orderHistoriesReducer));
            this.onRightDraweClose();
            this.forceUpdate();
        }
    }
    onCustomerHistoryOpen(genericView) {
        const { dispatch, orderHistoriesReducer, headersReducer } = this.props;
        this.showReciept = false;
        dispatch(setHeaderBackButton(headersReducer, true));

        if (genericView) {
            this.customerOrderHistory = [];
            this.customerOrderHistoryData = {};
            this.openCustomerHistory = true;
            dispatch(clearOrderType(orderHistoriesReducer));
            this.onRightDraweClose();
            this.forceUpdate();
        } else {
            if (_isEmpty(this.customerId)) {
                this.showAlert(true, 'Please Select a customer to see history.');
                this.onCustomerHistoryClose();
                this.forceUpdate();
                return;
            } else {
                this.showHistory = true;
                let url = "/customers/receipts?retailerId=" + localStorage.getItem('retailerID') + "&&customerId=" + this.customerId;
                // "/retailers/"+localStorage.getItem('retailerID')+"/customers/"+ this.customerId+"/receipts";
                dispatch(fetchOrderHistory(orderHistoriesReducer, url));
                this.openCustomerHistory = true;
                this.forceUpdate();
            }
        }


    }
    handleOrderSearch(url) {
        const { dispatch, orderHistoriesReducer } = this.props;
        this.showHistory = true;

        let url1 = "/customers/receipts?retailerId=" + localStorage.getItem('retailerID') + url;
        dispatch(fetchOrderHistory(orderHistoriesReducer, url1));
        this.openCustomerHistory = true;
        this.forceUpdate();
    }
    onSelectOrder(order, mainOrder) {
        this.showHistory = true;
        this.showReciept = false;
        const { dispatch, orderHistoriesReducer } = this.props;
        let url = "/retailers/" + localStorage.getItem('retailerID') + "/receipts/" + order.orderId + "/details";
        dispatch(fetchOrderHistoryData(orderHistoriesReducer, url));
        console.log(order);
    }



    customerType = {
        "data": [{
            "value": "1",
            "displayText": "GENERAL"
        }, {
            "value": "2",
            "displayText": "WHOLESALE"
        }, {
            "value": "3",
            "displayText": "RETAIL"
        }, {
            "value": "4",
            "displayText": "COMPANY EMPLOYEE"
        }]
    }

    setPosition(e) {
        this.setState({ position: e.target.value });
    }
    setNoOverlay(e) {
        this.setState({ noOverlay: e.target.checked });
    }

    //left drawer
    toggleDrawer() {
        this.setState({ open: !this.state.open });
    }
    closeDrawer() {
        this.setState({ open: false });
    }
    onDrawerClose() {
        this.setState({ open: false });
    }
    onRightDraweClose = () => {
        this.setState({
            rightDrawerOpen: false,
        })
    }
    toggleRightDrawer = () => {
        this.setState({ rightDrawerOpen: !this.state.rightDrawerOpen });
    }

    //right drawer
    toggleDrawerCustomer() {
        this.setState({ openCustomer: !this.state.openCustomer });
    }
    closeDrawerCustomer() {
        this.setState({ openCustomer: false });
    }
    onDrawerCloseCustomer = () => {
        this.setState({ openCustomer: false });
    }
    componentWillUnmount() {
        localStorage.clear();
    }


    // getProducts() {
    //     //For Localhost use the below url
    //     const url = "src/products.json";

    //     // For Production use the below url
    //     //const url="https://quarkbackend.com/getfile/sivadass/products";

    //     axios.get(url)
    //         .then(response => {
    //             this.setState({
    //                 products: response.data
    //             })
    //         })
    // }

    customerHistoryHandler() {
        this.setState({ openCustomer: true });
        this.showCustomerHistory = true;
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
            Alert.success(msg || 'done', {
                position: 'bottom-right',
                effect: 'slide',
                timeout: 3000,
                html: true
            });
        }

    }

    componentDidUpdate() {
        if (this.props.type === RECEIVE_SALE_TRANSACTION_DATA && (this.props.status !== 200 && this.props.status !== '') && !this.checkoutFormOpen && !this.closeCheckout) {
            this.checkoutFormOpen = true;
            this.forceUpdate();
        }
    }

    componentWillReceiveProps(props) {

        if (props.storeType !== REQUEST_POS_LOGIN && props.storeType !== RECEIVED_POS_LOGIN) {

            this.setState({
                open: props.leftDrawerOpen,
            })
            if (!_isEmpty(props.addressData) && this.getAddressFlag) {
                this.getAddressFlag = false;
                _set(this.billingAddress, 'city', _get(props.addressData, 'city', ''));
                _set(this.billingAddress, 'state', _get(props.addressData, 'state', ''));
                // _set(this.staffInfo,'latitude', _get(props.addressData,'latitude',''));
                _set(this.billingAddress, 'streetAddress1', _get(props.addressData, 'location', ''));
                // _set(this.staffInfo,'longitude', _get(props.addressData,'longitude',''));
                _set(this.billingAddress, 'country', 'US');
                // this.props1.setValues(this.billingAddress);

            }
            if (this.fetchEarnRulesFlag && !_isEmpty(props.rewardEarnRules)) {
                this.fetchEarnRulesFlag = false;
                let rewardEarnInfo = _get(props.rewardEarnRules, 'earnedPointRule', []);
                let rewardSpentInfo = _get(props.rewardEarnRules, 'spentPointRule', []);

                localStorage.setItem('rewardEarnInfo', JSON.stringify(rewardEarnInfo[0]));
                localStorage.setItem('rewardSpentInfo', JSON.stringify(rewardSpentInfo[0]));

            }

            if (props.isRefreshProduct) {
                this.fetchProductsData();
                const { dispatch, headersReducer } = this.props;
                dispatch(triggerRefreshProducts(headersReducer, false));
                this.forceUpdate();

            }

            if(props.addMisProduct)
            {
                this.handleMisProductToCart(props.miscProduct);
            }

            if (props.scanProduct) {
                this.handleScanProduct(props.scanParam);
                const { dispatch, headersReducer } = props;
                dispatch(setScanerQuery(headersReducer, props.scanParam, false));
                this.forceUpdate();
            }
            if (props.searchProduct) {
                this.handleSearch(props.searchParam);
                const { dispatch, headersReducer } = props;
                dispatch(setProductSearchQuery(headersReducer, props.searchParam, false));
                this.forceUpdate();
            }
            //pin is here
            if (props.orderHistoryOpen) {
                this.onCustomerHistoryOpen(true);
                const { dispatch, headersReducer } = props;
                dispatch(openCustomerHistoryDrawer(headersReducer, false));
                this.forceUpdate();
            }
            if (props.onHoldHistoryOpen) {
                this.onHoldHistoryOpen(true);
                //pin is here
                const { dispatch, headersReducer } = props;
                dispatch(openOnHoldHistoryDrawer(headersReducer, false));
                this.forceUpdate();
            }
            if (props.showBackButton) {
                this.backButtonEnabled = true;
            }
    
            if (!this.fetchEarnRulesFlag && !props.showBackButton && !props.closeCheckoutOrOrderDrawer && this.backButtonEnabled) {
                this.backButtonEnabled = false;
                if (this.checkoutFormOpen) {
                    this.checkoutFormClose();
                } else if (this.openCustomerHistory) {
                    debugger;
                    this.onCustomerHistoryClose();
                }
                //pin is here
                if(this.openOnholdHistory)
                {
                    this.onHoldOrderClose()
                }
            }
            if (props.homePage) {
                this.showHome();
                const { dispatch, headersReducer } = props;
                dispatch(requestHeaderShowHome(headersReducer, false));
                this.forceUpdate();
            }

            if ((props.orderType === RECEIVED_ORDERHISTORY || props.orderType === RECEIVED_ORDERHISTORY_ERROR) && this.openCustomerHistory && this.showHistory) {
                this.showHistory = false;
                if (!_isEmpty(props.orderHistory) && !props.orderHistory.message) {
                    this.customerOrderrderHistory = props.orderHistory;
                    this.customerOrderHistoryData = {};
                    // this.openCustomerHistory = true;
                } else {
                    this.showAlert(true, _get(props.orderHistory, 'message', 'there is no data for this customer.'));
                    this.openCustomerHistory = false;
                    this.backButtonEnabled = false;
                    this.onCustomerHistoryClose();
                    this.customerOrderrderHistory = [];
                    this.customerOrderHistoryData = {};
                    this.forceUpdate();
                }
            }
            else if ((props.orderType === RECEIVED_ORDERHISTORY_DATA || props.orderType === RECEIVED_ORDERHISTORY_DATA_ERROR) && this.openCustomerHistory && this.showHistory) {
                this.showHistory = false;
                if (!_isEmpty(props.selectedOrderHistoryData) && !props.selectedOrderHistoryData.message) {
                    this.customerOrderHistoryData = props.selectedOrderHistoryData;
                    // this.openCustomerHistory = true;
                } else {
                    this.showAlert(true, _get(props.selectedOrderHistoryData, 'message', ''));
                    this.openCustomerHistory = false;
                    this.customerOrderrderHistory = [];
                    this.customerOrderHistoryData = {};
                    this.forceUpdate();
                }
            }

            if (!_isEmpty(props.productData.productInventories) && this.fetchProductsFlag) {
                let productList = [];
                this.fetchProductsFlag = false;
                props.productData.productInventories.map(prod => {
                    let product = {};
                    product.name = prod.name;
                    product.price = prod.sellingPrice.price;
                    product.image = prod.imageLink;
                    product.id = prod.productId;
                    product.itemCode = prod.code;
                    product.description = prod.description;
                    productList.push(product);
                })
                const { dispatch, headersReducer } = props;
                dispatch(setRefreshTime(headersReducer, new Date()));

                this.setState({ products: productList });
                this.forceUpdate();
            } else if (props.productData.message) {
                this.showAlert(true, 'something went wrong.');
                this.forceUpdate();
            }
            if (!_isEmpty(props.productData.categories)) {
                this.categories = props.productData.categories;
                localStorage.setItem('categories', props.productData.categories);
                this.forceUpdate();
            }

            if (this.customerSubmitted && props.type === RECEIVE_CUSTOMER_REGISTRATION_DATA && props.status === 200) {
                this.customerSubmitted = false;
                this.showAlert(false, 'Customer created successfully.');
                if (!_isEmpty(props.getCustomerRegistration)) {
                    this.customerId = _get(props.getCustomerRegistration.customerResponse, 'id', '');
                    this.availableRewardPoints = _get(props.getCustomerRegistration.customerResponse, 'rewardPoints', 0);

                }

            }
            if (this.customerSubmitted && (props.type === RECEIVE_CUSTOMER_REGISTRATION_DATA || props.type === RECEIVE_CUSTOMER_REGISTRATION_DATA_ERROR) && (props.status !== 200 && props.status !== '')) {
                this.showAlert(true, 'Customer creation failed.');
                this.customerSubmitted = false;
            }
            if (!_isEmpty(props.customerSearchData)) {
                this.customerArray = props.customerSearchData;

                let customerName = '';
                this.customerArr = [];
                // if (customerSearch != '') {
                if (!_isEmpty(this.customerArray)) {
                    this.customerArray.map((customer, index) => {
                        this.customerArr.push(
                            <li key={index} onClick={this.setCustomerName.bind(this, customer)}>{customer.firstName + " " + customer.lastName}</li>);
                    })
                }
                else {
                    this.customerArr.push(<li onClick={this.setCustomerName.bind(this, "No customer Found")}>{"No customer Found"}</li>)
                }
                // } 
                // else {
                //     this.customerArr = [];
                // }
            }
            if (props.type === RECEIVE_SALE_TRANSACTION_DATA && props.status === 200 && this.checkoutFormSubmitted) {
                this.showAlert(false, 'transaction is done.');
                this.showReciept = true;
                this.checkoutFormSubmitted = false;
                this.recieptData = props.getSaleTransaction[0];
                console.log('reciept', this.recieptData);

                this.checkoutFormOpen = false;

                this.forceUpdate();
            }
            if (props.type === RECEIVE_SALE_TRANSACTION_DATA && (props.status !== 200 && props.status !== '') && this.checkoutFormSubmitted) {
                this.showAlert(true, 'transaction is failed.');
                this.checkoutFormOpen = false;
                this.closeCheckout = false;
                this.checkoutFormSubmitted = false;
                this.customerArr = [];
                this.forceUpdate();
            }

            let cartItems;
            let customerSearch = this.state.customerSearch;
            let x;

        } else {
            if (!_isEmpty(props.posLogin)) {
                if (props.posLogin.status === 200) {

                    this.redirectToLogin = true;

                    this.forceUpdate();
                    // this.showAlert(false,'logged out successfully.')
                } else {
                    this.showAlert(true, props.posLogin.message)
                }
                // const {dispatch} = props;
                // persistor.purge();
                // persistor.flush();
                // // Create and dispatch the action which will cause redux-persist to purge
                // dispatch({ 
                //     type: PURGE,
                //     key: "myStorageKey",    // Whatever you chose for the "key" value when initialising redux-persist in the **persistCombineReducers** method - e.g. "root"
                // result: () => null              // Func expected on the submitted action. 
                // });  
                localStorage.clear();
                this.forceUpdate();
            }
        }




    }

    // Search by Keyword
    handleSearch(searchParam) {
        this.setState({ term: searchParam });
    }

    handleScanProduct(scanParam) {
        let value = scanParam;
        let item = _find(this.state.products, { 'itemCode': value });
        let quantity = _find(this.state.cart, { 'itemCode': value });
        _set(item, 'quantity', quantity ? quantity.quantity : '1');
        if (!_isEmpty(item)) {
            this.itemFound = true;
            this.handleAddToCart(item);
            //event.target.value = '';
        }
    }

   
    toggleShowSecurePin = () => {
        this.showSecurePin = true;
        localStorage.setItem('showSecurePin', JSON.stringify(this.showSecurePin));
        this.forceUpdate();
    }

    // Search by Keyword
    handleSearchCustomer(event) {
        this.setState({
            customerSearch: event.target.value,
            openSearchCustomer: true
        });
        this.customerSearchRequestBody.searchField = event.target.value;
        this.customerSearchRequestBody.retailer = localStorage.getItem('retailerID');
        this.customerArray = [];
    }

    handleCustomerSearch = () => {
        // if(!_isEmpty(this.customerArr)){
        //     this.showCustomerList = false;
        // }else{
        this.showCustomerList = true;
        // }
        const { dispatch, productReducer } = this.props;
        if (this.customerSearchRequestBody.searchField === '') {
            delete this.customerSearchRequestBody['searchField'];
        }
        this.customerSearchRequestBody.retailer = localStorage.getItem('retailerID');
        dispatch(postCustomerSearchData(this.customerSearchRequestBody, productReducer));

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


    // Mobile Search Reset
    handleMobileSearch() {
        this.setState({ term: "" });
    }
    // Filter by Category
    handleCategory(event) {
        this.setState({ category: event.target.value });
        console.log(this.state.category);
    }
    // Add to Cart
    handleAddToCart(selectedProducts) {
        debugger;
        let cartItem = this.state.cart;
        let productID = selectedProducts.id;
        let productQty = selectedProducts.quantity;
        if (this.checkProduct(productID)) {
            let index = cartItem.findIndex((x => x.id == productID));
            cartItem[index].quantity = Number(cartItem[index].quantity) + 1;
            this.setState({
                cart: cartItem
            })
        } else {
            cartItem.push(selectedProducts);
        }
        this.setState({
            cart: cartItem,
            cartBounce: true,
        });
        setTimeout(function () {
            this.setState({
                cartBounce: false,
                quantity: 1
            });
            console.log(this.state.quantity);
            console.log(this.state.cart);
        }.bind(this), 1000);
        this.sumTotalItems(this.state.cart);
        this.sumTotalAmount(this.state.cart);
        this.forceUpdate();
    }
    fetchProductsData = () => {
        this.fetchProductsFlag = true;
        const { dispatch, productReducer, storesReducer } = this.props;
        dispatch(fetchAsyncLookupData(productReducer));
    }
    handleMisProductToCart=(selectedProducts)=> {
        debugger;
        let cartItem = this.state.cart;
        let productID = selectedProducts.id;
        let productQty = selectedProducts.quantity;
        if (this.checkProduct(productID)) {
            let index = cartItem.findIndex((x => x.id == productID));
            cartItem[index].quantity = Number(cartItem[index].quantity) + 1;
            this.setState({
                cart: cartItem
            })
        } else {
            cartItem.push(selectedProducts);
        }
        this.setState({
            cart: cartItem,
            cartBounce: true,
        });
        setTimeout(function () {
            this.setState({
                cartBounce: false,
                quantity: 1
            });
            console.log(this.state.quantity);
            console.log(this.state.cart);
        }.bind(this), 1000);
        this.sumTotalItems(this.state.cart);
        this.sumTotalAmount(this.state.cart);
        this.props.dispatch(triggerAddMisProduct(false,null))
        this.forceUpdate();
    }
    fetchProductsData = () => {
        this.fetchProductsFlag = true;
        const { dispatch, productReducer, storesReducer } = this.props;
        dispatch(fetchAsyncLookupData(productReducer));
    }
      componentWillMount() {
         this.checkoutFormOpen = false;
        let allNotes =   dbObjOnline.getAllDocs().then((onlineData)=>
    {
        console.log(onlineData,"offline data is here")
    });
        dbObjOnline.getAllDocs().then((data)=>
    {
        console.log(data,"online data is here");
    })
        let allKeys = Object.keys(allNotes);
        if(allKeys.length==0)
        {
            this.props.stopPolling();
        }
        
        localStorage.setItem('holdedData', "[]");
        this.onDrawerClose();
        const { dispatch, productReducer, storesReducer } = this.props;
        dispatch(clearPOSLoginData(storesReducer));
        dispatch(fetchLookupData(productReducer));

    }
    componentDidMount() {
        this.fetchProductsFlag = true;
        setInterval(this.fetchProductsData, 600000);
        // localStorage.setItem('holdedData', "[]");
        this.updateWindowDimensions();
        // const { dispatch, productReducer, storesReducer } = this.props;
        // dispatch(clearPOSLoginData(storesReducer));
        // dispatch(fetchLookupData(productReducer));
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
        this.customerOrderrderHistory = [];
        this.customerOrderHistoryData = {};
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }
    handleRemoveProduct(id, e) {
        let cart = this.state.cart;
        let index = cart.findIndex((x => x.id == id));
        cart.splice(index, 1);
        this.setState({
            cart: cart
        })
        this.sumTotalItems(this.state.cart);
        this.sumTotalAmount(this.state.cart);
        e.preventDefault();
    }
    checkProduct(productID) {
        let cart = this.state.cart;
        return cart.some(function (item) {
            return item.id === productID;
        });
    }
    sumTotalItems() {
        let total = 0;
        let cart = this.state.cart;
        total = 0;
        cart.map(product => {
            total += (Number(product.quantity));
        })
        this.setState({
            totalItems: total
        })
    }
    sumTotalAmount() {
        let total = 0;
        let cart = this.state.cart;
        for (var i = 0; i < cart.length; i++) {
            total += cart[i].price * parseInt(cart[i].quantity);
        }
        this.setState({
            totalAmount: total
        })
    }
    //pin is here
     handleHold = async () => {
        let holdedCustomerData = {};
        holdedCustomerData.cart = this.state.cart;
        holdedCustomerData.customerName = this.customerName;
        holdedCustomerData.customerId = this.customerId;
        holdedCustomerData.totalAmount = this.state.totalAmount;
        holdedCustomerData.totalItems = this.state.totalItems;
        holdedCustomerData.subTotal = this.state.subTotal;
        holdedCustomerData.tax = this.state.tax;
        holdedCustomerData.date = moment().format('DD-MM-YYYY');
        holdedCustomerData.time =  moment().format('HH:mm');
        let holdedDatadb = await dbOnHold.getAllDocs() || "[]";
        if (!_isEmpty(holdedDatadb)) {
            let existingCustomer = _find(holdedDatadb, { 'customerName': this.customerName });
            if (existingCustomer) {
                let cloneHoldedCustomerData ={};
                cloneHoldedCustomerData[existingCustomer._id] = {...holdedCustomerData};
                dbOnHold.updateDoc(cloneHoldedCustomerData)
            }
            else
            dbOnHold.createDoc(holdedCustomerData);
        }
        else
        dbOnHold.createDoc(holdedCustomerData);
        this.deleteCart();
        this.customerName = '';
        this.forceUpdate();
    }
    handleHoldCustomer = (customerName) => {
        let holdedData = JSON.parse(localStorage.getItem("holdedData") || "[]");
        if (!_isEmpty(holdedData)) {
            let customerData = _find(holdedData, { 'customerName': customerName });
            this.setState({
                cart: customerData.cart,
                totalAmount: customerData.totalAmount,
                totalItems: customerData.totalItems,
            });
            this.customerName = customerData.customerName;
            this.forceUpdate();
        }
    }

    //Reset Quantity
    updateQuantity(product, qty) {
        console.log("quantity added...")
        this.setState({
            quantity: qty
        });
        let cartItem = this.state.cart;
        let productID = product.id;
        // let productQty = product.quantity;
        if (this.checkProduct(productID)) {
            let index = cartItem.findIndex((x => x.id == productID));
            cartItem[index].quantity = Number(qty);
            this.setState({
                cart: cartItem
            })
        }
        this.setState({
            quantity: 1
        })
        this.sumTotalItems(this.state.cart);
        this.sumTotalAmount(this.state.cart);
        this.forceUpdate();
    }
    // Open Modal
    openModal(product) {
        this.quickViewProducts = product;
        this.setState({
            // quickViewProduct: product,
            modalActive: true,
            showBox: true
        })
    }

    newCustomer = () => {
        this.setState({
            modalActive: true,
            showAddNewCustomer: true,
            openCustomer: true
        });
        this.customerData = {};
        this.billingAddress = {};
        this.showCustomerHistory = false;
        this.forceUpdate();
    }
    showCustomerData = () => {
        this.customerData = { ...this.customerDataForShow };
        this.billingAddress = { ...this.customerBillingAddress };
        this.showCustomerHistory = true;

        this.setState({
            modalActive: true,
            showAddNewCustomer: true,
            openCustomer: true
        });
        this.forceUpdate();
    }
    // Close Modal
    closeModal() {
        this.setState({
            modalActive: false,
            showBox: false
        })
    }
    checkoutFormClose() {
        this.closeCheckout = true;
        this.checkoutFormOpen = false;
        this.forceUpdate();
    }
    closeSecurePin = () => {
        this.showSecurePin = false;
        localStorage.setItem('showSecurePin', JSON.stringify(this.showSecurePin));
        this.forceUpdate();
    }
    closeTransactionModal = () => {
        this.showTransactionConfirm = false;
        this.setState({
            showTransactionConfirm: false,
        })
        this.forceUpdate();
    }
    deleteCart = () => {
        this.setState({
            cart: [],
            totalAmount: 0,
            totalItems: 0,
        })
    }
    setCustomerName = (customer) => {
        this.showCustomerList = false;
        let customerName = 'No customer Found';
        let id = '';
        if (typeof (customer) !== 'string') {
            customerName = customer.firstName + " " + customer.lastName;
            id = customer.id;
            this.customerDataForShow = customer;
            this.customerBillingAddress = _get(customer, 'billingAddress', {});
        }


        if (customerName != "No customer Found") {
            this.customerName = customerName;
            this.customerId = id;
            this.availableRewardPoints = _get(customer, 'rewardPoints', 0);
            localStorage.setItem('customerID', JSON.stringify(this.customerId));
            this.setState({
                openSearchCustomer: false,
            })

        }
        else {
            this.setState({
                openSearchCustomer: false,
            })
            // this.customerSearchRequestBody.searchField = '';
            // this.customerArr = [];
        }
        if (!this.openCustomerHistory) {
            this.customerSearchRequestBody.searchField = '';
        } else {
            this.customerSearchRequestBody.searchField = this.customerName;
        }
        this.customerArr = [];
        this.forceUpdate();
    }

    handleSaleTransaction = () => {
        const { dispatch, headersReducer, productsReducer } = this.props;

        this.checkoutFormOpen = true;
        this.fetchEarnRulesFlag = true;
        let url = '/rewardpointrule?owner=' + localStorage.getItem('retailerID');
        dispatch(fetchRewardEarnRule(productsReducer, url));

        dispatch(setHeaderBackButton(headersReducer, true));
        // this.showTransactionConfirm = true;
        this.forceUpdate();
    }

    //pin is here
    handleSaleTransactionOfOnHoldOrders = (customerData)=>
    {
        debugger;
        console.log(customerData)
        console.log(this.customerId)
        this.setState({
            cart: customerData.cart,
            totalAmount: customerData.totalAmount,
            totalItems: customerData.totalItems,
        });
        this.customerName = customerData.customerName;
        this.customerId = customerData.customerId;
        const { dispatch, headersReducer, productsReducer } = this.props;

        this.checkoutFormOpen = true;
        this.fetchEarnRulesFlag = true;
        let url = '/rewardpointrule?owner=' + localStorage.getItem('retailerID');
        dispatch(fetchRewardEarnRule(productsReducer, url));

        dispatch(setHeaderBackButton(headersReducer, true));
        // this.showTransactionConfirm = true;
        this.forceUpdate();
    }
    
    handleTransactionSubmit = async (receivedAmount, reedemedAmount, reedemedPoint) => {
        let salesProduct = [];
        this.state.cart.map(cart => {
            let product = {};
            product.product = cart.id;
            product.quantity = cart.quantity;

            salesProduct.push(product);
        })
        this.checkoutFormSubmitted = true;
        let data = {
            terminal: localStorage.getItem('terminalID'),
            customer: this.customerId,
            salesExecutive: localStorage.getItem('userId'),
            paymentMethod: this.paymentMethod,
            amountPaid: receivedAmount,
            // receiptId: new Date().toString(),
            promoCode: '10',
            salesProduct: salesProduct,
            isReedem: this.isReedem,
            ReedemPoint: reedemedPoint,
            ReedemAmount: reedemedAmount,

        };
        console.log('product', data);
        const { dispatch, productsReducer } = this.props;
        let url = "http://35.154.191.154:3000/api/SaleTransaction";
        this.checkoutFormOpen = false;
        
        if(localStorage.getItem('offline')=="false")
        dispatch(postSaleTransactionData(productsReducer, data, url));
        //offline code will start here
        else
        {
          let resp =  await  dbobjOffline.createDoc(data);
          dispatch(postCustomerSearchDataOffline(productsReducer, data, url));
            this.props.startPolling();
            return ;
        }
        this.forceUpdate();
    }

    handleCloseCustomer = () => {
        this.setState({ openCustomer: false })
    }
    closeReciept() {
        this.showReciept = false;
        this.deleteCart();
        const { dispatch, headersReducer } = this.props;
        dispatch(hideLeftBackButton(headersReducer, false));
        this.customerArr = [];
        this.customerName = '';
        this.forceUpdate();
    }

    validateUser = () => {
        // alert('user is validated');
        this.closeSecurePin();
        this.forceUpdate();
    }
    onCategoryChange(category) {
        console.log(category,"category");
        this.selectedProducts = category.products;
        this.forceUpdate();
    }
    showHome() {
        this.selectedProducts = [];
        this.forceUpdate();
    }

    handleAlertConfirm() {
        this.deleteCart();
        this.openAlert = false;
        this.forceUpdate();
    }
    handleAlertClose() {
        this.openAlert = false;
        this.forceUpdate();
    }
    showConfirmationAlert(title, message) {
        this.alertTitle = title;
        this.alertMessage = message;
        this.openAlert = true;
        this.forceUpdate();
    }
    _onIdle = () => {
        this.showSecurePin = true;
        localStorage.setItem('showSecurePin', this.showSecurePin);
        // this.isIdle = true;
        // this.isActive = false;
        this.forceUpdate();
    }
    _onActive = () => {
        // this.showSecurePin = false;
        // this.isIdle = false;
        // this.isActive = true;
        this.forceUpdate();
    }
    onCustomerHistoryClose() {
        this.openCustomerHistory = false;
        const { dispatch, headersReducer } = this.props;
        dispatch(hideLeftBackButton(headersReducer, false));
        this.customerOrderrderHistory = [];
        this.customerOrderHistoryData = {};
        this.forceUpdate();
    }
    onHoldOrderClose = () =>
    {
        this.openOnholdHistory = false;
        const { dispatch, headersReducer } = this.props;
        dispatch(hideLeftBackButton(headersReducer, false));
        this.customerOrderrderHistory = [];
        this.customerOrderHistoryData = {};
        this.forceUpdate();
    }

    handleReedem(isReedem) {
        this.isReedem = isReedem;
        this.forceUpdate();
    }
    cartProductListClickHandler = (product) => {
        this.setState({
            cartProduct: product,
            showCartItemDialog: true,
        })

    }
    //Added function for left side bar
    onLogout = () => {
        this.onRightDraweClose();
        this.closeSecurePin();
        const { dispatch, storesReducer } = this.props;
        let loginData = {
            salesExecutive: localStorage.getItem('userId'),
            terminal: localStorage.getItem('terminalID'),
            type: 'logout'
        }
        this.setState(prevState => ({
            open: false
            }), function(){
                dispatch(postPOSLogin(storesReducer, loginData));
                dispatch(requestHeaderToggleCat(this.props.headersReducer, false))

            });

    }
    checkOut = ()=>
    {
        
    }
    handleOffline=(flag)=>
    {
        debugger;
        this.offline = flag;
        localStorage.setItem('offline',flag)
        return null
    }

    render() {
        let cartItems;
        let customerSearch = this.state.customerSearch;
        let x;

        let customerName = '';



        if (this.redirectToLogin) {
            return (<Redirect push to="/" />)
        }
        if (this.props.openDrawer) {
            this.toggleDrawer();
        }


        // function searchingFor(customerSearch) {
        //     return function (x) {
        //         return x.name.toLowerCase().includes(customerSearch.toLowerCase()) || x.email.toLowerCase().includes(customerSearch.toLowerCase()) || x.drivingLicense.toLowerCase().includes(customerSearch.toLowerCase()) || !customerSearch;
        //     }
        // }

        if (this.props.type != REQUEST_CUSTOMER_SEARCH_DATA && !this.fetchEarnRulesFlag) {
            if (_get(this, 'props.isFetching') || (_get(this.props, 'storeFetching'))) {
                return (<div className='loader-wrapper-main'>
                    <div className="spinner">
                        <div className="rect1"></div>
                        <div className="rect2"></div>
                        <div className="rect3"></div>
                        <div className="rect4"></div>
                        <div className="rect5"></div>
                    </div>
                </div>);
            }

        }

        // if (this.state.openSearchCustomer) {

        // } else {
        //     this.customerArr = [];
        // }

        cartItems = this.state.cart.map(product => {
            return (
                            <li className="cart-item" key={product.name}>
                                {/* <img className="product-image" src={product.image} /> */}
                                <div
                                    onClick={() => this.cartProductListClickHandler(product)}
                                    className="product-info">
                                    <Badge badgeContent={product.quantity} color="primary">
                                        <span className="product-name">{product.name}</span>
                                    </Badge>
                                    {/* <span>{product.quantity}</span> */}

                                </div>
                                {/* <div className="product-total">

                                    <Counter productQuantity={product.quantity} updateQuantity={this.updateQuantity.bind(this, product)} resetQuantity={this.resetQuantity} />
                                </div> */}
                                <div className="amount">
                                    {"$" + formatMoney(product.quantity * product.price)}
                                </div>
                                <a className="product-remove" href="#" onClick={this.handleRemoveProduct.bind(this, product.id)}><i class="material-icons">
                                    remove_circle_outline
            </i></a>
                </li>
            )
        });
        return (
            <div>

                //Order History Container starts here
                <div className="right-drawer-customerHistory">
                    <ReactDrawer
                        open={this.openCustomerHistory}
                        position={'right'}
                        onClose={this.onCustomerHistoryClose}
                        noOverlay={false}
                    >
                        <div>
                            <CustomerHistory
                                open={this.openCustomerHistory}
                                height={this.state.height}
                                cartItems={this.state.cart}
                                isCustomer={true}
                                orderHistory={this.customerOrderHistory}
                                onSelectOrder={(order) => this.onSelectOrder(order)}
                                orderHistoryData={this.customerOrderHistoryData}
                                isFetching={this.props.isOrderFetching}
                                handleOrderSearch={(url) => this.handleOrderSearch(url)}

                                customerArr={this.customerArr}
                                customerSearchRequestBody={this.customerSearchRequestBody}
                                handleCustomerSearch={() => this.handleCustomerSearch()}
                                handleSearchCustomer={(event) => this.handleSearchCustomer(event)}
                                showCustomerList={this.showCustomerList}


                            />
                        </div>
                    </ReactDrawer>
                </div>
                <div className="right-drawer-customerHistory">

                //pin is here
                    <ReactDrawer
                        open={this.openOnholdHistory}
                        position={'right'}
                        onClose={this.onHoldOrderClose}
                        noOverlay={false}
                    >
                        <div>
                            <OnHoldOrderContainer
                              handleSaleTransactionOfOnHoldOrders = {this.handleSaleTransactionOfOnHoldOrders}
                                dbOnHold = {dbOnHold}
                                open={this.openOnholdHistory}
                                height={this.state.height}
                                cartItems={this.state.cart}
                                isCustomer={true}
                                orderHistory={this.customerOrderHistory}
                                onSelectOrder={(order) => this.onSelectOrder(order)}
                                orderHistoryData={this.customerOrderHistoryData}
                                isFetching={this.props.isOrderFetching}
                                handleOrderSearch={(url) => this.handleOrderSearch(url)}

                                customerArr={this.customerArr}
                                customerSearchRequestBody={this.customerSearchRequestBody}
                                handleCustomerSearch={() => this.handleCustomerSearch()}
                                handleSearchCustomer={(event) => this.handleSearchCustomer(event)}
                                showCustomerList={this.showCustomerList}


                            />
                        </div>
                    </ReactDrawer>
                </div>
                <SecurePinDialog
                    // product={this.quickViewProducts}
                    // openModal={this.showSecurePin}
                    closeModal={() => this.closeSecurePin()}
                    open={this.showSecurePin}
                    pin={localStorage.getItem('userPin')}
                    validateUser={() => { this.validateUser() }}
                    onLogout={() => this.onLogout()}
                />
                <RecieptView
                    closeModal={() => this.closeReciept()}
                    open={this.showReciept}
                    data={this.recieptData}
                    cartItems={this.state.cart}
                />
                <AlertDialogSlide
                    open={this.openAlert}
                    handleClose={() => this.handleAlertClose()}
                    content={this.alertMessage}
                    title={this.alertTitle}
                    promptBtnText={this.promptBtnText}
                    handleAlertConfirm={() => this.handleAlertConfirm()}
                />


                <div className="right-drawer-checkout">
                    <ReactDrawer
                        open={this.checkoutFormOpen}
                        position={'right'}
                        onClose={() => this.checkoutFormClose()}
                        noOverlay={true}
                    >
                        <div>
                            <CheckoutForm
                                open={this.checkoutFormOpen}
                                height={this.state.height}
                                availableRewardPoints={this.availableRewardPoints}
                                totalAmount={this.state.totalAmount}
                                handlePointsReedem={(isReedem) => this.handleReedem(isReedem)}
                                onClose={() => this.checkoutFormClose()}
                                handleTransactionSubmit={(receivedAmount, reedemedAmount, reedemedPoint) => this.handleTransactionSubmit(receivedAmount, reedemedAmount, reedemedPoint)}
                                cartView={
                                    <CartView
                                        deleteCart={() => this.showConfirmationAlert('Confirmation', 'Are you sure you want to empty the cart?')}
                                        handleCustomerSearch={() => this.handleCustomerSearch()}
                                        newCustomer={() => this.newCustomer()}
                                        handleHoldCustomer={(customerName) => this.handleHoldCustomer(customerName)}
                                        handleHold={() => this.handleHold()}
                                        handleSaleTransaction={() => this.handleSaleTransaction()}
                                        onClose={() => this.checkoutFormClose()}
                                        cartItems={cartItems}
                                        totalAmount={this.state.totalAmount}
                                        totalItems={this.state.totalItems}
                                        height={this.state.height}
                                        customerSearchRequestBody={this.customerSearchRequestBody}
                                        customerArr={this.customerArr}
                                        holdedCustomers={this.holdedCustomers}
                                        customerName={this.customerName}
                                        showButtons={false}
                                        cart={this.state.cart}
                                        handleSearchCustomer={(event) => this.handleSearchCustomer(event)}
                                    />

                                }

                            />
                        </div>
                    </ReactDrawer>
                </div>
                <div className="col-sm-9 pad-none pro-list-section" style={{ height: (this.state.height - 70) }} >
                <ReactDrawer
                        open={this.state.open}
                        position={this.state.position}
                        onClose={this.onDrawerClose}
                        noOverlay={true}
                    >
                        <div style={{overFlow:'scroll'}}>
                           <OptionSideBar
                           refreshTime = {this.props.refreshTime}
                           refreshProducts = {this.props.refreshProducts}
                           openOnHoldHistoryContainer = {this.props.openOnHoldHistoryContainer}
                           openCustomerHistory = {this.props.openCustomerHistory}
                           toggleDrawer = {this.props.toggleDrawer}
                           dispatch={this.props.dispatch}
                           onLogout={this.onLogout}
                           />
                        </div>
                    </ReactDrawer>
                    <div  className={this.state.open ? "products-wrapper shift-right slick-container" : "products-wrapper slick-container"}>
                    <CategoriesSlickBar
                    categoryData={this.categories}
                    onCategoryChange={(category) => this.onCategoryChange(category)}
                    
                    />
                    </div>
                    <Products
                        productsList={this.state.products}
                        searchTerm={this.state.term}
                        drawer={this.state.open}
                        cartItems={this.state.cart}
                        addToCart={this.handleAddToCart}
                        windowHeight={this.state.height}
                        productQuantity={this.state.quantity}
                        updateQuantity={this.updateQuantity}
                        openModal={this.openModal}
                        selectedProducts={this.selectedProducts}
                    />

                    {/* <Footer /> */}
                    {/* product description starts here */}
                    <MaterialUiDialog
                        product={this.quickViewProducts}
                        openModal={this.state.modalActive}
                        closeModal={this.closeModal}
                        open={this.state.showBox}

                    />
                    <CartItemViewDialog
                        product={this.state.cartProduct}
                        updateQuantity={this.updateQuantity}
                        resetQuantity={this.resetQuantity}
                        totalProduct = {this.state.totalItems}
                        open={this.state.showCartItemDialog}
                        closeModal={() => this.setState({ showCartItemDialog: false })}
                    />
                    <TransactionDialog
                        product={this.quickViewProducts}
                        openModal={this.state.modalActive}
                        closeModal={this.closeTransactionModal}
                        open={this.showTransactionConfirm}
                        handleTransactionSubmit={this.handleTransactionSubmit}
                        customerName={this.customerName}
                    />

                  

                    {/* <QuickView product={this.state.quickViewProduct} openModal={this.state.modalActive} closeModal={this.closeModal} /> */}
                </div>
                <div className="col-sm-3 pad-none cart-div">

                    <CartView
                        className="empty-cart"
                        deleteCart={() => this.showConfirmationAlert('Confirmation', 'Are you sure you want to empty the cart?')}
                        handleCustomerSearch={() => this.handleCustomerSearch()}
                        showCustomerData={() => this.showCustomerData()}
                        newCustomer={() => this.newCustomer()}
                        onCustomerHistoryOpen={() => this.onCustomerHistoryOpen(false)}
                        customerHistory={() => this.customerHistoryHandler()}
                        handleHoldCustomer={(customerName) => this.handleHoldCustomer(customerName)}
                        handleHold={() => this.handleHold()}
                        handleSaleTransaction={() => this.handleSaleTransaction()}
                        cartItems={cartItems}
                        totalAmount={this.state.totalAmount}
                        totalItems={this.state.totalItems}
                        height={this.state.height}
                        customerSearchRequestBody={this.customerSearchRequestBody}
                        customerArr={this.customerArr}
                        holdedCustomers={this.holdedCustomers}
                        customerName={this.customerName}
                        showCustomerList={this.showCustomerList}
                        showButtons={true}
                        cart={this.state.cart}
                        handleSearchCustomer={(event) => this.handleSearchCustomer(event)}
                    />
                </div>
                <Detector
  render={({ online }) => (
    <div >
        {this.handleOffline(!online)}
    </div>
  )}
/>
            </div>
            // </IdleTimer>

        )
    }
}



const mapStateToProps = state => {
    const { productsReducer, userRolesReducer, storesReducer, orderHistoriesReducer, headersReducer, commonsReducer } = state;

    let { posLogin } = storesReducer || {};
    let { productData, getSaleTransaction } = productsReducer || {};
    let { customerSearchData, getCustomerRegistration, rewardEarnRules } = productsReducer || [];
    let { isFetching } = productsReducer || {};
    let storeFetching = storesReducer.isFetching || false;
    let { status } = productsReducer || {};
    let { type } = productsReducer || {};
    let { orderHistory, selectedOrderHistoryData } = orderHistoriesReducer || {};
    let orderType = orderHistoriesReducer.type || '';
    let isOrderFetching = orderHistoriesReducer.isFetching || false;
    let { userId, loggedInTime, retailerId } = userRolesReducer['userRolesData'] ? userRolesReducer['userRolesData'] : {};
    let storeType = storesReducer.type || {};
    let { leftDrawerOpen, homePage, closeCheckoutOrOrderDrawer, showBackButton, orderHistoryOpen,onHoldHistoryOpen, searchProduct, scanProduct, isRefreshProduct, refreshTime,addMisProduct,miscProduct  } = headersReducer || false;
    let { searchParam, scanParam } = headersReducer || '';
    let { addressData } = commonsReducer || {};

    return {
        productData,
        customerSearchData,
        userId,
        loggedInTime,
        retailerId,
        status,
        type,
        posLogin,
        isFetching,
        storeType,
        storeFetching,
        retailerId,
        getSaleTransaction,
        orderHistory,
        selectedOrderHistoryData,
        isOrderFetching,
        orderType,
        getCustomerRegistration,
        leftDrawerOpen,
        homePage,
        closeCheckoutOrOrderDrawer,
        showBackButton,
        orderHistoryOpen,
        searchParam,
        searchProduct,
        scanParam,
        scanProduct,
        isRefreshProduct,
        addressData,
        rewardEarnRules,
        onHoldHistoryOpen,
        refreshTime,
        addMisProduct,
        miscProduct
    }
}
const onPollInterval = async (props, dispatch) => {
    /*
    In this example, dispatch will return a Promise
    and then call this function again [intervalDuration]
    milliseconds later once the Promise has resolved
    */
   let allNotes =  await dbobjOffline.getAllDocs();
   console.log(allNotes,"all offline sell transaction is here")
  
   let allKeys = Object.keys(allNotes);
   if(allKeys.length==0)
   {
       props.stopPolling();
   }
   let data = Object.assign({},allNotes[allKeys[0]]);
   console.log(data,"data is here");
   let dataToSend = {...data};
   delete dataToSend._id;
   delete dataToSend._rev;
  
   console.log(props,"props is here")
   let url = "http://35.154.191.154:3000/api/SaleTransaction";
   if(allKeys.length>0&&localStorage.getItem('offline')=='false')
   {
    props.dispatch(postSaleTransactionDataWhenOnline('something', dataToSend, url)).then(async (respData)=>
{
    let resp = await dbobjOffline.deleteDoc(data);
    if(allKeys.length-1==0)
   {
       props.stopPolling();
       return ;
   }
    console.log("remove resp is here",resp) 
})
.catch((err)=>
{
 console.log("here",err) 
})
   }
    return 
};
export default  (connect(mapStateToProps)(asyncPoll(10 * 1000, onPollInterval)(ProductHome)));