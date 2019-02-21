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
                session will come here
            </div>
        );
    }
}

export default Session;