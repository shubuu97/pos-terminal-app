import React from 'react';
import PropTypes from 'prop-types';
/* Material Imports */
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';

const styles = {
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
    height: '65%',
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
  },
};

class CustomizedInputBase extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    if (this.props.isOpenProduct && !this.props.isOpenHistoryDialogue && !this.props.isCustomerTabOpen && !this.props.isGiftCardModelOpen && !this.props.openCustomerDialogue) {
      this.focusInput.focus()
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.root} elevation={1} >
        <InputBase
          id="searchBox"
          inputRef={(val) => { this.focusInput = val }}
          value={this.props.value}
          className={classes.input}
          onKeyPress={this.props.onKeyPress}
          placeholder="Search For Item"
          onChange={(event) => this.props.handleChange(event.target.value, event)} />
        {
          this.props.value == '' ? '' :
            <i onClick={this.props.onClear} class="material-icons">clear</i>
        }
        <IconButton className={classes.iconButton} aria-label="Search">
          <SearchIcon />
        </IconButton>
      </Paper>
    );
  }
}

CustomizedInputBase.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default (withStyles(styles)(CustomizedInputBase));