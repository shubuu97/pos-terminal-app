import React, { Component } from 'react';

//redux imports
import connect from 'react-redux/lib/connect/connect';
import LinearProgress from '@material-ui/core/LinearProgress';
import axiosFetcher from '../../Global/dataFetch/axiosFetcher';
import PouchDb from 'pouchdb';
import _get from 'lodash/get'
class SyncContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ApiCallCount: 2,
            percentageComplete: 0
        };
    }
    componentDidMount() {
        let storeId = localStorage.getItem('storeId');
        let retailerId = localStorage.getItem('retailerId');
        axiosFetcher({
            method: 'POST',
            url: 'Product/ByStoreId',
            reqObj: { id: storeId },
            successCb: this.handleProductFetchSuccess,
            errorCb: this.handleProductFetchError
        })
        axiosFetcher({
            method: 'POST',
            reqObj: { email: this.state.email, password: this.state.password },
            url: 'Customer/All',
            reqObj: { id: retailerId },
            successCb: this.handleCustomerFetchSuccess,
            errorCb: this.handleCustomerFetchError
        })

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
        let customersdb = new PouchDb('customersdb');
        customersdb.bulkDocs(_get(customerData, 'data', [])).then((result) => {
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