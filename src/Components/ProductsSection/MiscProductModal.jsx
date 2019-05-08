import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import _set from 'lodash/set';
import _isArray from 'lodash/isArray';
import _find from 'lodash/find';
/* Redux Imports */
import { commonActionCreater } from '../../Redux/commonAction';
import genericPostData from '../../Global/dataFetch/genericPostData';
import { connect } from 'react-redux';
/* Material Imports */
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import addToCart from '../../Global/PosFunctions/addToCart';

function Transition(props) {
    return <Slide direction="down" {...props} />;
}

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

class MiscProductModal extends React.Component {

    state = {
        name: '',
        upcCode: '',
        isTaxable: true,
        isError: true,
        errorMsg: ''
    }

    rand() {
        return Math.round(Math.random() * 20) - 10;
    }

    saveMiscProduct = (url, data, successMethod, errorMethod) => {
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: data,
            url: url,
            constants: {
                init: 'SAVE_MISC_PRODUCT_DATA_INIT',
                success: 'SAVE_MISC_PRODUCT_DATA_SUCCESS',
                error: 'SAVE_MISC_PRODUCT_DATA_ERROR'
            },
            identifier: 'SAVE_MISC_PRODUCT_DATA',
            successCb: successMethod,
            errorCb: errorMethod,
            dontShowMessage: true
        })
    }

    handleSaveMiscProductSuccess = () => {
        let { miscProduct } = this.props;
        if (miscProduct) {
            this.handleAddToCart(miscProduct);
        }
    }

    handleSaveMiscProductError = () => {
        alert('something went wrong');
    }

    addMiscProduct = (e, index) => {
        if (this.state.name == '') {
            this.setState({ isError: true, errorMsg: 'Please enter product name.' })
        } else {
            this.setState({ isError: false, errorMsg: '' })
            let data = { ...this.state };
            let salePrice = {
                price: Number(this.state.price),
                currencyCode: "$",
            }
            data.salePrice = salePrice;
            data.upcCode = Number(data.upcCode);
            data.retailerId = localStorage.getItem('retailerId');
            data.discountable = true
            delete data.price;
            let url = 'MiscProduct/Create';
            this.saveMiscProduct(url, data, this.handleSaveMiscProductSuccess, this.handleSaveMiscProductError);
        }
    }

    handleAddToCart = (miscProduct) => {
        let cartItems = _get(this, 'props.cart.cartItems', []);
        let cart = _get(this, 'props.cart', {})
        let doc = {};
        _set(doc, 'product', _get(this.props, 'miscProduct', {}));
        let data = {
            id: _get(this.props, 'miscProduct.id', ''),
            doc: doc,
        }
        addToCart(data, cartItems, cart, 1, this.props.dispatch)
        this.props.handleClose();

        // let reqObj = [
        //     ...cartItems,
        //     {
        //         ...data,
        //         qty: 1,
        //         saleType: 0,
        //     }
        // ];
        // let cartDiscountObj = {}
        // cartDiscountObj.type = '$'
        // cartDiscountObj.cartDiscount = _get(this.props, 'cart.cartDiscount.cartDiscountMoney.amount', 0)
        // cartDiscountObj.cartItems = reqObj
    }

    handleChange = (e, name) => {
        if (this.state.name == '') {
            this.setState({ isError: true, errorMsg: 'Please enter product name.' })
        } else {
            this.setState({ isError: false, errorMsg: '' })
        }
        let val = name == 'isTaxable' ? e : _get(e, 'target.value', '');
        this.setState({
            [name]: val,
        })
    }

    render() {
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    TransitionComponent={Transition}
                    keepMounted
                    fullWidth
                    onClose={this.props.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="customized-dialog-title" onClose={this.props.handleClose}>
                        Miscellaneous Product
                    </DialogTitle>
                    <DialogContent>
                        <div>
                            <div className="">
                                <TextField
                                    id="name"
                                    label="Product Name"
                                    value={_get(this.state, 'name', '')}
                                    onChange={(e) => this.handleChange(e, 'name')}
                                    // onBlur={(e) => this.handleBlur(e)}
                                    margin="outline"
                                    fullWidth
                                    type='text'
                                    variant="outlined"
                                    className='mt-10'
                                />
                            </div>
                            <div style={{ color: "red" }}>{this.state.errorMsg}</div>
                            <div className="">
                                <TextField
                                    id="upcCode"
                                    label="Product UPC"
                                    value={_get(this.state, 'upcCode', '')}
                                    type='text'
                                    onChange={(e) => this.handleChange(e, 'upcCode')}
                                    margin="outline"
                                    fullWidth
                                    // helperText='Between 5$-100$'
                                    variant="outlined"
                                    className='mt-10'
                                />
                            </div>
                            <div className=" flex-row align-center">
                                <div className="mui-col-md-6 no-pad">
                                    <TextField
                                        id="price"
                                        label="Product Price"
                                        value={_get(this.state, 'price', '')}
                                        type='number'
                                        onChange={(e) => this.handleChange(e, 'price')}
                                        margin="outline"
                                        fullWidth
                                        // helperText='Between 5$-100$'
                                        variant="outlined"
                                        className='mt-10'
                                    />
                                </div>
                                <div className="mui-col-md-6 mt-10">
                                    <FormControlLabel
                                        control={<Checkbox onChange={(event, value) => this.handleChange(value, 'isTaxable')} value="isTaxable" color="primary" checked={this.state.isTaxable} />}
                                        label="Taxable"
                                    />
                                </div>

                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.props.handleClose()} className='btnmodalsecondary' variant="outlined">
                            Cancel
                        </Button>

                        <Button onClick={() => this.addMiscProduct()} className='btnmodalprimary' variant="outlined" disabled={this.state.isError}>
                            Add To Cart
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state) {
    let { cart, saveMiscProductData } = state;
    let miscProduct = _get(saveMiscProductData, 'lookUpData', {});

    return {
        cart,
        miscProduct,
    }
}

export default connect(mapStateToProps)(MiscProductModal);