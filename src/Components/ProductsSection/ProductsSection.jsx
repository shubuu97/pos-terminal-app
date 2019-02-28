import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _findIndex from 'lodash/findIndex';
import _find from 'lodash/find'
/* Material import */
import Button from '@material-ui/core/Button';
import LockIcon from '@material-ui/icons/LockOutlined';
import ExitToApp from '@material-ui/icons/ExitToApp';
import CardGiftCard from '@material-ui/icons/CardGiftcard';
import LibraryAdd from '@material-ui/icons/LibraryAddOutlined';
/* Redux Imports */
import { commonActionCreater } from '../../Redux/commonAction'
/* Component Imports */
import SideDrawer from '../SideDrawer'
import Products from './Products';
import SearchBar from './SearchBar';
import PouchDb from 'pouchdb';
import Categories from './Categories/Categories';
import Pagination from './Pagination';
import Find from "pouchdb-find";
import CircularProgress  from '@material-ui/core/CircularProgress';

PouchDb.plugin(Find);
PouchDb.plugin(require('pouchdb-quick-search'));

let productsdb = new PouchDb("productsdb");
productsdb
    .createIndex({
        index: {
            fields: ["product.upcCode"]
        }
    })
    .then(function (result) {
        console.log(result, 'result of yes');
    })
    .catch(function (err) {
        console.log(err, 'result of no');
    });


// let productsdb = new PouchDb("productsdb");
productsdb.search({
    fields: ['product.name', 'product.description', 'product.sku', 'product.upcCode'],
    build: true
})

class ProductsSection extends React.Component {

    constructor() {
        super();
        this.state = {
            clearInput: false
        }
    }

    logout = () => {
        localStorage.clear();
        //logic to destory the dbs
        let p1 = new PouchDb('customersdb').destroy();
        let p2 = new PouchDb('productsdb').destroy();
        let p3 = new PouchDb('categoryDb').destroy();
        this.setState({ isLoading: true })
        Promise.all([p1, p2, p3]).then((data) => {
            this.setState({ isLoading: false })
            this.props.history.push('/login')
        });
    }

    handleChange = (searchText) => {
        this.setState({ clearInput: false })
        if (searchText.length > 3) {
            productsdb.search({
                query: searchText,
                fields: ['product.name', 'product.description', 'product.sku'],
                include_docs: true,
                limit: 9,
                skip: 0
            }).then((result) => {
                this.setState({ clearInput: false })
                result.pagination = {}
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
                limit: 10,
                skip: 0
            }).then((result) => {
                this.setState({ clearInput: false })
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
        /* if (searchText.length == 12) {
            let noSearchText = Number(searchText)
            productsdb.find({
                selector: { "product.upcCode": noSearchText }
            }).then((result) => {
                debugger
                if (!_isEmpty(result.docs)) {
                    this.setState({ clearInput: true })
                    let cartItems = _get(this, 'props.cart.cartItems', [])
                    let productDataDoc = { doc: result.docs[0] };
                    let productId = productDataDoc.doc._id;
                    let foundProduct = _find(cartItems, { id:productId });
                    let cartObj;
                    if (_isEmpty(foundProduct)) {
                        let newCartItem = {
                            ...productDataDoc,
                            qty: 1,
                            saleType: 0,
                            id:productId
                        }
                        cartObj = [...cartItems, newCartItem];
                    } else {
                        let qty = foundProduct.qty + 1
                        let index = _findIndex(cartItems, ['id',productId]);
                        cartObj = [...cartItems]
                        cartObj[index].qty = qty;
                    }
                    this.props.dispatch(commonActionCreater(cartObj, 'CART_ITEM_LIST'));
                }
            })
        } */
    }

    render() {
        if(this.state.isLoading){
            return <CircularProgress size={24}/>
        }
        let { windowHeight,headerHeight, categoriesHeight } = this.props
        return (
            <div className='pos-products-collection' style={{ height: windowHeight }}>

                {/* Header Component */}
                <div className='pos-header' style={{height: headerHeight}}>
                    <div className="header-top flex-row align-center justify-space-between pl-10 pr-10" >
                        <SideDrawer
                            // ! Actions
                            handleClickOpenOnHold={this.props.handleClickOpenOnHold}
                            handleHistoryOpen={this.props.handleHistoryOpen}
                            handleClickOpenSessionContainer={this.props.handleClickOpenSessionContainer}
                        />
                        <SearchBar
                            handleChange={this.handleChange}
                            handleInput={this.state.clearInput}
                        />
                        <div className="header-right-sec">
                            <LibraryAdd style={{ color: 'white', padding: '0 10px', fontSize: 30 }} onClick={this.props.handleMiscProduct}/>
                            <CardGiftCard style={{ color: 'white', padding: '0 10px', fontSize: 30 }} onClick={this.props.handleGiftCard} />
                            <LockIcon style={{ color: 'white', padding: '0 10px', fontSize: 30 }} />
                            <ExitToApp style={{ color: 'white', padding: '0 10px', fontSize: 30 }} onClick={this.logout} />
                        </div>
                    </div>
                </div>

                {/* Product Categories Component */}
                <Categories
                    categoriesHeight={categoriesHeight}
                    {...this.props}
                />
                

                {/* // ! Note - Hiding Pagination */}
                {/* <Pagination /> */}

                {/* Products List Component */}
                <Products
                    {...this.props}
                />

            </div>
        );
    }
}

export default ProductsSection;