import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
/* Material components import */
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
/* withStyle is needed to make  */
import { withStyles } from '@material-ui/core/styles';

const currencies = [
    {
        value: 'USD',
        label: '$',
    },
    {
        value: 'EUR',
        label: '€',
    },
    {
        value: 'BTC',
        label: '฿',
    },
    {
        value: 'JPY',
        label: '¥',
    },
];

// Making Styles in the container itself
const styles = theme => ({

    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    dense: {
        marginTop: 16,
    },
    menu: {
        width: 200,
    },
    title: {
        margin: '20px auto',
        fontSize: '3em'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    }
});

class xForms extends React.Component {
    state = {
        name: 'Mayuk Agarwal',
        age: '',
        multiline: 'Controlled',
        currency: 'EUR',
        settings: 'outlined',
        showPassword: false,
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };
    handleClickShowPassword = () => {
        this.setState(state => ({ showPassword: !state.showPassword }));
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.form}>
                <span className={classes.title}>Forms</span>
                <form className={classes.container} noValidate autoComplete="off">
                    <TextField
                        id="outlined-name"
                        label="Name"
                        className={classes.textField}
                        value={this.state.name}
                        onChange={this.handleChange('name')}
                        margin="normal"
                        variant={this.state.settings}
                    />
                    <TextField
                        id="outlined-uncontrolled"
                        label="Uncontrolled"
                        defaultValue="foo"
                        className={classes.textField}
                        margin="normal"
                        variant={this.state.settings}
                    />
                    <TextField
                        required
                        id="outlined-required"
                        label="Required"
                        defaultValue="Hello World"
                        className={classes.textField}
                        margin="normal"
                        variant={this.state.settings}
                    />
                    <TextField
                        error
                        id="outlined-error"
                        label="Error"
                        defaultValue="Hello World"
                        className={classes.textField}
                        margin="normal"
                        variant={this.state.settings}
                    />
                    <TextField
                        disabled
                        id="outlined-disabled"
                        label="Disabled"
                        defaultValue="Hello World"
                        className={classes.textField}
                        margin="normal"
                        variant={this.state.settings}
                    />
                    <TextField
                        id="outlined-email-input"
                        label="Email"
                        className={classes.textField}
                        type="email"
                        name="email"
                        autoComplete="email"
                        margin="normal"
                        variant={this.state.settings}
                    />
                    <TextField
                        id="outlined-password-input"
                        label="Password"
                        className={classes.textField}
                        type="password"
                        autoComplete="current-password"
                        margin="normal"
                        variant={this.state.settings}
                    />
                    <TextField
                        id="outlined-read-only-input"
                        label="Read Only"
                        defaultValue="Hello World"
                        className={classes.textField}
                        margin="normal"
                        InputProps={{
                            readOnly: true,
                        }}
                        variant={this.state.settings}
                    />
                    <TextField
                        id="outlined-dense"
                        label="Dense"
                        className={classNames(classes.textField, classes.dense)}
                        margin="dense"
                        variant={this.state.settings}
                    />
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Multiline"
                        multiline
                        rowsMax="4"
                        value={this.state.multiline}
                        onChange={this.handleChange('multiline')}
                        className={classes.textField}
                        margin="normal"
                        helperText="hello"
                        variant={this.state.settings}
                    />
                    <TextField
                        id="outlined-multiline-static"
                        label="Multiline"
                        multiline
                        rows="4"
                        defaultValue="Default Value"
                        className={classes.textField}
                        margin="normal"
                        variant={this.state.settings}
                    />
                    <TextField
                        id="outlined-helperText"
                        label="Helper text"
                        defaultValue="Default Value"
                        className={classes.textField}
                        helperText="Some important text"
                        margin="normal"
                        variant={this.state.settings}
                    />
                    <TextField
                        id="outlined-with-placeholder"
                        label="With placeholder"
                        placeholder="Placeholder"
                        className={classes.textField}
                        margin="normal"
                        variant={this.state.settings}
                    />
                    <TextField
                        id="outlined-textarea"
                        label="Multiline Placeholder"
                        placeholder="Placeholder"
                        multiline
                        className={classes.textField}
                        margin="normal"
                        variant={this.state.settings}
                    />
                    <TextField
                        id="outlined-number"
                        label="Number"
                        value={this.state.age}
                        onChange={this.handleChange('age')}
                        type="number"
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="normal"
                        variant={this.state.settings}
                    />
                    <TextField
                        id="outlined-search"
                        label="Search field"
                        type="search"
                        className={classes.textField}
                        margin="normal"
                        variant={this.state.settings}
                    />
                    <TextField
                        id="outlined-select-currency"
                        select
                        label="Select"
                        className={classes.textField}
                        value={this.state.currency}
                        onChange={this.handleChange('currency')}
                        SelectProps={{
                            MenuProps: {
                                className: classes.menu,
                            },
                        }}
                        helperText="Please select your currency"
                        margin="normal"
                        variant={this.state.settings}
                    >
                        {currencies.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        id="outlined-select-currency-native"
                        select
                        label="Native select"
                        className={classes.textField}
                        value={this.state.currency}
                        onChange={this.handleChange('currency')}
                        SelectProps={{
                            native: true,
                            MenuProps: {
                                className: classes.menu,
                            },
                        }}
                        helperText="Please select your currency"
                        margin="normal"
                        variant={this.state.settings}
                    >
                        {currencies.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </TextField>
                    <TextField
                        id="outlined-full-width"
                        label="Label"
                        style={{ margin: 8 }}
                        placeholder="Placeholder"
                        helperText="Full width!"
                        fullWidth
                        margin="normal"
                        variant={this.state.settings}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        id="outlined-bare"
                        className={classes.textField}
                        defaultValue="Bare"
                        margin="normal"
                        variant={this.state.settings}
                    />
                    <TextField
                        id="outlined-simple-start-adornment"
                        className={classNames(classes.margin, classes.textField)}
                        variant="outlined"
                        label="With outlined TextField"
                        InputProps={{
                            startAdornment: <InputAdornment position="start">Kg</InputAdornment>,
                        }}
                    />
                    <TextField
                        id="outlined-adornment-amount"
                        className={classNames(classes.margin, classes.textField)}
                        variant="outlined"
                        label="Amount"
                        value={this.state.amount}
                        onChange={this.handleChange('amount')}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                    />
                    <TextField
                        id="outlined-adornment-weight"
                        className={classNames(classes.margin, classes.textField)}
                        variant="outlined"
                        label="Weight"
                        value={this.state.weight}
                        onChange={this.handleChange('weight')}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
                        }}
                    />
                    <InputLabel htmlFor="adornment-password">Password</InputLabel>
                    <Input
                        id="adornment-password"
                        type={this.state.showPassword ? 'text' : 'password'}
                        value={this.state.password}
                        variant="outlined"
                        onChange={this.handleChange('password')}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="Toggle password visibility"
                                    onClick={this.handleClickShowPassword}
                                >
                                    {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </form>
            </div>

        );
    }
}

xForms.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(xForms);
