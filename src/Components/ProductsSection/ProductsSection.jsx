import React from 'react';
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

PouchDb.plugin(PAM);
PouchDb.plugin(Find);
PouchDb.plugin(require('pouchdb-quick-search'));

let productsdb = new PouchDb("productsdb");

class ProductsSection extends React.Component {

    constructor() {
        super();
        this.state = {
            clearInput: false,
            productLoading: false
        }
    }

    handleChange = (searchText) => {
        this.setState({ clearInput: false })
        if (searchText.length > 2) {
            productsdb.search({
                query: searchText,
                fields: ['product.name', 'product.description', 'product.sku', 'product.keywords', 'product.upcCode'],
                include_docs: true,
                limit: 39,
                skip: 0
            }).then((result) => {
                this.setState({ clearInput: false })
                result.pagination = {}
                result.pagination.method = "search"
                result.pagination.query = searchText
                result.pagination.fields = ['product.name', 'product.description', 'product.sku']
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
            this.setState({ clearInput: false })
            productsdb.allDocs({
                include_docs: true,
                attachments: true,
                limit: 39,
                skip: 0
            }).then((result) => {
                this.setState({ clearInput: false })
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
        if ((/^[0-9-]{4,}[0-9]$/).test(searchText)) {
            let noSearchText = Number(searchText)
            productsdb.find({
                selector: { "product.upcCode": noSearchText }
            }).then((result) => {
                if (!_isEmpty(result.docs)) {
                    this.setState({ clearInput: true })
                    let cartItems = _get(this, 'props.cart.cartItems', [])
                    let productDataDoc = { doc: result.docs[0] };
                    let productId = productDataDoc.doc._id;
                    let foundProduct = _find(cartItems, { id: productId });
                    let cartObj;
                    if (_isEmpty(foundProduct)) {
                        let newCartItem = {
                            ...productDataDoc,
                            qty: 1,
                            saleType: 0,
                            id: productId
                        }
                        cartObj = [...cartItems, newCartItem];
                    } else {
                        let qty = foundProduct.qty + 1
                        let index = _findIndex(cartItems, ['id', productId]);
                        cartObj = [...cartItems]
                        cartObj[index].qty = qty;
                    }

                    let cartDiscountObj = {}
                    cartDiscountObj.type = ''
                    cartDiscountObj.cartDiscount = 0
                    cartDiscountObj.cartItems = cartObj
                    this.props.dispatch(commonActionCreater(cartDiscountObj, 'ADD_DISCOUNT_TO_CART'));
                    this.props.dispatch(commonActionCreater(cartObj, 'CART_ITEM_LIST'));
                } else {
                    this.props.dispatch(commonActionCreater(result, 'GET_PRODUCT_DATA_SUCCESS')) ;
                    this.setState({ clearInput: true})
                }
            })
        }
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
    //     let productsdb = new PouchDb('productsdb');
    //       productsdb.allDocs({
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

    getNextProducts = async () => {
        this.setState({ disable: true, productLoading: true })
        let startkey = this.props.lastItemId
        let method = this.props.method
        let productsdb = new PouchDb('productsdb');
        if (method == 'allDocs') {
            productsdb.allDocs({
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
            productsdb.search({
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
            this.setState({ clearInput: true });
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
                            isOpenProduct={this.props.isOpenProduct}
                            isOpenHistoryDialogue={this.props.isOpenHistoryDialogue}
                            handleChange={this.handleChange}
                            handleInput={this.state.clearInput}
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
        resetProduct
    }
}

export default connect(mapStateToProps)(ProductsSection);