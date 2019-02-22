import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import moment from 'moment'
/* Material import */
/* Redux Imports */

/* Component Imports */


class Session extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }

    openOrClosed = () => {
        let { session } = this.props;
        let returnElement
        if (session.status == 'open') {
            returnElement = <span className="open-tag">OPEN</span>
        }
        else {
            let closingTime = _get(session, 'closingTimeStamp.seconds') * 1000;
            returnElement = <span>{moment(closingTime).format('hh:mm A')}</span>
        }
        return returnElement
    }
    showCurrentOrCloseBalance = ()=>{
        let { session } = this.props;
        let returnElement
        if (session.status == 'open') {
            returnElement = <span>${_get(session,'currentBalance.amount')}</span>
        }
        else {
            returnElement = <span>${_get(session,'closingBalance.amount')}</span>
        }
        return returnElement
    }
    render() {
        let { session, index } = this.props;
        let openingTime = _get(session, 'openingTimeStamp.seconds') * 1000;
        return (
            <div>
                <div className="session">
                    <div className="first-row">
                        <label>{moment(openingTime).format('dddd Do MMM')}</label>
                        <label>{this.showCurrentOrCloseBalance()}</label>
                    </div>
                    <div className="second-row">
                        <label>{moment(openingTime).format('hh:mm A')} - {this.openOrClosed()}</label>
                    </div>
                </div>
            </div>
        );
    }
}

export default Session;