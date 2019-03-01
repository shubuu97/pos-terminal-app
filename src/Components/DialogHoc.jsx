import React from 'react';
import PropTypes from 'prop-types';
import moment from "moment";
/* Lodash Imports */
import _get from 'lodash/get';
/* Redux Imports */
import { commonActionCreater } from '../Redux/commonAction'
/* Material Imports */
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
/* Material Icons */
import DeleteIcons from '@material-ui/icons/DeleteOutline';
/*  */
import applyCart from '../Global/PosFunctions/applyCart'
import SessionContainer from '../Containers/SessionContainer';

const styles = {
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
};

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

function withDialog(WrappedComponent) {
    class CommonDialog extends React.Component {
        render() {
            const { classes } = this.props;
            return (
                <div className='hold-dialogue'>
                    <Dialog
                        fullScreen
                        open={this.props.open}
                        onClose={this.props.handleClose}
                        TransitionComponent={Transition}
                    >
                        <div className='session-section'>
                            <div className='session-header'>
                                <IconButton
                                    color="inherit"
                                    onClick={this.props.handleClose}
                                    aria-label="Close">
                                    <CloseIcon />
                                </IconButton>
                                <span className='ml-20'>{this.props.title}</span>
                            </div>
                            <WrappedComponent
                                goBackToCheckOut={this.props.handleClose}
                                {...this.props}
                            />
                        </div>
                    </Dialog>
                </div>
            );
        }
    }

    CommonDialog.propTypes = {
        classes: PropTypes.object.isRequired,
    };

    return withStyles(styles)(CommonDialog);
}

export default withDialog;