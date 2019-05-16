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

    handleChange = (searchText, e) => {
        this.setState({ searchText })
        if(e) {
            if (this.previousTimeStamp) {
                if ((e.timeStamp - this.previousTimeStamp) <= 20) {
                    this.previousTimeStamp = e.timeStamp
                    return
                }
            }
            this.previousTimeStamp = e.timeStamp
        }
        
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

    onKeyPress = (key) => {
        if (key.charCode == 13) {
            if ((/^[0-9-]{4,}[0-9]$/).test(_get(this.state, 'searchText', ''))) {
                let searchBox = document.getElementById('searchBox')
                searchBox.select();
                let upcCode = _get(this.state, 'searchText', 0)
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
                                    {_get(product, 'doc.product.salePrice.currencyCode')} {_get(product, 'doc.product.salePrice.amount')}
                                </div>
                            </div>
                        );

                    } else {
                        this.props.enqueueSnackbar('No Product Found',{
                            variant: 'error'
                        });
                    }
                })
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
        let eachCardHeight = document.getElementById('productCard').offsetHeight
        let scrollHead = document.getElementById('productList').scrollTop
        let pageNo = this.props.pageNo;
        let nextScrollTrigger = (pageNo * eachCardHeight * 13) - 400 // ! Assuming limit is 39, needs to be dynamic
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
            result.pagination.pageNo = this.props.pageNo + 1
            this.props.dispatch(commonActionCreater(result, 'GET_PRODUCT_DATA_SUCCESS'));
            this.getNextProducts()
        }
    }

    // getPrevProducts = () => {
    //     this.setState({ disable: true })
    //     let startkey = this.props.firstItemId 
    //     let this.productsdb = new PouchDb('this.productsdb');
    //       this.productsdb.allDocs({
    //           include_docs: true,
    //           descending: true,
    //           startkey,
    //           limit: this.state.itemCount,
    //           skip: 1
    //       }).then((result) => {
    //           let sortedResult = _sortBy(result.rows, 'id')
    //           result.rows = sortedResult
    //           result.pagination = {}
    //           result.pagination.firstItemId = result.rows[0].id
    //           result.pagination.lastItemId = result.rows[result.rows.length - 1].id
    //           result.pagination.pageNo = this.props.pageNo - 1
    //           result.pagination.startVal = this.props.startVal - this.state.itemCount
    //           result.pagination.endVal = result.pagination.pageNo * this.state.itemCount
    //           this.props.dispatch(commonActionCreater(result, 'GET_PRODUCT_DATA_SUCCESS'));
    //           this.setState({ disable: false })
    //       }).catch((err) => {
    //           console.log(err)
    //     });
    //   }

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
                            // ! Actions
                            handleTransactionPopulate={this.props.handleTransactionPopulate}
                            handleClickOpenOnHold={this.props.handleClickOpenOnHold}
                            handleClickOpenHistory={this.props.handleClickOpenHistory}
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
                            handleChange={this.handleChange}
                            onKeyPress={this.onKeyPress}
                            value={this.state.searchText}
                            isGiftCardModelOpen={this.props.isGiftCardModelOpen}
                            onClear={this.clearSearchText}
                        />
                        <div className="header-right-sec">
                            <ul>
                                {
                                    this.handleHideWhenOffline(
                                        !this.props.offline,
                                        [<li onClick={this.props.handleMiscProduct}><LibraryAdd style={{ color: 'white', padding: '0 10px', fontSize: 33 }} /></li>],
                                        [<li className="disable-button" onClick={this.props.handleMiscProduct}><LibraryAdd style={{ color: 'white', padding: '0 10px', fontSize: 33 }} /></li>]
                                    )
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
                <Categories
                    categoriesHeight={categoriesHeight}
                    getHomeClicked={this.homeButtonClicked}
                    {...this.props}
                />

                {/* Products List Component */}
                <div className='pos-products' id='productList' style={{ height: this.props.productListHeight }} onScroll={this.scroll}>
                    <Products
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

    return {
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
        isCustomerTabOpen
    }
}

export default withSnackbar(connect(mapStateToProps)(ProductsSection));