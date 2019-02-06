import React from 'react';
import Button from 'material-ui/Button';
import Dialog from 'material-ui/Dialog/Dialog';
import DialogActions from 'material-ui/Dialog/DialogActions';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogContentText from 'material-ui/Dialog/DialogContentText';
import DialogTitle from 'material-ui/Dialog/DialogTitle';

import Slide from 'material-ui/transitions/Slide';
import PropTypes from 'prop-types';

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class AlertDialogSlide extends React.Component {
  state = {
    open: this.props.open,
  };

  componentWillReceiveProps(nextProps){
      this.setState({
          open: nextProps.open
      });
  }

  shouldComponentUpdate(nextProps){
      return this.props.open !== nextProps.open;
  }

  handleClose = () => {
    this.props.handleClose();
  };

  handleConfirm = () => {
    this.props.handleAlertConfirm();
  }

  render() {
    const { content, promptBtnText, title} = this.props;
    return (
      <div>
        <Dialog
          open={this.state.open}
          // transition={Transition}
          keepMounted
          // onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          {title && <DialogTitle id="alert-dialog-slide-title">
            {title}
          </DialogTitle>}
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description" style={{fontSize:'1.5em'}}>
              {content}
            </DialogContentText>
          </DialogContent>
          <DialogActions className="btn-action">
            <Button onClick={this.handleClose} color="primary" className="btn btn-default btn-gray btn-modal-close">
              
            </Button>
            <Button onClick={this.handleConfirm} color="primary" className="btn btn-default btn-green">
              {promptBtnText}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

AlertDialogSlide.propTypes = {
    content: PropTypes.string.isRequired,
    promptBtnText: PropTypes.string,
}

AlertDialogSlide.defaultProps = { promptBtnText: 'Ok' };
export default AlertDialogSlide;