import React from 'react';
import jwt_decode from 'jwt-decode';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
/* Redux Imports */
import connect from 'react-redux/lib/connect/connect';
import genericPostData from '../../Global/dataFetch/genericPostData';
/* Component Imports */

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class AuthModal extends React.Component {
    constructor() {
        super();
        this.state = {
            manager: '',
            managerAuthList: []
        }
    }
    componentDidMount() {
        let url = 'StoreManager/ByStoreId'
        genericPostData({
            dispatch: this.props.dispatch,
            url: 'StoreManager/ByStoreId',
            reqObj: { id: localStorage.getItem('storeId') },
            constants: {
                init: 'GET_MANAGERES_LIST_INIT',
                success: 'GET_MANAGERS_LIST_SUCCESS',
                error: 'GET_MANAGERS_LIST_ERROR'
            },
            identifier: 'GET_MANAGERS_LIST',
            dontShowMessage:true,
            successCb: this.handleManagerListSuccess,
            errorCb: this.handleManagerListError
        })
    }
    handleManagerListSuccess = (res) => {
        this.setState({ managerAuthList: res })
    }
    handleManagerListError = (error) => {
    }

    handleLogin = () => {
        let reqObj = {
            id: this.state.manager,
            pin: this.state.pin,
        }
        let url = 'StoreManager/ValidatePin';
        genericPostData({
            dispatch: this.props.dispatch,
            url,
            reqObj,
            constants: {
                init: 'POST_MANAGERE_LOGIN_INIT',
                success: 'POST_MANAGER_LOGIN_SUCCESS',
                error: 'POST_MANAGER_LOGIN_ERROR'
            },
            identifier: 'POST_MANAGER_LOGIN',
            successCb: this.handleManagerLoginSuccess,
            successText:'Pin Verified Succesfully',
            errorCb: this.handleManagerLoginError
        })
    }
    handleManagerLoginSuccess = (data) => {
        if (data.result) {
            this.props.authSuccess();
            this.props.handleClose();
            
        }
    }
    handleManagerLoginError = (error) => {
    }

    populateManagers = () => {
        let managerAuthList = _get(this, 'state.managerAuthList', [])
        let managerList = []
        managerAuthList.map((data, index) => {
            managerList.push(
                <MenuItem value={data.id}>{data.person.firstName} {data.person.lastName}</MenuItem>
            )
        })
        return (
            <Select
                value={this.state.manager}
                onChange={this.handleChange}
                input={
                    <OutlinedInput
                        labelWidth={this.state.labelWidth}
                        name="manager"
                        id="outlined-manager-simple"
                    />
                }
            >
                <MenuItem value=""><em>None</em></MenuItem>
                {managerList}
            </Select>
        )
    }
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleTextChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    render() {

        return (
            <Dialog
                open={this.props.open}
                TransitionComponent={Transition}
                keepMounted
                fullWidth
                onClose={this.props.handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">
                    {"Manager Auth Required"}
                </DialogTitle>
                <form onSubmit={this.handleSubmit}>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel
                                    ref={ref => {
                                        this.InputLabelRef = ref;
                                    }}
                                    htmlFor="outlined-manager-simple"
                                >Manager List</InputLabel>
                                {
                                    _get(this, 'state.managerAuthList', []).length > 0 ?
                                        this.populateManagers() : null
                                }
                            </FormControl>
                            <TextField
                                id="pin"
                                label="Pin"
                                value={this.state.pin}
                                onChange={this.handleTextChange('pin')}
                                margin="outline"
                                fullWidth
                                type='password'
                            />
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.handleClose} color="primary">
                            Disagree
                    </Button>
                        <Button onClick={this.handleLogin} color="primary">
                            Agree
                    </Button>
                    </DialogActions>
                </form>
            </Dialog>
        );
    }
}

const mapStateToProps = state => {
    return {}
}

export default connect(mapStateToProps)(AuthModal);