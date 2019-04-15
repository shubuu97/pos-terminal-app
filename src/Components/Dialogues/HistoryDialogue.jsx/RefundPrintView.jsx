import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */
import RefundHandlePrint from './RefundHandlePrint';
/* Redux Imports */
import moment from 'moment';
import aobLogo from '../../../assets/images/aobLogodark.png';

/* Component Imports */


class RefundPrintView extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }

    componentDidUpdate(){
        debugger;
        if(this.props.print){
            debugger;
            this.props.handlePrint()
        }
    }


    render() {
        const { store, data } = this.props;

        let address = _get(store, 'store.address', '')
        let selectedOrder = _get(this.props, "selectedOrder", []);
        let storeAddress = _get(address, 'addressLine1', '') + ', ' +
            _get(address, 'addressLine2', '') + ', ' + _get(address, 'city', '') + ', ' +
            _get(address, 'state', '') + ', ' + _get(address, 'country', '') + ', ' +
            _get(address, 'postalCode', '')

        const customerName = _get(selectedOrder, 'customer.customer.firstName') + ' ' +
            _get(selectedOrder, 'customer.customer.lastName');
        // console.log(this.props.logo, 'gugfhfyfyuf');
        return (
            <div style={{ padding: "50px" }} >
                <RefundHandlePrint
                    logo={this.props.logo}
                    data={this.props.data}
                    type="Refund History"
                    cashierName={_get(selectedOrder, 'operator.person.firstName') + ' ' + _get(selectedOrder, 'operator.person.lastName')}
                    orderId={_get(data, 'id', '')}
                    currency='$'
                    saleComment={_get(data, 'reason', '')}
                    itemList={_get(data, 'returnItems', [])}
                    orderDate={moment(_get(data, 'timestamp.seconds', 0) * 1000).format('llll')}
                    storeName={_get(selectedOrder, 'store.name', '')}
                    storeAddress={storeAddress}
                    customerName={customerName}
                    terminalName={_get(selectedOrder, 'terminal.name', '')} //!this need to be change
                    itemsDiscount={0}
                    cartDiscount={0}
                    employeeDiscount={0}
                    subTotal={_get(data, 'refundSubTotal.amount', 0)}
                    totalTax={('amount' in _get(data, 'refundTaxTotal', {})) ? _get(data, 'refundTaxTotal.amount', '') : 0}
                    totalAmount={('amount' in _get(data, 'refundTotal', {})) ? _get(data, 'refundTotal.amount', '') : 0}
                    paymentMethods={_get(data, 'refunds', [])}
                />
            </div>
        );
    }
}

export default RefundPrintView;