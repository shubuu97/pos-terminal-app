import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material components import */
import transactionDataFetcher from '../Global/dataFetch/transactionDataFetcher';

/* Redux Imports */


class NewComponent extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }
    //extracting Transaction id
    componentDidMount() {
    let keyValue = _get(this, 'props.data.key');
    transactionDataFetcher(this.props.dispatch,keyValue).then((data)=>
{
    
})
   }
    render() {
        let keyValue = _get(this, 'props.data.key');
        let data = _get(this, 'props.data');
        console.log(data, "New Component Data")
        return (
            <div>
                The key is {keyValue}
            </div>
        );
    }
}

export default NewComponent;