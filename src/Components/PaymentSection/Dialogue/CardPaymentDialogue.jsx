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
          open={this.state.open}
          TransitionComponent={Transition}
          keepMounted
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <div className='card-payment-dialogue'>

            {
              !this.state.error && !this.state.success ?
                <div className='fwidth flex-column justify-center align-center'>
                  <CircularProgress color='#fff'/>
                  <div className='processing-text'>Processing Card Payment</div>
                </div> : null
            }

            {
              this.state.error ?
                <div className='fwidth flex-column error-section'>
                  <div>
                    <div className='error-title'>Error</div>
                    <div className='error-message'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex, iusto! Fugit doloremque doloribus officia nobis, modi obcaecati, facere cupiditate accusamus harum saepe minima laborum dignissimos nemo fuga voluptatum voluptatem atque.</div>
                  </div>
                  <div className='error-actions'>
                    <Button className='action' variant="contained">Cancel</Button>
                    <Button className='action' variant="contained">Retry</Button>
                  </div>
                </div> : null
            }

            {
              this.state.success ?
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