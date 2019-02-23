import React, { Component } from 'react';
/* Lodash Imports */
import _get from 'lodash/get'
/* Redux Imports */
import connect from 'react-redux/lib/connect/connect';
/* Material Imports */
import LinearProgress from '@material-ui/core/LinearProgress';
/* Global Imports */
import axiosFetcher from '../../Global/dataFetch/axiosFetcher';
import globalClearCart from '../../Global/PosFunctions/clearCart'
/* Pouch Import */
import PouchDb from 'pouchdb';
import addGuestToCart from '../../Global/PosFunctions/addGuestToCart';

class SyncContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ApiCallCount: 3,
            percentageComplete: 0
        };
    }
    componentDidMount() {
        let storeId = localStorage.getItem('storeId');
        let retailerId = localStorage.getItem('retailerId');
        globalClearCart(this.props.dispatch);
        axiosFetcher({
            method: 'POST',
            url: 'Inventory/ByStoreId',
            reqObj: { id: storeId },
            successCb: this.handleProductFetchSuccess,
            errorCb: this.handleProductFetchError
        })
        axiosFetcher({
            method: 'POST',
            // reqObj: { email: this.state.email, password: this.state.password },
            url: 'Customer/All',
            reqObj: { id: retailerId },
            successCb: this.handleCustomerFetchSuccess,
            errorCb: this.handleCustomerFetchError
        })
        axiosFetcher({
            method: 'POST',
            url: 'Category/AllByRetailerId',
            reqObj:{id : retailerId},
            successCb: this.handleCategoryFetchSuccess,
            errorCb: this.handleCategoryFetchError
        })

    }

    handleCategoryFetchSuccess = (categoryData) => {
        console.log(categoryData.data, 'categoryData.data')
        _get(categoryData, 'data', []).forEach((item,index)=>{
            item._id = item.id
        });
        let categoryDb = new PouchDb('categoryDb');
        categoryDb.bulkDocs(_get(categoryData,'data', [])).then((res) => {
            let percentageComplete = this.state.percentageComplete + 100 / this.state.ApiCallCount;
            this.setState({ percentageComplete });
            PouchDb.replicate('categoryDb', `http://localhost:5984/categoryDb`, {
                live: true,
                retry: true
            })
        }).catch((err) => {
            console.log(err);
        })
    }
    handleCategoryFetchError = (err) => {
        console.log(err);
    }

    handleProductFetchSuccess = (productData) => {
        let productsdb = new PouchDb('productsdb');
        productsdb.bulkDocs(_get(productData, 'data', [])).then((result) => {
            let percentageComplete = this.state.percentageComplete + 100 / this.state.ApiCallCount;
            this.setState({ percentageComplete });
            PouchDb.replicate('productsdb', `http://localhost:5984/productsdb`, {
                live: true,
                retry: true
            })
        }).catch((err) => {
            console.log(err);
        });
    }
    handleProductFetchError = (error) => {

    }
    handleCustomerFetchSuccess = (customerData) => {
        _get(customerData, 'data', []).forEach((item,index)=>{
            item._id = item.id
        });
        let customersdb = new PouchDb('customersdb');
        customersdb.bulkDocs(_get(customerData, 'data', [])).then((result) => {
            addGuestToCart(this.props.dispatch);
            let percentageComplete = this.state.percentageComplete + 100 / this.state.ApiCallCount;
            this.setState({ percentageComplete });
            PouchDb.replicate('customersdb', `http://localhost:5984/customersdb`, {
                live: true,
                retry: true
            })
        }).catch((err) => {
            console.log(err);
        });

    }
    handleCustomerFetchError = (error) => {
    }
    render() {
        if(this.state.percentageComplete==100){
          setTimeout(()=>{
            this.props.handleStepChange(4);
          },1000)
        }
        return (
            <React.Fragment>
                <div>
                    <LinearProgress
                        variant="determinate"
                        value={this.state.percentageComplete} />
                    <span>Synching data from server......</span>
                </div>
            </React.Fragment>
        )
    }
}

function MapStateToProps(state) {
    return {}
}
export default connect(MapStateToProps)(SyncContainer);