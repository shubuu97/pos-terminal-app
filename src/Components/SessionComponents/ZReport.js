import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import ZReportPrintView from './ZReportPrintView';
import ReactToPrint from "react-to-print";
/* Material import */
import { connect } from 'react-redux';
import  moment  from 'moment';
import  Button  from '@material-ui/core/Button';

/* Redux Imports */

/* Component Imports */


class ZReport extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }

    render() {
        return (
            <div>
                <ZReportPrintView
                    data={this.props.data}
                    ref={el => (this.componentRef = el)}
                    showHeader={true}
                />
                
                <ReactToPrint
                    trigger={() => <div className="button-print-z"><Button  variant='contained' color="primary" type="button" value="Print" >Print</Button></div>}
                    content={() => this.componentRef}
                    onAfterPrint={this.handleClose}
                />
            </div>
        );
    }
}

function MapStateToProps(state){
    let data = {};
    let sessionData = _get(state,'sessionDataById.lookUpData');
    data.pos = _get(sessionData,'terminal.name');
    data.staff = `${_get(sessionData,'manager.person.firstName')} ${_get(sessionData,'manager.person.lastName')}`;
    data.openFrom =  moment(_get(sessionData,'session.openingTimeStamp.seconds') * 1000).format('dddd DD MMM,YYYY hh:mm A');
    data.closedAt =  _get(sessionData,'session.closingTimeStamp.seconds',0)?moment(_get(sessionData,'session.closingTimeStamp.seconds') * 1000).format('dddd DD MMM,YYYY hh:mm A'):null;
    data.openingAmount = _get(sessionData,'session.openingBalance.amount');
    data.cashSalesAmount = _get(sessionData,'session.cashSalesAmount');
    data.cardSalesAmount = _get(sessionData,'session.cardSalesAmount');
    data.employeeDeductSalesAmount = _get(sessionData,"session.employeeDeductSalesAmount",0);
    data.costCenterChargeSalesAmount = _get(sessionData,'session.costCenterChargeSalesAmount',0);
    data.loyaltySalesAmount = _get(sessionData,"session.loyaltySalesAmount",0);
    data.decliningBalanceSalesAmount = _get(sessionData,"session.decliningBalanceSalesAmount",0);
    data.giftCardSalesAmount = _get(sessionData,"session.giftCardSalesAmount",0)
    data.cashAdded = _get(sessionData,'session.cashAdded');
    data.cashRemoved = _get(sessionData,'session.cashRemoved');
    data.theoreticalClosingBalance = _get(sessionData,'session.currentBalance.amount',0);
    data.realClosingBalance = _get(sessionData,'session.closingBalance.amount',0);
    data.cashRefundAmount= _get(sessionData,"session.cashRefundAmount",0);
    data.cardRefundAmount= _get(sessionData,"session.cardRefundAmount",0);
    data.giftCardRefundAmount = _get(sessionData,"session.giftCardRefundAmount",0);
    data.diffrence = parseFloat(data.realClosingBalance) -parseFloat(data.theoreticalClosingBalance);
    console.log(data.diffrence,sessionData,data.realClosingBalance,data.theoreticalClosingBalance,"data.theoreticalClosingBalance");
    data.preTaxSalesAmount = _get(sessionData,'session.preTaxSalesAmount');
    data.taxAmount = _get(sessionData,'session.taxAmount');
    data.totalSalesAmount = _get(sessionData,'session.totalSalesAmount');
    data.totalDiscountAmount = _get(sessionData,'session.totalDiscountAmount');

    return {data}
}

export default connect(MapStateToProps)(ZReport);