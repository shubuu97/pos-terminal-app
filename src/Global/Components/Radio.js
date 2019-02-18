import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const styles = theme => ({
    root: {
        display: 'flex'
    },
    formControl: {
        margin: theme.spacing.unit,
    },
    group: {
        margin: `${theme.spacing.unit}px 0`,
        display: 'inline'
    },
});



  let    RadioButtonsGroup = (props)=> {
        const { classes,label,name,input,radioList,...rest} = props;
        console.log(input.value,"radio")

        return (
            <div className={classes.root}>
                <FormControl component="fieldset" className={classes.formControl}>
                    <FormLabel component="legend">{label}</FormLabel>
                    <RadioGroup
                        aria-label={label}
                        name={name}
                        className={classes.group}
                        value={input.value}
                        onChange={(event, value) => input.onChange(value)}
                    >
                        {radioList.map(option => (
                            <FormControlLabel disabled={props.disabled} value={option.value} control={<Radio />} label={option.label} />
                        ))}

                    </RadioGroup>
                </FormControl>
            </div>
        );
    }


RadioButtonsGroup.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RadioButtonsGroup);
