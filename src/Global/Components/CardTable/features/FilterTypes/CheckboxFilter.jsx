import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
/* Material Imports*/
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
/* Redux Imports */


class CheckboxFilter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            
        };
        _get(props,'filterState',[]).map((data)=>{
            this.state[data]=true
        })
    }

    componentDidMount() {
       
    }

    populateCheckbox = () => {
        let checboxArr = _get(this, "props.data.values", [])
        console.log(checboxArr,'checboxArr')
        let filterCheckbox = [];
        filterCheckbox = checboxArr.map((data, index) => {
            return (
                <FormControlLabel
                    control={
                        <Checkbox
                            key={index}
                            checked={this.state[data]}
                            onChange={this.handleChange(data)}
                            value={data}
                        />
                    }
                    label={data}
                />
            )
        })

        return filterCheckbox
    }
    filterCheckboxStates=(checkBoxState)=>
    {
        let filterdCheckBoxes = []
       Object.keys(checkBoxState).map((keyname,index)=>
       {
        if(checkBoxState[keyname])
        filterdCheckBoxes.push(keyname);
       })
       return filterdCheckBoxes
    }

    handleChange = name => event => {
        this.state[name] = event.target.checked; 
        this.setState({ [name]: this.state[name] });
       let filterdCheckBoxes =  this.filterCheckboxStates(this.state);
        this.props.filterUpdationHandler(filterdCheckBoxes, this.props.data.name,this.props.data.keyname, "checkbox")
    }


    render() {
        console.log("Filter Data Type - ", this.props.data.type, this.props.data)
        return (
            <div className="filter-list">
                {this.populateCheckbox()}
            </div>
        )
    }
}

export default CheckboxFilter;