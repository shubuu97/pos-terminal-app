import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material components import */

/* Redux Imports */


class Extended extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }

    render() {
        let ExtendedComponent = this.props.extendedComponent
        return (
            <ExtendedComponent {...this.props}/>
        );
    }
}

export default Extended;
