import React from 'react';
import Redirect from "react-router/Redirect";
import Panel from 'react-bootstrap/lib/Panel';
import PanelGroup from 'react-bootstrap/lib/PanelGroup';
import "bootstrap/dist/css/bootstrap.css";
import { categoryData } from '../constants/categoryData';
import _isEmpty from 'lodash/isEmpty';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';



class OptionSideBar extends React.Component {
    constructor(props) {
        super(props);

    }

    handleCheckOut = ()=>
    {
    this.props.toggleDrawer();
    }
    handleOrderHistory = ()=>
    {
        this.props.toggleDrawer();
        this.props.openCustomerHistory();
    }
    handleOnHoldOrders = () =>
    {
        this.props.toggleDrawer();
        this.props.openOnHoldHistoryContainer()
    }
    refreshProducts = ()=>
    {
        this.props.toggleDrawer();
        this.props.refreshProducts();

    }
    componentWillReceiveProps(props){
    
        if(props.refreshTime && props.refreshTime!==''){
          this.refreshTime = props.refreshTime.toString().substring(4,21);
          this.forceUpdate();
        }
    }
    render() {

        return (
            <div className="OptionSideBarParent">
            <PanelGroup accordion id="category-bar" defaultActiveKey="0" className="leftdrawer-panel">

                <Panel>
                    <Panel.Heading>
                        <Panel.Title>
                            <ListGroupItem className="titlelistitem">CHECKOUT</ListGroupItem>
                        </Panel.Title>
                    </Panel.Heading>
                    <ListGroup>
                        <ListGroupItem onClick={this.handleCheckOut}>Checkout</ListGroupItem>
                        <ListGroupItem onClick={this.handleOrderHistory}>Order History</ListGroupItem>
                        <ListGroupItem onClick={this.handleOnHoldOrders}>On-hold Orders</ListGroupItem>
                        <ListGroupItem onClick={this.refreshProducts}>{"Refresh Products"+this.refreshTime}
                    </ListGroupItem>
                    </ListGroup>
                    <Panel.Heading>
                        <Panel.Title>
                            <ListGroupItem className="titlelistitem">SESSION MANAGEMENT</ListGroupItem>
                        </Panel.Title>
                    </Panel.Heading>
                    <ListGroup>
                        <ListGroupItem onClick={this.handleCheckOut} >Session Management</ListGroupItem>
                    </ListGroup>
                    <Panel.Heading>
                        <Panel.Title>
                            <ListGroupItem className="titlelistitem">CUSTOMERS</ListGroupItem>
                        </Panel.Title>
                    </Panel.Heading>
                    <ListGroup>
                        <ListGroupItem>Customer List</ListGroupItem>
                    </ListGroup>
                    <Panel.Heading>
                        <Panel.Title>
                            <ListGroupItem className="titlelistitem">INVENTORY</ListGroupItem>
                        </Panel.Title>
                    </Panel.Heading>
                    <ListGroup>
                        <ListGroupItem>Manage Stocks</ListGroupItem>
                    </ListGroup>
                    <Panel.Heading>
                        <Panel.Title>
                            <ListGroupItem className="titlelistitem">SETTING</ListGroupItem>
                        </Panel.Title>
                    </Panel.Heading>
                    <ListGroup>
                        <ListGroupItem>General</ListGroupItem>
                        <ListGroupItem>Syncronization</ListGroupItem>
                        <ListGroupItem>Account</ListGroupItem>
                        <ListGroupItem onClick={()=>this.props.onLogout()}>Logout</ListGroupItem>

                    </ListGroup>
                </Panel>
            </PanelGroup>
            </div>
        )

    }

}

export default OptionSideBar;