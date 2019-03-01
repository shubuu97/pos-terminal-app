import React from 'react';
import { connect } from 'react-redux';
import genericPostData from '../Global/dataFetch/genericPostData';
import _get from 'lodash/get';
import Select from '@material-ui/core/Select';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import FormControl from '@material-ui/core/FormControl';
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


class StoreContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            terminals: [],
            selectedTerminal: ""
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
                init: 'GET_STORE_DATA_init',
                success: 'GET_STORE_DATA_success',
                error: 'GET_STORE_DATA_error'
            },
            identifier: 'GET_STORE_DATA',
            successCb: this.afterStoreSuccess,
            errorCb: () => this.setState({ isFetching: false })
        })

    }
    afterStoreSuccess = (data) => {
        this.setState({ terminals: _get(data, 'terminals') })
    }
    handleChange = (terminal) => {

    }
    mapTermainal = () => {
        let terminals = this.state.terminals.map((terminal) => {
            console.log(terminal, "here");
            return <option value={terminal}>{terminal.name}</option>
        })
        terminals.push('');
    }
    render() {
        const { classes } = this.props;
        return (
            <main>
                <CssBaseline />
                <Paper className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Select Terminal
                     </Typography>
                    <form className={classes.form}>
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
                            onClick={this.handleSubmitLogin}
                            fullWidth
                            isFetching={this.state.isFetching}
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Login in to POS
          </LoaderButton>
                    </form>
                </Paper>
            </main>
        )
    }

}

function mapStateToProps(state) {

}

export default connect(mapStateToProps)(withStyles(styles)(StoreContainer));
