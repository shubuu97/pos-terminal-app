import React from 'react';
import Redirect from "react-router/Redirect";
import Panel from 'react-bootstrap/lib/Panel';
import PanelGroup from 'react-bootstrap/lib/PanelGroup';
import "bootstrap/dist/css/bootstrap.css";
import _isEmpty from 'lodash/isEmpty';
import Form from "react-bootstrap/lib/Form";
import AutoComplete from './Elements/AutoComplete.jsx';
import SaveButton from './common/SaveButton.jsx';
import SearchCustomer from '../components/SearchCustomer';
import formatMoney from '../global/normalizingMoneyField';

class CartView extends React.Component {
    constructor(props) {
        super(props);
        this.handleCustomerSearch = this.handleCustomerSearch.bind(this);
        this.newCustomer = this.newCustomer.bind(this);
        this.handleHoldCustomer = this.handleHoldCustomer.bind(this);
        this.deleteCart = this.deleteCart.bind(this);
        this.handleSearchCustomer = this.handleSearchCustomer.bind(this);
        this.handleHold = this.handleHold.bind(this);
        this.handleSaleTransaction = this.handleSaleTransaction.bind(this);
        this.onClose = this.onClose.bind(this);
        this.customerHistory = this.customerHistory.bind(this);
        this.onCustomerHistoryOpen = this.onCustomerHistoryOpen.bind(this);

    }

    handleCustomerSearch() {
        this.props.handleCustomerSearch();
    }

    newCustomer() {
        this.props.newCustomer();
    }

    handleHoldCustomer(id) {
        this.props.handleHoldCustomer(id);
    }

    deleteCart() {
        this.props.deleteCart();
    }
    handleSearchCustomer(event) {
        this.props.handleSearchCustomer(event);
    }
    handleHold() {
        this.props.handleHold();
    }
    handleSaleTransaction() {
        this.props.handleSaleTransaction();
    }
    onClose() {
        this.props.onClose()
    }
    customerHistory() {
        this.props.customerHistory();
    }
    onCustomerHistoryOpen() {
        this.props.onCustomerHistoryOpen();
    }


    render() {
        const cartItems = this.props.cartItems;
        const totalAmount = this.props.totalAmount;
        const totalItems = this.props.totalItems;
        const height = this.props.height;
        const cart = this.props.cart;

        return (

            <div className="shop-cart" style={{ height: (height - 70) }}>
                <div className="p-10">
                    <SearchCustomer
                        customerArr={this.props.customerArr}
                        showCustomerList={this.props.showCustomerList}
                        customerSearchRequestBody={this.props.customerSearchRequestBody}
                        // height = {this.props.height}
                        handleCustomerSearch={this.handleCustomerSearch}
                        handleSearchCustomer={this.props.handleSearchCustomer}
                    />
                    <div className="add-customer pull-right" onClick={this.newCustomer}></div>
                </div>
                <div className="clearfix"></div>
                {/* {this.props.showButtons &&
                    <div className="form-d p-10 hold-customer">
                        <AutoComplete
                            data={this.props.holdedCustomers}
                            type="single"
                            id={'holdedCustomers'}
                            placeholder="Search for Customer on Hold"
                            // value={_get(_find(this.tableData,{'_id':row._id}),'tagNo','')}
                            changeHandler={(id) => { this.handleHoldCustomer(id) }}
                        />
                    </div>
                } */}
                {this.props.showButtons &&
                    <div className="form-d mb-0">
                        <div className="cus-profile">
                            <div className="customer-pic pull-left" onClick={() => this.props.showCustomerData()}></div>
                            <div className="pull-right"><span className="customer-name">{this.props.customerName}</span> <span onClick={this.onCustomerHistoryOpen} className="customer-order-history"></span></div>
                        </div>
                    </div>
                }
                <div className="form-d cart-block-header">
                    <div className="col-sm-12">
                        <span className="clear-cart" onClick={this.deleteCart}></span>
                        <span className="pull-right">Cart({totalItems})</span>
                    </div>
                </div>

                <div className="form-d cart-product-list mb-0">
                    <ul>
                        {cartItems}
                    </ul>
                </div>
                <div className="form-d cart-amount-block mb-0">
                    <div className="row marg-none style2">
                        <span className="decor1"><span className="inner1"></span></span>
                        <label className="labelmain pull-left" >Total</label>
                        <label className="labelmain pull-right" >{"$ " + formatMoney(totalAmount)}</label>
                    </div>
                    <div className="row marg-none style2">
                        <span className="decor1"><span className="inner1"></span></span>
                        <label className="labelmain pull-left" >Tax</label>
                        <label className="labelmain pull-right" >$ 0.00</label>
                    </div>

                    <div className="row marg-none style2">
                        <span className="decor1"><span className="inner1"></span></span>
                        <label className="labelmain pull-left" >Total</label>
                        <label className="labelmain pull-right" >{"$ " + formatMoney(totalAmount)}</label>
                    </div>
                    {this.props.showButtons &&
                        <div className="row  marg-none cart-action-btn pt-15">
                            <div className="col-sm-4 plr-5">
                                <SaveButton
                                    Class_Name="col-sm-12 btn-gray"
                                    buttonDisplayText={'Hold'}
                                    disabled={cart.length <= 0}
                                    handlerSearch={this.handleHold} />
                            </div>
                            <div className="col-sm-8 plr-5">
                                <SaveButton
                                    Class_Name="col-sm-12 btn-green"
                                    buttonDisplayText={'Checkout'}
                                    handlerSearch={this.handleSaleTransaction}
                                    disabled={cart.length <= 0 || !this.props.customerName || this.props.customerName == ''} />
                            </div>
                        </div>
                    }


                </div>

            </div>
        )

    }

}
export default CartView;