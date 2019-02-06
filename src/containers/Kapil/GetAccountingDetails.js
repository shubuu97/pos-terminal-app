import React, { Component } from 'react';
import _get from 'lodash/get';
/* Material Imports */
import BalanceSheet from './Balance'
// import Header from '../../components/Header';



class GetAccountingDetails extends Component {

    constructor() {
        super();
        this.state = {
            searchItem: '',
            index:0
        }
    }

    componentDidMount() {
        let obj = {};
        obj.Header = "start";
        obj.Rows = {};
        obj.Rows.Row = _get(BalanceSheet,"Rows.Row")
        this.balanceDataMapper(obj);
    }

    balanceDataMapper=(obj)=>
    {

        debugger;
        if(!_get(obj,"Header"))
        {
            console.log("-------------Col data is here");
            this.state.index++;
            return 
        }
       console.log(_get(obj,"Header.ColData[0].value",),"Col data is here");
    for(let i=0;i<obj.Rows.Row.length;i++)
    {
    this.balanceDataMapper(obj.Rows.Row[i]);
  
    }
    
    }

    render() {
        return (
            <React.Fragment>
              some thing
            </React.Fragment >
        )
    }
}




export default GetAccountingDetails
