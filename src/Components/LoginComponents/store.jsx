import React from 'react';
import LoaderButton from '../../Global/Components/LoaderButton';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import genericPostData from '../../Global/dataFetch/genericPostData';
import _get from 'lodash/get';
import moment from 'moment';
import AuthModal from './authModal';
import Redirect from "react-router/Redirect";



class Store extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            terminals: [],
            selectedTerminal: 0,
            isManager: localStorage.getItem('role') == 'manager' ? true : false
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
            dispatch: this.props.dispatch,
            reqObj: { id: localStorage.getItem('storeId') },
            url: 'Store/AllData',
            constants: {
                init: 'GET_STORE_DATA_INIT',
                success: 'GET_STORE_DATA_SUCCESS',
                error: 'GET_STORE_DATA_ERROR'
            },
            identifier: 'GET_STORE_DATA',
            successCb: this.afterStoreSuccess,
            errorCb: () => this.setState({ isFetching: false })
        })

    }
    afterStoreSuccess = (data) => {
        let countyTaxRate = _get(data, 'tax.countyTaxRate');
        let federalTaxRate = _get(data, 'tax.federalTaxRate');
        let stateTaxRate = _get(data, 'tax.stateTaxRate');
        localStorage.setItem('countyTaxRate', countyTaxRate);
        localStorage.setItem('federalTaxRate', federalTaxRate);
        localStorage.setItem('stateTaxRate', stateTaxRate);
        this.setState({ terminals: _get(data, 'terminals') })
    }
    mapTermainal = () => {
        let terminals = this.state.terminals.map((terminal, index) => {
            console.log(terminal, "here");
            return <option data-value={terminal} value={index}>{terminal.name}</option>
        })
        return terminals;
    }

    handleChange = (event) => {
        this.setState({ selectedTerminal: event.target.value });
        let terminalObj = this.state.terminals[event.target.value];
        localStorage.setItem('terminalId', terminalObj.id);
        localStorage.setItem('terminalName', terminalObj.name);
    }

    handleLoginToPos = () => {
        let loginData = {
            operatorId: localStorage.getItem('userId'),
            terminalId: localStorage.getItem('terminalId'),
            type: 'login'
        }
        this.setState({ isFetching: true });
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: loginData,
            url: 'Store/LoginOnTerminal',
            constants: {
                init: 'GET_TERMINAL_DATA_INIT',
                success: 'GET_TERMINAL_DATA_SUCCESS',
                error: 'GET_TERMINAL_DATA_ERROR'
            },
            identifier: 'GET_TERMINAL_DATA',
            successCb: this.afterLoginSuccess,
            errorCb: () => this.setState({ isFetching: false })
        })
    }
    afterLoginSuccess = (data) => {
        console.log(data, "data is here");
        this.setState({ isFetching: false });
        let loggedInTime = moment(_get(data, 'loginTime.seconds') * 1000).format('h:mm:ss a');
        let loggedInDate = moment(_get(data, 'loginTime.seconds') * 1000).format('MMMM Do YYYY');
        localStorage.setItem('loggedInTime', loggedInTime);
        localStorage.setItem('loggedInDate', loggedInDate);
        localStorage.setItem('sessionId', _get(data, 'sessionId', 'nil'));
        if (_get(data, 'sessionId', 'nil') == 'nil') {
            if (this.state.isManager) {
                this.props.history.push('/DenominationDetailsForm');
            }
            else {
               this.setState({showAuthModal:true})
            }
        }
        else {
            this.props.handleStepChange(3)
        }
    }
    authSuccess = () => {
     this.props.history.push('/DenominationDetailsForm');
    }
    handleClose = ()=>
    {
        this.setState({
        showAuthModal:false
        })
    }
    render() {
        let { classes } = this.props
        return (
            <React.Fragment>
                <FormControl margin="normal" required fullWidth>
                    <Select
                        native
                        value={this.state.selectedTerminal}
                        onChange={this.handleChange}
                    >
                        {this.mapTermainal()}
                    </Select>
                </FormControl>
                <LoaderButton
                    onClick={this.handleLoginToPos}
                    fullWidth
                    isFetching={this.state.isFetching}
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                >
                    Login in to POS
                </LoaderButton>
                {this.state.showAuthModal ? <AuthModal
                    open={this.state.showAuthModal}
                    handleClose={this.handleClose}
                    dispatch={this.props.dispatch}
                    authSuccess={this.authSuccess}
                /> : null}
            </React.Fragment>)
    }
}

export default Store;