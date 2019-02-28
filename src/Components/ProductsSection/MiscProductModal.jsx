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
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class AlertDialogSlide extends React.Component {

    state = {
        name: '',
        upcCode: '',
        isTaxable: false,
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
            errorCb: errorMethod
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
        let data = { ...this.state };
        let salePrice = {
            price: Number(this.state.price),
            currencyCode: "$",
        }
        data.salePrice = salePrice;
        data.upcCode = Number(data.upcCode);
        data.retailerId = localStorage.getItem('retailerId');
        delete data.price;
        let url = 'MiscProduct/Create';
        this.saveMiscProduct(url, data, this.handleSaveMiscProductSuccess, this.handleSaveMiscProductError);
    }

    handleAddToCart = (miscProduct) => {
        let cartItems = _get(this, 'props.cart.cartItems', []);
        let doc = {};
        _set(doc, 'product', _get(this.props, 'miscProduct', {}));
        // _set(doc, 'product.name', _get(this.state, 'name', ''));
        // _set(doc, 'product.salePrice.currencyCode', _get(this.state, 'giftCard.value.currencyCode', ''));
        // _set(doc, 'product.salePrice.price', _get(this.state, 'giftCard.value.amount', 0));
        let data = {
            id: _get(this.props, 'miscProduct.id', ''),
            // value: _get(this.state, 'giftCard.value', {}),
            doc: doc,
        }
        let reqObj = [
            ...cartItems,
            {
                ...data,
                qty: 1,
                saleType: 0,
            }
        ];
        this.props.dispatch(commonActionCreater(reqObj, 'CART_ITEM_LIST'));
        this.props.handleClose();
    }

    handleChange = (e, name) => {
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
                    <DialogTitle id="alert-dialog-slide-title">
                        {`Miscellaneous Product`}
                    </DialogTitle>
                    <DialogContent>
                        <div>
                            <div className="mui-row">
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
                            <div className="mui-row">
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
                            <div className="mui-row flex-row align-center">
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
                                        control={<Checkbox onChange={(event, value) => this.handleChange(value, 'isTaxable')} value="isTaxable" color="primary" />}
                                        label="Taxable"
                                    />
                                </div>

                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.props.handleClose()} color="primary">
                            Cancel
                    </Button>
                        <Button onClick={() => this.addMiscProduct()} color="primary">
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

export default connect(mapStateToProps)(AlertDialogSlide);