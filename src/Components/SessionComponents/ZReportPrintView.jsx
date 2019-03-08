import React from 'react';
import _get from 'lodash/get';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import get from 'lodash/get'

class ZReportPrintView extends React.Component {


    render() {

        return (
            <div className="z-report-dialog">
                <div>
                    <h3> #Session </h3>
                    <div className="row">
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-left" >POS</label>
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-right" >{get(this.props, 'data.pos', '')}</label>
                    </div>
                    <div className="row">
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-left" >Staff</label>
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-right" >{get(this.props, 'data.staff', '')}</label>
                    </div>
                    <div className="row">
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-left" >Opened</label>
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-right" >{get(this.props, 'data.openFrom', '')}</label>
                    </div>
                    <div className="row">
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-left" >Closed</label>
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-right" >{get(this.props, 'data.closedAt', '')}</label>
                    </div>
                </div>

                <div>
                    <h3> #Transaction </h3>
                    <div className="row">
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-left" >Opening Amount</label>
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-right" >{get(this.props, 'data.openingAmount', 0)}</label>
                    </div>
                    <div className="row">
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-left" >Cash Sales</label>
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-right" >{get(this.props, 'data.cashSales', 0)}</label>
                    </div>
                    <div className="row">
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-left" >Cash Added</label>
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-right" >{get(this.props, 'data.cashAdded', 0)}</label>
                    </div>
                    <div className="row">
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-left" >Cash Removed</label>
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-right" >{get(this.props, 'data.cashRemoved', 0)}</label>
                    </div>
                    <div className="row">
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-left" >Theoretical Closing Balance</label>
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-right" >{get(this.props, 'data.theoreticalClosingBalance', 0)}</label>
                    </div>
                    <div className="row">
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-left" >Real Closing Balance</label>
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-right" >{get(this.props, 'data.realClosingBalance', 0)}</label>
                    </div>
                    <div className="row">
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-left" >Difference</label>
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-right" >{get(this.props, 'data.difference', 0)}</label>
                    </div>
                </div>

                <div>
                    <h3> #Sales </h3>
                    <div className="row">
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-left" >Total Pre Tax Sales</label>
                        <label style={{ marginLeft: "30px", marginRight: "30px" }}className="labelmain pull-right" >{get(this.props, 'data.totalPreTaxSales', 0)}</label>
                    </div>
                    <div className="row">
                        <label style={{ marginLeft: "30px", marginRight: "30px" }}className="labelmain pull-left" >Tax</label>
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-right" >{get(this.props, 'data.tax', 0)}</label>
                    </div>
                    <div className="row">
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-left" >Total Sales</label>
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-right" >{get(this.props, 'data.totalSales', 0)}</label>
                    </div>
                    <div className="row">
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-left" >Discount</label>
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-right" >{get(this.props, 'data.discount', 0)}</label>
                    </div>
                    <div className="row">
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-left" >Refund</label>
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-right" >{get(this.props, 'data.refund', 0)}</label>
                    </div>
                    <div className="row">
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-left" >Void</label>
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-right" >{get(this.props, 'data.void', 0)}</label>
                    </div>
                </div>

                <div>
                    <h3> #Payment </h3>
                    <div className="row">
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-left" >Cash Payment</label>
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-right" >{get(this.props, 'data.cashSalesAmount', 0)}</label>
                    </div>
                    <div className="row">
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-left" >Credit/Debit Card</label>
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-right" >{get(this.props, 'data.cardSalesAmount', 0)}</label>
                    </div>
                    <div className="row">
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-left" >Employee Payroll Deduct</label>
                        <label style={{ marginLeft: "30px", marginRight: "30px" }} className="labelmain pull-right" >{get(this.props, 'data.employeeDeductSalesAmount', 0)}</label>
                    </div>
                </div>
            </div>

        );
    }
}

export default ZReportPrintView;