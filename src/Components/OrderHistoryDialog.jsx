import React from 'react';
import PropTypes from 'prop-types';
import moment from "moment";
/* Lodash Imports */
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _isArray from 'lodash/isArray';
/* Redux Imports */
import { commonActionCreater } from '../Redux/commonAction'
/* Material Imports */
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';

import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
/* Material Icons */
import DeleteIcons from '@material-ui/icons/DeleteOutline';
/*  */
import applyCart from '../Global/PosFunctions/applyCart';
import genericPostData from '../Global/dataFetch/genericPostData';
import { isArray } from 'util';


const styles = {
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
};

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class OrderHistoryDialog extends React.Component {
    state = {
        orderId: '',
    }

    componentDidMount() {

    }
    onSelectOrder = (custData) => {
        this.setState({
            orderId: _get(custData, 'sale.id', ''),
        })
    }

    populateOrderHistory = () => {
        const { salesList } = this.props;
        console.log('customer sales data', salesList);
        const orderHistory = !_isEmpty(salesList) && _isArray(salesList) && salesList.map((custData, index) => (
            <div key={index} className="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet ">
                <div className="order-date">
                    {new Date(_get(custData, 'sale.saleTimeStamp.seconds', 0) * 1000).toISOString()}
                </div>
                <div className="demo-grid-3 mdl-grid">
                    <div className={_get(this.selectedOrder, 'orderId', '') === _get(custData, 'sale.id', '') ? "active" : ""} key={index} onClick={() => this.onSelectOrder(custData)}>
                        <div className="mdl-cell mdl-cell--1-col">
                            <label>{_get(custData, 'sale.id', '')}</label>
                            <span>{_get(custData, 'customer.email', '')}</span>
                        </div>
                        <div className="oh-right">
                            <label>{"$ " + _get(custData, 'sale.paymentAmount', 0)}</label>
                            <span>{_get(custData, 'sale.paymentMethod', '')}</span>
                        </div>
                    </div>
                </div>
            </div>
        ));
        return (
            <div className="demo-grid-3 mdl-grid">
                {orderHistory}
            </div>
        )
    }
    render() {
        const { classes } = this.props;
        return (
            <div className='hold-dialogue'>
                <Dialog
                    fullScreen
                    open={this.props.open}
                    onClose={this.props.handleClose}
                    TransitionComponent={Transition}
                >
                    <div className='on-hold-section'>
                        <div className='on-hold-header'>
                            <IconButton color="inherit" onClick={this.props.handleClose} aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                            <span className='ml-20'>Order History</span>
                        </div>
                        <div className="d-flex">
                            <div className="col-sm-6 pad-none"  >
                                <div className="pro-list-section">
                                    {this.populateOrderHistory()}
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div >
        );
    }
}

OrderHistoryDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    let { customerSalesList } = state;
    let salesList = customerSalesList.lookUpData || [];

    return {
        salesList,
    }
}


export default connect(mapStateToProps)(withStyles(styles)(OrderHistoryDialog));