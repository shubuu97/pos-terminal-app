import React, { Component } from 'react';

//action imports
import { fetchLookupData, postCustomerSearchData, fetchRewardEarnRule } from '../../actions/products'
import { fetchOrderHistory } from '../../actions/orderHistory'

//redux imports
import connect from 'react-redux/lib/connect/connect';

import { ProgressBar } from 'react-bootstrap';
import Redirect from "react-router/Redirect";

import db from '../../db';
let posdb = new db('posdb');


var ddocProduct = {
    _id: '_design/productView',
    views: {
        byProductName: {
            map: "function (doc) {\n  var products = doc.state.productData.productInventories;\n  for(var i=0;i<products.length;i++)\n  {\n    emit(products[i].name, products[i]);\n  }\n  \n}"
        }
    }
}
var ddocCustomer = {
    _id: '_design/customerView',
    views: {
        byCustomerName: {
            map: "function (doc) {\n  var customers = doc.state.customerSearchData;\n  for(var i=0;i<customers.length;i++)\n  {\n    emit(customers[i].firstName.toLowerCase()+' '+customers[i].lastName.toLowerCase(), customers[i]);\n  }\n  \n}"
        },
        byCustomerEmail: {
            map: "function (doc) {\n  var customers = doc.state.customerSearchData;\n  for(var i=0;i<customers.length;i++)\n  {\n    emit(customers[i].email, customers[i]);\n  }\n  \n}"
        }
    }
}
class SyncContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ApiCallCount: 4,
            percentageComplete: 0
        };
    }
    componentDidMount() {
        let { dispatch } = this.props;

        //Api call for fetch product data
        dispatch(fetchLookupData('Syncing', null))
            .then((data) => {
                let percentageComplete = this.state.percentageComplete + 100 / 4;
                //view of product creation
                posdb.createView(ddocProduct);
                this.setState({ percentageComplete })

            })

        //Api call for fetch customer data
        let customerSearchRequestBody = {};
        customerSearchRequestBody.retailer = localStorage.getItem('retailerID');

        dispatch(postCustomerSearchData(customerSearchRequestBody))
            .then((data) => {
                let percentageComplete = this.state.percentageComplete + 100 / 4;
                //todo needed to be modified
                posdb.createView(ddocCustomer);
                this.setState({ percentageComplete })

            })

        //Api call for Fetch customer customer reciept
        let url = "/customers/receipts?retailerId=" + localStorage.getItem('retailerID');

        dispatch(fetchOrderHistory(null, url)).
            then((data) => {
                let percentageComplete = this.state.percentageComplete + 100 / 4;
                this.setState({ percentageComplete });
            })
        //Api call for Fetch 

        let urlRewardpointrule = '/rewardpointrule?owner=' + localStorage.getItem('retailerID');
        dispatch(fetchRewardEarnRule(null, urlRewardpointrule))
            .then((data) => {
                let percentageComplete = this.state.percentageComplete + 100 / 4;
                this.setState({ percentageComplete });
            });
    }
    render() {
        if (this.state.percentageComplete == 100) {
            return (<Redirect push to="/product" />)
        }
        return (
            <React.Fragment>
                <div className="progress-bar-parent">
                    <ProgressBar
                        variant="success"
                        animated={true}
                        now={this.state.percentageComplete}
                        label={this.state.percentageComplete + '%completed'} />
                </div>
                <div>
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