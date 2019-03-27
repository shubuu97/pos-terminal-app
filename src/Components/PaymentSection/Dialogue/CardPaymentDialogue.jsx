import React from 'react';
/* React Pose */
import posed from 'react-pose';
/* Material Imports */
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import CircularProgress from '@material-ui/core/CircularProgress';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class CardPaymentDialogue extends React.Component {
  state = {
    open: false,
    error: false,
    success: false,
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          TransitionComponent={Transition}
          keepMounted
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <div className='card-payment-dialogue'>

            {
              !this.props.error && !this.props.success ?
                <div className='fwidth flex-column justify-center align-center'>
                  <CircularProgress color='#fff'/>
                  <div className='processing-text'>Processing Card Payment</div>
                </div> : null
            }

            {
              this.props.error ?
                <div className='fwidth flex-column error-section'>
                  <div>
                    <div className='error-title'>Error</div>
                    <div className='error-message'>{this.props.errorMsg}</div>
                  </div>
                  <div className='error-actions'>
                    <Button className='action' variant="contained" onClick={this.props.handleClose}>Cancel</Button>
                    <Button className='action' variant="contained">Retry</Button>
                  </div>
                </div> : null
            }

            {
              this.props.success ?
                <div className='fwidth flex-column justify-center align-center'>
                  <div className='success-text'>Success</div>
                </div> : null
            }

          </div>
        </Dialog>
      </div>
    );
  }
}

export default CardPaymentDialogue;