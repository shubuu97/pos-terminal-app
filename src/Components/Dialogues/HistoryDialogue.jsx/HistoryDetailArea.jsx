import React from 'react';
import moment from "moment";
import ReactToPrint from 'react-to-print';
/* Lodash Imports */
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import RefundHistory from './RefundHistory';
import RefundDialogue from './RefundDialogue/RefundDialogue';
/* Material import */
import HandlePrint from '../../../Global/PosFunctions/handlePrint';
import aobLogo from '../../../assets/images/aobLogodark.png';
import { connect } from 'react-redux';
import OrderPrintView from './OrderPrintView';
import Dinero from 'dinero.js';
import SyncIcon from '@material-ui/icons/Sync';

let DineroInit = (amount, currency, precision) => (
    Dinero({amount:  parseInt(amount) || 0, currency: currency || 'USD', precision: precision || 2})
)
class HistoryDetailArea extends React.Component {

    constructor() {
        super();
        this.state = {
            openRefund: false,
        }
    }
    componentDidMount() {
        let logo
        if (localStorage.getItem('storeLogo')) {
            logo = localStorage.getItem('storeLogo')
        } else {
            logo = aobLogo
        }
        this.setState({ logo })

    }
    handleRefundClose = () => {
        this.setState({ openRefund: false });
    };

    showItemList = () => {
        let saleItems = _get(this.props, "selectedSaleTransaction.sale.saleItems", []);
        const showSyncStatus  = status => {
            let statusColour = ''
            if(status == 0) {
                statusColour = 'Yellow'
            } else if(status == 1 || status == 2) {
                statusColour = 'Green'
            } else if(status == 3) {
                statusColour = 'Red'
            }
            return <SyncIcon style={{color: statusColour}} />
        }
        let saleItemResp = saleItems.map((saleItem, index) => {
            let totalDiscount = _get(saleItem,'cartDiscountTotal.amount',0) + _get(saleItem,'employeeDiscountTotal.amount',0) + _get(saleItem,'itemDiscountTotal.amount',0)
            return (<tr>
                <td style={{maxWidth: '70px'}}>{_get(saleItem, "product.name", '')}</td>
                <td>
                    <div><span>Ordered: </span><span>{_get(saleItem, "qty", 0)}</span></div>
                    <div><span>Returned:</span> <span>{_get(saleItem, "returnQty", 0)}</span></div>
                </td>
                <td>{DineroInit(_get(saleItem,'product.salePrice.amount',0)).toFormat('$0,0.00')}</td>
                <td>{DineroInit(totalDiscount).toFormat('$0,0.00')}<br />
                
                    {_get(saleItem,'cartDiscountTotal.amount',0) > 0 ? 
                     <span>Cart: {DineroInit(_get(saleItem,'cartDiscountTotal.amount',0)).toFormat('$0,0.00')}</span> : ''
                    }

                    &nbsp;&nbsp;

                    {_get(saleItem,'itemDiscountTotal.amount',0) > 0 ? <span>Item: {DineroInit(_get(saleItem,'itemDiscountTotal.amount',0)).toFormat('$0,0.00')}</span> : ''
                    }
                    
                    &nbsp;&nbsp;
                    {_get(saleItem,'employeeDiscountTotal.amount',0) ? <span>Emp: {DineroInit(_get(saleItem,'employeeDiscountTotal.amount',0)).toFormat('$0,0.00')}</span> : ''}
                
                </td>
                <td>{DineroInit(_get(saleItem,'itemSubTotal.amount',0)).toFormat('$0,0.00')}</td>
                <td>{DineroInit(_get(saleItem,'itemTaxAmount.amount',0)).toFormat('$0,0.00')}</td>
                <td>{DineroInit(_get(saleItem,'itemEffectiveTotal.amount',0)).toFormat('$0,0.00')}</td>
                <td>{showSyncStatus(_get(saleItem,'itemPackage.syncStatus',0))}</td>
            </tr>)
        })
        return (
            <React.Fragment>
                {saleItemResp}
            </React.Fragment>

        )

    }
    paymentMethods = (num) => {
        let method
        switch (num) {
            case 0:
                method = 'Cash'
                break;
            case 1:
                method = 'Card'
                break;
            case 2:
                method = 'Gift Card'
                break;
            case 3:
                method = 'Cost Center Charge'
                break;
            case 4:
                method = 'Employee'
                break;
            case 5:
                method = 'Loyalty'
                break;
                case 6:
                method = 'Declining Balance'
                break;
        }

        return method
    }
    showPaymentMethods = () => {
        const paymentMethodsView = _get(this.props.selectedSaleTransaction, 'sale.payments', []).map((payment) => (
            <div className='flex-row justify-space-between mb-5'>
                <span className='summary-key'>{this.paymentMethods(_get(payment, 'paymentMethod', 0))}</span>
                <span className='summary-value'>
                {(DineroInit(_get(payment, 'paymentAmount.amount', 0), _get(payment, 'paymentAmount.currency', 'USD'))).toFormat('$0,0.00')}
                </span>
            </div>
        ))
        return (
            <React.Fragment>
                {paymentMethodsView}
            </React.Fragment>
        )
    }
    summaryPanel = () => {
        let selectedOrder = _get(this.props, "selectedSaleTransaction", []);
        return (
            <div className="mui-col-md-12 flex-column mt-10" >
                {/* <div className='flex-row justify-space-between mb-5'>
                    <span className='summary-key'>{`Created Date: `}</span>
                    <span className='summary-value'>{moment(_get(selectedOrder, 'sale.saleCommitTimeStamp.seconds', 0) * 1000).format('MM/DD/YYYY h:mm a')}</span>
                </div>
                <div className='flex-row justify-space-between mb-5'>
                    <span className='summary-key'>{`Served By: `}</span>
                    <span className='summary-value'>{_get(selectedOrder, 'operator.person.firstName', '') + ' ' + _get(selectedOrder, 'operator.person.lastName', '')}</span>
                </div> */}
                {
                    (_get(selectedOrder, 'sale.cartDiscountAmount.amount', 0) + _get(selectedOrder, 'sale.employeeDiscountAmount.amount', 0) + _get(selectedOrder, 'sale.itemDiscountAmount.amount', 0)) > 0 ?
                        <div className='flex-row justify-space-between mb-5'>
                            <span className='summary-key'>{`Discounts: `}</span>
                            <span className='summary-value'>{(_get(selectedOrder, 'sale.cartDiscountAmount.currencyCode', '$') + (_get(selectedOrder, 'sale.cartDiscountAmount.amount', 0)/100 + _get(selectedOrder, 'sale.employeeDiscountAmount.amount', 0)/100 + _get(selectedOrder, 'sale.itemDiscountAmount.amount', 0)/100).toFixed(2))}</span>
                        </div> : null
                }
                <div className='flex-row justify-space-between mb-5'>
                    <span className='summary-key'>{`Tax: `}</span>
                    <span className='summary-value'>
                    {(DineroInit(_get(selectedOrder, 'sale.totalTaxAmount.amount', 0), _get(selectedOrder, 'sale.totalTaxAmount.currency', 'USD'))).toFormat('$0,0.00')}
                    </span>
                </div>
                <div className='flex-row justify-space-between mb-5'>
                    <span className='summary-key'>{`Grand Total: `}</span>
                    <span className='summary-value'>
                    {(DineroInit(_get(selectedOrder, 'sale.totalAmount.amount', 0), _get(selectedOrder, 'sale.totalAmount.currency', 'USD'))).toFormat('$0,0.00')}
                    </span>
                </div>
                <div className='flex-row justify-space-between mb-5'>
                    <span className='summary-key'>{`Returned Amount: `}</span>
                    <span className='summary-value'>
                    {(DineroInit(this.calcReturnedAmountTotal(), _get(selectedOrder, 'sale.totalRefundAmount.currency', 'USD'))).toFormat('$0,0.00')}
                    </span>
                </div>
                <div className='flex-row justify-space-between mb-5'>
                    <span className='summary-key'>{`Total Paid: `}</span>
                    <span className='summary-value'>
                    {(DineroInit(_get(selectedOrder, 'sale.totalAmountPaid.amount', 0), _get(selectedOrder, 'sale.totalAmountPaid.currency', 'USD'))).toFormat('$0,0.00')}
                    </span>
                </div>
                <div className='flex-row justify-space-between mb-5'>
                    <span className='summary-key'>{`Change: `}</span>
                    <span className='summary-value'>
                    {(DineroInit(_get(selectedOrder, 'sale.changeDue.amount', 0), _get(selectedOrder, 'sale.changeDue.currency', 'USD'))).toFormat('$0,0.00')}
                    </span>
                </div>
                <div className="flex-column">
                    <span>Payment Methods</span>
                    {this.showPaymentMethods()}
                </div>


                {/* <span className='summary-value'>{`$ ${_get(selectedOrder, 'sale.paymentAmount', '100.00')}`}</span> */}
            </div>
        )
    }
    makePrintContent = () => {

        let printArea =

            console.log(printArea, "printAreaprintArea");
        return ("printarea")
    }
    makeIframeContent = () => {
        return (<iframe id="ifmcontentstoprint" style={{
            height: '0px',
            width: '0px',
            position: 'absolute'
        }}></iframe>
        )

    }
    handlePrint = () => {
        var content = this.makePrintContent();
        var pri = this.makeIframeContent().contentWindow;
        console.log(pri, content, "contentpri")

        // pri.document.open();
        // pri.document.write(content.innerHTML);
        // pri.document.close();
        // pri.focus();
        // pri.print();
    }
    calcReturnedAmountTotal = () => {
        let returns = _get(this.props, "selectedSaleTransaction.sale.returns", []);
        let TotalRefundAmount = returns.reduce((acc, returnObj) => {
            return (acc + returnObj.refundTotal.amount)
        }, 0);
        return TotalRefundAmount;

    }

    everyQtyReturned = () => {
        let saleItems = _get(this.props, "selectedSaleTransaction.sale.saleItems", []);
        saleItems = saleItems.filter((saleItem, index) => {
            if (saleItem.saleType == 2) {
                return false
            }
            return true
        })
        let everyQtyReturned = saleItems.every((saleItem, index) => {
            let returnableQty = _get(saleItem, "qty", 0) - _get(saleItem, "returnQty", 0)
            if (returnableQty > 0) {
                return false
            }
            return true
        });
        return everyQtyReturned
    }

    render() {
        const { store } = this.props;
        let selectedOrder = _get(this.props, "selectedSaleTransaction", []);
        return (
            <div className='history-main flex-column overflow-y'>
                <span className='order-summary-title'>Order #{_get(selectedOrder,'sale.id','')}</span>
                <div className="order-summary-header">
                    <div style={{margin: '10px'}}>
                        <div>
                            <span className='summary-key'>{`Created Date: `}</span>
                            <span className='summary-value'>{moment(_get(this.props.selectedSaleTransaction, 'sale.saleCommitTimeStamp.seconds', 0) * 1000).format('MM/DD/YYYY h:mm a')}</span>
                        </div>
                    
                        <div>
                            <span className='summary-key'>{`Served By: `}</span>
                            <span className='summary-value'>{_get(this.props.selectedSaleTransaction, 'operator.person.firstName', '') + ' ' + _get(this.props.selectedSaleTransaction, 'operator.person.lastName', '')}</span>
                        </div> 
                    </div>

                    <div className='order-action-section flex-row'>
                        <ReactToPrint
                            trigger={() => <div className='action-btn flex-row justify-center align-center'>Re-Print</div>}
                            content={() => this.printElementRef}
                        />
                        <div className={this.everyQtyReturned() ? 'disable-button action-btn flex-row justify-center align-center' : ' action-btn flex-row justify-center align-center'} onClick={() => { this.setState({ openRefund: true }) }}>Refund</div>
                    </div> 
                </div>
                    
                <div className="card history-order-details">
                    <div style={{ paddingLeft: '3%', paddingRight: '4%' }}>
                        <table className="mui-table mui-table--bordered">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Discount</th>
                                    <th>Subtotal</th>
                                    <th>Tax</th>
                                    <th>Total</th>
                                    <th>Sync Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.showItemList()}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex-row justify-space-between" style={{marginTop: '20px'}}>
                    <div className='order-summary-section'>
                        <span className='order-summary-title'>Summary</span>
                        <div className='card order-summary'>
                            {this.summaryPanel()}
                        </div>
                    </div>

                {/* Refund History Area */}
                    <div className="refund-history-section">
                        {_isEmpty(_get(selectedOrder.sale, 'returns')) ? '' : 
                        <span className='order-summary-title'> Refund History</span>}
                        {_get(selectedOrder.sale, 'returns', []).map(returnData => {
                            return <div className='refund-detail-section'>
                                <RefundHistory
                                    store={store}
                                    selectedOrder={selectedOrder}
                                    logo={this.state.logo}
                                    data={returnData} />
                            </div>
                        })
                        }
                    </div>
                </div>

                {/* Refund Dialogue */}
                {
                    this.state.openRefund ?
                        <RefundDialogue
                            open={this.state.openRefund}
                            handleRefundClose={this.handleRefundClose}
                            handleHistoryClose={this.props.handleHistoryClose}
                            selectedSaleTransaction={this.props.selectedSaleTransaction}
                            logo={this.state.logo}
                        /> : null
                }
                <div style={{ display: "none" }}>
                    <OrderPrintView
                        ref={el => this.printElementRef = el}
                        store={store}
                        selectedOrder={selectedOrder}
                        logo={this.state.logo}
                    />
                </div>
            </div>
        );
    }
}
function mapStateToProps(state) {
    let { customerSalesList, storeData } = state;
    let salesList = customerSalesList.lookUpData || [];
    let store = storeData.lookUpData || {};

    return {
        salesList,
        store
    }
}

export default connect(mapStateToProps)(HistoryDetailArea);
