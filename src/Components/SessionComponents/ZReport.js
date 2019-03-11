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
    data.closedAt =  moment(_get(sessionData,'session.closingTimeStamp.seconds') * 1000).format('dddd DD MMM,YYYY hh:mm A')||'';
    data.openingAmount = _get(sessionData,'session.openingBalance.amount');
    data.cashSalesAmount = _get(sessionData,'session.cashSalesAmount');
    data.cardSalesAmount = _get(sessionData,'session.cardSalesAmount');
    data.employeeDeductSalesAmount = _get(sessionData,'session.employeeDeductSalesAmount',0);
    data.cashAdded = _get(sessionData,'session.cashAdded');
    data.cashRemoved = _get(sessionData,'session.cashRemoved');
    data.theoreticalClosingBalance = _get(sessionData,'session.currentBalance.amount',0);
    data.realClosingBalance = _get(sessionData,'session.closingBalance.amount');
    data.diffrence = parseFloat(data.realClosingBalance) -parseFloat(data.theoreticalClosingBalance);
    return {data}
}

export default connect(MapStateToProps)(ZReport);