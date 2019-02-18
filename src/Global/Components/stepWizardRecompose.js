import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Aboutstep from '../CompanyOnBoarding/CompanyOnBoarding_About';
import {compose, withState, withHandlers} from 'recompose';
import About from '../CompanyOnBoarding/CompanyOnBoarding_About'

const styles = theme => ({
  root: {
    width: '100%',
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



let  HorizontalStepper=(props)=>
{
    const { classes,label,component,length,incrementStep,decrementalStep,resetStep,activeStep } = props;
    const steps = getSteps();
    return (
      <div className={classes.root}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {label.map(label => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <div>
          {activeStep === steps.length ? (
            <div>
              <Typography className={classes.instructions}>All steps completed</Typography>
              <Button onClick={resetStep}>Reset</Button>
            </div>
          ) : (
            <div>
              <Typography className={classes.instructions}>{}</Typography>
              <div>
                <Button
                  disabled={activeStep === 0}
                  onClick={decrementalStep}
                  className={classes.backButton}
                >
                  Back
                </Button>
                <Button variant="contained" color="primary" onClick={incrementStep}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }


HorizontalStepper.propTypes = {
  classes: PropTypes.object,
};


HorizontalStepper = compose(
  withState('activeStep','handleActiveStep',0),
  withHandlers({
    incrementStep:props=>props.handleActiveStep(props.activeStep+1),
    decrementalStep:props=>props.handleActiveStep(props.activeStep-1),
    resetStep:props=>props.handleActiveStep(0)
  })
)(HorizontalStepper)





export default withStyles(styles)(HorizontalStepper);
