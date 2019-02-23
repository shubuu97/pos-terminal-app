import React from 'react';
import PropTypes from 'prop-types';
import moment from "moment";
/* Lodash Imports */
import _get from 'lodash/get';
/* Redux Imports */
/* Material Imports */
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
/* Material Icons */
//component imports
import DenominationDetailsForm from './DenominationDetailsForm';

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

class AddNewSessionDialog extends React.Component {

    
  
    headingDecider = ()=>{
        if(this.props.close){
            return <span>Set Closing Balance</span>
        }
        else{
            return <span>Set Opening Balance for {localStorage.getItem('terminalName')}</span>
        }
    }
    render() {
        debugger;
        const { classes } = this.props;
        return (
            <div >
                <Dialog
                    fullScreen
                    open={this.props.open}
                    onClose={this.props.handleClose}
                    TransitionComponent={Transition}
                >
                    <div className='session-parent'>
                        <div className='session-header'>
                            <IconButton color="inherit"
                             onClick={this.props.handleClose} aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                            <span className='ml-20'>{this.headingDecider()}</span>
                        </div>
                        <DenominationDetailsForm
                        {...this.props}
                        />
                    </div>
                </Dialog>
            </div>
        );
    }
}

AddNewSessionDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddNewSessionDialog);