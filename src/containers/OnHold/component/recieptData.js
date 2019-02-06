import React from 'react';
import _get from 'lodash/get';

import { findDOMNode } from 'react-dom';
import Button from "react-bootstrap/lib/Button";

import BootstrapTable from 'react-bootstrap-table/lib/BootstrapTable';
import TableHeaderColumn from 'react-bootstrap-table/lib/TableHeaderColumn';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import formatMoney from '../../../global/normalizingMoneyField';

class RecieptData extends React.Component {


    render() {
        let cartItems = [];
        this.props.cartItems.map(product => {

            let tempObj = {};
            tempObj.productName = product.name;
            tempObj.quantity = product.quantity;
            tempObj.price = product.price;
            tempObj.totalPrice = Number(product.price) * Number(product.quantity);
            cartItems.push(tempObj);

        });
        const tableData = this.props.cartItems.map((product, index) => (
            <tr key={index}>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>{(product.price) || product.unitPrice}</td>
                {this.props.showHeader ? <td>{Number(product.price) * Number(product.quantity)}</td> :
                    <td>{product.quantity * product.price}</td>
                }
            </tr>

        ));

        return (
            <div className="modal-child">
                <div className="row">

                    <div className="col-sm-12 invoice-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Sub Total</th>
                                </tr>
                            </thead>

                            <tbody>
                                {tableData}
                            </tbody>
                        </table>

                    </div>
                    <div className="cart-amount-block col-sm-12">
                        <div className="row marg-none style2">
                            <span className="decor1"><span className="inner1"></span></span>
                            <label className="labelmain pull-left" >SubTotal</label>
                            <label className="labelmain pull-right" >{"$ " + formatMoney(this.props.selectedOrder.totalAmount)}</label>
                        </div>
                        <div className="row marg-none style2">
                            <span className="decor1"><span className="inner1"></span></span>
                            <label className="labelmain pull-left" >Tax</label>
                            <label className="labelmain pull-right" >$ 0.00</label>
                        </div>

                        <div className="row marg-none style2">
                            <span className="decor1"><span className="inner1"></span></span>
                            <label className="labelmain pull-left" >Grand Total</label>
                            <label className="labelmain pull-right" >{"$ " + formatMoney(this.props.selectedOrder.totalAmount)}</label>
                        </div>
                    </div>
                </div>
            </div>




        );
    }
}

export default RecieptData;