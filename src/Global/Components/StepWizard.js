import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// import Aboutstep from '../CompanyOnBoarding/CompanyOnBoarding_About';
// import {compose, withState, withHandlers} from 'recompose'


const styles = theme => ({
  root: {
    width: '100%',
  },
  labelContainer: {
    color: 'blue'
  },
  backButton: {
    marginRight: theme.spacing.unit,
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

function getSteps() {
  return ['About', 'Contact', 'Financials'];
}

function getStepContent(stepIndex) {
  return this.props.component.stepIndex;
}

class HorizontalStepper extends React.Component {
  state = {
    activeStep: 0,
  };



  render() {
    const { classes, label, component, length, activeStep, handleBack, handleNext, handleReset } = this.props;
    const steps = getSteps();
    const { } = this.state;

    return (
      <div className={classes.root}>
        <Typography className={classes.label}>
          <Stepper className={classes.label} activeStep={activeStep} alternativeLabel>
            {label.map(label => {
              return (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </Typography>
        <div>
          {(
            <div>
              {/* <Typography className={classes.instructions}>{this.props.component[activeStep]}</Typography> */}
              <div> {this.props.component[activeStep]}</div>
              <div>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className={classes.backButton}
                >
                  Back
                </Button>
                <Button variant="contained" color="primary" onClick={handleNext}>
                  {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

HorizontalStepper.propTypes = {
  classes: PropTypes.object,
};
export default withStyles(styles)(HorizontalStepper);
