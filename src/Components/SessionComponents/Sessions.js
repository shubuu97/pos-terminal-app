import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import _orderBy from 'lodash/orderBy';
/* Material import */

/* Redux Imports */

/* Component Imports */
import Session from './Session';

class Sessions extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }

    render() {
        let { sessionList } = this.props;
        let sortedSessionList = _orderBy(sessionList, ['openingTimeStamp.seconds'], ['desc']);
        return (

            <div >
                {sortedSessionList.map((session, index) => 
                    <Session
                        index={index}
                        session={session}
                    />
                )} 
            </div>
        );
    }
}

export default Sessions;