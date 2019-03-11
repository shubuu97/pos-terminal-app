import React from 'react';
import PropTypes from 'prop-types';
import moment from "moment";
/* Lodash Imports */
import _get from 'lodash/get';
/* Redux Imports */
/* Material Imports */
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';

import Slide from '@material-ui/core/Slide';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
/* Material Icons */


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

function DialogHoc(WrappedComponent) {
    class CommonDialog extends React.Component {
        render() {
            const { classes } = this.props;
            return (
                <div>
                    <Dialog
                        fullWidth
                        open={this.props.open}
                        onClose={this.props.handleClose}
                        TransitionComponent={Transition}
                    >
                        <DialogTitle id="alert-dialog-slide-title">
                            {this.props.title}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                <WrappedComponent
                                    {...this.props}
                                />
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button variant='outlined' onClick={this.props.handleClose} color="primary">
                                Close
                    </Button>
                           {!this.props.hide?<Button variant='contained' onClick={() => this.props.actionHandler()} color="primary">
                                {this.props.actionName}
                            </Button>:null}
                        </DialogActions>
                    </Dialog>
                </div >
            );
        }
    }

    CommonDialog.propTypes = {
        classes: PropTypes.object.isRequired,
    };

    return withStyles(styles)(CommonDialog);
}

export default DialogHoc;