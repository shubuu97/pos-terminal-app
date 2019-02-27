import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */

/* Redux Imports */ 

/* Component Imports */
import Transactions from '../Components/OfllineTransaction/Transactions';


class OfflineTransactionContainer extends React.Component {

    constructor(){
        super();
        this.state = {
            
        }
    }
    
    render() {
        return (
            <div>
               <Transactions/>
            </div>
        );
    }
}

export default OfflineTransactionContainer;