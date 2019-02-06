import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import AsyncReactSelect from '../../global/components/async-react-select';
import db from '../../db';
const posdb = new db('posdb');

posdb.queryToView('customerView/byCustomerName', {
  include_docs: true
}).then((data) => {
  console.log(data, "result is here")
});

const colourOptions =  [
  { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
  { value: 'blue', label: 'Blue', color: '#0052CC', disabled: true },
  { value: 'purple', label: 'Purple', color: '#5243AA' },
  { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
  { value: 'orange', label: 'Orange', color: '#FF8B00' },
  { value: 'yellow', label: 'Yellow', color: '#FFC400' },
  { value: 'green', label: 'Green', color: '#36B37E' },
  { value: 'forest', label: 'Forest', color: '#00875A' },
  { value: 'slate', label: 'Slate', color: '#253858' },
  { value: 'silver', label: 'Silver', color: '#666666' },
];
export default class CustomerContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onInputChange = (newValue) => {
    debugger;
    const inputValue = newValue.replace(/\W/g, '');
    this.setState({ inputValue });
    debugger;
    return inputValue;
  }
   mapCustomer = (data) => {
    return data.rows.map(d =>
      {
      let obj = {};
      obj.label = d.key;
      obj.value = d.value;
      return obj;
      }
    );
    // console.log(result,"colourOptions");
    // return result
  };
  
   loadOptions = (inputValue, callback) => {
    posdb.queryToView('customerView/byCustomerName', {
      include_docs: true,
      startkey:inputValue,
      endkey:`${inputValue}\ufff0`

    }).then((data) => {
      console.log(data, "result is here")
      callback(this.mapCustomer(data))
     
    });
  };
  onChange = (value)=>
  {
    console.log(value,"yogi jain");
  }
  render() {
    return (
      <div>
        <Button
          color='primary'
          variant='contained'
          fullWidth={true}>Add New Customer</Button>
        <Button
          color='secondary'
          variant='contained'
          fullWidth={true}>use as guest</Button>
        <AsyncReactSelect
          onInputChange = {this.onInputChange}
          cacheOptions
          defaultOptions
          onChange={this.onChange}
          loadOptions={this.loadOptions}
        />
      </div>
    )
  }
}
