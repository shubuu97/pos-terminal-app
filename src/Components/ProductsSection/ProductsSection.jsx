import React from 'react';
import { withSnackbar } from 'notistack';
/* Lodash Imports */
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _findIndex from 'lodash/findIndex';
import _find from 'lodash/find'
/* Material Import */
import CircularProgress from '@material-ui/core/CircularProgress';
/* Material Icons */
import LockIcon from '@material-ui/icons/LockOutlined';
import ExitToApp from '@material-ui/icons/ExitToApp';
import CardGiftCard from '@material-ui/icons/CardGiftcard';
import LibraryAdd from '@material-ui/icons/LibraryAddOutlined';
/* Redux Imports */
import { commonActionCreater } from '../../Redux/commonAction'
import { connect } from 'react-redux';
import genericPostData from '../../Global/dataFetch/genericPostData';
/* Pouch Imports */
import PAM from "pouchdb-adapter-memory"
import Find from "pouchdb-find";
/* Component Imports */
import SideDrawer from '../SideDrawer'
import Products from './Products';
import SearchBar from './SearchBar';
import PouchDb from 'pouchdb';
import Categories from './Categories/Categories';
import addToCart from '../../Global/PosFunctions/addToCart';
import Dinero from 'dinero.js';

PouchDb.plugin(PAM);
PouchDb.plugin(Find);
PouchDb.plugin(require('pouchdb-quick-search'));

class ProductsSection extends React.Component {

    constructor() {
        super();
        this.productsdb = new PouchDb(`productsdb${localStorage.getItem("storeId")}`);
        this.state = {
            productLoading: false,
            searchText: ''
        }
    }

    searchOnPouch = (searchText) => {
        if (searchText.length > 2) {
            this.productsdb.search({
                query: searchText,
                fields: ['product.name', 'product.description', 'product.sku', 'product.keywords', 'product.upcCode'],
                include_docs: true,
                limit: 39,
                skip: 0
            }).then((result) => {
                result.pagination = {}
                result.pagination.method = "search"
                result.pagination.query = searchText
                result.pagination.fields = ['product.name', 'product.description', 'product.sku', 'product.keywords', 'product.upcCode']
                result.pagination.firstItemId = result.rows[0].id
                result.pagination.lastItemId = result.rows[result.rows.length - 1].id
                result.pagination.pageNo = 1
                result.pagination.startVal = 1
                result.pagination.endVal = result.rows.length
                this.props.dispatch(commonActionCreater(result, 'GET_PRODUCT_DATA_SUCCESS'));
            })
                .catch((err) => {
                    console.log(err);
                })
        } else if (searchText == '') {
            this.productsdb.allDocs({
                include_docs: true,
                attachments: true,
                limit: 39,
                skip: 0
            }).then((result) => {
                result.pagination = {}
                result.pagination.method = "allDocs"
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
    }

    searchWithElastic = (searchText) => {
        let customerType = _get(this.props, 'customer.customerType');

        let filters = [{ "field": "retailerId", "value": localStorage.getItem('retailerId') }]
        if (customerType == 1) {
            filters = [...filters,
            { 'field': 'productType', 'value': '3' },
            { 'field': 'productType', 'value': '1' },
            { 'field': 'productType', 'value': '2' },

            ]
        }
        else if (customerType == 2) {
            filters = [
                ...filters,
                { 'field': 'productType', 'value': '3' },
                { 'field': 'productType', 'value': '1' },
            ]
        }
        let reqObj = {
            request: {
                "text": searchText,
                "offset": 0,
                "limit": 39,
                "filters": filters
            },
            storeId: localStorage.getItem('storeId')
        }

        // enum ProductType {
        //     NON_CANNABIS = 0;
        //     CANNABIS = 1;
        //     MEDICAL_ONLY_CANNABIS = 2;
        // }

        if (searchText == '' || searchText.length > 2) {
            genericPostData({
                dispatch: this.props.dispatch,
                reqObj: reqObj,
                url: 'Search/Inventory',
                dontShowMessage: true,
                filters,
                constants: {
                    init: 'ELASTIC_SEARCH_PRODUCTS_INIT',
                    success: 'ELASTIC_SEARCH_PRODUCTS_SUCCESS',
                    error: 'ELASTIC_SEARCH_PRODUCTS_ERROR'
                },

                identifier: 'ELASTIC_SEARCH_PRODUCTS_RULES',
                successCb: (data) => { }
            }).then((data) => {
                if (!_isEmpty(data)) {
                    let result = {}
                    result.pagination = {}
                    result.pagination.method = "allDocs"
                    result.pagination.firstItemId = data.products[0].id
                    result.pagination.lastItemId = data.products[data.products.length - 1].id
                    result.pagination.pageNo = 1
                    result.pagination.startVal = 1
                    result.pagination.endVal = data.products.length
                    let rows = data.products.map((d) => {
                        let obj = {
                            doc: {
                                product: d
                            },
                            id: d.product.id
                        }
                        return obj
                    })
                    result.rows = rows
                    console.log(result, 'result')
                    this.props.dispatch(commonActionCreater(result, 'GET_PRODUCT_DATA_SUCCESS'));
                }

            })
        }
    }

    handleChange = (searchText, e) => {
        this.setState({ searchText })
        if (e) {
            if (this.previousTimeStamp) {
                if ((e.timeStamp - this.previousTimeStamp) <= 20) {
                    this.previousTimeStamp = e.timeStamp
                    return
                }
            }
            this.previousTimeStamp = e.timeStamp
        }
        if (localStorage.getItem('cannabisStore')) {
            this.searchWithElastic(searchText);
        }
        else {
            this.searchOnPouch(searchText);
        }
    }

    onKeyPress = (key) => {
        if (key.charCode == 13) {
            let searchBox = document.getElementById('searchBox')
            searchBox.select();
            let upcCode = _get(this.state, 'searchText', 0)

            if (localStorage.getItem('cannabisStore')) {
                let reqObj = { id: upcCode }
                genericPostData({
                    dispatch: this.props.dispatch,
                    reqObj: reqObj,
                    url: 'Package/Get/ByLabel',
                    dontShowMessage: true,
                    constants: {
                        init: 'ELASTIC_SEARCH_PRODUCTS_INIT',
                        success: 'ELASTIC_SEARCH_PRODUCTS_SUCCESS',
                        error: 'ELASTIC_SEARCH_PRODUCTS_ERROR'
                    },
                    identifier: 'ELASTIC_SEARCH_PRODUCTS_RULES',
                    successCb: (data) => { }
                }).then((result) => {
                    if (!_isEmpty(result)) {
                        let product = {
                            ...result.product,
                            doc: {
                                product: result.product
                            }
                        }
                        let cartItems = _get(this.props, 'cart.cartItems', [])
                        let cart = _get(this.props, 'cart', {})
                        let quantity = _get(result, 'itemPackage.quantity', 0)
                        let dispatch = this.props.dispatch
                        let selectedPackage = result.itemPackage
                        addToCart(product, cartItems, cart, quantity, dispatch, selectedPackage)
                        this.props.enqueueSnackbar(
                            <div className='flex-row justify-space-between cart-snackbar'>
                                <div className='flex-row'>
                                    <div className='product-img'>
                                        <img src={_get(product, 'doc.product.image')} alt='' />
                                    </div>
                                    <div className='product-name ml-20'>
                                        {_get(product, 'doc.product.name')}
                                    </div>

                                </div>
                                <div className='product-price flex-row justify-flex-end'>
                                    {Dinero({ amount: _get(product, 'doc.product.salePrice.amount', 0), currency: 'USD' }).toFormat('$0,0.00')}
                                </div>
                            </div>
                        );

                    } else {
                        this.props.enqueueSnackbar('No Product Found', {
                            variant: 'error'
                        });
                    }
                })
            }
            else {
                if ((/^[0-9-]{4,}[0-9]$/).test(_get(this.state, 'searchText', ''))) {
                    this.productsdb.find({
                        selector: { "product.upcCode": upcCode }
                    }).then((result) => {
                        if (!_isEmpty(result.docs)) {
                            let productData = { rows: [] }
                            productData.rows[0] = { doc: result.docs[0] }
                            // this.props.dispatch(commonActionCreater(productData, 'GET_PRODUCT_DATA_SUCCESS'));
                            let cartItems = _get(this, 'props.cart.cartItems', [])
                            let cart = _get(this, 'props.cart', {})
                            let product = { doc: result.docs[0] }
                            addToCart(product, cartItems, cart, 1, this.props.dispatch)

                            // View for Snackbar
                            this.props.enqueueSnackbar(
                                <div className='flex-row justify-space-between cart-snackbar'>
                                    <div className='flex-row'>
                                        <div className='product-img'>
                                            <img src={_get(product, 'doc.product.image')} alt='' />
                                        </div>
                                        <div className='product-name ml-20'>
                                            {_get(product, 'doc.product.name')}
                                        </div>

                                    </div>
                                    <div className='product-price flex-row justify-flex-end'>
                                        {Dinero({ amount: _get(product, 'doc.product.salePrice.amount', 0), currency: 'USD' }).toFormat('$0,0.00')}
                                    </div>
                                </div>
                            );

                        } else {
                            this.props.enqueueSnackbar('No Product Found', {
                                variant: 'error'
                            });
                        }
                    })
                }


            }
        }
    }

    homeButtonClicked = () => {
        this.setState({ searchText: '' })
    }

    clearSearchText = () => {
        this.setState({ searchText: '' })
        this.handleChange('')
    }

    scroll = () => {
        let pCard = document.getElementById('productCard');
        if (pCard != null) {
            let eachCardHeight = pCard.offsetHeight
            let scrollHead = document.getElementById('productList').scrollTop
            let pageNo = this.props.pageNo;
            let nextScrollTrigger = (pageNo * eachCardHeight * 13) - 600 // ! Assuming limit is 39, needs to be dynamic
            console.log('Scroll Head - ', scrollHead, nextScrollTrigger)
            if (scrollHead > nextScrollTrigger) {
                let result = {
                    rows: [],
                    pagination: {}
                }
                result.rows = this.props.productList
                result.pagination.method = this.props.method
                result.pagination.query = this.props.query
                result.pagination.fields = this.props.fields
                result.pagination.firstItemId = result.rows[0].id
                result.pagination.lastItemId = result.rows[result.rows.length - 1].id
                result.pagination.pageNo = this.props.pageNo + 1
                result.pagination.startVal = this.props.endVal + 1
                result.pagination.endVal = result.pagination.pageNo * this.state.itemCount
                this.props.dispatch(commonActionCreater(result, 'GET_PRODUCT_DATA_SUCCESS'));
                if (localStorage.getItem('cannabisStore')) {
                    this.getNextCannabisProducts(result)
                }
                else {
                    this.getNextProducts()
                }
            }
        }
    }

    getNextCannabisProducts = (result) => {
        // ! MAYUK - cleanup required in this function
        this.setState({ disable: true, productLoading: true })
        console.log(result, 'getNextCannabisProducts')
        let customerType = _get(this.props, 'customer.customerType');

        let filters = [{ "field": "retailerId", "value": localStorage.getItem('retailerId') }]
        if (customerType == 1) {
            filters = [...filters,
            { 'field': 'productType', 'value': '1' },
            { 'field': 'productType', 'value': '2' },
            { 'field': 'productType', 'value': '3' },

            ]
        }
        else if (customerType == 2) {
            filters = [
                ...filters,
                { 'field': 'productType', 'value': '1' },
                { 'field': 'productType', 'value': '3' },
            ]
        }
        let reqObj = {
            request: {
                "text": '',
                "offset": (result.pagination.pageNo - 1) * 39,
                "limit": 39,
                "filters": filters
            },
            storeId: localStorage.getItem('storeId')
        }
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: reqObj,
            url: 'Search/Inventory',
            dontShowMessage: true,
            filters,
            constants: {
                init: 'ELASTIC_SEARCH_PRODUCTS_INIT',
                success: 'ELASTIC_SEARCH_PRODUCTS_SUCCESS',
                error: 'ELASTIC_SEARCH_PRODUCTS_ERROR'
            },
            identifier: 'ELASTIC_SEARCH_PRODUCTS_RULES',
            successCb: (data) => { }
        }).then((result) => {
            let rows = result.products.map((d) => {
                let obj = {
                    doc: {
                        product: d
                    },
                    id: d.product.id
                }
                return obj
            })
            if (result.products.length == 0) {
                this.setState({ disable: false, productLoading: false })
                return;
            }
            if (localStorage.getItem("showOutOfStock") == "true") {
                //this is the code for filtering the result;
                this.filteredResult = [];
                this.resolveArray = [];
                this.filterResult(result).then((products) => {
                    let result = { products }
                    result.pagination = {}
                    //result.pagination.method = method
                    result.pagination.firstItemId = result.products[0].id
                    result.pagination.lastItemId = result.products[result.products.length - 1].id
                    result.pagination.pageNo = this.props.pageNo
                    result.pagination.startVal = this.props.endVal + 1
                    result.pagination.endVal = result.pagination.pageNo * this.state.itemCount

                    result.rows = [..._get(this, 'props.productList', []), ...result.products]
                    if (result.pagination.endVal > this.props.productCount) {
                        result.pagination.endVal = this.props.productCount
                    }
                    this.props.dispatch(commonActionCreater(result, 'GET_PRODUCT_DATA_SUCCESS'));
                    this.setState({ disable: false, productLoading: false })
                });
            }
            else {
                result.pagination = {}
                //result.pagination.method = method
                result.pagination.firstItemId = result.products[0].id
                result.pagination.lastItemId = result.products[result.products.length - 1].id
                result.pagination.pageNo = this.props.pageNo
                result.pagination.startVal = this.props.endVal + 1
                result.pagination.endVal = result.pagination.pageNo * this.state.itemCount

                result.rows = [..._get(this, 'props.productList', []), ...rows]
                if (result.pagination.endVal > this.props.productCount) {
                    result.pagination.endVal = this.props.productCount
                }
                this.props.dispatch(commonActionCreater(result, 'GET_PRODUCT_DATA_SUCCESS'));
                this.setState({ disable: false, productLoading: false })
            }
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
                let res = await this.productsdb.allDocs({
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

    getNextProducts = async () => {
        this.setState({ disable: true, productLoading: true })
        let startkey = this.props.lastItemId
        let method = this.props.method
        if (method == 'allDocs') {
            this.productsdb.allDocs({
                include_docs: true,
                startkey,
                limit: 39,
                skip: 1
            }).then(async (result) => {
                if (result.rows.length == 0) {
                    this.setState({ disable: false, productLoading: false })
                    return;
                }
                if (localStorage.getItem("showOutOfStock") == "true") {
                    //this is the code for filtering the result;
                    this.filteredResult = [];
                    this.resolveArray = [];
                    this.filterResult(result).then((rows) => {
                        let result = { rows }
                        result.pagination = {}
                        result.pagination.method = method
                        result.pagination.firstItemId = result.rows[0].id
                        result.pagination.lastItemId = result.rows[result.rows.length - 1].id
                        result.pagination.pageNo = this.props.pageNo
                        result.pagination.startVal = this.props.endVal + 1
                        result.pagination.endVal = result.pagination.pageNo * this.state.itemCount

                        result.rows = [..._get(this, 'props.productList', []), ...result.rows]
                        if (result.pagination.endVal > this.props.productCount) {
                            result.pagination.endVal = this.props.productCount
                        }
                        this.props.dispatch(commonActionCreater(result, 'GET_PRODUCT_DATA_SUCCESS'));
                        this.setState({ disable: false, productLoading: false })
                    });
                }
                else {
                    result.pagination = {}
                    result.pagination.method = method
                    result.pagination.firstItemId = result.rows[0].id
                    result.pagination.lastItemId = result.rows[result.rows.length - 1].id
                    result.pagination.pageNo = this.props.pageNo
                    result.pagination.startVal = this.props.endVal + 1
                    result.pagination.endVal = result.pagination.pageNo * this.state.itemCount

                    result.rows = [..._get(this, 'props.productList', []), ...result.rows]
                    if (result.pagination.endVal > this.props.productCount) {
                        result.pagination.endVal = this.props.productCount
                    }
                    this.props.dispatch(commonActionCreater(result, 'GET_PRODUCT_DATA_SUCCESS'));
                    this.setState({ disable: false, productLoading: false })
                }
            }).catch((err) => {
                console.log(err)
            });
        }
        else if (method == 'search' || method == 'categories') {
            this.productsdb.search({
                query: this.props.query,
                fields: this.props.fields,
                include_docs: true,
                startkey,
                limit: 39,
                skip: 1
            }).then((result) => {
                result.pagination = {}
                result.pagination.method = method
                result.pagination.query = this.props.query
                result.pagination.fields = this.props.fields
                result.pagination.firstItemId = result.rows[0].id
                result.pagination.lastItemId = result.rows[result.rows.length - 1].id
                result.pagination.pageNo = this.props.pageNo
                result.pagination.startVal = this.props.endVal + 1
                result.pagination.endVal = result.pagination.pageNo * this.state.itemCount

                result.rows = [..._get(this, 'props.productList', []), ...result.rows]
                if (result.pagination.endVal > this.props.productCount) {
                    result.pagination.endVal = this.props.productCount
                }
                this.props.dispatch(commonActionCreater(result, 'GET_PRODUCT_DATA_SUCCESS'));
                this.setState({ disable: false, productLoading: false })
            }).catch((err) => {
                console.log(err)
            });
        }
    }

    handleHideWhenOffline = (online, onlineContent, offlineContent) => {
        if (online) {
            return onlineContent
        }
        else
            return offlineContent
    }

    componentDidUpdate() {
        if (this.props.resetProduct == true) {
            this.props.dispatch(commonActionCreater(false, 'RESET_PRODUCT'));
        }
    }

    render() {
        let { windowHeight, headerHeight, categoriesHeight } = this.props
        return (
            <div className='pos-products-collection' style={{ height: windowHeight }}>

                {/* Header Component */}
                <div className='pos-header' style={{ height: headerHeight }}>
                    <div className="header-top flex-row align-center justify-space-between pl-10" >
                        <SideDrawer
                            offline={this.props.offline}
                            storeClose = {this.props.storeClose}
                            // ! Actions
                            handleTransactionPopulate={this.props.handleTransactionPopulate}
                            handleClickOpenOnHold={this.props.handleClickOpenOnHold}
                            handleClickOpenHistory={this.props.handleClickOpenHistory}
                            handleClickOpenCustomer={this.props.handleClickOpenCustomer}
                            handleHistoryOpen={this.props.handleHistoryOpen}
                            handleClickOpenSessionContainer={this.props.handleClickOpenSessionContainer}
                            handleClickQuickBook={this.props.handleClickQuickBook}
                            handleSetting={this.props.handleSetting}
                            logout={this.props.handleLogout}
                            getProductData={this.props.getProductData}
                        />
                        <SearchBar
                            isOpenProduct={_get(this.props, 'isOpenProduct', false)}
                            isOpenHistoryDialogue={_get(this.props, 'isOpenHistoryDialogue', false)}
                            isCustomerTabOpen={_get(this.props, 'isCustomerTabOpen.lookUpData', false)}
                            openCustomerDialogue={_get(this.props, 'openCustomerDialogue', false)}
                            productModalOpen={this.state.productModalOpen}
                            handleChange={this.handleChange}
                            onKeyPress={this.onKeyPress}
                            value={this.state.searchText}
                            isGiftCardModelOpen={this.props.isGiftCardModelOpen}
                            onClear={this.clearSearchText}
                        />
                        <div className="header-right-sec">
                            <ul>
                                {
                                    !(localStorage.getItem('cannabisStore')) ?
                                        this.handleHideWhenOffline(
                                            !this.props.offline,
                                            [<li onClick={this.props.handleMiscProduct}><LibraryAdd style={{ color: 'white', padding: '0 10px', fontSize: 33 }} /></li>],
                                            [<li className="disable-button" onClick={this.props.handleMiscProduct}><LibraryAdd style={{ color: 'white', padding: '0 10px', fontSize: 33 }} /></li>]
                                        ) : null
                                }

                                {
                                    this.props.paymentMethods.findIndex((m) => m == 2) > 0 ?
                                        this.handleHideWhenOffline(
                                            !this.props.offline,

                                            [<li onClick={this.props.handleGiftCard}><CardGiftCard style={{ color: 'white', padding: '0 10px', fontSize: 33 }} /></li>],

                                            [<li className="disable-button" onClick={this.props.handleGiftCard}><CardGiftCard style={{ color: 'white', padding: '0 10px', fontSize: 33 }} /></li>]
                                        ) : null
                                }

                                <li onClick={this.props.handleLockTerminal}><LockIcon style={{ color: 'white', padding: '0 10px', fontSize: 33 }} /></li>
                                {/* <li onClick={this.logout}><ExitToApp style={{ color: 'white', padding: '0 10px', fontSize: 33 }}  /></li> */}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Product Categories Component */}
                {
                    <Categories
                        categoriesHeight={categoriesHeight}
                        getHomeClicked={this.homeButtonClicked}
                        getProductData={this.props.getProductData}
                        {...this.props}
                    />
                }


                {/* Products List Component */}
                <div className='pos-products' id='productList' style={{ height: this.props.productListHeight }} onScroll={this.scroll}>
                    <Products
                        isProductModalOpen={(productModalOpen) => this.setState({ productModalOpen })}
                        {...this.props}
                    />
                    {
                        this.state.productLoading ?
                            <div className='fwidth pt-15 flex-row justify-center align-center'><CircularProgress /> <span className='loading-text'>Loading ... </span></div> : null
                    }
                </div>

            </div>
        );
    }
}

const mapStateToProps = state => {
    let { productList } = state
    let { cart } = state;
    let isCustomerTabOpen = state.isCustomerTabOpen
    let productCount = _get(productList, 'lookUpData.total_rows', '')
    let lastItemId = _get(productList, 'lookUpData.pagination.lastItemId', '')
    let firstItemId = _get(productList, 'lookUpData.pagination.firstItemId', '')
    let method = _get(productList, 'lookUpData.pagination.method', '')
    let query = _get(productList, 'lookUpData.pagination.query', '')
    let fields = _get(productList, 'lookUpData.pagination.fields', [])
    let pageNo = _get(productList, 'lookUpData.pagination.pageNo', '')
    let startVal = _get(productList, 'lookUpData.pagination.startVal', '')
    let endVal = _get(productList, 'lookUpData.pagination.endVal', '')
    let paymentMethods = _get(state, 'storeData.lookUpData.store.paymentMethods', [])
    let resetProduct = _get(state, 'resetProduct.lookUpData')
    let customer = _get(state, 'customerQueue.customer.customer');
    let storeClose = _get(state, 'storeClose.lookUpData')

    return {
        cart,
        productCount,
        lastItemId,
        firstItemId,
        query,
        fields,
        method,
        pageNo,
        startVal,
        endVal,
        paymentMethods,
        resetProduct,
        isCustomerTabOpen,
        customer,
        storeClose
    }
}

export default withSnackbar(connect(mapStateToProps)(ProductsSection));