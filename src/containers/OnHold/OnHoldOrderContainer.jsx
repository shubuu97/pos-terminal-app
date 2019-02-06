import React from 'react';
import Redirect from "react-router/Redirect";
import Panel from 'react-bootstrap/lib/Panel';
import PanelGroup from 'react-bootstrap/lib/PanelGroup';
import "bootstrap/dist/css/bootstrap.css";
import connect from 'react-redux/lib/connect/connect';

import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import _set from 'lodash/set';
import SaveButton from '../../components/common/SaveButton';
import RecieptData from './component/recieptData';
import SearchCustomer from './component/SearchCustomer';
import formatMoney from '../../global/normalizingMoneyField';
import db from '../../db';
let dbOnHold = new db('dbonhold');

class OnHoldHistoryContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { onHoldOrders: [] }

    }

    shouldComponentUpdate(props) {
        if (props.open) {
            return true;
        } else {
            return false;
        }
    }
    componentDidMount() {
        dbOnHold.getAllDocs().then((onHoldOrders) => {
            this.onHoldMapper(onHoldOrders);
        });
        dbOnHold.createIndex(['customerName']).then(function (result) {
            console.log(result, "result is here")
        }).catch(function (err) {
            console.log(err);
        });
    }
    onHoldMapper = (onHoldOrders)=>
    {
        let onHoldOrdersArr =   Object.keys(onHoldOrders).map((key) => {
            return onHoldOrders[key]
        })
        this.setState({ onHoldOrders: onHoldOrdersArr });
    }
    onSelectHoldOrder = (order) => {
        this.setState({ selectedOrder: order });
    }

    handleCustomerSearch = () => {
        this.getCustomerId = true;
        this.props.handleCustomerSearch();
    }

    getAllOnHoldOrder = async () => {
        let onHoldOrdersArr = [];
        let onHoldOrders = await dbOnHold.getAllDocs();
        onHoldOrdersArr = Object.keys(onHoldOrders).map((key) => {
            return onHoldOrders[key]
        })
        return onHoldOrdersArr;
    }

    handleDelete = async () => {
        let deleteDoc = await dbOnHold.deleteDoc(this.state.selectedOrder);
        this.setState({ selectedOrder: null });
        let onHoldOrderArr = await this.getAllOnHoldOrder();
        this.setState({ onHoldOrders: onHoldOrderArr });
    }

    handleSaleTransactionOfOnHoldOrders = () => {
        this.props.handleSaleTransactionOfOnHoldOrders(this.state.selectedOrder);
    }
    searchCustomer = async (value) => {
        let queryObj = {
            selector: {
                customerName: { $regex: RegExp(value, "i") }
            }
        }
       let result = await dbOnHold.findIndex(queryObj)
       this.onHoldMapper(result.docs);
       console.log(result,"search result is here")
    }
    render() {
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



        const orderHistory = <div className="order-section">
            <div className="order-date">
                {}
            </div>
            <div className="oh-body">
                {
                    !_isEmpty(this.state.onHoldOrders) && this.state.onHoldOrders.map((order, index) =>
                        (
                            <div className={_get(this.selectedOrder, 'orderId', '') === order.orderId ? "oh-block active" : "oh-block"} key={index} onClick={() => this.onSelectHoldOrder(order)}>
                                <div className="oh-left">
                                    <label>{order.customerName}</label>
                                    <span>{order.date}</span>
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


        return (
            <div className="d-flex">
                <div className="col-sm-6 pad-none"  >
                    <div className="pro-list-section">
                        <div className="oh-heading">
                            Onhold Orders History
                        </div>
                        <div className="d-flex oh-search">
                            <div className="col-flex form-d">
                                <SearchCustomer
                                    searchCustomer={this.searchCustomer}
                                />
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
                {!_isEmpty(this.state.selectedOrder) &&
                    <div className="col-sm-6 pad-none cart-div">
                        <div className="cart-top">
                            <div className="oh-heading oh-border">
                                Order Details
                            </div>
                            <div className="row d-flex order-status">
                                <div className="col-sm-8 od-status">
                                    <div className="status-div"><label>Status:</label><span className="yellow">Onhold</span></div>
                                    <div className="status-div"><label>Customer Name:</label><span >{_get(this.state.selectedOrder, 'customerName', '')}</span></div>
                                    <div className="status-div"><label>Date:</label><span>{_get(this.state.selectedOrder, 'date', '')}</span></div>
                                    <div className="status-div"><label>Time:</label><span>{_get(this.state.selectedOrder, 'time', '')}</span></div>
                                    <div className="status-div"><label>Served By:</label><span>{_get(this.state.selectedOrder, 'salesExecutive', '')}</span></div>
                                </div>
                                <div className="col-sm-4 od-amount ">
                                    <h4>{"$ " + formatMoney(_get(this.state.selectedOrder, 'totalAmount', 0))}</h4>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-12 od-billtable">
                            <RecieptData
                                data={this.recieptData}
                                cartItems={_get(this.state, 'selectedOrder.cart', [])}
                                selectedOrder={_get(this.state, 'selectedOrder', {})}
                                showHeader={false}
                                ref={el1 => (this.componentRef1 = el1)}
                            />
                        </div>

                        <div className="col-sm-12 plr-30" style={{ background: "#FFF", padding: "5px 10px" }}>
                            <div className="col-sm-6 plr-5 checkout-action">
                                <SaveButton
                                    handlerSearch={this.handleDelete}
                                    Class_Name="btn-gray text-uppercase"
                                    buttonDisplayText={'Delete'} />
                            </div>
                            <div className="col-sm-6 plr-5 checkout-action">
                                <SaveButton
                                    handlerSearch={this.handleSaleTransactionOfOnHoldOrders}
                                    Class_Name="btn-green text-uppercase"
                                    buttonDisplayText={'Checkout'}
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

export default connect(mapStateToProps)(OnHoldHistoryContainer);

