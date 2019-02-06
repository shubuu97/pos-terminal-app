import React from 'react';
import _get from 'lodash/get';

import { findDOMNode } from 'react-dom';
import Button from "react-bootstrap/lib/Button";

import SaveButton from "../components/common/SaveButton.jsx";
import BootstrapTable from 'react-bootstrap-table/lib/BootstrapTable';
import TableHeaderColumn from 'react-bootstrap-table/lib/TableHeaderColumn';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import formatMoney from '../global/normalizingMoneyField';

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
        const tableData = this.props.cartItems.map((product,index) => (
            <tr key={index}>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>{(product.price) || product.unitPrice}</td>
                {this.props.showHeader ? <td>{Number(product.price) * Number(product.quantity)}</td>:
                <td>{product.subTotal}</td>
            }
            </tr>
            // <div className="col-sm-12">
            //     <div className="col-sm-3">
            //         {product.name}
            //     </div>
            //     <div className="col-sm-3">
            //         {product.quantity}
            //     </div>
            //     <div className="col-sm-3">
            //         {product.price}
            //     </div>
            //     <div className="col-sm-3">
            //         {Number(product.price) * Number(product.quantity)}
            //     </div>
            // </div>

        ));

        return (



            <div className="modal-child">
            <div className="row">
            {this.props.showHeader &&
                <div className="col-sm-12">
                    <div className="invoice-header">
                        <h3>All On Block </h3>
                        <h4>Order No: {this.props.data.id}</h4>
                    </div>
                </div>
            }
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
                    {/* <div className="col-sm-12">
                        <div className="col-sm-3">
                            Name
                        </div>
                        <div className="col-sm-3">
                            Quantity
                        </div>
                        <div className="col-sm-3">
                           Price
                        </div>
                        <div className="col-sm-3">
                            Sub Total
                        </div>
                    </div>
                    <hr/> */}
                    <tbody>
                    {tableData}
                    </tbody>
                    </table>
                    {/* <BootstrapTable data={cartItems}>
                        <TableHeaderColumn width='150' dataField='productName' isKey={true}>Product </TableHeaderColumn>
                        <TableHeaderColumn dataField='quantity'>Quantity</TableHeaderColumn>
                        <TableHeaderColumn dataField='price'>Price</TableHeaderColumn>
                        <TableHeaderColumn width='100' dataField='totalPrice'>SubTotal</TableHeaderColumn>
                    </BootstrapTable> */}
                </div>
                <div className="cart-amount-block col-sm-12">
                    <div className="row marg-none style2">
                        <span className="decor1"><span className="inner1"></span></span>
                        <label className="labelmain pull-left" >SubTotal</label>
                        <label className="labelmain pull-right" >{"$ " + formatMoney(this.props.data.totalAmount)}</label>
                    </div>
                    <div className="row marg-none style2">
                        <span className="decor1"><span className="inner1"></span></span>
                        <label className="labelmain pull-left" >Tax</label>
                        <label className="labelmain pull-right" >$ 0.00</label>
                    </div>

                    <div className="row marg-none style2">
                        <span className="decor1"><span className="inner1"></span></span>
                        <label className="labelmain pull-left" >Grand Total</label>
                        <label className="labelmain pull-right" >{"$ " + formatMoney(this.props.data.totalAmount)}</label>
                    </div>
                    <div className="row marg-none style2">
                        <span className="decor1"><span className="inner1"></span></span>
                        <label className="labelmain pull-left" >Total Paid</label>
                        <label className="labelmain pull-right" >{"$ " + formatMoney(this.props.data.amountPaid)}</label>
                    </div>
                    {this.props.showHeader &&
                    <div className="row marg-none style2">
                        <span className="decor1"><span className="inner1"></span></span>
                        <label className="labelmain pull-left" >Total Due</label>
                        <label className="labelmain pull-right" >{"$ " + formatMoney(this.props.data.dueAmount)}</label>
                    </div>
                    }
                     {this.props.showHeader &&
                    <div className="row marg-none style2">
                        <span className="decor1"><span className="inner1"></span></span>
                        <label className="labelmain pull-left" >Reedem Point</label>
                        <label className="labelmain pull-right" >{ _get(this.props,'data.ReedemPoint',0)}</label>
                    </div>
                    }
                     {this.props.showHeader &&
                    <div className="row marg-none style2">
                        <span className="decor1"><span className="inner1"></span></span>
                        <label className="labelmain pull-left" >Reedem Amount</label>
                        <label className="labelmain pull-right" >{"$ " + formatMoney(_get(this.props,'data.ReedemAmount',0))}</label>
                    </div>
                    }
                    {this.props.showHeader &&
                    <div className="row marg-none style2">
                        <span className="decor1"><span className="inner1"></span></span>
                        <label className="labelmain pull-left" >Earned Reward Points</label>
                        <label className="labelmain pull-right" >{ _get(this.props,'data.rewardPoints',0)}</label>
                    </div>
                    }
                    {/* <div className="row marg-none style2">
                        <span className="decor1"><span className="inner1"></span></span>
                        <label className="labelmain pull-left" >CASH PAYMENT</label>
                        <label className="labelmain pull-right" >{"$ " + formatMoney(this.props.data.amountPaid)}</label>
                    </div> */}
                    {this.props.showHeader &&
                    <div className="row marg-none style2">
                        <span className="decor1"><span className="inner1"></span></span>
                        <label className="labelmain pull-left" >Change </label>
                        <label className="labelmain pull-right" >{"$ " + formatMoney(_get(this.props,'data.totalChange',0))}</label>
                    </div>
                    }


                </div>
            </div>
            </div>




        );
    }
}

export default RecieptData;