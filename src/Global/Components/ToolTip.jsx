import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
    lightTooltip: {
        background: theme.palette.common.white,
        color: theme.palette.text.primary,
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
    arrowPopper: {
        '&[x-placement*="bottom"] $arrowArrow': {
            top: 0,
            left: 0,
            marginTop: '-0.9em',
            width: '3em',
            height: '1em',
            '&::before': {
                borderWidth: '0 1em 1em 1em',
                borderColor: `transparent transparent ${theme.palette.grey[700]} transparent`,
            },
        },
        '&[x-placement*="top"] $arrowArrow': {
            bottom: 0,
            left: 0,
            marginBottom: '-0.9em',
            width: '3em',
            height: '1em',
            '&::before': {
                borderWidth: '1em 1em 0 1em',
                borderColor: `${theme.palette.grey[700]} transparent transparent transparent`,
            },
        },
        '&[x-placement*="right"] $arrowArrow': {
            left: 0,
            marginLeft: '-0.9em',
            height: '3em',
            width: '1em',
            '&::before': {
                borderWidth: '1em 1em 1em 0',
                borderColor: `transparent ${theme.palette.grey[700]} transparent transparent`,
            },
        },
        '&[x-placement*="left"] $arrowArrow': {
            right: 0,
            marginRight: '-0.9em',
            height: '3em',
            width: '1em',
            '&::before': {
                borderWidth: '1em 0 1em 1em',
                borderColor: `transparent transparent transparent ${theme.palette.grey[700]}`,
            },
        },
    },
    arrowArrow: {
        position: 'absolute',
        fontSize: 7,
        width: '3em',
        height: '3em',
        '&::before': {
            content: '""',
            margin: 'auto',
            display: 'block',
            width: 0,
            height: 0,
            borderStyle: 'solid',
        },
    },
    button: {
        margin: theme.spacing.unit,
    },
});

class CustomizedTooltips extends React.Component {
    state = {
        arrowRef: null,
    };

    handleArrowRef = node => {
        this.setState({
            arrowRef: node,
        });
    };

    render() {
        const { classes } = this.props;

        return (
            <div>
                <Tooltip
                    title={
                        <React.Fragment>
                            {this.props.title}
                            {
                                this.props.arrow ? <span className={classes.arrowArrow} ref={this.handleArrowRef} /> :
                                null
                            }
                        </React.Fragment>
                    }
                    classes={{ popper: classes.arrowPopper }}
                    PopperProps={{
                        popperOptions: {
                            modifiers: {
                                arrow: {
                                    enabled: Boolean(this.state.arrowRef),
                                    element: this.state.arrowRef,
                                },
                            },
                        },
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                    </svg>
                </Tooltip>
            </div>
        );
    }
}

CustomizedTooltips.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomizedTooltips);