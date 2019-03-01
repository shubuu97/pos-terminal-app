import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty'
/* Material import */

/* Redux Imports */
import { connect } from 'react-redux';
import genericPostData from '../Global/dataFetch/genericPostData';
import { commonActionCreater } from '../Redux/commonAction';
/* React Pose */
import posed from 'react-pose';
/* Pouch DB */
import PouchDb from 'pouchdb';
/* Component Imports */
import ProductsSection from '../Components/ProductsSection/ProductsSection'
import CheckoutSection from '../Components/CheckoutSection/CheckoutSection'
import PaymentSection from '../Components/PaymentSection/PaymentSection'
import OrderHistoryDialog from '../Components/OrderHistoryDialog';
import withDialog from '../Components/DialogHoc'
import HoldDialogue from '../Components/HoldDialogue';
import AlertCartClear from '../Components/AlertCartClear';
import GiftCardModel from '../Components/ProductsSection/GiftCardModel';
import MiscProductModal from '../Components/ProductsSection/MiscProductModal';
import SessionContainer from './SessionContainer';
import QuickBookContainer from './QuickBookContainer';
let SessionDialog = withDialog(SessionContainer)
let QuickBookDialog = withDialog(QuickBookContainer)


/* Pose Animation Configs */
const Config = {
    open: { width: '65%', opacity: 1, flip: true },
    closed: { width: '0px', opacity: 0, flip: true }
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
            openMiscProduct: false,
            openCartOnHoldOrClear: false,
        }
    }

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
        let headerHeight = 70;
        let categoriesHeight = 90;
        let productListHeight = windowHeight - (headerHeight + categoriesHeight + 25)
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

    handleClickOpen = (name) => {
        this.setState({ [name]: true });
    };

    handleClose = (name) => {
        this.setState({ [name]: false });
    };
    handleClickOpenSessionContainer = () => {
        this.setState({ openSessionContainer: true });
    };

    handleCloseSessionContainer = () => {
        if (localStorage.getItem('sessionId') == 'nil') {
            localStorage.clear();
            this.props.history.push('/login')
        }
        this.setState({ openSessionContainer: false });
    };

    handleHoldIndex = (index) => {
        this.setState({
            holdIndex: index
        })
    }


    getProductData = () => {
        let productsdb = new PouchDb('productsdb');
        productsdb.allDocs({
            include_docs: true,
            attachments: true,
            // limit: 9,
            // skip: 0
            // ! Note - Hiding Pagination
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
    handleMiscProduct = (open) => {
        this.setState({
            openMiscProduct: open,
        })
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
                        handleMiscProduct={() => this.handleMiscProduct(true)}
                        // ! Actions
                        handleHistoryOpen={this.handleTerminalHistoryOpen}
                        handleClickOpenOnHold={() => this.handleClickOpen('openOnHold')}
                        handleClickOpenSessionContainer={this.handleClickOpenSessionContainer}
                        handleClickQuickBook = {()=>this.setState({openQuickBookContainer:true})}
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
                            handleClickOpenOnHold={() => this.handleClickOpen('openOnHold')}
                            handleCloseOnHold={() => this.handleClose('openOnHold')}
                            handleClickOpenAlertCartClear={() => this.handleClickOpen('openCartOnHoldOrClear')}
                            handleCloseAlertCartClear={() => this.handleClose('openCartOnHoldOrClear')}
                            handleHoldIndex={this.handleHoldIndex}
                            open={this.state.openOnHold}
                            cart={this.props.cart}
                            holdCartData={this.props.holdCartData}
                            dispatch={dispatch}
                        /> : null
                }
                {
                    this.state.openCartOnHoldOrClear ?
                        <AlertCartClear
                            //handleClickOpenOnHold={() => this.handleClickOpen('openOnHold')}
                            handleCloseOnHold={() => this.handleClose('openOnHold')}
                            //handleClickOpenAlertCartClear={() => this.handleClickOpen('openCartOnHoldOrClear')}
                            handleCloseAlertCartClear={() => this.handleClose('openCartOnHoldOrClear')}
                            open={this.state.openCartOnHoldOrClear}
                            cart={this.props.cart}
                            holdCartData={this.props.holdCartData}
                            dispatch={dispatch}
                            index={this.state.holdIndex}
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
                        <SessionDialog
                            title = "Sesssion List"
                            handleClickOpen={this.handleClickOpenSessionContainer}
                            handleClose={this.handleCloseSessionContainer}
                            open={this.state.openSessionContainer}
                            holdCartData={this.props.holdCartData}
                            dispatch={dispatch}
                        /> : null
                }
                {
                    this.state.openQuickBookContainer ?
                        <QuickBookDialog
                            title = "Quick Book Integration"
                            handleClickOpen={()=>this.setState({openQuickBookContainer:true})}
                            handleClose={()=>this.setState({openQuickBookContainer:false})}
                            open={this.state.openQuickBookContainer}
                            holdCartData={this.props.holdCartData}
                            dispatch={dispatch}
                            {...this.propos}
                        /> : null
                }
                {
                    this.state.openGiftCard &&
                    <GiftCardModel
                        open={this.state.openGiftCard}
                        handleClose={() => this.handleGiftCard(false)}
                    />
                }
                {
                    this.state.openMiscProduct &&
                    <MiscProductModal
                        open={this.state.openMiscProduct}
                        handleClose={() => this.handleMiscProduct(false)}
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
