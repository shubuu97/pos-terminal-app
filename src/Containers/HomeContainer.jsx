import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty'
/* Material import */

/* Redux Imports */
import { connect } from 'react-redux';
import genericPostData from '../Global/dataFetch/genericPostData';
import {commonActionCreater} from '../Redux/commonAction';
/* React Pose */
import posed from 'react-pose';
/* Pouch DB */
import PouchDb from 'pouchdb';
/* Component Imports */
import ProductsSection from '../Components/ProductsSection/ProductsSection'
import CheckoutSection from '../Components/CheckoutSection/CheckoutSection'
import PaymentSection from '../Components/PaymentSection/PaymentSection'
import OrderHistoryDialog from '../Components/OrderHistoryDialog';
import SessionDialogue from '../Components/SessionDialogue'
import HoldDialogue from '../Components/HoldDialogue';
import GiftCardModel from '../Components/ProductsSection/GiftCardModel';



/* Pose Animation Configs */
const Config = {
    open: { width: '60%', opacity: 1 },
    closed: { width: '0px', opacity: 0 }
}

const Products = posed.div(Config)
const Payment = posed.div(Config);

class HomeContainer extends React.Component {

    constructor() {
        super();
        this.state = {
            productListHeight: 0,
            isOpenProduct: true,
            isOpenPayment: false,
            openOnHold: false,
            openOrderHistory: false,
        }
    }

    // componentWillUpdate(){
    //     debugger;
    //     const params = new URLSearchParams(this.props.location.search);
    //     if(params)
    //     {
    //     const tab = params.get('tab');
    //     if(tab=="=1"){
    //         this.state.isOpenPayment = false;
    //         // this.setState({isOpenProduct:true});
    //     }
    //   console.log(tab);
    //     } // bar
    // }

    componentDidMount() {
        let token = localStorage.getItem('Token')
        if (_isEmpty(token)) {
            this.props.history.push('/login')
        }
        this.calcHeight();
        this.getProductData();
    }

    calcHeight() {
        let windowHeight = document.documentElement.scrollHeight
        // * Product Section Calculations
        let headerHeight = 80;
        let categoriesHeight = 90;
        let productListHeight = windowHeight - (headerHeight + categoriesHeight + 50)
        // * Checkout Section Calculations
        let checkoutHeader = headerHeight * 0.65;
        let checkoutMainPart = windowHeight - (checkoutHeader + 80);
        let checkoutcalcArea = 150
        let checkoutactionArea = 60
        let checkoutcartArea = checkoutMainPart - (checkoutcalcArea + checkoutactionArea)
        // * Checkout Customer Section Calculations
        let checkoutCustomerArea = checkoutMainPart - checkoutactionArea


        this.setState({
            windowHeight: windowHeight,
            headerHeight,
            categoriesHeight,
            productListHeight,
            checkoutHeader,
            checkoutMainPart,
            checkoutcalcArea,
            checkoutactionArea,
            checkoutcartArea,
            checkoutCustomerArea
        })
    }

    toggleViewPayment = () => {
        this.setState({
            isOpenProduct: false,
            isOpenPayment: true,
        })
    }

    toggleViewProduct = () => {
        this.setState({
            isOpenProduct: true,
            isOpenPayment: false,
        })
    }

    handleClickOpen = () => {
        this.setState({ openOnHold: true });
    };

    handleClose = () => {
        this.setState({ openOnHold: false });
    };
    handleClickOpenSessionContainer = () => {
        this.setState({ openSessionContainer: true });
    };

    handleCloseSessionContainer = () => {
        if(localStorage.getItem('sessionId')=='nil'){
            localStorage.clear();
            this.props.history.push('/login')
        }
        this.setState({ openSessionContainer: false });
    };


    getProductData = () => {
        let productsdb = new PouchDb('productsdb');
        productsdb.allDocs({
            include_docs: true,
            attachments: true,
            limit: 9,
            skip: 0
        }).then((result) => {
            result.pagination = {}
            result.pagination.firstItemId = result.rows[0].id
            result.pagination.lastItemId = result.rows[result.rows.length - 1].id
            result.pagination.pageNo = 1
            result.pagination.startVal = 1
            result.pagination.endVal = result.rows.length
            this.props.dispatch(commonActionCreater(result, 'GET_PRODUCT_DATA_SUCCESS'));
        }).catch((err) => {
            console.log(err)
        });
    }
    
    handleTerminalHistoryOpen = () => {
        let url = 'Sale/GetByTerminalId';
        let data = { id: localStorage.getItem('terminalId') }
        this.getOrderHistory(url, data)
        this.setState({
            openOrderHistory: true,
        });
    }
    getOrderHistory = (url, data) => {
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: data,
            url: url,
            constants: {
                init: 'GET_CUSTOMER_SALE_DATA_INIT',
                success: 'GET_CUSTOMER_SALE_DATA_SUCCESS',
                error: 'GET_CUSTOMER_SALE_DATA_ERROR'
            },
            identifier: 'GET_CUSTOMER_SALE_DATA',
            successCb: this.handleGetCustomerSaleData,
            errorCb: this.handleGetCustomerSaleDataError
        })
    }
    handleHistoryOpen = () => {
        let url = 'Sale/GetByCustomerId';
        let data = { id: _get(this.props, 'customer.id', '') }
        this.getOrderHistory(url, data)
        this.setState({
            openOrderHistory: true,
        });
    }
    handleGetCustomerSaleData = (data) => {

    }
    handleGetCustomerSaleDataError = (error) => {

    }
    handleOrderHistoryClose = () => {
        this.setState({
            openOrderHistory: false,
        });
    }
    handleGiftCard = (open) => {
        this.setState({
            openGiftCard: open,
        });
    }


    render() {
        let windowHeight = document.documentElement.scrollHeight
        let { productListHeight, isOpenProduct, isOpenPayment, headerHeight, categoriesHeight, checkoutHeader, checkoutMainPart, checkoutcalcArea, checkoutactionArea, checkoutcartArea, checkoutCustomerArea } = this.state

        let { productList, dispatch, cart } = this.props
        return (
            <div className='main pos-body'>
                <Products pose={isOpenProduct ? 'open' : 'closed'}>
                    <ProductsSection
                        // * Css Specific props
                        windowHeight={windowHeight}
                        productListHeight={productListHeight}
                        headerHeight={headerHeight}
                        categoriesHeight={categoriesHeight}
                        productList={productList}
                        cart={cart}
                        dispatch={dispatch}
                        history={this.props.history}
                        handleGiftCard={() => this.handleGiftCard(true)}
                        // ! Actions
                        handleHistoryOpen={this.handleTerminalHistoryOpen}
                        handleClickOpen={this.handleClickOpen}
                        handleClickOpenSessionContainer={this.handleClickOpenSessionContainer}
                    />
                </Products>

                <CheckoutSection
                    // * Css Specific props
                    windowHeight={windowHeight}
                    checkoutHeader={checkoutHeader}
                    checkoutMainPart={checkoutMainPart}
                    checkoutcalcArea={checkoutcalcArea}
                    checkoutactionArea={checkoutactionArea}
                    checkoutcartArea={checkoutcartArea}
                    checkoutCustomerArea={checkoutCustomerArea}
                    dispatch={dispatch}
                    cart={cart}
                    // ! Actions
                    toggleViewPayment={this.toggleViewPayment}
                    toggleViewProduct={this.toggleViewProduct}
                    handleHistoryOpen={this.handleHistoryOpen}

                />

                <Payment pose={isOpenPayment ? 'open' : 'closed'}>
                    {isOpenPayment ?
                        <PaymentSection /> : null
                    }
                </Payment>

                {
                    this.state.openOnHold ?
                        <HoldDialogue
                            handleClickOpen={this.handleClickOpen}
                            handleClose={this.handleClose}
                            open={this.state.openOnHold}
                            holdCartData={this.props.holdCartData}
                            dispatch={dispatch}
                        /> : null
                }
                {
                    this.state.openOrderHistory ?
                        <OrderHistoryDialog
                            handleClose={this.handleOrderHistoryClose}
                            open={this.state.openOrderHistory}
                            dispatch={dispatch}
                        /> : null
                }

                {
                    this.state.openSessionContainer ?
                        <SessionDialogue
                            handleClickOpen={this.handleClickOpenSessionContainer}
                            handleClose={this.handleCloseSessionContainer}
                            open={this.state.openSessionContainer}
                            holdCartData={this.props.holdCartData}
                            dispatch={dispatch}
                        /> : null
                }
                {
                    this.state.openGiftCard &&
                    <GiftCardModel
                        open={this.state.openGiftCard}
                        handleClose={() => this.handleGiftCard(false)}
                    />
                }
            </div>
        );
    }
}

function mapStateToProps(state) {
    let { productList, cart, cartHoldData } = state;
    productList = _get(productList, 'lookUpData.rows', []);
    let holdCartData = _get(cartHoldData, 'holdedItems', []);
    let customer = _get(cart, 'customer', {});

    return {
        productList,
        cart,
        holdCartData,
        customer,
    }
}
export default connect(mapStateToProps)(HomeContainer)
