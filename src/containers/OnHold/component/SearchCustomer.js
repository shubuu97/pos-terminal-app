import React from 'react';
import Redirect from "react-router/Redirect";
import Panel from 'react-bootstrap/lib/Panel';
import PanelGroup from 'react-bootstrap/lib/PanelGroup';
import "bootstrap/dist/css/bootstrap.css";
import _isEmpty from 'lodash/isEmpty';
import Form from "react-bootstrap/lib/Form";



class SearchCustomer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { searchText: '' }
        this.handleCustomerSearch = this.handleCustomerSearch.bind(this);
        this.handleSearchCustomer = this.handleSearchCustomer.bind(this);
    }

    handleCustomerSearch() {
        this.props.handleCustomerSearch();
    }

    handleSearchCustomer(event) {
        this.props.searchCustomer(event.target.value)
        this.setState({searchText:event.target.value});
    }

    render() {

        return (

            <div className="form-d mb-0 pull-left c-search-block">
                <div id="results" className="customer-search-results">
                    <Form horizontal>
                        <input type="search"
                            ref="searchBox"
                            name="customerSearchbox"
                            placeholder="Search for Customers"
                            value={this.state.searchText}
                            className="searchTerm"
                            onChange={this.handleSearchCustomer} />
                        {!_isEmpty(this.props.customerArr) && this.props.showCustomerList ? <ul className="pointer">{this.props.customerArr}</ul> : ''}
                        <span className="reg-customer-serach" onClick={this.handleCustomerSearch} ></span>
                    </Form>
                </div>
            </div>

        )

    }

}
export default SearchCustomer;