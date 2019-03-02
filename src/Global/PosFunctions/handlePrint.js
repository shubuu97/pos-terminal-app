import React from 'react';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';

const HandlePrint = (props) => {
    const orderList = _get(props, 'itemList', []).map(item => {
        return (
            <tr>
                <td>{_get(item,'doc.product.name')}</td>
                <td>{_get(item,'qty', '')}</td>
                <td>
                    {_get(props,'currency', '') + _get(item,'itemRegularTotal.amount','0')}
                </td>
                <td>
                    {_get(props,'currency','') + _get(item,'itemTotalDiscountAmount.amount','0')}
                </td>
                <td>
                    {_get(props,'currency', '') + _get(item,'itemTaxAmount.amount','0')}
                </td>
                <td>
                    {_get(props,'currency', '') + _get(item,'itemEffectiveTotal.amount','0')}
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
                        {orderList}
                    </tbody>
                </table>
            </div>
            <div>
                {props.saleComment == '' ? '' : 
                    <h3>
                        <span>Sale Comment: </span>
                        <span>{_get(props,'saleComment', '')}</span>
                    </h3>
                }
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
                <h3>
                    <span>Regular Total: </span>
                    <span>{_get(props,'currency', '') + _get(props,'regularTotal','0')}</span>
                </h3>
                <h3>
                    <span>Total Discount: </span>
                    <span>{_get(props,'currency', '') + _get(props,'totalDiscount','0')}</span>
                </h3>
                <h3>
                    <span>Net Total: </span>
                    <span>{_get(props,'currency', '') + _get(props,'netTotal','0')}</span>
                </h3>
                <h3>
                    <span>Total Tax: </span>
                    <span>{_get(props,'currency', '') + _get(props,'totalTax','0')}</span>
                </h3>
                <h3>
                    <span>Total Amount: </span>
                    <span>{_get(props,'currency', '') + _get(props,'totalAmount','0')}</span>
                </h3>
            </div>
        </div>
    )
}

export default HandlePrint;