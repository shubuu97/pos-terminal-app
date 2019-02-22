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
import Modal from '@material-ui/core/Modal';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

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


const styles = theme => ({
    paper: {
        position: 'relative',
        width: '90%',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
    },
});

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class OrderRefund extends React.Component {
    state = {
        orderId: '',
    }

    componentDidMount() {

    }
    rand() {
        return Math.round(Math.random() * 20) - 10;
    }

    getModalStyle() {
        const top = 10;
        const left = 3;

        return {
            top: `${top}%`,
            left: `${left}%`,
            // transform: `translate(-${top}%, -${left}%)`,
        };
    }
    handleChange = (e, index) => {
        let quantity = _get(e, 'target.value', 0);
        this.props.updateReturnQuantity(quantity, index);
    }

    showItemList = () => {
        const { selectedOrder } = this.props;
        // let orderData = _find(salesList, { sale: { id: this.state.orderId } });
        let listItems = _isArray(selectedOrder.saleParts) ? selectedOrder.saleParts.map((item, index) => (
            <tr>
                <td>{_get(item, 'product.name', '')}</td>
                <td>{(_get(item, 'saleItem.itemRegularTotal.amount', 0)/_get(item, 'saleItem.qty', 0))}</td>
                <td>{_get(item, 'saleItem.qty', 0)}</td>
                <td>
                    <input name={`returnQty-${index}`} value={_get(item, 'saleItem.returnQty', 0)} onChange={(e) => this.handleChange(e, index)} />
                </td>
                <td>{(_get(item, 'saleItem.itemRefundAmount.amount', 0))}</td>
                <td>{(_get(item, 'saleItem.itemRegularTotal.amount', 0)/_get(item, 'saleItem.qty', 0)) * _get(item, 'saleItem.returnQty', 0) + _get(item, 'product.tax', 0)}</td>
            </tr>
        )) : (
                <tr>
                    <td>Cell 1-1</td>
                    <td>Cell 1-2</td>
                    <td>Cell 1-2</td>
                    <td>Cell 1-2</td>
                    <td>Cell 1-2</td>
                    <td>Cell 1-2</td>
                    <td>Cell 1-2</td>
                </tr>
            )
        return (
            <React.Fragment>
                {listItems}
            </React.Fragment>
        )
    }

    render() {
        const { classes } = this.props;
        return (
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.props.open}
                onClose={this.props.handleClose}
                disableBackdropClick={true}
            >
                <div
                    style={this.getModalStyle()}
                    className={classes.paper}>
                    <Typography variant="h6" id="modal-title">
                        Refund Order
                    </Typography>
                    <table className="mui-table mui-table--bordered">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Return Qty</th>
                                <th>SubTotal</th>
                                <th>Row Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.showItemList()}
                        </tbody>
                    </table>
                    <div className="mui-row" style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" onClick={() => this.props.handleClose()}>CANCEL </Button>
                        <Button style={{ marginLeft: '15px' }} variant="contained" onClick={() => this.props.handleRefund()}>REFUND </Button>
                    </div>
                </div>
            </Modal>

        );
    }
}

OrderRefund.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    let { customerSalesList } = state;
    let salesList = customerSalesList.lookUpData || [];

    return {
        salesList,
    }
}


export default connect(mapStateToProps)(withStyles(styles)(OrderRefund));