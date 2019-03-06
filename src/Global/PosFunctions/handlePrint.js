import React from 'react';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';

const HandlePrint = (props) => {

    const saleTransaction = _get(props, 'itemList', []).map(item => {
        return (
            <tr>
                <td>{_get(item,'doc.product.name')}</td>
                <td>{_get(item,'qty', '')}</td>
                <td>{_get(item,'doc.product.salePrice.price','0')}</td>
                <td>{_get(item,'itemTotalDiscountAmount.amount','0')}</td>
                <td>{_get(item,'itemTaxAmount.amount','0')}</td>
                <td>{_get(item,'itemEffectiveTotal.amount','0')}</td>
            </tr>
        )}) 
        
    const orderHistory = _get(props, 'itemList', []).map(item => {
    console.log(item, 'vgugfy yivfu')
        return (
            <tr>
                <td>{_get(item,'product.name')}</td>
                <td>{_get(item,'saleItem.qty', '')}</td>
                <td>{_get(item,'product.salePrice.price','0')}</td>
                <td>{_get(item,'saleItem.itemTotalDiscountAmount.amount','0')}</td>
                <td>0
                    {/* {_get(item,'saleItem.itemTaxAmount.amount','0')} */}
                </td>
                <td>{_get(item,'saleItem.itemEffectiveTotal.amount','0')}
                </td>
            </tr>
        )}) 
    
    return (
        <div>
            <div>
                <h3>
                    <span>Order Date: </span>
                    <span>{_get(props,'orderDate','')}</span>
                </h3>
                <h3>
                    <span>Store Name: </span>
                    <span>{_get(props,'storeName','')}</span>
                </h3>
                <h3>
                    <span>Store Address: </span>
                    <span>{_get(props,'storeAddress','')}</span>
                </h3>
                <h3>
                    <span>Customer Name: </span>
                    <span>{_get(props,'customerName','')}</span>
                </h3>
                <h3>
                    <span>Terminal Name: </span>
                    <span>{_get(props,'terminalName','')}</span>
                </h3>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Discount</th>
                            <th>Tax</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.type == 'Sale Transaction' ? saleTransaction : orderHistory}
                    </tbody>
                </table>
            </div>
            <div>
                {props.saleComment && 
                    <h3>
                        <span>Sale Comment: </span>
                        <span>{_get(props,'saleComment', '---------')}</span>
                    </h3>
                }
                <h3>
                    <span>Items Discount: </span>
                    <span>{_get(props,'currency', '') + _get(props,'itemsDiscount','0')}</span>
                </h3>
                <h3>
                    <span>Cart Discount: </span>
                    <span>{_get(props,'currency', '') + _get(props,'cartDiscount','0')}</span>
                </h3>
                <h3>
                    <span>Employee Discount: </span>
                    <span>
                        {_get(props,'currency', '') + _get(props,'employeeDiscount','0')}
                    </span>
                </h3>
                {props.regularTotal &&
                    <h3>
                        <span>Regular Total: </span>
                        <span>{_get(props,'currency', '') + _get(props,'regularTotal','0')}</span>
                    </h3>
                }
                {props.totalDiscount &&
                    <h3>
                        <span>Total Discount: </span>
                        <span>{_get(props,'currency', '') + _get(props,'totalDiscount','0')}</span>
                    </h3>
                }
                {props.netTotal &&
                    <h3>
                        <span>Net Total: </span>
                        <span>{_get(props,'currency', '') + _get(props,'netTotal','0')}</span>
                    </h3>
                }
                <h3>
                    <span>Total Tax: </span>
                    <span>{_get(props,'currency', '') + _get(props,'totalTax','0')}</span>
                </h3>
                <h3>
                    <span>Total Amount: </span>
                    <span>{_get(props,'currency', '') + _get(props,'totalAmount','0')}</span>
                </h3>
                {props.totalAmountPaid &&
                    <h3>
                        <span>Total Amount Paid: </span>
                        <span>{_get(props,'currency', '') + _get(props,'totalAmountPaid','0')}</span>
                    </h3>
                }
                {props.changeDue &&
                    <h3>
                        <span>Change Due: </span>
                        <span>{_get(props,'currency', '') + _get(props,'changeDue','0')}</span>
                    </h3>
                }

                {props.paymentMethods &&
                    <h3>Payment Method: 
                    {_get(props,'paymentMethods',[]).map(payment => {
                        return (
                            <div style={{display: 'flex'}}>
                                <p>{_get(payment,'paymentAmount.currency','') + _get(payment,'paymentAmount.amount',0)} by&nbsp;</p> 
                                <p>{_get(payment,'paymentMethod','')}</p>
                            </div>
                        )
                    })}
                    </h3>
                }
            </div>
        </div>
    )
}

export default HandlePrint;