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
import { withStyles } from '@material-ui/core/styles';

function Transition(props) {
    return <Slide direction="up" {...props} />;
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

class GiftCardModal extends React.Component {

    state = {
        giftCard: {
            giftCode: '',
            value: {
                amount: '',
                currencyCode: '$',
                isError: true,
                errorMsg: ''
            }
        },
    }

    rand() {
        return Math.round(Math.random() * 20) - 10;
    }

    getExistingGiftCard = (url, data, successMethod, errorMethod) => {
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: data,
            url: url,
            constants: {
                init: 'GET_GIFT_CARD_DATA_INIT',
                success: 'GET_GIFT_CARD__DATA_SUCCESS',
                error: 'GET_GIFT_CARD__DATA_ERROR'
            },
            identifier: 'GET_GIFT_CARD__DATA',
            successCb: successMethod,
            errorCb: errorMethod
        })
    }

    handleGetGiftcardDataSuccess = () => {
        console.log('came in success of gift card get');
        let { giftCard } = this.props;
        if (giftCard) {
            let status = _get(giftCard, 'status', 0);
            if (giftCard.giftCode && status !== 0) {
                giftCard.giftCode = '';
                _set(giftCard, 'value.amount', '');
                this.setState({
                    giftCard,
                })
                alert('this giftcode already exist.');
            } else {
                _set(giftCard, 'value.amount', '');
                _set(giftCard, 'value.currencyCode', '$');
                this.setState({
                    giftCard,
                })
            }
        }
    }

    handleGetGiftCardDataError = () => {
        console.log('came in error of gift card get');
    }

    handleSaveGiftDataSuccess = () => {
        let { giftCard } = this.props;
        if (giftCard) {
            this.handleAddToCart();
        }
    }
    handleSaveGiftDataError = () => {
        alert('something went wrong');
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

    addGiftCard = (e, index) => {
        let data = { ...this.state.giftCard };
        if (!data.id) {
            data.retailerId = localStorage.getItem('retailerId');
            data.storeId = localStorage.getItem('storeId');
            _set(data, 'createdOn.seconds', parseInt((new Date().getTime()) / 1000));
        }
        // _set(data, 'value.amount', this.state.value);
        // _set(data, 'value.currencyCode', '$');
        // delete data.value
        console.log('data for gift card', data);
        let url = 'GiftCard/Create';
        this.getExistingGiftCard(url, data, this.handleSaveGiftDataSuccess, this.handleSaveGiftDataError);
    }

    handleAddToCart = () => {
        let cartItems = _get(this, 'props.cart.cartItems', []);
        let doc = {};
        _set(doc, 'product.id', _get(this.props, 'giftCard.id', ''));
        _set(doc, 'product.isGiftCard', true);
        _set(doc, 'product.name', _get(this.state, 'giftCard.giftCode', ''));
        _set(doc, 'product.salePrice.currencyCode', _get(this.state, 'giftCard.value.currencyCode', ''));
        _set(doc, 'product.salePrice.price', _get(this.state, 'giftCard.value.amount', 0));
        let data = {
            id: _get(this.props, 'giftCard.id', ''),
            value: _get(this.state, 'giftCard.value', {}),
            doc: doc,
        }
        let reqObj = [
            ...cartItems,
            {
                ...data,
                qty: 1,
                saleType: 1,
            }
        ];
        this.props.dispatch(commonActionCreater(reqObj, 'CART_ITEM_LIST'));
        this.props.handleClose();
    }

    handleBlur = (e) => {
        let val = _get(e, 'target.value', '');
        let url = 'GiftCard/GetByCodeAndStore';
        let data = {
            storeId: localStorage.getItem('storeId'),
            code: val,
        }
        this.getExistingGiftCard(url, data, this.handleGetGiftcardDataSuccess, this.handleGetGiftCardDataError);
    }

    handleChange = (e, name) => {
        let val = _get(e, 'target.value', '');
        if(Number(val) < 5 || Number(val) > 100) {
          this.setState({ isError: true, errorMsg: 'Value must be between 5 and 100'})
        } else {
            this.setState({ isError: false, errorMsg: ''})
        }
        if (name === 'giftCode') {
            let giftCard = _get(this.state, 'giftCard', {});
            _set(giftCard, 'giftCode', val);
            this.setState({
                giftCard,
            })

        } else {
            let giftCard = _get(this.state, 'giftCard', {});
            _set(giftCard, 'value.amount', !isNaN(val) ? Number(val) : val);
            this.setState({
                giftCard,
            })
            
        }
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
                        Create Gift Card
                    </DialogTitle>
                    <DialogContent>
                        <div style={this.getModalStyle()}>
                            <div className="">
                                <TextField
                                    id="giftCode"
                                    label="Gift Code"
                                    value={_get(this.state, 'giftCard.giftCode', '')}
                                    onChange={(e) => this.handleChange(e, 'giftCode')}
                                    onBlur={(e) => this.handleBlur(e)}
                                    margin="outline"
                                    fullWidth
                                    type='text'
                                    variant="outlined"
                                    className='mt-10'
                                />
                            </div>
                            <div className="">
                                <TextField
                                    id="value"
                                    label="Value"
                                    value={_get(this.state, 'giftCard.value.amount', '')}
                                    type='number'
                                    onChange={(e) => this.handleChange(e, 'value')}
                                    margin="outline"
                                    fullWidth
                                    helperText='Between 5$-100$'
                                    variant="outlined"
                                    className='mt-10'
                                />
                            </div>
                            <div style={{color: 'red'}}>
                                {this.state.errorMsg}
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.props.handleClose()} className='btnmodalsecondary' variant="outlined">Cancel</Button>
                        <Button disabled={this.state.isError} onClick={() => this.addGiftCard()} className='btnmodalprimary' variant="outlined">Add To Cart</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state) {
    let { cart, giftCardData } = state;
    let giftCard = _get(giftCardData, 'lookUpData', {});

    return {
        cart,
        giftCard,
    }
}


export default connect(mapStateToProps)(GiftCardModal);