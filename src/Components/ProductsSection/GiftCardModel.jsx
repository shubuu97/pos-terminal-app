import React from 'react';
import PropTypes from 'prop-types';
import moment from "moment";
/* Lodash Imports */
import _get from 'lodash/get';
import _set from 'lodash/set';
import _isArray from 'lodash/isArray';
import _find from 'lodash/find';
/* Redux Imports */
import { commonActionCreater } from '../../Redux/commonAction';
import genericPostData from '../../Global/dataFetch/genericPostData';

/* Material Imports */
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import Modal from '@material-ui/core/Modal';

import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
/* Material Icons */



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

class GiftCardModel extends React.Component {
    state = {
        giftCard: {
            giftCode: '',
            value: {
                amount: '',
                currencyCode: '$',
            }
        },
    }

    componentDidMount() {

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
            if (Number(val) < 5 || Number(val) > 100) {
                alert('value should be between 5 and 100 $')
            }
        }
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
                        Open Gift Card
                    </Typography>
                    <div className="mui-row">
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
                    <div className="mui-row">
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
                    <div className="mui-row" style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" onClick={() => this.props.handleClose()}>CANCEL </Button>
                        <Button style={{ marginLeft: '15px' }} variant="contained" onClick={() => this.addGiftCard()}>Add To Cart </Button>
                    </div>
                </div>
            </Modal>

        );
    }
}

GiftCardModel.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    let { cart, giftCardData } = state;
    let giftCard = _get(giftCardData, 'lookUpData', {});

    return {
        cart,
        giftCard,
    }
}


export default connect(mapStateToProps)(withStyles(styles)(GiftCardModel));