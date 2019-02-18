import React from 'react';
import Switch from '@material-ui/core/Switch';
class Switches extends React.Component {
    state = {
    };
  
    handleChange = name => event => {
      this.setState({ [name]: event.target.checked });
      console.log(this.props,"here");
      this.props.onChange(name,event.target.checked)
    };

  
    render() {
      return (
        <div>
          <Switch
            checked={this.props.showSwitchChecked}
            color='primary'
            onChange={this.handleChange(this.props.name)}
            value={this.props.name}
          />
        </div>
      );
    }
  }
  
  export default Switches;