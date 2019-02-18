import React from 'react';
import {connect} from 'react-redux';
import genericPostData from '../Global/dataFetch/genericPostData';
import _get from 'lodash/get';
import Select from '@material-ui/core/Select';


class StoreContainer extends React.Component {
    constructor(props) {
        super(props);
         this.state = {
            terminals:[]
        };
     
    }

    handleSubmit = () => {
        // // this.redirectToPOS = true;
        // this.isSubmitted = true;
        // const { dispatch, storesReducer } = this.props;
        // let loginData = {
        //     operatorId: localStorage.getItem('userId'),
        //     terminalId: localStorage.getItem('terminalId'),
        //     type: 'login'
        // }
        // dispatch(postPOSLogin(storesReducer, loginData))
        // this.forceUpdate();
    }
    onSelectTerminal = (index, terminal) => {
        // this.selectedTerminalIndex = index;
        // localStorage.setItem('terminalId',terminal.id);
        // localStorage.setItem('terminalName',terminal.name);

        // let terminalObj = _find(this.props.terminalData, { 'name': terminal.name });
        // console.log(terminalObj,this.selectedTerminalIndex,"termianal obj is here")
        // this.selectedTerminalId = _get(terminalObj, 'id', '');
        // this.isPosDisable = false;
        // this.forceUpdate();
    }
    componentDidMount() {
      
        genericPostData({
            dispatch:this.props.dispatch,
            reqObj:{ id: localStorage.getItem('storeId')},
            url:'Store/AllData',
            constants:{
                init:'GET_STORE_DATA_init',
                success:'GET_STORE_DATA_success',
                error:'GET_STORE_DATA_error'
            },
            identifier:'GET_STORE_DATA',
            successCb:this.afterStoreSuccess,
            errorCb:()=>this.setState({isFetching:false})
        })

    }
    afterStoreSuccess=(data)=>
    {
    this.setState({terminals:_get(data,'terminals')})
    }
    handleChange = (terminal)=>
    {

    }
    mapTermainal=()=>
    {
       this.state.terminals.map((terminal)=>
    {
        return <option value ={terminal}>{terminal.name}</option>
    })
    }
    render() {

        return (
            <div>
              <Select
            native
            value={this.state.terminal}
            onChange={this.handleChange}
          >
           {this.mapTermainal()}
          </Select>

             </div>
        )
    }

}

function mapStateToProps(state) {

}

export default connect(mapStateToProps)(StoreContainer);
