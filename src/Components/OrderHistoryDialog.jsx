import React from 'react';
import PropTypes from 'prop-types';
import moment from "moment";
/* Lodash Imports */
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _isArray from 'lodash/isArray';
import _find from 'lodash/find';
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
        const orderHistory = !_isEmpty(salesList) && _isArray(salesList) && salesList.map((custData, index) => (
            <div onClick={() => this.onSelectOrder(custData)} key={index} className="card">
                <div className={_get(this.state, 'orderId', '') === _get(custData, 'sale.id', '') ? "active" : ""}>
                    <div className="mui-col-md-12">
                        {moment(_get(custData, 'sale.saleTimeStamp.seconds', 0) * 1000).format('MM/DD/YYYY')}
                    </div>
                    <div className="mui-row" style={{ paddingLeft: '15px' }}>
                        <div className="">
                            <div className="mui-col-md-8">
                                <label>{`Order Id: ${_get(custData, 'sale.id', '')}`}</label>
                                <br />
                                <span>{`Email: ${_get(custData, 'customer.email', '')}`}</span>
                            </div>
                            <div className="mui-col-md-8">
                                <label>{`Amount: $ ${_get(custData, 'sale.paymentAmount', 0)}`}</label>
                                <br />
                                <span>{`Payment Method: ${_get(custData, 'sale.paymentMethod', '')}`}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ));
        return (
            <div className="content">
                {orderHistory}
            </div>
        )
    }
    showItemList = () => {
        const { salesList } = this.props;
        let orderData = _find(salesList, { sale: { id: this.state.orderId } });
        let listItems = _isArray(orderData.items) ? orderData.items.map((item) => (
            <React.Fragment>
                <td>{item.product}</td>
                <td>{item.originalPrice}</td>
                <td>{item.price}</td>
                <td>{item.qty}</td>
                <td>{item.discount}</td>
                <td>{item.subTotal}</td>
                <td>{item.tax}</td>
                <td>{item.rowTotal}</td>
            </React.Fragment>
        )) : (
                <React.Fragment>
                    <td>Cell 1-1</td>
                    <td>Cell 1-2</td>
                    <td>Cell 1-2</td>
                    <td>Cell 1-2</td>
                    <td>Cell 1-2</td>
                    <td>Cell 1-2</td>
                    <td>Cell 1-2</td>
                    <td>Cell 1-2</td>
                </React.Fragment>
            )
        return (
            <tr>
                {listItems}
            </tr>
        )
    }
    populateOrderData = () => {
        const { salesList } = this.props;
        let selectedOrder = _find(salesList, { sale: { id: this.state.orderId } });
        return (
            <div className="">
                <div className={"mui-row"} >
                    <div className="card" style={{ justifyContent: 'center' }}>
                        {moment(_get(selectedOrder, 'sale.saleTimeStamp.seconds', 0) * 1000).format('MM/DD/YYYY')}
                        <div className="mui-row">
                            <div className="mui-col-md-4" style={{ display: 'flex', paddingLeft: '29px' }}>
                                <label >{` $ ${_get(selectedOrder, 'sale.paymentAmount', 0)}`}</label>
                            </div>
                            <div className="mui-col-md-8">
                                <label >{`Status: Complete`}</label>
                                <br />
                                <label >{`Created Date: ${moment(_get(selectedOrder, 'sale.saleTimeStamp.seconds', 0) * 1000).format('MM/DD/YYYY')}`}</label>
                                <br />
                                <label >{`Served By ${_get(selectedOrder, 'sale.terminalId', '')}`}</label>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="mui-row" style={{ paddingLeft: '5%', paddingRight: '6%' }}>
                            <table class="mui-table mui-table--bordered">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Original Price</th>
                                        <th>Price</th>
                                        <th>Qty</th>
                                        <th>Discount Amount</th>
                                        <th>SubTotal</th>
                                        <th>Tax Amount</th>
                                        <th>Row Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.showItemList()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="card">
                        <div className="mui-row">
                            <div className="mui-col-md-6" style={{ display: 'flex', paddingLeft: '29px' }}>
                            </div>
                            <div className="mui-col-md-6" style={{ paddingRight: '50px' }}>
                                <label >{`Tax: `}</label>
                                <label style={{ float: 'right' }}>{`$ ${_get(selectedOrder, 'sale.tax', '2,62')}`}</label>
                                <br />
                                <label >{`Grand Total: `}</label>
                                <label style={{ float: 'right' }}>{`$ ${_get(selectedOrder, 'sale.total', '31.59')}`}</label>
                                <br />
                                <label >{`Total Paid: `}</label>
                                <label style={{ float: 'right' }}>{`$ ${_get(selectedOrder, 'sale.paymentAmount', '100.00')}`}</label>
                                <br />
                                <label >{`Change: `}</label>
                                <label style={{ float: 'right' }}>{`$ ${_get(selectedOrder, 'sale.change', '0')}`}</label>
                            </div>
                        </div>
                        <div className="mui-row" style={{ display: 'flex', justifyContent: 'center'}}>
                            <Button variant="contained">ORDER PRINT </Button>
                            <Button style={{marginLeft: '15px'}} variant="contained">REFUND </Button>
                        </div>
                    </div>
                </div>
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
                    <div className='history-section'>
                        <div className='history-header'>
                            <IconButton color="inherit" onClick={this.props.handleClose} aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                            <span className='ml-20'>Order History</span>
                        </div>
                        <div className="mui-container-fluid">
                            <div className="mui-col-md-4 pad-none"  >
                                {this.populateOrderHistory()}
                            </div>
                            {
                                this.state.orderId !== '' &&
                                <div className="mui-col-md-8 pad-none"  >
                                    {this.populateOrderData()}
                                </div>
                            }
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