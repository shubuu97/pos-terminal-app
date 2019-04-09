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
        let saleItemResp = saleItems.map((saleItem) => {
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

        let summaryPanelContent = <div className="mui-col-md-12" style={{ paddingRight: '50px' }}>
             <label >{`Status: `}</label>
            <label style={{ float: 'right' }}>{_get(selectedOrder, 'sale.totalTaxAmount.currencyCode', '$') + _get(selectedOrder, 'sale.totalTaxAmount.amount', 0)}</label>
            <br />
            <label >{`Created Date: `}</label>
            <label style={{ float: 'right' }}>{_get(selectedOrder, 'sale.totalTaxAmount.currencyCode', '$') + _get(selectedOrder, 'sale.totalTaxAmount.amount', 0)}</label>
            <br />
            <label >{`Served By: `}</label>
            <label style={{ float: 'right' }}>{_get(selectedOrder, 'operator.person.firstName', '') +' ' +_get(selectedOrder, 'operator.person.lastName', '')}</label>
            <br />
            <label >{`Tax: `}</label>
            <label style={{ float: 'right' }}>{_get(selectedOrder, 'sale.totalTaxAmount.currencyCode', '$') + _get(selectedOrder, 'sale.totalTaxAmount.amount', 0)}</label>
            <br />
            <label >{`Grand Total: `}</label>
            <label style={{ float: 'right' }}>{`${_get(selectedOrder, 'sale.totalAmount.currencyCode', '$')}${_get(selectedOrder, 'sale.totalAmount.amount', 0)}`}</label>
            <br />
            <label >{`Returned Amount: `}</label>
            <label style={{ float: 'right' }}>{_get(selectedOrder, 'sale.totalRefundAmount.currencyCode', '$') + _get(selectedOrder, 'sale.totalRefundAmount.amount', '0')}</label>
            <br />
            <label >{`Total Paid: `}</label>
            <label style={{ float: 'right' }}>{`${_get(selectedOrder, 'sale.totalAmountPaid.currencyCode', '$')}${_get(selectedOrder, 'sale.totalAmountPaid.amount', '0')}`}</label>
            <br />
            <label >{`Payment Method: `}</label>
            <div style={{ float: 'right' }}>
                {/* {this.showPaymentMethods(this.state.selectedOrder)} */}
            </div>
            {/* <label style={{ float: 'right' }}>{`$ ${_get(selectedOrder, 'sale.paymentAmount', '100.00')}`}</label> */}
            <br />
            <br />
            <label >{`Change: `}</label>
            <label style={{ float: 'right' }}>{_get(selectedOrder, 'sale.changeDue.currencyCode', 0) + _get(selectedOrder, 'sale.changeDue.amount', 0).toFixed(2)}</label>
        </div>
        return summaryPanelContent;
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
                            <div className='action-btn flex-row justify-center align-center' onClick={()=>{this.setState({openRefund: true})}}>Refund</div>
                        </div>
                    </div>
                </div>
                <div className='refund-detail-section'>
                    <RefundHistory

                    />
                </div>

                {
                    this.state.openRefund ? 
                    <RefundDialogue
                        open={this.state.openRefund}
                        handleRefundClose={this.handleRefundClose}
                        selectedSaleTransaction = {this.props.selectedSaleTransaction}
                    /> : null
                }

            </div>
        );
    }
}

export default HistoryDetailArea;