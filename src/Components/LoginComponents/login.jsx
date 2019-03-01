import React from 'react';
import LoaderButton from '../../Global/Components/LoaderButton';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import jwtDecode from 'jwt-decode';
import genericPostData from '../../Global/dataFetch/genericPostData';
import _get from 'lodash/get';


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        }
    }
    handleSubmitLogin = () => {
        this.setState({ isFetching: true });
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: { email: this.state.email, password: this.state.password },
            url: 'login/pos-login',
            constants: {
                init: 'POST_LOGIN_DATA_INIT',
                success: 'POST_LOGIN_DATA_SUCCESS',
                error: 'POST_LOGIN_DATA_ERROR'
            },
            identifier: 'POST_LOGIN_DATA',
            successCb: this.afterLoginSuccess,
            errorCb: this.handleLoginError,
            successText:'Logged in succesfully'
        })
    }

    afterLoginSuccess = (data) => {
        this.setState({ isFetching: false });
        let decodeToken = jwtDecode(_get(data, 'token'));
        console.log(decodeToken, 'decodeToken')
        //todo encryption to be 
        localStorage.setItem('Token', _get(data, 'token'));
        localStorage.setItem('userPin', _get(decodeToken, 'Operator.loginPin', ''));
        localStorage.setItem('userName', _get(decodeToken, 'Operator.person.firstName', '') + " " + _get(decodeToken, 'Operator.person.lastName', ''));
        localStorage.setItem('email', _get(decodeToken, 'Operator.email', ''));
        localStorage.setItem('storeId', _get(decodeToken, 'Operator.storeId'));
        localStorage.setItem('userId', _get(decodeToken, 'Operator.id'));
        localStorage.setItem('role', _get(decodeToken, 'Operator.role'));
        localStorage.setItem('retailerId', _get(decodeToken, 'Retailer.id'));
        // this.props.history.push('/store');
        this.props.handleStepChange(2)
    }

   handleLoginError =  (error) =>{
    console.log(error,"error is here");
    this.setState({ isFetching: false });
   }
    render() {
        let { classes } = this.props
        return (
            <React.Fragment>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="email">Email Address</InputLabel>
                    <Input
                        id="email"
                        onChange={(event) => this.setState({ email: event.target.value })}
                        name="email"
                        autoComplete="email"
                        autoFocus />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input
                        name="password"
                        onChange={(event) => this.setState({ password: event.target.value })}
                        type="password"
                        id="password"
                        autoComplete="current-password" />
                </FormControl>
                <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                />
                <LoaderButton
                    onClick={this.handleSubmitLogin}
                    fullWidth
                    isFetching={this.state.isFetching}
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                >
                    Sign in
</LoaderButton>
            </React.Fragment>)
    }
}

export default Login;