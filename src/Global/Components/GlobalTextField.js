import React,{Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import _get from 'lodash/get';
import {lifecycle} from 'recompose';
import {clearFields,Field} from 'redux-form'
import InputAdornment from '@material-ui/core/InputAdornment';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    inputspace: {
        marginTop: 0,
        marginBottom: 0, 
    },
    dense: {
        marginTop: 16,
    },
    menu: {
        width: 300,
    },
});

class TextFieldRF extends Field
{

    componentWillUnmount() {
        console.log(this.props,"888")
        super.componentWillUnmount();
        this.context._reduxForm.dispatch(
        clearFields(this.context._reduxForm.form, false, false, this.props.input.name));
    }

render() {
    const {multiline, classes,field,disabled, InputLabelProps, defaultValue, input, id, variant, fullWidth, autoFocus, label, type, placeholder,required, custom, meta, startAdornment, endAdornment } = this.props;
    console.log(this.props, "globalTextField")
   return (
        [

            <TextField
                multiline={multiline}
                rows={4}
                fullWidth={fullWidth}
                type={type}
                disabled={disabled}
                label={label}
                defaultValue={defaultValue}
                error={_get(meta, 'touched', true) && _get(meta, 'error', false)}
                {...input}
                {...custom}
                InputLabelProps={InputLabelProps}
                id={id}
                className={classes.inputspace}
                variant={'standard'}
                required={required}
                autoFocus={autoFocus}
                InputProps={{
                    startAdornment: <InputAdornment position="start">{startAdornment}</InputAdornment>,
                    endAdornment: <InputAdornment position="end">{endAdornment}</InputAdornment>,
                }}
            />,
            <div className="errormsg">  {_get(meta, 'touched', false) && _get(meta, 'error', '') ? <FormHelperText style={{color:'red'}}>{meta.error}</FormHelperText> : null}</div>

        ]
    );
}
}


TextFieldRF.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(TextFieldRF);
