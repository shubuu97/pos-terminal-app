import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";


import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import _get from 'lodash/get'

const styles = theme => ({
    toggleContainer: {
        height: 56,
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        margin: `${theme.spacing.unit}px 0`,
        background: theme.palette.background.default
    }
});

let ToggleButtons = (props) => {
    const { input, toggleList, classes } = props;
    console.log(input, "input")

    return (
        <Grid container spacing={16}>

            <div className={classes.toggleContainer}>
                <ToggleButtonGroup
                    value={_get(input, 'value', '1')}
                    exclusive
                    onChange={(event, value) => input.onChange(value)}
                >

                    {toggleList.map(item => (
                        <ToggleButton
                            disabled={props.disabled}
                            value={item.alinValue}>{item.label}</ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </div>
        </Grid>
    );

}

ToggleButtons.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ToggleButtons);
