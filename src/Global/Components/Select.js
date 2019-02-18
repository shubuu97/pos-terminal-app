import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import _get from 'lodash/get'

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 200
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
});




class SelectField extends React.Component {

    render() {
        console.log("content is here")
        const { classes, input, label, children, name, id, options, variantType, ...custom } = this.props;
        console.log(input)
        console.log(variantType, '----------------------------------')
        return (
            <div>
                {variantType == 'standard' && <FormControl>
                    <InputLabel htmlFor="age-simple">{label}</InputLabel>
                    <Select
                        {...input}
                        autoWidth   ={true}
                        onChange={(event, element) => {
                            input.onChange(element.props.value)
                        }
                        }
                        inputProps={{
                            name: name,
                            id: id,
                        }}
                    >
                        {_get(this.props, 'options', []).map(option => (

                            <MenuItem value={option.value}>{option.value}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                }

                {variantType == 'outlined' && <FormControl variant="outlined"  fullWidth='true'>
                    <InputLabel
                        ref={ref => {
                            this.labelRef = ReactDOM.findDOMNode(ref);
                        }}
                        htmlFor={label}
                    >
                        {label}
                    </InputLabel>
                    <Select
                        {...input}
                        disabled={this.props.disabled}
                        onChange={(event, element) => {
                            input.onChange(element.props.value)
                        }
                        }
                       
                    >
                        {_get(this.props,'options')?_get(this.props, 'options', []).map((option,index) => (
                            <MenuItem key={index} value={option.value}>{option.label||option.value}</MenuItem>
                        )):null}
                    </Select>

                </FormControl>
                }

            </div>



        );
    }
}

SelectField.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SelectField);
