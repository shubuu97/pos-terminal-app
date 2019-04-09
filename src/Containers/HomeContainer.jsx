import React from 'react';
import { Detector } from 'react-detect-offline';
/* Lodash Imports */
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _find from 'lodash/find'
/* Material Icons */
import SignalWifiOffOutlined from '@material-ui/icons/SignalWifiOffOutlined'
/* Material Import */
import CircularProgress from '@material-ui/core/CircularProgress';
/* Redux Imports */
import { connect } from 'react-redux';
import genericPostData from '../Global/dataFetch/genericPostData';
import { commonActionCreater } from '../Redux/commonAction';
/* React Pose */
import posed from 'react-pose';
/* Pouch DB */
import PouchDb from 'pouchdb';
/* Global Imports */
import pollingHoc from '../Global/PosFunctions/pollingHoc';
import axiosFetcher from '../Global/dataFetch/axiosFetcher';
/* Component Imports */
import ProductsSection from '../Components/ProductsSection/ProductsSection'
import CheckoutSection from '../Components/CheckoutSection/CheckoutSection'
import PaymentSection from '../Components/PaymentSection/PaymentSection'
import OrderHistoryDialog from '../Components/OrderHisoty/OrderHistoryDialog';
import withDialog from '../Components/DialogHoc'
import OnHoldDialogue from '../Components/Dialogues/HoldCartDialogue/OnHoldDialogue';
import AlertCartClear from '../Components/AlertCartClear';
import GiftCardModel from '../Components/ProductsSection/GiftCardModel';
import MiscProductModal from '../Components/ProductsSection/MiscProductModal';
import SessionContainer from './SessionContainer';
import LockTerminalDialogue from '../Components/Dialogues/LockTerminalDialogue'
import OfflineTransactionContainer from './OfflineTransactionContainer';
import Customer from '../Components/CheckoutSection/Customer';
import SettingContainer from './SettingContainer';

let SessionDialog = withDialog(SessionContainer)
let OfflineTransactionDialog = withDialog(OfflineTransactionContainer);
let SettingDialog = withDialog(SettingContainer);
let transactiondb = new PouchDb('transactiondb')


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
            isLoading: false,
            offline:true
        }
    }

    componentDidMount() {
        let token = localStorage.getItem('Token')
        if (_isEmpty(token)) {
            this.props.history.push('/login')
        }
        else {
            this.calcHeight();
            this.getRuleSet();
            this.getProductData();
            this.props.startPolling();
        }
    }

    calcHeight() {
        let windowHeight = document.documentElement.scrollHeight
        // ! Product Section Calculations
        let headerHeight = 70;
        let categoriesHeight = 90;
        let productListHeight = windowHeight - (headerHeight + categoriesHeight + 25)

        // ! Checkout Section Calculations
        let checkoutHeader = headerHeight * 0.65;
        let checkoutMainPart = windowHeight - (checkoutHeader + 80);
        let checkoutcalcArea = 150
        let checkoutactionArea = 60
        let checkoutcartArea = checkoutMainPart - (checkoutcalcArea + checkoutactionArea)
        // * Checkout Customer Section Calculations
        let checkoutCustomerArea = checkoutMainPart - checkoutactionArea

        // ! Payment Section
        let paymentOptionsPart = headerHeight;
        let paymentMainPart = windowHeight - (checkoutHeader + 100);
        let paymentCalculator = paymentMainPart * 0.70;
        let paymentSaleComment = paymentMainPart * 0.10;
        let paymentSubmitTransaction = paymentMainPart * 0.10;


        this.setState({
            windowHeight,
            headerHeight,
            categoriesHeight,
            productListHeight,
            checkoutHeader,
            checkoutMainPart,
            checkoutcalcArea,
            checkoutactionArea,
            checkoutcartArea,
            checkoutCustomerArea,
            paymentOptionsPart,
            paymentMainPart,
            paymentCalculator,
            paymentSaleComment,
            paymentSubmitTransaction,
        })
    }
    errorLoyaltyPoint = (err, errCode) => {
        if (err) {
            if (errCode == 401) {
                this.handleLogout()
            }
        }
    }

    getRuleSet = () => {
        let data = { id: localStorage.getItem('retailerId') }
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: data,
            url: 'Rewards/RedemptionRule/ByRetailer',
            dontShowMessage: true,
            constants: {
                init: 'GET_LOYALTY_REDEMPTION_RULES_INIT',
                success: 'GET_LOYALTY_REDEMPTION_RULES_SUCCESS',
                error: 'GET_LOYALTY_REDEMPTION_RULES_ERROR'
            },
            identifier: 'GET_LOYALTY_REDEMPTION_RULES',
            successCb: this.saveRedemptionRules,
            errorCb: this.errorLoyaltyPoint
        })
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: data,
            url: 'Rewards/EarningRule/ByRetailer',
            dontShowMessage: true,
            constants: {
                init: 'GET_LOYALTY_EARNING_RULES_INIT',
                success: 'GET_LOYALTY_EARNING_RULES_SUCCESS',
                error: 'GET_LOYALTY_EARNING_RULES_ERROR'
            },
            identifier: 'GET_LOYALTY_EARNING_RULES',
            successCb: this.saveEarningRules,
            errorCb: this.handleErrorRedemption
        })
    }

    saveRedemptionRules = (data) => {
        this.props.dispatch(commonActionCreater(data, 'GET_LOYALTY_REDEMPTION_RULES'));
    }

    saveEarningRules = (data) => {
        this.props.dispatch(commonActionCreater(data, 'GET_LOYALTY_EARNING_RULES'));
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
    filterResult = (result) => {
        return new Promise(async (resolve, reject) => {
            this.resolveArray.push(resolve);
            if (_get(result, 'rows.length') == 0) {
                let resolved = this.resolveArray[0];

                resolved(this.filteredResult)
            }

            let rowsWithPositiveQuantity = result.rows.filter((row) => {
                if (_get(row, 'doc.inventory.quantity') > 0) {
                    return true;
                }
                else {
                    return false;
                }
            });
            this.filteredResult = [...this.filteredResult, ...rowsWithPositiveQuantity];
            let filteredCount = _get(result, 'rows.length', 0) - rowsWithPositiveQuantity.length;
            console.log(filteredCount, "filteredCount");
            if (filteredCount > 0) {
                let startkey = result.rows[result.rows.length - 1].id;
                let productsdb = new PouchDb('productsdb');
                let res = await productsdb.allDocs({
                    include_docs: true,
                    startkey,
                    limit: filteredCount,
                    skip: 1
                });
                this.filterResult(res);
            }
            else {
                console.log(this.filteredResult)
                let resolved = this.resolveArray[0];
                resolved(this.filteredResult);
            }
        })

    }
    getProductData = () => {
        let productsdb = new PouchDb('productsdb');
        productsdb.allDocs({
            include_docs: true,
            attachments: true,
            limit: 39,
            skip: 0
        }).then(async (result) => {
            if (localStorage.getItem("showOutOfStock") == "false") {
                this.filteredResult = [];
                this.resolveArray = [];
                this.filterResult(result).then(async (rows) => {
                    if (rows.length == 0) {
                        return;
                    }
                    let result = { rows };

                    result.pagination = {}
                    result.pagination.method = "allDocs"
                    result.pagination.firstItemId = result.rows[0].id
                    result.pagination.lastItemId = result.rows[result.rows.length - 1].id
                    result.pagination.pageNo = 1
                    result.pagination.startVal = 1
                    result.pagination.endVal = result.rows.length
                    this.props.dispatch(commonActionCreater(result, 'GET_PRODUCT_DATA_SUCCESS'));
                })
            }
            else {
                result.pagination = {}
                result.pagination.method = "allDocs"
                result.pagination.firstItemId = result.rows[0].id
                result.pagination.lastItemId = result.rows[result.rows.length - 1].id
                result.pagination.pageNo = 1
                result.pagination.startVal = 1
                result.pagination.endVal = result.rows.length
                this.props.dispatch(commonActionCreater(result, 'GET_PRODUCT_DATA_SUCCESS'));
            }
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
    handleLockTerminal = () => {
        this.props.dispatch(commonActionCreater({ lock: true }, 'LOCK_TERMINAL'));
    }
    handleUnlockTerminal = () => {
        this.props.dispatch(commonActionCreater({ lock: false }, 'LOCK_TERMINAL'));
    }

    handleLogout = () => {
        localStorage.clear();
        //logic to destory the dbs
        let p1 = new PouchDb('customersdb').destroy();
        let p2 = new PouchDb('productsdb').destroy();
        let p3 = new PouchDb('categoryDb').destroy();
        this.setState({ isLoading: true })
        Promise.all([p1, p2, p3]).then((data) => {
            this.setState({ isLoading: false });
            window.location.reload();
            this.props.history.push('/login')
        });
    }

    showNetworkIndicator = ({ online }) => {
        if (online && this.state.offline == true){
            this.setState({
                offline:false
            })
            return null
        }
        else if(online && this.state.offline == false){
            return null
        }
        else if(!online&&this.state.offline==false){
            this.setState({offline:true})
            return (
                <div className='toast-area absolute flex-row justify-center align-center'>
                    <div className='offline-indicator flex-row justify-center align-center'>
                        <SignalWifiOffOutlined /> <span className='pl-10'>Uhhh, You are Offline</span>
                    </div>
                </div>
            )
        }
        else{
            return (
                <div className='toast-area absolute flex-row justify-center align-center'>
                    <div className='offline-indicator flex-row justify-center align-center'>
                        <SignalWifiOffOutlined /> <span className='pl-10'>Uhhh, You are Offline</span>
                    </div>
                </div>
            )
        }
    }


    render() {
        let windowHeight = document.documentElement.scrollHeight
        let { productListHeight, isOpenProduct, isOpenPayment, headerHeight, categoriesHeight, checkoutHeader, checkoutMainPart, checkoutcalcArea, checkoutactionArea, checkoutcartArea, checkoutCustomerArea } = this.state

        let { productList, dispatch, cart } = this.props
        return (
            <div className='main pos-body relative' >
                <Products pose={isOpenProduct ? 'open' : 'closed'}>
                    <ProductsSection
                        offline={this.state.offline}
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
                        handleClickQuickBook={() => this.setState({ openQuickBookContainer: true })}
                        handleLockTerminal={this.handleLockTerminal}
                        handleSetting={() => this.setState({ openSetting: true })}
                        getProductData={this.getProductData}
                        handleLogout={this.handleLogout}
                    />
                </Products>
                <CheckoutSection
                    offline={this.state.offline}
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
                        <PaymentSection
                            offline={this.state.offline}
                            startPolling={this.props.startPolling}
                            windowHeight={windowHeight}
                            paymentOptionsPart={this.state.paymentOptionsPart}
                            paymentMainPart={this.state.paymentMainPart}
                            paymentCalculator={this.state.paymentCalculator}
                            paymentSaleComment={this.state.paymentSaleComment}
                            paymentSubmitTransaction={this.state.paymentSubmitTransaction}
                        /> : null
                    }
                </Payment>
                {
                    this.state.openOnHold ?
                        <OnHoldDialogue
                            offline={this.state.offline}
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
                            offline={this.state.offline}
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
                            offline={this.state.offline}
                            handleClose={this.handleOrderHistoryClose}
                            open={this.state.openOrderHistory}
                            dispatch={dispatch}
                        /> : null
                }
                {
                    this.state.openSessionContainer ?
                        <SessionDialog
                            offline={this.state.offline}
                            title="Sesssion List"
                            handleClickOpen={this.handleClickOpenSessionContainer}
                            handleClose={this.handleCloseSessionContainer}
                            open={this.state.openSessionContainer}
                            holdCartData={this.props.holdCartData}
                            dispatch={dispatch}
                        /> : null
                }
                {
                    this.state.openQuickBookContainer ?
                        <OfflineTransactionDialog
                            offline={this.state.offline}
                            title="Offline Transactions"
                            handleClickOpen={() => this.setState({ openQuickBookContainer: true })}
                            handleClose={() => this.setState({ openQuickBookContainer: false })}
                            open={this.state.openQuickBookContainer}
                            holdCartData={this.props.holdCartData}
                            dispatch={dispatch}
                            {...this.props}
                        /> : null
                }
                {
                    this.state.openSetting ?
                        <SettingDialog
                            offline={this.state.offline}
                            title="Settings"
                            handleClickOpen={() => this.setState({ openSetting: true })}
                            handleClose={() => this.setState({ openSetting: false })}
                            open={this.state.openSetting}
                            getProductData={this.getProductData}
                            dispatch={dispatch}
                            {...this.props}
                        /> : null
                }
                {
                    this.state.openGiftCard &&
                    <GiftCardModel
                        offline={this.state.offline}
                        open={this.state.openGiftCard}
                        handleClose={() => this.handleGiftCard(false)}
                    />
                }
                {
                    this.state.openMiscProduct &&
                    <MiscProductModal
                        offline={this.state.offline}
                        open={this.state.openMiscProduct}
                        handleClose={() => this.handleMiscProduct(false)}
                    />
                }

                <Detector render={this.showNetworkIndicator} />

                <LockTerminalDialogue
                    offline={this.state.offline}
                    open={this.props.lockState}
                    handleUnlockTerminal={this.handleUnlockTerminal}
                    handleLogout={this.handleLogout}
                />

                {
                    this.state.isLoading ?
                        <div className=' fwidth fheight absolute flex-column justify-center align-center' style={{ background: "rgba(0,0,0,0.5)" }}>
                            <CircularProgress size={50} style={{ color: '#fff' }} />
                            <div className='pt-15' style={{ fontSize: '1.5em', color: '#fff', fontWeight: 'bold' }}>Logging Out</div>
                        </div> : null
                }
            </div >
        );
    }
}

function mapStateToProps(state) {
    let { productList, cart, cartHoldData, lockTerminal } = state;
    productList = _get(productList, 'lookUpData.rows', []);
    let holdCartData = _get(cartHoldData, 'holdedItems', []);
    let customer = _get(cart, 'customer', {});
    let lockState = _get(lockTerminal, 'lookUpData.lock', false);

    return {
        productList,
        cart,
        holdCartData,
        customer,
        lockState
    }
}

const deleteDocFromDb = async (row) => {
    console.log("###############hi###############")
    //todo implement maxtry
    let rev = row.value.rev;
    return transactiondb.remove(row.id, row.value.rev).
        then(() => true).
        catch(() => false);
}

const OfflineTransactionPusher = async (propsOfComp, dispatch) => {
    console.log("###OfflineTransaction###")
    let resp = await transactiondb.allDocs({
        include_docs: true,
        attachments: true,
    });
    let rows = resp.rows;


    if (rows.length) {

        let transactionDoc = _get(rows, '[0].doc.transactionDoc');
        axiosFetcher({
            method: 'POST',
            reqObj: transactionDoc,
            url: 'Sale/CreateSaleTransaction',
            successCb: () => deleteDocFromDb(rows[0]),
            errorCb: (err) => {
                console.log(err, "err is here")
            }
        })
    }
    else {
        // propsOfComp.stopPolling(propsOfComp, dispatch);
        return;
    }
}
const updateTimeStampAndDbForInventory = async (res, dispatch, extraArgs) => {
    let tempInvetoryUpdateTime = localStorage.getItem('tempInvetoryUpdateTime');
    localStorage.setItem('invetoryUpdateTime', tempInvetoryUpdateTime)

    let productsdb = new PouchDb('productsdb');
    let updatedInventory = _get(res, 'data', []) || [];
    let promiseArray = updatedInventory.map(async (product, index) => {
        let productObj = await productsdb.get(product._id);
        productObj.inventory.quantity = _get(product, 'inventory.quantity', 0);
        return productObj
    });
    Promise.all(promiseArray).then(async (updatedInventoryWith_Rev) => {
        let resOfUpdateBulk = await productsdb.bulkDocs(updatedInventoryWith_Rev);
        //!this is the code for updating the current reducer;
        // console.log(updatedInventoryWith_Rev, extraArgs, "this is the code for updating the current reducer 1");
        // let productList = _get(extraArgs, 'productList', []) || [];
        // updatedInventoryWith_Rev.map((updatedInventory, index) => {
        //     console.log(updatedInventory, productList, "this is the code for updating the current reducer 2");
        //     let res = _find(productList, {id:updatedInventory._id});

        //     console.log(updatedInventoryWith_Rev, extraArgs, res, "this is the code for updating the current reducer 3");

        // })
    })

}
const getInventoryUpdate = async (propsOfComp, dispatch) => {
    let reqObj = {
        id: localStorage.getItem('storeId'),
        timestamp: {
            seconds: parseInt(localStorage.getItem('invetoryUpdateTime'))
        }
    };
    let tempInvetoryUpdateTime = Date.now();
    tempInvetoryUpdateTime = parseInt(tempInvetoryUpdateTime / 1000);
    localStorage.setItem('tempInvetoryUpdateTime', tempInvetoryUpdateTime);
    axiosFetcher({
        method: 'POST',
        reqObj,
        url: 'Inventory/Increment',
        successCb: updateTimeStampAndDbForInventory,
        extraArgs: propsOfComp,
        errorCb: (err) => {
            console.log(err, "err is here")
        }
    })
}
const updateTimeStampAndDbForCustomer = async (res) => {
    let tempCustomerTime = localStorage.getItem('tempCustomerTime');
    localStorage.setItem('CustomerTime', tempCustomerTime)

    let customerdb = new PouchDb('customersdb');
    let updatedCustomer = _get(res, 'data', []) || [];
    updatedCustomer.forEach((item, index) => {
        item._id = item.id
    });
    console.log(updatedCustomer, '*********resCustomer*********');
    let resOfUpdateBulk = await customerdb.bulkDocs(updatedCustomer);
    console.log(resOfUpdateBulk, "*********resOfUpdateBulk**********");

}
const getCustomerUpdate = async (propsOfComp, dispatch) => {
    let reqObj = {
        id: localStorage.getItem('retailerId'),
        timestamp: {
            seconds: parseInt(localStorage.getItem('CustomerTime'))
        }
    };
    let tempCustomerTime = Date.now();
    tempCustomerTime = parseInt(tempCustomerTime / 1000);
    localStorage.setItem('tempCustomerTime', tempCustomerTime);
    axiosFetcher({
        method: 'POST',
        reqObj,
        url: 'Customer/Increment',
        successCb: updateTimeStampAndDbForCustomer,
        errorCb: (err) => {
            console.log(err, "err is here")
        }
    })
}
const pollingWrapper = async (propsOfComp, dispatch) => {
    await getInventoryUpdate(propsOfComp, dispatch);
    await getCustomerUpdate(propsOfComp, dispatch)
    OfflineTransactionPusher(propsOfComp, dispatch);
    return;

}


HomeContainer = pollingHoc(30000, pollingWrapper)(HomeContainer)


export default connect(mapStateToProps)(HomeContainer)
