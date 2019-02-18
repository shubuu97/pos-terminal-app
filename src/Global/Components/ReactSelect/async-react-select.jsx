import React, { Component } from 'react';
// import 'react-select/dist/react-select.css';

import AsyncSelect from 'react-select/lib/Async';
// import { colourOptions } from '../data';





export default class WithPromises extends Component {
  render() {
    return (
      <AsyncSelect 
       onChange = {this.props.onChange}
       cacheOptions={this.props.cacheOptions}
       defaultOptions={this.props.defaultOptions}
       onInputChange={this.props.onInputChange}
       loadOptions={this.props.loadOptions} 
       className={this.props.className}
       />
    );
  }
}