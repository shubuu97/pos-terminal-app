import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _findIndex from 'lodash/findIndex';
import _find from 'lodash/find'
/* Material import */
import LockIcon from '@material-ui/icons/Lock';
import ExitToApp from '@material-ui/icons/ExitToApp';
/* Redux Imports */
import { commonActionCreater } from '../../Redux/commonAction'
/* Component Imports */
import SideDrawer from '../SideDrawer'
import Products from './Products';
import SearchBar from './SearchBar';
import PouchDb from 'pouchdb';
PouchDb.plugin(require('pouchdb-quick-search'));
let productsdb = new PouchDb('productsdb');
productsdb.search({
    fields: ['product.name', 'product.description', 'product.sku'],
    build:true
  })



class ProductsSection extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }

    logout = () => {
        localStorage.clear();
        this.props.history.push('/login')
    }
    handleChange = (searchText)=>{
     if(searchText.length>3)
     {
     productsdb.search({
        query: searchText,
        fields: ['product.name', 'product.description', 'product.sku'],
        include_docs: true,
        limit: 20,
        skip: 0
      }).then((res)=> {
        this.props.dispatch(commonActionCreater(res,'GET_PRODUCT_DATA_SUCCESS'));
      })
      .catch((err)=>{
      console.log(err);
      })
    }
    else if(searchText==''){
        productsdb.allDocs({
            include_docs: true,
            attachments: true,
            limit: 20,
            skip: 0
          }).then((result)=> {
            this.props.dispatch(commonActionCreater(result,'GET_PRODUCT_DATA_SUCCESS'));
           
          }).catch((err)=> {
              
          });

    }

    }

    render() {
        let { windowHeight, productListHeight, headerHeight, categoriesHeight } = this.props
        return (
            <div className='pos-products-collection' style={{ height: windowHeight }}>

                {/* 
                // * Header Component
                */}
                <div className='pos-header' style={{ height: headerHeight }}>
                    <div className="header-top flex-row align-center justify-space-between pl-10 pr-10" >
                        <SideDrawer
                             // ! Actions
                            handleClickOpen={this.props.handleClickOpen}
                            handleClickOpenSessionContainer={this.props.handleClickOpenSessionContainer}
                        />
                        <SearchBar
                        handleChange = {this.handleChange}
                        />
                        <div>
                            <LockIcon style={{color: 'white', padding:'0 10px', fontSize: 30}}/>
                            <ExitToApp style={{color: 'white', padding:'0 10px', fontSize: 30}} onClick={this.logout}/>
                        </div>
                    </div>
                    <div className='header-bottom'>

                    </div>
                </div>


                {/* 
                // * Product Categories Component
                */}
                <div className='product-catogories' style={{ height: categoriesHeight }}>
                    <div className='each-tile blue-background'>
                        <span className='category-text'>
                            Hello
                            </span>
                    </div>
                    <div className='each-tile blue-background'>
                        <span className='category-text'>
                            Hello
                            </span>
                    </div>
                    <div className='each-tile blue-background'>
                        <span className='category-text'>
                            Hello
                            </span>
                    </div>
                    <div className='each-tile blue-background'>
                        <span className='category-text'>
                            Hello
                            </span>
                    </div>
                </div>

                {/* 
                // * Products List Component
                */}


                <Products
                    {...this.props}
                />

            </div>
        );
    }
}

export default ProductsSection;