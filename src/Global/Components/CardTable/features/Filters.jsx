import React, { Component } from 'react';
import _get from 'lodash/get';
/* Material Imports */
import CheckboxFilter from './FilterTypes/CheckboxFilter';
import SliderFilter from './FilterTypes/SliderFilter';
import TextboxFilter from './FilterTypes/TextboxFilter';
import RadioFilter from './FilterTypes/RadioFilter';

class Filters extends Component {

    constructor() {
        super();
        this.state = {
            Filter: {}
        }
    }

    filterUpdationHandler = (data, name,keyname, type) => {
       let filterState =  {...this.props.filterState}
        if (type == "checkbox" || type == "textbox") {
            if (data.length == 0) {
                delete filterState[keyname]
                console.log(data, keyname, type, filterState, "jj")
                this.props.filterAction(filterState)
                return 
            }
        }
        filterState[keyname] = data;
        this.setState({filterData:filterState})
        this.props.filterAction(filterState)
    }

    populateFilters = () => {
        let allData = this.props.filterData
        let filters = []
        allData.map((data, index) => {
            let type = data.type
            let title = data.name
            switch (type) {
                case "checkbox":
                    filters.push(
                        <div className="filter-sub-block">
                            <h3>{title}</h3>
                            <CheckboxFilter
                                filterState={_get(this.props,`filterState.${data.keyname}`)}
                                data={data}
                                filterUpdationHandler={this.filterUpdationHandler} />
                        </div>
                    )
                    break;
                case "radio":

                    filters.push(
                        <div className="filter-sub-block">
                            <h3>{title}</h3>
                            <RadioFilter data={data}
                                 filterState={_get(this.props,`filterState.${data.keyname}`)}
                                filterUpdationHandler={this.filterUpdationHandler} />
                        </div>
                    )
                    break;
                case "textbox":
                    filters.push(
                        <div className="filter-sub-block">
                            <h3>{title}</h3>
                            <TextboxFilter
                             data={data} 
                             filterState={_get(this.props,`filterState.${data.keyname}`)}
                             filterUpdationHandler={this.filterUpdationHandler} />
                        </div>
                    )
                    break;
                case "slider":
                    filters.push(
                        <div className="filter-sub-block">
                            <h3>{title}</h3>
                            <SliderFilter 
                             filterState={_get(this.props,`filterState.${data.keyname}`)}
                            data={data} />
                        </div>
                    )
                    break;
            }
        })

        return filters
    }

    render() {
        console.log("Filter Data - ", this.props.filterData)
        return (
            <div className="filter-test">
                {this.populateFilters()}
            </div>
        )
    }
}

export default Filters;