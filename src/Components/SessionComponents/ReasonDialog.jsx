import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
/* Material import */
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Divider from '@material-ui/core/Divider';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import  TextField  from '@material-ui/core/TextField';

/* Redux Imports */
import moment from "moment";
/* Component Imports */

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class ReasonDialog extends React.Component {
    constructor() {
        super();
        this.state = {
        }
    }
    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };
    render() {
        const { store } = this.props;
        return (
            <React.Fragment>
                <Dialog
                    open={this.props.open}
                    TransitionComponent={Transition}
                    keepMounted
                    fullWidth
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">
                        {"Theory is not same the Closing balance"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                        <TextField
                                id="standard-multiline-flexible"
                                label="reason"
                                multiline
                                variant = 'outlined'
                                rowsMax={4}
                                value={this.state.reason}
                                onChange={this.handleChange('reason')}
                                margin="normal" />
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button variant='outlined' onClick={this.props.handleClose} color="primary">
                            Close
                    </Button>
                    <Button variant='primary' onClick={()=>this.props.specifyReason(this.state.reason)} color="primary">
                            Done
                    </Button>
                    </DialogActions>
                </Dialog>

            </React.Fragment>
        );
    }
}



export default ReasonDialog;