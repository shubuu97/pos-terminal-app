import React from 'react';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import logo from '../../assets/images/aobLogodark.png';
import '../../assets/stylesheets/print.css';

var Barcode = require('react-barcode');

const HandlePrint = (props) => {
    let stSubTotal = 0
    let ohSubTotal = 0
    const saleTransaction = _get(props, 'itemList', []).map(item => {
        let itemSubTotal = 0
        let empDis
        if (_get(item, 'employeeDiscountPercent', '') !== 0) {
            empDis = (_get(item, 'itemRegularTotal.amount') * _get(item, 'employeeDiscountPercent')) / 100
        } else {
            empDis = 0
        }
        let itemDis
        let isItemDiscountPercentExist = !('itemDiscountPercent' in item)
        if (isItemDiscountPercentExist) {
            itemDis = 0
        } else {
            itemDis = (_get(item, 'itemRegularTotal.amount') * _get(item, 'itemDiscountPercent')) / 100
        }
        itemSubTotal = ((_get(item, 'doc.product.salePrice.price', '0') * _get(item, 'qty', 1)) - (empDis + itemDis))
        stSubTotal += itemSubTotal
        return (
            <div style={{ display: 'flex', flex: '1', paddingTop: "10px", paddingBottom: "10px", borderBottom: 'dotted 1px #9e9e9e' }}>
                <div style={{ width: "35%" }}>{_get(item, 'doc.product.name')}</div>
                <div style={{ width: "10%", textAlign: "center" }}>{_get(item, 'qty', '')}</div>
                <div style={{ width: "30%", textAlign: "right" }}>{_get(item, 'doc.product.salePrice.price', '0')}<br />
                    <div style={{ fontSize: "9px" }}>
                        {itemDis == 0 ? '' : <span>(Item Disc.: {itemDis.toFixed(2)})</span>}<br />
                        {empDis == 0 ? '' : <span>(Emp Disc.: {empDis.toFixed(2)})</span>}
                    </div>
                </div>
                <div style={{ width: "25%", textAlign: "right" }}>{itemSubTotal.toFixed(2)}</div>
            </div>
        )
    })

    const orderHistory = _get(props, 'itemList', []).map(item => {
        let itemSubTotal = 0
        let empDis
        let salePrice = _get(item, 'product.salePrice.price', '0')
        let isEmpDisExist = ('employeeDiscountPercent' in _get(item, 'saleItem', {}))
        if (!isEmpDisExist) {
            empDis = 0
        } else {
            empDis = (_get(item, 'saleItem.itemRegularTotal.amount') * _get(item, 'saleItem.employeeDiscountPercent')) / 100
        }
        let itemDis
        let isItemDisExist = ('itemDiscountPercent' in _get(item, 'saleItem',{}))
        if(!isItemDisExist) {
            itemDis = 0
        } else {
            itemDis = (_get(item,'saleItem.itemRegularTotal.amount') * _get(item,'saleItem.itemDiscountPercent')) / 100   
        }
        itemSubTotal = (_get(item, 'product.salePrice.price', 0) * _get(item, 'saleItem.qty', 1)) - (empDis + itemDis) 
        ohSubTotal += itemSubTotal
        return (
            <div style={{ display: 'flex', flex: '1', paddingTop: "10px", paddingBottom: "10px", borderBottom: 'dotted 1px #9e9e9e' }}>
                <div style={{ width: "35%", paddingRight: '10px' }}>{_get(item, 'product.name')}</div>
                <div style={{ width: "10%", textAlign: "center" }}>{_get(item, 'saleItem.qty', '')}</div>
                <div style={{ width: "30%", textAlign: "right" }}>{salePrice}<br />
                    <div style={{ fontSize: "9px" }}>
                        {itemDis == 0 ? '' : <span>(Item Disc.: {itemDis.toFixed(2)})</span>}<br />
                        {empDis == 0 ? '' : <span>(Emp Disc.: {empDis.toFixed(2)})</span>}
                    </div>
                </div>
                <div style={{ width: "25%", textAlign: "right" }}>{itemSubTotal.toFixed(2)}</div>
            </div>
        )
    })
    let subTotal = 0
    if (props.type == 'Sale Transaction') {
        subTotal = stSubTotal
    }
    if (props.type == 'Order History') {
        subTotal = ohSubTotal
    }

    let itemDiscount = _get(props, 'currency', '') + _get(props, 'itemsDiscount', '0')
    let cartDiscount = _get(props, 'currency', '') + _get(props, 'cartDiscount', '0')
    let employeeDiscount = _get(props, 'currency', '') + _get(props, 'employeeDiscount', '0')
    let taxAmount = _get(props, 'currency', '') + _get(props, 'totalTax', '0')
    let grandTotal = _get(props, 'currency', '') + _get(props, 'totalAmount', '0')
    let totalAmountPaid = _get(props, 'currency', '') + _get(props, 'totalAmountPaid', '0')
    let changeDue = _get(props, 'currency', '') + _get(props, 'changeDue', '0')
    
    return (
        <div style={{ fontSize: "12px", fontFamily: "arial, sans-serif" }} >
            <div style={{ textAlign: "center" }}>
                <div className="store-logo"> <img src={logo} /></div>
                <div style={{ marginTop: '15px' }}>{_get(props, 'orderId', '')}</div>
                <div>{_get(props, 'orderDate', '')}</div>
                <div style={{ marginTop: '10px' }}><span style={{ color: '#9e9e9e', fontSize: '11px', fontWeight: 'bold' }}>STORE:</span> {_get(props, 'storeName', '')}</div>
                <div><span style={{ color: '#9e9e9e', fontSize: '11px', fontWeight: 'bold' }}>ADDRESS:</span> {_get(props, 'storeAddress', '')}</div>

                <div style={{ marginTop: '10px' }}><span style={{ color: '#9e9e9e', fontSize: '11px', fontWeight: 'bold' }}>CASHIER:</span> {_get(props, 'cashierName', '')}</div>

                {/* Hiding Staff Id */}
                {/* <div><span style={{ color: '#9e9e9e', fontSize: '11px', fontWeight: 'bold' }}>STAFF ID:</span> {_get(props, 'staffId', '')}</div> */}

                <div><span style={{ color: '#9e9e9e', fontSize: '11px', fontWeight: 'bold' }}>TERMINAL:</span> {_get(props, 'terminalName', '')}</div>


                <div style={{ marginTop: '10px' }}><span style={{ color: '#9e9e9e', fontSize: '11px', fontWeight: 'bold' }}>CUSTOMER:</span> {_get(props, 'customerName', '')}</div>

                <div style={{ padding: '10px 0 10px 0', fontSize: "15px" }}><strong style={{ color: '#9e9e9e', fontSize: '14px', fontWeight: 'bold' }}>INVOICE:</strong></div>
            </div>
            <div >
                <div style={{ display: 'flex', flex: '1', borderTop: 'solid 1px #9e9e9e', borderBottom: 'solid 1px #9e9e9e', paddingTop: "10px", paddingBottom: "10px" }} >
                    <div style={{ fontSize: "11px", width: "35%" }}><strong>ITEM</strong></div>
                    <div style={{ fontSize: "11px", width: "10%", textAlign: "right" }}><strong>QTY</strong></div>
                    <div style={{ fontSize: "11px", width: "30%", textAlign: "right" }}><strong>PRICE</strong></div>
                    <div style={{ fontSize: "11px", width: "25%", textAlign: "right" }}><strong>SUBTOTAL</strong></div>
                </div>

                {props.type == 'Sale Transaction' ? saleTransaction : orderHistory}

            </div>

            <div style={{ display: 'flex', flex: '1', flexDirection: 'column', borderBottom: 'solid 1px #9e9e9e', paddingTop: "10px", paddingBottom: "5px" }} >
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>
                    SUB TOTAL: <span style={{ fontWeight: 'bold' }}>{_get(props, 'currency', '') + subTotal}</span>
                </div>
                {
                    _get(props, 'itemsDiscount') == 0 ? '' :
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>
                            ITEMS DISCOUNT: <span style={{ fontWeight: 'bold' }}>{itemDiscount}</span>
                        </div>
                }

                {
                    _get(props, 'cartDiscount') == 0 ? '' :
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>
                            CART DISCOUNT: <span style={{ fontWeight: 'bold' }}>{cartDiscount}</span>
                        </div>
                }

                {
                    _get(props, 'employeeDiscount') == 0 ? '' :
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>
                            EMPLOYEE DISCOUNT: <span style={{ fontWeight: 'bold' }}>{employeeDiscount}</span>
                        </div>
                }

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>
                    TOTAL TAX: <span style={{ fontWeight: 'bold' }}>{taxAmount}</span>
                </div>
                
            </div>
            <div style={{ display: 'flex', flex: '1', flexDirection: 'column', borderBottom: 'solid 1px #9e9e9e', paddingTop: "5px", paddingBottom: "5px", marginBottom: "15px" }} >
                {/* {props.regularTotal &&
                     <div style={{display:'flex',  justifyContent:'space-between', paddingBottom:"4px"}}>
                        REGULAR TOTAL: <span style={{fontWeight:'bold'}}>{_get(props,'currency', '') + _get(props,'regularTotal','0')}</span>
                     </div>
                } */}
                {/* {props.totalDiscount &&
                     <div style={{display:'flex',  justifyContent:'space-between', paddingBottom:"4px"}}>
                        TOTAL DISCOUNT: <span style={{fontWeight:'bold'}}>{_get(props,'currency', '') + _get(props,'totalDiscount','0')}</span>
                     </div>
                } */}
                {/* {props.netTotal &&
                     <div style={{display:'flex',  justifyContent:'space-between', paddingBottom:"4px"}}>
                        NET TOTAL: <span style={{fontWeight:'bold'}}>{_get(props,'currency', '') + _get(props,'netTotal','0')}</span>
                     </div>
                }
                    */}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>
                    GRAND TOTAL: <span style={{ fontWeight: 'bold' }}>{grandTotal}</span>
                </div>

                {props.totalAmountPaid &&
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>
                        TOTAL PAID: <span style={{ fontWeight: 'bold' }}>{totalAmountPaid}</span>
                    </div>
                }

                {props.changeDue == 0 ? '' :
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>
                        CHANGE:  <span style={{ fontWeight: 'bold' }}>{changeDue}</span>
                    </div>
                }

                {props.saleComment && 
                    <div style={{display:'flex',  justifyContent:'space-between', paddingBottom:"4px"}}>
                        SALE COMMENT: <span style={{fontWeight:'bold'}}>{_get(props,'saleComment', '---------')}</span>
                    </div>
                }

                {props.paymentMethods &&
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>
                        PAYMENT METHOD:
                    {_get(props, 'paymentMethods', []).map(payment => {
                            return (
                                <div style={{ display: 'flex' }}>
                                    <span style={{ fontWeight: 'bold', textAlign: "right" }}>{_get(props, 'currency', '') + _get(payment, 'paymentAmount.amount', 0)}<br />
                                        by {_get(payment, 'paymentMethod', '')}</span>
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