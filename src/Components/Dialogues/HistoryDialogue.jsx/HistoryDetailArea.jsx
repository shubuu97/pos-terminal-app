import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import RefundHistory from './RefundHistory';
import RefundDialogue from './RefundDialogue/RefundDialogue';
/* Material import */


/* Redux Imports */

/* Component Imports */


class HistoryDetailArea extends React.Component {

    constructor() {
        super();
        this.state = {
            openRefund: false,
        }
    }

    handleRefundClose = () => {
        this.setState({ openRefund: false });
    };

    showItemList = () => {
        let saleItems = _get(this.props, "selectedSaleTransaction.sale.saleItems", []);
        let saleItemResp = saleItems.map((saleItem, index) => {
            return (<tr>
                <td>{_get(saleItem, "product.name", '')}</td>
                <td>{_get(saleItem, "qty", 0)}</td>
                <td>{_get(saleItem, "returnQty", 0)}</td>

            </tr>)
        })
        return (
            <React.Fragment>
                {saleItemResp}
            </React.Fragment>

        )

    }
    summaryPanel = () => {
        let selectedOrder = _get(this.props, "selectedSaleTransaction", []);

        return (
            <div className="mui-col-md-12 flex-column mt-10" >
                <div className='flex-row justify-space-between mb-5'>
                    <span className='summary-key'>{`Status: `}</span>
                    <span className='summary-value'>{_get(selectedOrder, 'sale.totalTaxAmount.currencyCode', '$') + _get(selectedOrder, 'sale.totalTaxAmount.amount', 0)}</span>
                </div>
                <div className='flex-row justify-space-between mb-5'>
                    <span className='summary-key'>{`Created Date: `}</span>
                    <span className='summary-value'>{_get(selectedOrder, 'sale.totalTaxAmount.currencyCode', '$') + _get(selectedOrder, 'sale.totalTaxAmount.amount', 0)}</span>
                </div>
                <div className='flex-row justify-space-between mb-5'>
                    <span className='summary-key'>{`Served By: `}</span>
                    <span className='summary-value'>{_get(selectedOrder, 'operator.person.firstName', '') + ' ' + _get(selectedOrder, 'operator.person.lastName', '')}</span>
                </div>
                <div className='flex-row justify-space-between mb-5'>
                    <span className='summary-key'>{`Tax: `}</span>
                    <span className='summary-value'>{_get(selectedOrder, 'sale.totalTaxAmount.currencyCode', '$') + _get(selectedOrder, 'sale.totalTaxAmount.amount', 0)}</span>
                </div>
                <div className='flex-row justify-space-between mb-5'>
                    <span className='summary-key'>{`Grand Total: `}</span>
                    <span className='summary-value'>{`${_get(selectedOrder, 'sale.totalAmount.currencyCode', '$')}${_get(selectedOrder, 'sale.totalAmount.amount', 0)}`}</span>
                </div>
                <div className='flex-row justify-space-between mb-5'>
                    <span className='summary-key'>{`Returned Amount: `}</span>
                    <span className='summary-value'>{_get(selectedOrder, 'sale.totalRefundAmount.currencyCode', '$') + _get(selectedOrder, 'sale.totalRefundAmount.amount', '0')}</span>
                </div>
                <div className='flex-row justify-space-between mb-5'>
                    <span className='summary-key'>{`Total Paid: `}</span>
                    <span className='summary-value'>{`${_get(selectedOrder, 'sale.totalAmountPaid.currencyCode', '$')}${_get(selectedOrder, 'sale.totalAmountPaid.amount', '0')}`}</span>
                </div>
                <div className='flex-row justify-space-between mb-5'>
                    <span className='summary-key'>{`Payment Method: `}</span>
                    <div style={{ float: 'right' }}>
                        {/* {this.showPaymentMethods(this.state.selectedOrder)} */}
                    </div>
                </div>
                <div className='flex-row justify-space-between mb-5'>
                    <span className='summary-key'>{`Change: `}</span>
                    <span className='summary-value'>{_get(selectedOrder, 'sale.changeDue.currencyCode', 0) + _get(selectedOrder, 'sale.changeDue.amount', 0).toFixed(2)}</span>
                </div>
                {/* <span className='summary-value'>{`$ ${_get(selectedOrder, 'sale.paymentAmount', '100.00')}`}</span> */}
            </div>
        )
    }

    render() {
        return (
            <div className='history-main flex-column overflow-y'>
                <div className='flex-row justify-space-between'>
                    <div className="card history-order-details">
                        <span className='card-title'>Order Details</span>
                        <div className="mui-row" style={{ paddingLeft: '5%', paddingRight: '6%' }}>
                            <table className="mui-table mui-table--bordered">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Qty</th>
                                        <th>Return Qty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.showItemList()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='order-summary-section'>
                        <div className='card order-summary'>
                            <span className='card-title'>Summary</span>
                            {this.summaryPanel()}
                        </div>
                        <div className='order-action-section flex-row'>
                            <div className='action-btn flex-row justify-center align-center'>Print</div>
                            <div className='action-btn flex-row justify-center align-center' onClick={() => { this.setState({ openRefund: true }) }}>Refund</div>
                        </div>
                    </div>
                </div>

                {/* Refund History Area */}
                {
                    <div className='refund-detail-section'>
                        <RefundHistory />
                    </div>
                }

                {/* Refund Dialogue */}
                {
                    this.state.openRefund ?
                        <RefundDialogue
                            open={this.state.openRefund}
                            handleRefundClose={this.handleRefundClose}
                            selectedSaleTransaction={this.props.selectedSaleTransaction}
                        /> : null
                }

            </div>
        );
    }
}

export default HistoryDetailArea;