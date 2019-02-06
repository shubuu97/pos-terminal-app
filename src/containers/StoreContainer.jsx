import React from 'react';
import Redirect from "react-router/Redirect";
import Jumbotron from 'react-bootstrap/lib/Jumbotron';
import Button from "react-bootstrap/lib/Button";
import FormGroup from "react-bootstrap/lib/FormGroup";
import FormControl from "react-bootstrap/lib/FormControl";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import "bootstrap/dist/css/bootstrap.css";
import { categoryData } from '../constants/categoryData';
import SaveButton from '../components/common/SaveButton.jsx'
import { fetchStore, fetchTerminal, postPOSLogin } from '../actions/store';
import {fetchRewardEarnRule} from '../actions/products';
import AutoComplete from '../components/Elements/AutoComplete.jsx';
import connect from 'react-redux/lib/connect/connect';
import _get from 'lodash/get';
import _set from 'lodash/set';
import _isEmpty from 'lodash/isEmpty';
import _find from 'lodash/find';
import Alert from 'react-s-alert';

import logologin from '../assets/images/logo-main.jpg';
import {
    RECEIVED_STORE,
    RECEIVED_STORE_ERROR,
    REQUEST_STORE,
    REQUEST_TERMINAL,
    RECEIVED_TERMINAL,
    RECEIVED_TERMINAL_ERROR,
    REQUEST_POS_LOGIN,
    RECEIVED_POS_LOGIN
  
  } from '../constants/store';

// import Category from './category';


class StoreContainer extends React.Component {
    constructor(props) {
        super(props);

        this.handleToggle = this.handleToggle.bind(this);

        this.state = {
            activeKey: '1',
            activeMenuIndex: 0,
            activeSubMenuIndex: 0,
            show: false,
        };
        this.redirectToPOS = false;
        this.stores = ['1','2']
        //     {value:'1', displayText:'store1'},
        //     {value:'2', displayText:'store2'},
        // ];
        this.terminals = []
    //         {value:'3', displayText:'term1'},
    //     {value:'4', displayText:'term2'},
    // ];
        this.selectedIndex = '';
        this.selectedTerminalIndex = '';
        this.fetchEarnRulesFlag = false;
        this.isPosDisable = true;
        this.storeData = {};
        this.selectedStore = '';
        this.selectedTerminalId = '';
        this.terminalUrl = '';
        this.isSubmitted = false;
    }

    handleToggle() {
        this.setState({ show: !this.state.show });
    }

    handleSubmit = () => {
        // this.redirectToPOS = true;
        this.isSubmitted = true;
        const {dispatch, storesReducer} = this.props;
        let loginData = {
            salesExecutive: this.props.userId,
            terminal: this.selectedTerminalId,
            type: 'login'
        }
        localStorage.setItem('terminalID',this.selectedTerminalId);
        dispatch(postPOSLogin(storesReducer, loginData))
        this.forceUpdate();
    }

    onSelectItem = (index, store) => {
        this.selectedIndex = index;
        this.selectedStore = store;
        const { dispatch, storesReducer } = this.props;
        let storeObj = _find(this.props.storeData.stores,{'storeName':this.selectedStore});
        localStorage.setItem('storeID',storeObj.id);
        this.terminalUrl += "/"+_get(storeObj,'id','');
        dispatch(fetchTerminal(storesReducer,this.terminalUrl));
        this.selectedTerminalIndex = '';
        this.isPosDisable = true;
        this.forceUpdate();
    }
    onSelectTerminal = (index,terminal) => {
        this.selectedTerminalIndex = index;
        let terminalObj = _find(this.props.terminalData,{'number':terminal});
        this.selectedTerminalId = _get(terminalObj,'id','');
        this.isPosDisable = false;
        this.forceUpdate();
    }
    componentDidMount() {
        const { dispatch, storesReducer, productsReducer } = this.props;
        let retailerId = _get(this.props,'retailerId','');
        // if(this.props.retailerId && this.props.retailerId!=''){
        //     let retailerId = this.props.retailerId.split('#');
        dispatch(fetchStore(storesReducer,retailerId));
        this.fetchEarnRulesFlag = true;
        let url = '/rewardpointrule?owner='+localStorage.getItem('retailerID');
        dispatch(fetchRewardEarnRule(productsReducer, url));
        // }
        
    }
    componentWillReceiveProps(props){
        if(this.fetchEarnRulesFlag && !_isEmpty(props.rewardEarnRules)){
            this.fetchEarnRules = false;
            let rewardEarnInfo = _get(props.rewardEarnRules,'earnedPointRule',[]);
            let rewardSpentInfo = _get(props.rewardEarnRules,'spentPointRule',[]); 
            
            localStorage.setItem('rewardEarnInfo', JSON.stringify(rewardEarnInfo[0]));
            localStorage.setItem('rewardSpentInfo', JSON.stringify(rewardSpentInfo[0]));

        }
        if(!_isEmpty(props.storeData)){
            this.stores = [];
            this.terminals = [];
            this.terminalUrl = _get(props.storeData,'_links.getTerminals.href','');
            props.storeData.stores.map((store, index)=>{
                this.stores.push(store.storeName);
            });
        }
        if(!_isEmpty(props.terminalData)){
            this.terminals = [];
            props.terminalData.map((terminal, index)=>{
                this.terminals.push(terminal.number);
            });
        }
        
        if(this.isSubmitted && props.type == RECEIVED_POS_LOGIN && props.status === 200){
            this.redirectToPOS = true;
            this.isSubmitted = false;
            localStorage.setItem('loggedInTime', _get(props.posLogin,'time'));
            localStorage.setItem('loggedInDate', _get(props.posLogin,'date'));
        } else if(this.isSubmitted && props.status !==200 && props.status !==''){
            this.isSubmitted = false;
            this.showAlert(true, props.posLogin.message);
        }
        this.forceUpdate();
    }
    showAlert(error, msg) {
        if (error) {
            Alert.error(msg || '', {
                position: 'bottom-right',
                effect: 'slide',
                timeout: 5000,
                html: true
            });
            this.forceUpdate();
        } else {
            Alert.success('Logged in  successfully', {
                position: 'bottom-right',
                effect: 'slide',
                timeout: 3000,
                html: true
            });
        }

    }
    handleSelectChange = (id, name) => {
        _set(this.storeData,name,id);
        if(name=='terminal'){
            this.isPosDisable = false;
        }else{
            this.isPosDisable = true;
        }
        this.forceUpdate();
    }
    render() {
        if (_get(this, 'props.isFetching')) {
            return (<div className='loader-wrapper-main'>
                <div className="spinner">
                    <div className="rect1"></div>
                    <div className="rect2"></div>
                    <div className="rect3"></div>
                    <div className="rect4"></div>
                    <div className="rect5"></div>
                </div>
            </div>);
        }
        if (this.redirectToPOS) {
            return (<Redirect push to="/sync" />)
        }
        const storeListItems = this.stores.map((item, index) =>
            <MenuItem key={index} 
            onClick={this.onSelectItem.bind(this, index,item)}
                selected={this.selectedIndex === index ? true : false}>{item}</MenuItem>

        )
        const terminalItems = this.terminals.map((terminal, index) =>
            <MenuItem key={index} 
            onClick={this.onSelectTerminal.bind(this, index, terminal)}
                active={this.selectedTerminalIndex === index ? true : false}>{terminal}</MenuItem>
        )
        return(<Jumbotron>
           
                        <div className="login store-selection">
                            <div className="section-head">
                               <span className="icon-store"></span>
                               <h1>STORES</h1>
                            </div>
                            <form onSubmit={this.handleSubmit}>
                                <FormGroup controlId="stores" bsSize="large">
                              
                                <DropdownButton                                
                                title={this.selectedIndex===''?"select a Store":this.stores[this.selectedIndex]}
                                
                                id="dropdown-no-caret"
                                // onChange={this.onSelectItem.bind(this)}
                                >
                                {/* <option>Please select a store</option> */}
                                {storeListItems}
                                    </DropdownButton>
                                {/* <AutoComplete
                                    type="single"
                                    data={this.stores}
                                    placeholder="stores"
                                    value={_get(this.storeData,'store','')}
                                    changeHandler={(id, name) => { this.handleSelectChange(id, "store") }}
                                /> */}
                                    
                                </FormGroup>
                                <FormGroup controlId="terminals" bsSize="large">
                                

                                <DropdownButton
                                disabled={this.selectedIndex===''?true: false}
                                title={this.selectedTerminalIndex===''?"Select a Terminal":this.terminals[this.selectedTerminalIndex]}
                               
                                id="dropdown-no-caret"
                                // onChange={this.onSelectItem.bind(this)}
                                > 
                                    {terminalItems}
                                    </DropdownButton>
                                {/* <AutoComplete
                                    type="single"
                                    disabled={!this.storeData.store}
                                    data={this.terminals}
                                    placeholder="Terminals"
                                    value={_get(this.storeData,'terminal','')}
                                    changeHandler={(id, name) => { this.handleSelectChange(id, "terminal") }}
                                />                                                                   */}
                                    
                                   
                                </FormGroup>
                                <Button
                                    bsStyle='info'
                                    block
                                    bsSize="large"
                                    disabled={this.isPosDisable}
                                    type="submit"
                                    className="btn btn-login"
                                >
                                    Login To POS
                                </Button>                             
                                   
                            </form> 
                    </div>
                   
                
            </Jumbotron>
        )
        // return (
        //     <div>
        //         <div className="col-sm-12">
        //             <div className="col-sm-6">
        //                 <ListGroup className="pointer">
        //                     {storeListItems}
        //                 </ListGroup>
        //             </div>
        //             {this.selectedIndex !== '' && <div className="col-sm-6">
        //                 <ListGroup className="pointer">
        //                     {terminalItems}
        //                 </ListGroup>
        //             </div>}
        //         </div>
        //         <div>
        //             <SaveButton disabled={!this.isPosDisable} handlerSearch={this.sendToPOS.bind(this)} buttonDisplayText="GoTo POS" />
        //         </div>
        //     </div>
        // )

    }

}

const mapStateToProps = state => {

    let { storesReducer, userRolesReducer, productsReducer } = state

    let { status } = storesReducer || '';
    let { isFetching } = storesReducer || false;
    let { type } = storesReducer || '';
    let {storeData, posLogin} = storesReducer || {};
    let {terminalData } = storesReducer || {};
    // let { userRoleData } = loginReducer[commonLoginReducer] || [];
    let { retailerId, userId } = userRolesReducer['userRolesData'] ? userRolesReducer['userRolesData'] : {};
    let { rewardEarnRules } = productsReducer || {}


    return {
        status,
        isFetching,
        retailerId,
        storeData,
        terminalData,
        userId,
        type,
        posLogin,
        rewardEarnRules


    }
}

export default connect(mapStateToProps)(StoreContainer);
