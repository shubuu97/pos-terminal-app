import React from 'react';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import '../../../assets/stylesheets/print.css';
import paymentMethods from '../../../Global/PosFunctions/paymentMethods';

var Barcode = require('react-barcode');



const HandlePrint = (props) => {
    let taxAmount = _get(props, 'totalTax', 0)
    let grandTotal = _get(props, 'totalAmount', 0)
    let totalAmountPaid = _get(props, 'totalAmountPaid', 0)
    let changeDue = _get(props, 'changeDue', 0)


    let saleItems = _get(props.data, "returnItems", []);
    let saleItemResp = saleItems.map((saleItem, index) => {
        return (<div style={{ display: 'flex', flex: '1', paddingTop: "10px", paddingBottom: "10px", borderBottom: 'dotted 1px #9e9e9e' }}>
            < div style={{ width: "35%" }
            }> {_get(saleItem, 'doc.product.isGiftCard', false) ? 'Gift Card' : _get(saleItem, "productId", '')}</div >
            <div style={{ width: "10%", textAlign: "center" }}>{_get(saleItem, "qty", 0)}</div>
            <div style={{ width: "30%", textAlign: "right" }}>{_get(saleItem, 'doc.product.salePrice.price', 0).toFixed(2)}<br />

            </div>
            <div style={{ width: "25%", textAlign: "right" }}>{_get(saleItem, "itemRefundEffectiveTotal.amount", 0).toFixed(2)}</div>
        </div >)
    })



    return (
        <div style={{ fontSize: "12px", fontFamily: "arial, sans-serif" }} >
            <div style={{ textAlign: "center" }}>
                <div style={{ height: "100px", width: "100%" }}> <img style={{ height: "100%", width: "auto" }} src={props.logo} /></div>
                <div style={{ marginTop: '15px' }}>{_get(props, 'orderId', '')}</div>
                <div>{_get(props, 'orderDate', '')}</div>
                <div style={{ marginTop: '10px' }}><span style={{ color: '#9e9e9e', fontSize: '11px', fontWeight: 'bold' }}>STORE:</span> {_get(props, 'storeName', '')}</div>
                <div><span style={{ color: '#9e9e9e', fontSize: '11px', fontWeight: 'bold' }}>ADDRESS:</span> {_get(props, 'storeAddress', '')}</div>
                <div style={{ marginTop: '10px' }}><span style={{ color: '#9e9e9e', fontSize: '11px', fontWeight: 'bold' }}>CASHIER:</span> {_get(props, 'cashierName', '')}</div>
                <div><span style={{ color: '#9e9e9e', fontSize: '11px', fontWeight: 'bold' }}>TERMINAL:</span> {_get(props, 'terminalName', '')}</div>
                <div style={{ marginTop: '10px' }}><span style={{ color: '#9e9e9e', fontSize: '11px', fontWeight: 'bold' }}>CUSTOMER:</span> {_get(props, 'customerName', '')}</div>
                <div style={{ padding: '10px 0 10px 0', fontSize: "15px" }}><strong style={{ color: '#9e9e9e', fontSize: '14px', fontWeight: 'bold' }}>REFUND DETAILS:</strong></div>
            </div>
            <div>
                <div style={{ display: 'flex', flex: '1', borderTop: 'solid 1px #9e9e9e', borderBottom: 'solid 1px #9e9e9e', paddingTop: "10px", paddingBottom: "10px" }} >
                    <div style={{ fontSize: "11px", width: "35%" }}><strong>ITEM</strong></div>
                    <div style={{ fontSize: "11px", width: "10%", textAlign: "right" }}><strong>QTY</strong></div>
                    <div style={{ fontSize: "11px", width: "30%", textAlign: "right" }}><strong>PRICE</strong></div>
                    <div style={{ fontSize: "11px", width: "25%", textAlign: "right" }}><strong>SUBTOTAL</strong></div>
                </div>

                {saleItemResp}
            </div>

            <div style={{ display: 'flex', flex: '1', flexDirection: 'column', borderBottom: 'solid 1px #9e9e9e', paddingTop: "10px", paddingBottom: "5px" }} >
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>
                    SUB TOTAL: <span style={{ fontWeight: 'bold' }}>{_get(props, 'currency', '') + props.subTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>
                    TOTAL TAX: <span style={{ fontWeight: 'bold' }}>{_get(props, 'currency', '') + taxAmount.toFixed(2)}</span>
                </div>
            </div>
            <div style={{ display: 'flex', flex: '1', flexDirection: 'column', borderBottom: 'solid 1px #9e9e9e', paddingTop: "5px", paddingBottom: "5px", marginBottom: "15px" }} >

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>
                    GRAND TOTAL: <span style={{ fontWeight: 'bold' }}>{_get(props, 'currency', '') + grandTotal.toFixed(2)}</span>
                </div>

                {props.totalAmountPaid &&
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>
                        TOTAL Refund: <span style={{ fontWeight: 'bold' }}>{_get(props, 'currency', '') + totalAmountPaid.toFixed(2)}</span>
                    </div>
                }

                {props.saleComment &&
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>
                        SALE COMMENT: <span style={{ fontWeight: 'bold' }}>{_get(props, 'saleComment', '---------')}</span>
                    </div>
                }

                {props.paymentMethods &&
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>
                        Refund METHOD:
                    {_get(props, 'paymentMethods', []).map(payment => {
                            return (
                                <div style={{ display: 'flex' }}>
                                    <span style={{ fontWeight: 'bold', textAlign: "right" }}>{_get(props, 'currency', '') + _get(payment, 'paymentAmount.amount', 0).toFixed(2)}<br />
                                        by {paymentMethods(_get(payment, 'paymentMethod', 0))}</span>
                                </div>
                            )
                        })}
                    </div>
                }

            </div>
            <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: "4px", fontSize: '15px', marginBottom: '40px' }}>Customer Copy</div>

            <div style={{ display: 'flex', justifyContent: 'start', paddingBottom: "4px", fontSize: '12px', borderBottom: 'dotted 1px #9e9e9e' }}>Customer Signature </div>

            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: "10px", fontSize: '15px', marginBottom: '40px' }}>
                <Barcode value={_get(props, 'orderId', '')} />
            </div>

        </div>
    )
}

export default HandlePrint;