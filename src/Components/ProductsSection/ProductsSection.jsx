import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _findIndex from 'lodash/findIndex';
import _find from 'lodash/find'
/* Material import */
import LockIcon from '@material-ui/icons/Lock';
import ExitToApp from '@material-ui/icons/ExitToApp';
import CardGiftCard from '@material-ui/icons/CardGiftcard';
/* Redux Imports */
import { commonActionCreater } from '../../Redux/commonAction'
/* Component Imports */
import SideDrawer from '../SideDrawer'
import Products from './Products';
import SearchBar from './SearchBar';
import PouchDb from 'pouchdb';
import Categories from './Categories/Categories';
import Pagination from './Pagination';
import CircularProgress  from '@material-ui/core/CircularProgress';

PouchDb.plugin(require('pouchdb-quick-search'));
let productsdb = new PouchDb('productsdb');
productsdb.search({
    fields: ['product.name', 'product.description', 'product.sku'],
    build: true
})

class ProductsSection extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }

    logout = () => {
        debugger
        localStorage.clear();
        //logic to destory the dbs
        let p1 = new PouchDb('customersdb').destroy();
        let p2 = new PouchDb('productsdb').destroy();
        let p3 = new PouchDb('categoryDb').destroy();
        this.setState({ isLoading: true })
        Promise.all([p1, p2, p3]).then((data) => {
            debugger;
            this.setState({ isLoading: false })
            this.props.history.push('/login')
        });
    }
    handleChange = (searchText) => {
        if (searchText.length > 3) {
            productsdb.search({
                query: searchText,
                fields: ['product.name', 'product.description', 'product.sku'],
                include_docs: true,
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
            })
                .catch((err) => {
                    console.log(err);
                })
        }
        else if (searchText == '') {
            productsdb.allDocs({
                include_docs: true,
                attachments: true,
                limit: 10,
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
    }

    render() {
        if(this.state.isLoading){
            return <CircularProgress size={24}/>
        }
        let { windowHeight, productListHeight, headerHeight, categoriesHeight } = this.props
        return (
            <div className='pos-products-collection' style={{ height: windowHeight }}>

                {/* 
                // * Header Component
                */}
                <div className='pos-header'>
                    <div className="header-top flex-row align-center justify-space-between pl-10 pr-10" >
                        <SideDrawer
                            // ! Actions
                            handleClickOpen={this.props.handleClickOpen}
                            handleHistoryOpen={this.props.handleHistoryOpen}
                            handleClickOpenSessionContainer={this.props.handleClickOpenSessionContainer}
                        />
                        <SearchBar
                            handleChange={this.handleChange}
                        />
                        <div>
                            <CardGiftCard style={{ color: 'white', padding: '0 10px', fontSize: 30 }} onClick={this.props.handleGiftCard} />
                            <LockIcon style={{ color: 'white', padding: '0 10px', fontSize: 30 }} />
                            <ExitToApp style={{ color: 'white', padding: '0 10px', fontSize: 30 }} onClick={this.logout} />
                        </div>
                    </div>
                </div>

                <Categories
                    categoriesHeight={categoriesHeight}
                    {...this.props}
                />
                {/* Product Categories Component */}

                <Pagination />
                {/* Products List Component */}
                <Products
                    {...this.props}
                />

            </div>
        );
    }
}

export default ProductsSection;