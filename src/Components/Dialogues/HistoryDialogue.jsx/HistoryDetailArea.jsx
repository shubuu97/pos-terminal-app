import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import RefundHistory from './RefundHistory';
/* Material import */

/* Redux Imports */

/* Component Imports */


class HistoryDetailArea extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }

    showItemList = () => {
        let saleItems = _get(this.props, "selectedSaleTransaction.sale.saleItems",[]);
        let saleItemResp = saleItems.map((saleItem) => {
            return(<tr>
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
                        </div>
                        <div className='order-action-section flex-row'>
                            <div className='action-btn flex-row justify-center align-center'>Print</div>
                            <div className='action-btn flex-row justify-center align-center'>Refund</div>
                        </div>
                    </div>
                </div>
                <div className='refund-detail-section'>
                    <RefundHistory
                    
                    />
                </div>

            </div>
        );
    }
}

export default HistoryDetailArea;