import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';




/* Redux Imports */

/* Component Imports */

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
        maxWidth: 300,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: theme.spacing.unit / 4,
    },
    noLabel: {
        marginTop: theme.spacing.unit * 3,
    },
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const names = [
    'Bereavement',
    'Service Recovery',
    'Department',
];
function getStyles(name, that) {
    return {
        fontWeight:
            that.state.name.indexOf(name) === -1
                ? that.props.theme.typography.fontWeightRegular
                : that.props.theme.typography.fontWeightMedium,
    };
}
class CostCenter extends React.Component {

    constructor() {
        super();
        this.state = {
            name: ''
        }
    }
    handleChange = event => {
        this.setState({ name: event.target.value });
    };

    render() {
        let { classes } = this.props;
        return (
            <div>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="select-multiple">Cost Cd
                    </InputLabel>
                    <Select
                        value={this.state.name}
                        onChange={this.handleChange}
                        MenuProps={MenuProps}
                    >

                        {names.map(name => (
                            <MenuItem key={name} value={name}>
                                <ListItemText primary={name} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        autoFocus
                        // onFocus={() => this.props.currentFocus({ fieldValue: 'giftPayNumber', handler: 'GIFT_CARD_NUMBER' })}
                        id="giftPayNumber"
                        label="Gift Card Number"
                        type="text"
                        // value={this.props.giftPayNumber}
                        // onChange={this.handleChange('giftPayNumber')}
                        margin="normal"
                        fullWidth
                        variant="outlined"
                    />
                </FormControl>

            </div>
        );
    }
}
export default withStyles(styles, { withTheme: true })(CostCenter);
