import React from 'react';
import Redirect from "react-router/Redirect";
import Panel from 'react-bootstrap/lib/Panel';
import PanelGroup from 'react-bootstrap/lib/PanelGroup';
import "bootstrap/dist/css/bootstrap.css";
import connect from 'react-redux/lib/connect/connect';

import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import _set from 'lodash/set';
import SaveButton from './common/SaveButton.jsx';
import { ToggleIndeterminateCheckBox } from 'material-ui';
import RecieptData from '../components/recieptData';
import { fetchOrderHistory, fetchOrderHistoryData } from '../actions/orderHistory';
import { RECEIVED_ORDERHISTORY, RECEIVED_ORDERHISTORY_DATA } from '../constants/orderHistory';
import { SSL_OP_CISCO_ANYCONNECT } from 'constants';
import ReactToPrint from "react-to-print";
import { postCustomerSearchData } from '../actions/products';
import SearchCustomer from './SearchCustomer';
import formatMoney from '../global/normalizingMoneyField';

const customerData = [
    {
        date: '11/1/18',
        servedBy: 'mike',
        customerName: '',
        billingAddress: '12, srwan,dasdasd,deda,sdasdsad,asdasdsaerwrf,fr87,ferfs87',
        orders: [
            {
                orderId: 'adsao2e232',
                email: 'a@g.co',
                status: 'Completed',
                price: 100,
                totalAmountPaid: 100,
                paymentMethod: 'CASH'
            },
            {
                orderId: 'saeerwasdc87686',
                email: 'a@g.co',
                status: 'Completed',
                price: 200,
                totalAmountPaid: 200,
                paymentMethod: 'CASH'
            }
        ]

    },
    {
        date: '10/1/18',
        servedBy: 'john',
        customerName: '',
        billingAddress: '',
        orders: [
            {
                orderId: 'shd7866aghdas8796',
                email: 'a@g.co',
                status: 'Completed',
                price: 300,
                totalAmountPaid: 300,
                paymentMethod: 'CASH'
            },
            {
                orderId: 'ajkjiei6534334352hdgsaagd',
                email: 'a@g.co',
                status: 'Completed',
                price: 400,
                totalAmountPaid: 400,
                paymentMethod: 'CASH'
            },
            {
                orderId: '765756735752725',
                email: 'a1@g.co',
                status: 'Completed',
                price: 500,
                totalAmountPaid: 500,
                paymentMethod: 'CASH'
            }
        ]

    }
]

class CustomerHistory extends React.Component {
    constructor(props) {
        super(props);
        this.onSelectOrder = this.onSelectOrder.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.selectedOrder = {};
        this.orderHistory = [];
        this.orderHistoryData = {};
        this.getCustomerId = false;
        this.searchParameters = {
            orderId: '',
            date: '',
        };
        this.recieptData = {

        }

    }


    shouldComponentUpdate(props){
        if(props.open){
            return true;
        }else{
            return false;
        }
    }
    componentWillReceiveProps(props) {

    }
    onSelectOrder = (order, mainOrder) => {
        // this.selectedOrder = order;
        // this.selectedOrder.date = mainOrder.date;
        // this.selectedOrder.servedBy = mainOrder.servedBy;
        // this.selectedOrder.billingAddress = mainOrder.billingAddress;
        this.props.onSelectOrder(order, mainOrder);
        this.forceUpdate();
    }
    handleInputChange(event) {
        _set(this.searchParameters, event.target.name, event.target.value);
        this.forceUpdate();
    }
    handleSearch() {
        let url = '';
        if(this.getCustomerId && JSON.parse(localStorage.getItem('customerID'))){
            url += '&&customerId=' + JSON.parse(localStorage.getItem('customerID'));
        }
        if (this.searchParameters.orderId !== '') {
            // if (url !== '') {
            //     url += '&&orderId=' + this.searchParameters.orderId;
            // }else{
                url += '&&orderId=' + this.searchParameters.orderId;
            // }
        }
        if (this.searchParameters.date !== '') {
            // if (url !== '') {
            //     url += '&&date=' + this.searchParameters.date;
            // } else {
                url += '&&date=' + this.searchParameters.date;
            // }
        }
        // if(this.searchParameters.orderId!==''){
        //     url+='orderId'+this.searchParameters.orderId;
        // }
        this.props.handleOrderSearch(url);
        // _set(this.searchParameters, 'orderId', '');
        // _set(this.searchParameters, 'date', '');
    }

    handleCustomerSearch = () => {
        this.getCustomerId = true;
        this.props.handleCustomerSearch();
    }



    render() {
        this.orderHistory = _get(this.props, 'orderHistory', []);
        this.selectedOrder = _get(this.props, 'orderHistoryData', {});

        const cartItems = _get(this.selectedOrder, 'saleProducts', []);
        _set(this.recieptData, 'totalAmount', _get(this.selectedOrder, 'grandTotal', 0));
        _set(this.recieptData, 'amountPaid', _get(this.selectedOrder, 'totalPaid', 0));
        // _set(this.recieptData,'totalAmount',_get(this.selectedOrder,'grandTotal',0));


        if (_get(this, 'props.isFetching')) {
            return (<div className='loader-wrapper-main'>
                <div className="spinner">
                    <div className="rect1"></div>
                    <div className="rect2"></div>
                    <div className="rect3"></div>
                    <div className="rect4"></div>
                    <div className="rect5"></div>
                </div>
            </div>);
        }



        const orderHistory = !_isEmpty(this.orderHistory) && this.orderHistory.map((custData, index) => (
            <div key={index} className="order-section">
                <div className="order-date">
                    {custData.date}
                </div>
                <div className="oh-body">
                    {
                        !_isEmpty(custData.orders) && custData.orders.map((order, index) =>
                            (
                                <div className={_get(this.selectedOrder, 'orderId', '') === order.orderId ? "oh-block active" : "oh-block"} key={index} onClick={() => this.onSelectOrder(order, custData)}>
                                    <div className="oh-left">
                                        <label>{order.orderId}</label>
                                        <span>{order.customerMail}</span>
                                    </div>
                                    <div className="oh-right">
                                        <label>{"$ " + formatMoney(order.totalAmount)}</label>
                                        <span>{order.time}</span>
                                    </div>
                                </div>
                            ))
                    }
                </div>
            </div>
        ));


        return (
            <div className="d-flex">
                <div className="col-sm-6 pad-none"  >
                    <div className="pro-list-section">
                        <div className="oh-heading">
                            Orders History
                        </div>
                        <div className="d-flex oh-search">
                            <div className="col-flex form-d">
                                <SearchCustomer
                                    customerArr={this.props.customerArr}
                                    showCustomerList={this.props.showCustomerList}
                                    customerSearchRequestBody={this.props.customerSearchRequestBody}
                                    // height = {this.props.height}
                                    handleCustomerSearch={this.handleCustomerSearch}
                                    handleSearchCustomer={this.props.handleSearchCustomer}
                                />
                            </div>
                            <div className="col-flex form-d">
                                <input type="text" className="form-control" placeholder="Enter Order Id to search" value={this.searchParameters.orderId} name='orderId' onChange={this.handleInputChange} />
                            </div>
                            <div className="col-flex form-d">
                                <input type="date" className="form-control" value={this.searchParameters.date} name='date' onChange={this.handleInputChange} />
                            </div>
                            <div className="col-flex form-d max-w120">
                                <span className="pointer" className="btn btn-info" style={{ marginTop: "9px" }} onClick={this.handleSearch}>Search </span>
                            </div>
                        </div>
                        <div className="order-section-parent">
                            {orderHistory}
                        </div>
                    </div>
                </div>
                {!_isEmpty(this.selectedOrder) &&
                    <div className="col-sm-6 pad-none cart-div">
                        <div className="cart-top">
                            <div className="oh-heading oh-border">
                                Order Details
                            </div>

                            <h4 className="oh-id"><span>Order ID: <i className="text-uppercase">{this.selectedOrder.orderId}</i></span> </h4>

                            <div className="row d-flex order-status">
                                <div className="col-sm-8 od-status">
                                    <div className="status-div"><label>Status:</label><span className="green">Completed</span></div>
                                    <div className="status-div"><label>Customer Name:</label><span >{_get(this.selectedOrder, 'customerName', '')}</span></div>
                                    <div className="status-div"><label>Date:</label><span>{_get(this.selectedOrder, 'date', '')}</span></div>
                                    <div className="status-div"><label>Time:</label><span>{_get(this.selectedOrder, 'time', '')}</span></div>
                                    <div className="status-div"><label>Served By:</label><span>{_get(this.selectedOrder, 'salesExecutive', '')}</span></div>
                                </div>
                                <div className="col-sm-4 od-amount ">
                                    <h4>{"$ " + formatMoney(_get(this.selectedOrder, 'grandTotal', 0))}</h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 od-billpay">
                            <div className="row">
                                <div className="col-sm-6 od-billing">
                                    <h5>BILLING ADDRESS</h5>
                                    <div className="odb-address">
                                        <label>{_get(this.selectedOrder.billingAddress, 'streetAddress1', '')}</label>
                                        <label>{_get(this.selectedOrder.billingAddress, 'streetAddress2', '')}</label>
                                        <label>{_get(this.selectedOrder.billingAddress, 'streetAddress3', '')}</label>
                                    </div>
                                </div>
                                <div className="col-sm-4 col-sm-offset-2 od-payment">
                                    <h5>PAYMENT METHOD</h5>
                                    <div className="odp">
                                        <span>Paid- {this.selectedOrder.paymentMethod}</span>
                                        <span>{"$ " + formatMoney(_get(this.selectedOrder, 'totalPaid', 0))}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-12 od-billtable">
                            <RecieptData
                                data={this.recieptData}
                                cartItems={cartItems}
                                showHeader={false}
                                ref={el1 => (this.componentRef1 = el1)}
                            />
                        </div>

                        <div className="col-sm-12 plr-30" style={{ background: "#FFF", padding: "5px 10px" }}>
                            <div className="col-sm-6 plr-5 checkout-action">
                                <ReactToPrint
                                    trigger={() => <input type="button" value="Print" className="btn btn-gray" />}
                                    content={() => this.componentRef1}
                                    onAfterPrint={this.handleClose}
                                />
                            </div>
                            <div className="col-sm-6 plr-5 checkout-action">
                                <SaveButton Class_Name="btn-green text-uppercase" buttonDisplayText={'Refund'}
                                />
                            </div>
                        </div>
                    </div>
                }

            </div>
        )

    }

}


const mapStateToProps = state => {

    let { orderHistoriesReducer } = state

    let { status } = orderHistoriesReducer || '';
    let { isFetching } = orderHistoriesReducer || false;
    let { type } = orderHistoriesReducer || '';
    let { orderHistory } = orderHistoriesReducer || {};
    let { selectedOrderHistoryData } = orderHistoriesReducer || {};

    return {
        status,
        isFetching,
        orderHistory,
        selectedOrderHistoryData,
        type


    }
}

export default connect(mapStateToProps)(CustomerHistory);

