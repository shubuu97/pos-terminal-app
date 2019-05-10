import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */
import HandlePrint from '../../../Global/PosFunctions/handlePrint';
/* Redux Imports */
import moment from 'moment';
import aobLogo from '../../../assets/images/aobLogodark.png';

/* Component Imports */


class OrderPrintView extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }
   
render() {
    const { store } = this.props;
    let address = _get(store, 'store.address', '')
    let selectedOrder = _get(this.props, "selectedOrder", []);
    console.log(selectedOrder, 'jguuufurdr')
    let storeAddress = _get(address, 'addressLine1', '') + ', ' +
        _get(address, 'addressLine2', '') + ', ' + _get(address, 'city', '') + ', ' +
        _get(address, 'state', '') + ', ' + _get(address, 'country', '') + ', ' +
        _get(address, 'postalCode', '')

    const customerName = _get(selectedOrder, 'customer.customer.firstName') + ' ' +
        _get(selectedOrder, 'customer.customer.lastName');
        // console.log(this.props.logo, 'gugfhfyfyuf')
    return (
        <div>
            <HandlePrint
                logo={this.props.logo}
                type="Order History"
                cashierName={_get(selectedOrder, 'operator.person.firstName') + ' ' + _get(selectedOrder, 'operator.person.lastName')}
                orderId={_get(selectedOrder, 'sale.id', '')}
                currency='$'
                saleComment={_get(selectedOrder, 'sale.saleComment', '')}
                itemList={_get(selectedOrder, 'saleParts', [])}
                orderDate={moment(_get(selectedOrder, 'sale.saleCommitTimeStamp.seconds', 0) * 1000).format('llll')}
                storeName={_get(selectedOrder, 'store.name', '')}
                storeAddress={storeAddress}
                customerName={customerName}
                terminalName={_get(selectedOrder, 'terminal.name', '')}
                itemsDiscount={_get(selectedOrder,'sale.itemDiscountAmount.amount',0)}
                cartDiscount={_get(selectedOrder, 'sale.cartDiscountAmount.amount',0)}
                employeeDiscount={_get(selectedOrder, 'sale.employeeDiscountAmount.amount', 0)}
                totalTax={_get(selectedOrder, 'sale.totalTaxAmount.amount',0)}
                totalAmount={_get(selectedOrder, 'sale.totalAmount.amount',0)}
                totalAmountPaid={_get(selectedOrder, 'sale.totalAmountPaid.amount',0)}
                changeDue={_get(selectedOrder, 'sale.changeDue.amount', '0')}
                paymentMethods={_get(selectedOrder, 'sale.payments', [])}
            />
        </div>
    );
}
}

export default OrderPrintView;