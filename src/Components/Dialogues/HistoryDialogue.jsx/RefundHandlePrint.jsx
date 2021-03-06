import React from 'react';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import '../../../assets/stylesheets/print.css';
import paymentMethods from '../../../Global/PosFunctions/paymentMethods';
import dineroObj from '../../../Global/PosFunctions/dineroObj';

var Barcode = require('react-barcode');



const HandlePrint = (props) => {
    let taxAmount = _get(props, 'totalTax', 0)
    let grandTotal = _get(props, 'totalAmount', 0)
    let totalAmountPaid = _get(props, 'totalAmountPaid', 0)
    let changeDue = _get(props, 'changeDue', 0)


    let saleItems = _get(props.data, "returnItems", []);
    let saleItemResp = saleItems.map((saleItem, index) => {
        return (
            <div style={{ display: 'flex', flex: '1', paddingTop: "10px", paddingBottom: "10px", borderBottom: 'dotted 1px #9e9e9e' }}>
                < div style={{ width: "35%" }
                }> {_get(saleItem, 'doc.product.isGiftCard', false) ? 'Gift Card' : _get(saleItem, "returnProduct.name", '')}</div >
                <div style={{ width: "10%", textAlign: "center" }}>{_get(saleItem, "qty", 0)}</div>
                <div style={{ width: "30%", textAlign: "right" }}>{(dineroObj(_get(saleItem, "itemRefundEffectiveTotal.amount", 0)).divide(_get(saleItem, "qty", 0))).toFormat('$0,0.00')}<br />
                </div>
                <div style={{ width: "25%", textAlign: "right" }}>{dineroObj(_get(saleItem, "itemRefundEffectiveTotal.amount", 0)).toFormat('$0,0.00')}</div>
            </div >)
    })



    return (
        <div style={{ fontSize: "12px", fontFamily: "arial, sans-serif", color: 'black' }} >
            <div style={{ textAlign: "center" }}>
                <div style={{ width: "100%" }}> <img style={{ height: "auto", width: "100%" }} src={props.logo} /></div>
                <div style={{ marginTop: '10px' }}><span style={{ fontSize: '11px', fontWeight: 'bold' }}>ORDER ID:</span> {_get(props, 'orderId', '')}</div>
                <div style={{ marginTop: '10px' }}><span style={{ fontSize: '11px', fontWeight: 'bold' }}>REFUND ORDER ID:</span> {_get(props, 'refundorderId', '')}</div>
                <div style={{ marginTop: '10px' }}><span style={{ fontSize: '11px', fontWeight: 'bold' }}>ORDER DATE:</span> {_get(props, 'orderDate', '')}</div>
                <div style={{ marginTop: '10px' }}><span style={{ fontSize: '11px', fontWeight: 'bold' }}>REFUND DATE:</span> {_get(props, 'refundDate', '')}</div>
                <div style={{ marginTop: '10px' }}><span style={{ fontSize: '11px', fontWeight: 'bold' }}>STORE:</span> {_get(props, 'storeName', '')}</div>
                <div><span style={{ fontSize: '11px', fontWeight: 'bold' }}>ADDRESS:</span> {_get(props, 'storeAddress', '')}</div>
                <div style={{ marginTop: '10px' }}><span style={{ fontSize: '11px', fontWeight: 'bold' }}>CASHIER:</span> {_get(props, 'cashierName', '')}</div>
                <div><span style={{ fontSize: '11px', fontWeight: 'bold' }}>TERMINAL:</span> {_get(props, 'terminalName', '')}</div>
                <div style={{ marginTop: '10px' }}><span style={{ fontSize: '11px', fontWeight: 'bold' }}>CUSTOMER:</span> {_get(props, 'customerName', '')}</div>
                <div style={{ padding: '10px 0 10px 0', fontSize: "15px" }}><strong style={{ fontSize: '14px', fontWeight: 'bold' }}>REFUND DETAILS:</strong></div>
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
                    SUB TOTAL: <span style={{ fontWeight: 'bold' }}>{dineroObj(props.subTotal).toFormat('$0,0.00')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>
                    TOTAL TAX: <span style={{ fontWeight: 'bold' }}>{dineroObj(taxAmount).toFormat('$0,0.00')}</span>
                </div>
            </div>
            <div style={{ display: 'flex', flex: '1', flexDirection: 'column', borderBottom: 'solid 1px #9e9e9e', paddingTop: "5px", paddingBottom: "5px", marginBottom: "15px" }} >

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>
                    GRAND TOTAL: <span style={{ fontWeight: 'bold' }}>{dineroObj(grandTotal).toFormat('$0,0.00')}</span>
                </div>

                {props.totalAmountPaid &&
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>
                        TOTAL Refund: <span style={{ fontWeight: 'bold' }}>{dineroObj(totalAmountPaid).toFormat('$0,0.00')}</span>
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
                                    <span style={{ fontWeight: 'bold', textAlign: "right" }}>{dineroObj(_get(payment, 'paymentAmount.amount', 0)).toFormat('$0,0.00')}<br />
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