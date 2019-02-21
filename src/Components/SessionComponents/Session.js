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
            <div className="session">

               <div className="mui-col-sm-4">
               left section
               </div>
               <div className="mui-col-sm-8">
               right section
               </div>
            </div>
        );
    }
}

export default Session;