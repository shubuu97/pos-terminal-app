import React from 'react';
import Dinero from 'dinero.js';
/* Lodash Imports */
import _get from 'lodash/get';
import _set from 'lodash/set';
import _isArray from 'lodash/isArray';
import _find from 'lodash/find';
import _isEmpty from 'lodash/isEmpty'
/* Redux Imports */
import { reduxForm, Field, FormSection } from 'redux-form';
/* Material Imports */
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import RemoveCircleIcons from '@material-ui/icons/RemoveCircleOutline';
import AddIcons from '@material-ui/icons/AddCircleOutline';
/* Global Components */
import ReactSelect from '../FormComponents/ReactSelect'


let DineroInit = (amount, currency, precision) => (
    Dinero({ amount: parseInt(amount) || 0, currency: currency || 'USD', precision: precision || 2 })
)

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

class MaterialUIModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            qty: 0,
            fromInfoView: false,
            packageSelected: {}
        };
    }

    componentDidMount() {

    }

    handleClose = () => {
        this.setState({ open: false });
    };

    incrementer = () => {
        if( this.state.qty < _get(this.props.inventoryDetails, 'quantity', 0))
        this.setState({ qty: this.state.qty + 1 })
    }

    decrementer = () => {
        if (this.state.qty > 0) {
            this.setState({ qty: this.state.qty - 1 })
        }
    }

    addToCart = (index, qty) => {
        this.props.addToCart(this.props.product, this.props.cartItems, this.props.cart, qty, this.props.dispatch, this.state.packageSelected);
        this.setState({ qty: 0, fromInfoView: true })
    }

    handleSelectedPackage = (packageSelected) => {
        this.setState({
            packageSelected
        })
    }

    render() {
        let { handleSubmit, fullScreen } = this.props;
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    onClose={this.props.onClose}
                    aria-labelledby="form-dialog-title"
                    fullWidth
                    maxWidth='md'
                >
                    <DialogTitle id="customized-dialog-title" onClose={this.props.handleClose}>
                        {this.props.title}
                    </DialogTitle>
                    <DialogContent>
                        <div className="mui-row mt-20 product-details-modal">
                            <div className="mui-col-md-4 pop-img">
                                <img src={_get(this.props.productDetails, 'image', '')} alt={_get(this.props.productDetails, 'image', '')} />
                            </div>
                            <div className="mui-col-md-8">
                                <div className='flex-column fwidth'>
                                    <div className='truncate'>
                                        <span className="each-card-name">{_get(this.props.productDetails, 'name', '')}</span>
                                    </div>
                                    <div className='truncate mt-5'>
                                        <span className="each-card-code-head text-titlehead">SKU : </span>
                                        <span className='each-card-code'>{_get(this.props.productDetails, 'sku', '')}</span>
                                    </div>
                                    <div className="each-card-price flex-row">
                                        {DineroInit(_get(this.props.productDetails, 'salePrice.amount', 0)).toFormat('$0,0.00')}
                                        <div className='indicator'></div>
                                    </div>
                                    {_get(this.props.inventoryDetails, 'quantity', 0) <= 0 ?
                                        <div className='truncate'>
                                            <span className="each-card-code-head">Out of stock</span>
                                        </div> : ''
                                    }
                                    <div className='expanded-options flex-row justify-space-between'>
                                        {
                                            this.props.cannabisRetailer && !(_get(this.props, 'productDetails.productType', 3) == 3) ?
                                                <div className='flex-row justify-space-between align-center' style={{ width: '100%' }}>
                                                    <ReactSelect
                                                        name='Select Package'
                                                        dispatch={this.props.dispatch}
                                                        productId={_get(this.props.productDetails, 'id', '')}
                                                        handleSelectedPackage={this.handleSelectedPackage}
                                                    />
                                                    {
                                                        !_isEmpty(this.state.packageSelected) ?
                                                            <div className="mt-10 mbottom-10">
                                                                <Button className='btnmodalprimary' variant="outlined" onClick={() => this.addToCart(this.props.index, this.state.qty, this.state.fromInfoView)}>Add To Cart</Button>
                                                            </div> :
                                                            null
                                                    }
                                                </div>
                                                :
                                                <div className="qty-block">
                                                    <span className='option-title'>Qty:</span>
                                                    <div className='qty-btn'>
                                                        <RemoveCircleIcons onClick={() => this.decrementer()} style={{ fontSize: '2.7em' }} />
                                                        <span className='quantity'>{this.state.qty}</span>
                                                        <AddIcons onClick={() => this.incrementer()} style={{ fontSize: '2.7em' }} />
                                                    </div>
                                                </div>
                                        }
                                        {
                                            this.state.qty > 0 ?
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

MaterialUIModal = reduxForm({
    form: 'CustomerForm'
})(MaterialUIModal)

export default MaterialUIModal;