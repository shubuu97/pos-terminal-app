import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';
import genericPostData from '../Global/dataFetch/genericPostData';
import _get from 'lodash/get';
import LoaderButton from '../Global/Components/LoaderButton';

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
});

class SignIn extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {email:'',password:''}
    }

    handleSubmitLogin = () => {
        this.setState({isFetching:true});
        genericPostData({
            dispatch:this.props.dispatch,
            reqObj:{email:this.state.email,password:this.state.password},
            url:'login/pos-login',
            constants:{
                init:'login_init',
                success:'login_success',
                error:'login_error'
            },
            identifier:'login',
            successCb:this.afterLoginSuccess,
            errorCb:()=>this.setState({isFetching:false})
        })
    }

    afterLoginSuccess = (data)=>{
        this.setState({isFetching:false});
        let decodeToken = jwtDecode(_get(data,'token'));
            //todo encryption to be 
            localStorage.setItem('Token',_get(data,'token'));    
            localStorage.setItem('userPin', _get(decodeToken,'Operator.loginPin',''));
            localStorage.setItem('userName', _get(decodeToken,'Operator.person.firstName','') + " " + _get(decodeToken,'Operator.person.lastName',''));
            localStorage.setItem('email', _get(decodeToken,'Operator.email',''));
            localStorage.setItem('storeId', _get(decodeToken,'Operator.storeId'));
            localStorage.setItem('userId', _get(decodeToken,'Operator.id'));
            localStorage.setItem('role',_get(decodeToken,'Operator.role'));
            localStorage.setItem('retailerId',_get(decodeToken,'Retailer.id'));
            this.props.history.push('/store')
    }
    render() {
        const { classes } = this.props;

        return (
            <main className={classes.main}>
                <CssBaseline />
                <Paper className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
        </Typography>
                    <form className={classes.form}>
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="email">Email Address</InputLabel>
                            <Input
                                id="email"
                                onChange={(event)=>this.setState({email:event.target.value})}
                                name="email"
                                autoComplete="email"
                                autoFocus />
                        </FormControl>
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input
                                name="password"
                                onChange={(event)=>this.setState({password:event.target.value})}
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
                    </form>
                </Paper>
            </main>
        );
    }
}

SignIn.propTypes = {
    classes: PropTypes.object.isRequired,
};


function mapStateToProps(state) {

}
export default connect(mapStateToProps)(withStyles(styles)(SignIn));