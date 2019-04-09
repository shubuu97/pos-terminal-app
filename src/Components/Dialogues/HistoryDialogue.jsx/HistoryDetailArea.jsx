import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */

/* Redux Imports */

/* Component Imports */


class HistoryDetailArea extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }

    showItemList = () => {

        return (
            <React.Fragment>
                <tr>
                    <td>Dummy Cell 1-1</td>
                    <td>Dummy Cell 1-2</td>
                    <td>Dummy Cell 1-2</td>
                </tr>
                <tr>
                    <td>Dummy Cell 1-1</td>
                    <td>Dummy Cell 1-2</td>
                    <td>Dummy Cell 1-2</td>
                </tr>
                <tr>
                    <td>Dummy Cell 1-1</td>
                    <td>Dummy Cell 1-2</td>
                    <td>Dummy Cell 1-2</td>
                </tr>
            </React.Fragment>

        )

    }

    render() {
        return (
            <div className='history-main flex-column'>
                <div className='flex-row justify-space-between'>
                    <div className="card history-order-details">
                        <span className='card-title'>Order Details</span>
                        <div className="mui-row" style={{ paddingLeft: '5%', paddingRight: '6%' }}>
                            <table className="mui-table mui-table--bordered">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Qty</th>
                                        <th>Return Qty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.showItemList()}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className='card order-summary'>
                        <span className='card-title'>Summary</span>
                    </div>


                </div>

            </div>
        );
    }
}

export default HistoryDetailArea;