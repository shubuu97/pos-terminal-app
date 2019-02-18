import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */
import Button from '@material-ui/core/Button';
import SvgIcon from '@material-ui/core/SvgIcon';
/* Redux Imports */

/* Global Imports */
import ReactSelect from '../../../Global/Components/ReactSelect/async-react-select';
import genericPostData from '../../../Global/dataFetch/genericPostData';
/* Component Imports */





class CustomerTab extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }
    onInputChange = (newValue) => {
        //const inputValue = newValue.replace(/\W/g, '');
        this.setState({ newValue });
        return newValue;
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
         console.log(inputValue,"")
        // posdb.queryToView('customerView/byCustomerName', {
        //   include_docs: true,
        //   startkey:inputValue,
        //   endkey:`${inputValue}\ufff0`
    
        // }).then((data) => {
        //   console.log(data, "result is here")
        //   callback(this.mapCustomer(data))
         
        // });
      };
      onChange = (value)=>
      {
        console.log(value,"yogi jain");
      }

    render() {
        let {checkoutactionArea, checkoutMainPart, checkoutCustomerArea } = this.props
        return (
            <div className="customer-section" style={{ height: checkoutMainPart }}>
                <div className="customer-main" style={{height: checkoutCustomerArea}}>
                    <div className='search-section flex-row'>
                        <ReactSelect 
                             onInputChange = {this.onInputChange}
                             cacheOptions
                             defaultOptions
                             onChange={this.onChange}
                             loadOptions={this.loadOptions}
                            className='fwidth'
                        />
                        <div className='add-customer flex-row align-center justify-center'> + </div>
                    </div>
                </div>
                
                <div className='button-section flex-row ' style={{ height: checkoutactionArea }}>
                    <div>
                        <Button className='mr-20' variant="outlined">Hold</Button>
                        <Button className='mr-20' variant="outlined">Proceed as Guest</Button>
                        <Button variant="contained">Proceed</Button>
                    </div>

                </div>
            </div>
        );
    }
}

export default CustomerTab;