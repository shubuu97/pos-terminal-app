import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Component Imports */
import HistoryView from '../Global/Components/HistoryView/HistoryView'
import NewComponent from './NewComponent'

/* 

//Todo : Array of HistoryView and pass individual rowData and extendedData.
//Todo : Dummy data for Rows and Extended.
//Todo : extendedComponent, must send CustomComponent and actionEvent.
//Todo: Dynamic classes for heading icon.
Todo: Ask Vishnu to make a default icon, If no Icon is provided.
Todo: Make a default ExtendedView if CustomComponent is not provided.

*/

let dummyRows = [
    {
        key: '0',
        date: {
            date: 'Dec 12',
            year: '2018',
        },
        heading : [
            {title: 'Event Name', content: 'SMB Updated', className: 'event-name'},
            {title: 'Transaction Time', content: '2:30pm', className: 'transaction-time'},
            {title: 'Modified By', content: 'Yogi', className: 'modified-by'},
        ],
    },
    {
        key: '1',
        date: {
            date: 'Dec 12',
            year: '2018',
        },
        heading : [
            {title: 'Event Name', content: 'SMB Updated', className: 'event-name'},
            {title: 'Transaction Time', content: '2:30pm', className: 'transaction-time'},
            {title: 'Modified By', content: 'Mak', className: 'modified-by'},
        ],
    },
    {
        key: '2',
        date: {
            date: 'Dec 12',
            year: '2018',
        },
        heading : [
            {title: 'Event Name', content: 'SMB Updated', className: 'event-name'},
            {title: 'Transaction Time', content: '2:30pm', className: 'transaction-time'},
            {title: 'Modified By', content: 'Kapil', className: 'modified-by'},
        ],
    },
]

class HistoryViewTest extends React.Component {

    constructor() {
        super();
        this.state = {
            extendedData: [],
            isFetching: true
        }
    }

    extendedComponentAction = (data, index) => {
        console.log(data, index, "extendedComponentAction")
    }

    render() {
        return (
            <div>
                <HistoryView
                    data={dummyRows}
                    extendedComponent={
                        {
                            component: NewComponent,
                            actionEvent: this.extendedComponentAction
                        }
                    }
                    isFetching={this.state.isFetching}
                />
            </div>
        );
    }
}

export default HistoryViewTest;
