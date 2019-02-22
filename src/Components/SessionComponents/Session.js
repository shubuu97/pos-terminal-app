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

    render() {
        let { session, index } = this.props
        return (
            <div>
            <div className="session">
                <div className="first-row">
                    <label>Thursday 4 Oct</label>
                    <label>$1,00,000,000.00</label>
                </div>
                <div className="second-row">
                    <label>04: 58 PM - 05:15 AM</label>
                </div>
            </div>
            <div className="session">
                <div className="first-row">
                    <label>Thursday 4 Oct</label>
                    <label>$1,00,000,000.00</label>
                </div>
                <div className="second-row">
                    <label>04: 58 PM - <span className="open-tag">OPEN</span></label>
                </div>
            </div>
            </div>
        );
    }
}

export default Session;