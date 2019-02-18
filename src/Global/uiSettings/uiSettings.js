import React,{Component} from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


export default class UiSetting extends Component
{
constructor(props)
{
    super(props);
    this.state={TextFilledVaraint:''}
}

handleChange = name => event => {
    this.setState({ [name]: event.target.value });
    localStorage.setItem('TextFilledVaraint',event.target.value);
  };
 
render()
{
    return(
        <div>
        <Select 
        value={this.state.TextFilledVaraint}
         placeholder="Variant of Text Box"
          onChange={this.handleChange('TextFilledVaraint')}>
        {['standard','outlined','filled'].
        map((option,index)=> <option value={option}>{option}</option>)
        }
    
        </Select>
        </div>
    )
}
}