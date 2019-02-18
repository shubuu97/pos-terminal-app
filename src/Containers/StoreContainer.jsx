import React from 'react';
import {connect} from 'react-redux';
import genericPostData from '../Global/dataFetch/genericPostData';



class StoreContainer extends React.Component {
    constructor(props) {
        super(props);
         this.state = {
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
                init:'store_init',
                success:'store_success',
                error:'store_error'
            },
            identifier:'store',
            successCb:this.afterStoreSuccess,
            errorCb:()=>this.setState({isFetching:false})
        })

    }
    afterStoreSuccess=(data)=>
    {
    console.log(data,"data is here")
    }
    render() {

        return (
            <div>
                this is dfjd
             </div>
        )
    }

}

function mapStateToProps(state) {

}

export default connect(mapStateToProps)(StoreContainer);
