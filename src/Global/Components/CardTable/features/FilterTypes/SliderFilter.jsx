import React, { Component } from 'react';
import _get from 'lodash/get';
/* Material Imports*/

/* Redux Imports */


class SliderFilter extends Component {

    constructor() {
        super();
    }
    
    render() {
        console.log("Filter Data Type - ", this.props.data.type, this.props.data)
        return (
            <div className="mt-15">
                Slider Filter
            </div>
        )
    }
}

export default SliderFilter;