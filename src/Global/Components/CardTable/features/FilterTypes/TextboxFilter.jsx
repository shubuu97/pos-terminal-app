import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
/* Material Imports*/
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

/* Redux Imports */


const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    dense: {
        marginTop: 8,
    },
    menu: {
        width: 200,
    },
});


class TextboxFilter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value:''
        }
        this.state.value = props.filterState
    }

    render() {
        const { classes } = this.props;
        console.log("Filter Data Type - ", this.props.data.type, this.props.data)
        return (
            <div className="mt-10">
                <FormControl >
                    <TextField
                        id="outlined-bare"
                        className={classNames(classes.textField, classes.dense)}
                        placeholder={this.props.data.name}
                        value={this.state.value}
                        margin="normal"
                        variant="outlined"
                        onChange={(event) => this.props.filterUpdationHandler(event.target.value, this.props.data.name,this.props.data.keyname, "textbox")}
                    />
                </FormControl>
            </div>
        )
    }
}

TextboxFilter.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TextboxFilter);