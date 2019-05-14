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
import splitDotWithInt from '../../Global/PosFunctions/splitDotWithInt';
let regex = /^\d*[\.\d]{1,3}$/;



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
        isTaxable: true
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
        alert('Something went wrong!');
    }

    addMiscProduct = (e, index) => {
        if (this.state.name == '') {
            alert('Please enter a product name!')
        } else {
            let data = { ...this.state };
            let salePrice = {
                amount: splitDotWithInt(this.state.price),
                currency: "USD",
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
        this.setState({
            ...this.state,
            [name]: e.target.value
        })
    }

    handleChangePrice = (e, name) => {
        let value = e.target.value;
        if (regex.test(value)) {
            this.setState({
                ...this.state,
                [name]: e.target.value
            })
        }
        else if (regex.test(value.substring(0, value.length - 1))) {
            this.setState({
                ...this.state,
                [name]: value.substring(0, value.length - 1)
            })
        }
        else {
            this.setState({
                ...this.state,
                [name]: ''
            })
        }
    }

    handleCheckBoxChange = (val, name) => {
        this.setState({
            [name]: val
        })
    }
    handleInputChange = num => event => {
        let focusItemValue = this.state.price;
        if (num != '<') {
            focusItemValue = (focusItemValue || '') + num;
            let regex = /^\d*[\.\d]{1,3}$/;
            if (!regex.test(focusItemValue))
                return false;

        }
        else {
            focusItemValue = '';
        }
        this.setState({ price: focusItemValue });
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
                        <div className="d-flex">
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
                                            onChange={(e) => this.handleChangePrice(e, 'price')}
                                            margin="outline"
                                            onFocus={() => this.setState({ currentFocus: 'price' })}
                                            fullWidth
                                            // helperText='Between 5$-100$'
                                            variant="outlined"
                                            className='mt-10'
                                        />
                                    </div>
                                    <div className="mui-col-md-6 mt-10">
                                        <FormControlLabel
                                            control={<Checkbox onChange={(event, value) => this.handleCheckBoxChange(value, 'isTaxable')} value="isTaxable" color="primary" checked={this.state.isTaxable} />}
                                            label="Taxable"
                                        />
                                    </div>

                                </div>
                            </div>
                            <div className="numpad-global ml-20 mt-10">
                                <div className='card numpad-card' style={{}}>
                                    <span className='card-title'>Numpad</span>
                                    <div className='flex-row flex-wrap justify-center pt-15'>
                                        <div className='key small-key' onClick={this.handleInputChange('1')}>1</div>
                                        <div className='key small-key' onClick={this.handleInputChange('2')}>2</div>
                                        <div className='key small-key' onClick={this.handleInputChange('3')}>3</div>
                                        <div className='key small-key' onClick={this.handleInputChange('4')}>4</div>
                                        <div className='key small-key' onClick={this.handleInputChange('5')}>5</div>
                                        <div className='key small-key' onClick={this.handleInputChange('6')}>6</div>
                                        <div className='key small-key' onClick={this.handleInputChange('7')}>7</div>
                                        <div className='key small-key' onClick={this.handleInputChange('8')}>8</div>
                                        <div className='key small-key' onClick={this.handleInputChange('9')}>9</div>
                                        <div className='key small-key' onClick={this.handleInputChange('.')}>.</div>
                                        <div className='key small-key' onClick={this.handleInputChange('0')}>0</div>
                                        <div className='key small-key' onClick={this.handleInputChange('<')}>clr</div>
                                        <div className='small-key'></div>
                                        <div className='key big-key'>Enter</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.props.handleClose()} className='btnmodalsecondary' variant="outlined">
                            Cancel
                        </Button>

                        <Button onClick={() => this.addMiscProduct()} className='btnmodalprimary' variant="outlined">
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