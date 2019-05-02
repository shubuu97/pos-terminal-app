import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import _set from 'lodash/set';
import _isArray from 'lodash/isArray';
import _find from 'lodash/find';
// Redux Form Imports
import { reduxForm, Field, FormSection } from 'redux-form';
// MaterialUi Imports
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import RemoveCircleIcons from '@material-ui/icons/RemoveCircleOutline';
import AddIcons from '@material-ui/icons/AddCircleOutline';

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 35;
    const left = 35;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const styles = theme => ({
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 100,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
    },
});

const DialogTitle = withStyles(theme => ({
    root: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing.unit * 2,
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing.unit,
        top: theme.spacing.unit,
        color: theme.palette.grey[500],
    },
}))(props => {
    const { children, classes, onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

class Customer extends React.Component {

    state = {
        open: false,
        qty: 0,
        fromInfoView: false
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    incrementer = () => {
        this.setState({ qty: this.state.qty + 1 })
    }

    decrementer = () => {
        if (this.state.qty > 0) {
            this.setState({ qty: this.state.qty - 1 })
        }
    }

    addToCart = (index, qty) => {
        this.props.addToCart(this.props.product, this.props.cartItems, this.props.cart, qty, this.props.dispatch);
        this.setState({ qty: 0, fromInfoView: true })
    }

    render() {
        let { handleSubmit, fullScreen } = this.props;
        return (
            <div>
                <Dialog
                    fullWidth='100%'
                    open={this.props.open}
                    onClose={this.props.onClose}
                    aria-labelledby="form-dialog-title"
                    fullWidth
                >
                    <DialogTitle id="customized-dialog-title" onClose={this.props.handleClose}>
                        {this.props.title}
                    </DialogTitle>
                    <DialogContent>
                        <div className="mui-row mt-20 product-details-modal">
                            <div className="mui-col-md-6 pop-img">
                                <img src={_get(this.props.productDetails, 'image', '')} alt={_get(this.props.productDetails, 'image', '')} />
                            </div>
                            <div className="mui-col-md-6">
                                <div className='flex-column fwidth'>
                                    <div className='truncate'>
                                        <span className="each-card-name">{_get(this.props.productDetails, 'name', '')}</span>
                                    </div>
                                    <div className='truncate mt-5'>
                                        <span className="each-card-code-head text-titlehead">SKU : </span>
                                        <span className='each-card-code'>{_get(this.props.productDetails, 'sku', '')}</span>
                                    </div>
                                    <div className="each-card-price flex-row">
                                        {_get(this.props.productDetails, 'salePrice.currencyCode', '')} {_get(this.props.productDetails, 'salePrice.price', 0).toFixed(2)}
                                        <div className='indicator'></div>
                                    </div>
                                    {_get(this.props.inventoryDetails, 'quantity', 0) <= 0 ?
                                        <div className='truncate'>
                                            <span className="each-card-code-head">Out of stock</span>
                                        </div> : ''
                                    }
                                    <div className='expanded-options'>
                                        <div className="qty-block">
                                            <span className='option-title'>Qty:</span>
                                            <div className='qty-btn'>
                                                <RemoveCircleIcons onClick={() => this.decrementer()} style={{ fontSize: '2.7em' }} />
                                                <span className='quantity'>{this.state.qty}</span>
                                                <AddIcons onClick={() => this.incrementer()} style={{ fontSize: '2.7em' }} />
                                            </div>
                                        </div>
                                        {this.state.qty > 0 ?
                                            <div className='button-section flex-row '>
                                                <Button className='btnmodalprimary' variant="outlined" onClick={() => this.addToCart(this.props.index, this.state.qty, this.state.fromInfoView)}>Add To Cart</Button>
                                            </div> : ''
                                        }
                                    </div>
                                    <div className='truncate'>
                                        <span className="each-card-code-head text-titlehead">UPC : </span>
                                        <span className='each-card-code'>{_get(this.props.productDetails, 'upcCode', '')}</span>
                                    </div>
                                    <div className='truncate'>
                                        <span className="each-card-code-head text-titlehead">Availability : </span>
                                        <span className='each-card-code'>{_get(this.props.inventoryDetails, 'quantity', 0)} item(s) </span>
                                    </div>
                                    <div className='truncate mt-10'>
                                        <span className="each-card-code-head text-titlehead">Description : </span><br />
                                        <span className='each-card-code pro-description'>{_get(this.props.productDetails, 'description', '')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogContent>

                </Dialog>
            </div>
        );
    }
}

Customer = reduxForm({
    form: 'CustomerForm'
})(Customer)

export default Customer;