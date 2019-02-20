import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

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

class HoldDialogue extends React.Component {

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
                    <div className='on-hold-section pt-30'>
                        <div className='on-hold-header'>    
                            <IconButton color="inherit" onClick={this.props.handleClose} aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                            <span className='ml-20'>Carts On Hold</span>
                        </div>
                        <div className='fwidth flex-row'>
                            <div className='card'>
                                hello
                        </div>
                            <div className='card'>
                                hello
                        </div>
                            <div className='card'>
                                hello
                        </div>
                        </div>
                    </div>





                </Dialog>
            </div>
        );
    }
}

HoldDialogue.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HoldDialogue);