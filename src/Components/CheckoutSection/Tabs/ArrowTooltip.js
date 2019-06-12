import arrowGenerator from './arrowGeneratorFunc';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';

const useStylesArrow = makeStyles(theme => ({
    arrow: {
      position: 'absolute',
      fontSize: 6,
      width: '4em',
      height: '3em',
      '&::before': {
        content: '""',
        margin: 'auto',
        display: 'block',
        width: 0,
        height: 0,
        borderStyle: 'solid',
      },
    },
    tooltip: {
      backgroundColor: "#fff"
    },
    popper: arrowGenerator('#000'),
  }));

  function ArrowTooltip(props) {
    const { arrow, ...classes } = useStylesArrow();
    const [arrowRef, setArrowRef] = React.useState(null);
  
    return (
      <Tooltip
        classes={classes}
        PopperProps={{
          popperOptions: {
            modifiers: {
              arrow: {
                enabled: Boolean(arrowRef),
                element: arrowRef,
              },
            },
          },
        }}
        {...props}
        title={
          <React.Fragment>
            {props.title}
            <span className={arrow} ref={setArrowRef} />
          </React.Fragment>
        }
      />
    );
  }

  export default ArrowTooltip;