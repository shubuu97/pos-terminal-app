import React from 'react';
import _get from 'lodash/get';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import logo from '../../assets/images/aobLogodark.png';
import dineroObj from '../../Global/PosFunctions/dineroObj';

class ZReportPrintView extends React.Component {


    render() {
        return (
            <div style={{ fontSize: "12px", fontFamily: "arial, sans-serif", padding: "50px" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{marginBottom: "10px"}} className="store-logo"> <img src={logo}/></div>
                    <div style={{ display: 'flex', flex: '1', flexDirection: 'column', borderBottom: 'solid 1px #9e9e9e', paddingTop: "10px", paddingBottom: "5px" }}>
                        <h3 style={{marginBottom: "20px"}}><u>#Session</u></h3>

                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>POS:<span style={{ fontWeight: 'bold' }}>{_get(this.props, 'data.pos', '')}</span></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>Staff:<span style={{ fontWeight: 'bold' }}>{_get(this.props, 'data.staff', '')}</span></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>Opened:<span style={{ fontWeight: 'bold' }}>{_get(this.props, 'data.openFrom', '')}</span></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>Closed:<span style={{ fontWeight: 'bold' }}> {_get(this.props, 'data.closedAt', '')}</span></div>
                    </div>

                    <div style={{borderBottom: 'solid 1px #9e9e9e', paddingBottom: '30px'}}>
                        <h3 style={{marginBottom: "20px"}}><u>#Transaction</u></h3>

                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>Opening Amount:<span style={{fontWeight: 'bold' }}> {dineroObj(_get(this.props, 'data.openingAmount', 0)).toFormat('$0,0.00')}</span></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>Cash Sales:<span style={{fontWeight: 'bold' }}> {dineroObj(_get(this.props, 'data.cashSalesAmount', 0)).toFormat('$0,0.00')}</span></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>Cash Added:<span style={{fontWeight: 'bold' }}> {dineroObj(_get(this.props, 'data.cashAdded', 0)).toFormat('$0,0.00')}</span></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>Cash Removed:<span style={{fontWeight: 'bold' }}> {dineroObj(_get(this.props, 'data.cashRemoved', 0)).toFormat('$0,0.00')}</span></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>Theoretical Closing Balance:<span style={{fontWeight: 'bold' }}>{dineroObj(_get(this.props, 'data.theoreticalClosingBalance', 0)).toFormat('$0,0.00')}</span></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>Real Closing Balance:<span style={{fontWeight: 'bold' }}>{dineroObj(_get(this.props, 'data.realClosingBalance', 0)).toFormat('$0,0.00')}
                        </span></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>Difference:<span style={{fontWeight: 'bold' }}> {dineroObj(_get(this.props, 'data.diffrence', 0)).toFormat('$0,0.00')}</span></div>
                    </div>

                    <div style={{borderBottom: 'solid 1px #9e9e9e', paddingBottom: '30px'}}>
                        <h3 style={{marginBottom: "20px"}}><u>#Sales</u></h3>

                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>Total Pre Tax Sales:<span style={{fontWeight: 'bold' }}> {dineroObj(_get(this.props, 'data.preTaxSalesAmount', 0)).toFormat('$0,0.00')}
                        </span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>Tax:<span style={{fontWeight: 'bold' }}> {dineroObj(_get(this.props, 'data.taxAmount', 0)).toFormat('$0,0.00')}</span></div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>Total Sales:<span style={{fontWeight: 'bold' }}> {dineroObj(_get(this.props, 'data.totalSalesAmount', 0)).toFormat('$0,0.00')}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>Discounts:<span style={{fontWeight: 'bold' }}> {dineroObj(_get(this.props, 'data.totalDiscountAmount', 0)).toFormat('$0,0.00')}</span></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>Cash Refund:<span style={{fontWeight: 'bold' }}> {dineroObj(_get(this.props, 'data.cashRefundAmount', 0)).toFormat('$0,0.00')}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>Card Refund:<span style={{fontWeight: 'bold' }}> {dineroObj(_get(this.props, 'data.cardRefundAmount', 0)).toFormat('$0,0.00')}</span></div>
                        {_get(this.props, 'data.giftCardRefundAmount', 0)!=0?<div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>Gift Card Refund:<span style={{fontWeight: 'bold' }}> {dineroObj(_get(this.props, 'data.giftCardRefundAmount', 0)).toFormat('$0,0.00')}</span></div>:null}


    {/* `                   <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>Void:<span style={{fontWeight: 'bold' }}> {_get(this.props, 'data.void', 0).toFixed(2)}</span></div> */}

                        {/* <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>Difference:<span style={{fontWeight: 'bold' }}> {_get(this.props, 'data.difference', 0).toFixed(2)}</span></div> */}
                    </div>

                    <div style={{borderBottom: 'solid 1px #9e9e9e', paddingBottom: '30px'}}>
                        <h3 style={{marginBottom: "20px"}}><u>#Payment</u></h3>

                        {_get(this.props, 'data.cashSalesAmount', 0)!==0?<div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>Cash Payment:<span style={{fontWeight: 'bold' }}> {dineroObj(_get(this.props, 'data.cashSalesAmount', 0)).toFormat('$0,0.00')}</span></div>:null}
                        {_get(this.props, 'data.cardSalesAmount', 0)!==0?<div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>Credit/Debit Card:<span style={{fontWeight: 'bold' }}> {dineroObj(_get(this.props, 'data.cardSalesAmount', 0)).toFormat('$0,0.00')}</span></div>:null}
                        {_get(this.props, 'data.employeeDeductSalesAmount', 0)!==0?<div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>Employee Deduct:<span style={{fontWeight: 'bold' }}> {dineroObj(_get(this.props, 'data.employeeDeductSalesAmount', 0)).toFormat('$0,0.00')}</span></div>:null}
                        {_get(this.props, 'data.costCenterChargeSalesAmount', 0)!==0?<div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>Cost Center Charge:<span style={{fontWeight: 'bold' }}> {dineroObj(_get(this.props, 'data.costCenterChargeSalesAmount', 0)).toFormat('$0,0.00')}</span></div>:null}
                        {_get(this.props, 'data.loyaltySalesAmount', 0)!==0?<div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>Loyalty:<span style={{fontWeight: 'bold' }}> {dineroObj(_get(this.props, 'data.loyaltySalesAmount', 0)).toFormat('$0,0.00')}</span></div>:null}
                        {_get(this.props, 'data.decliningBalanceSalesAmount', 0)!==0?<div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>Declining Balance:<span style={{fontWeight: 'bold' }}> {dineroObj(_get(this.props, 'data.decliningBalanceSalesAmount', 0)).toFormat('$0,0.00')}</span></div>:null}
                        {_get(this.props, 'data.giftCardSalesAmount', 0)!==0?<div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: "4px" }}>Gift Card:<span style={{fontWeight: 'bold' }}> {dineroObj(_get(this.props, 'data.giftCardSalesAmount', 0)).toFormat('$0,0.00')}</span></div>:null}
                    </div>
            </div>
        </div>
        );
    }
}

export default ZReportPrintView;