import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty'
/* Redux Imports */
import { connect } from 'react-redux';
import { commonActionCreater } from '../Redux/commonAction';
/* Material Imports */
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
/* Global Imports */
import globalClearCart from '../Global/PosFunctions/clearCart'
import globalHoldCart from '../Global/PosFunctions/holdCart'
import globalApplyCart from '../Global/PosFunctions/applyCart'


function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class AlertCartClear extends React.Component {

    constructor() {
        super();
        this.state = {
            Title: '',
            holdedItems: []
        }
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleHold = () => {
        const { firstName, lastName } = _get(this, 'props.cart.customer.customer', '')
        let title = _get(this, 'state.Title', '')
        globalHoldCart(this.props.dispatch, this.props.cart, (title || ''), 'Guest Customer');

        let newHoldObj = {};
        newHoldObj.cart = this.props.cart
        newHoldObj.title = title;
        newHoldObj.customerName = firstName + ' ' + lastName;

        this.setState({
            holdedItems: [...this.props.holdCartData, newHoldObj]
        }, () => {
            this.applyCart()
            this.props.handleCloseAlertCartClear();
            this.props.handleCloseOnHold();
        })

    };

    handleClearCart = () => {
        globalClearCart(this.props.dispatch);
        this.setState({
            holdedItems: [...this.props.holdCartData]
        }, () => {
            this.applyCart()
            this.props.handleCloseAlertCartClear();
            this.props.handleCloseOnHold();
        })

    }

    applyCart = () => {
        let holdCartData = this.props.holdCartData
        globalApplyCart(this.props.dispatch, holdCartData[this.props.index].cart)
        let unHoldedCart = holdCartData[this.props.index]
        this.props.dispatch(commonActionCreater(unHoldedCart, 'ON_HOLD_DATA'));
        this.deleteHold(this.props.index);
    }

    deleteHold = (index) => {
        let holdCartData = [...this.state.holdedItems]
        holdCartData.splice(index, 1);
        let reqObj = [
            ...holdCartData
        ]
        this.props.dispatch(commonActionCreater(reqObj, 'DELETE_HOLD_CART_ITEM'));
    }


    render() {
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.props.handleCloseAlertCartClear}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">
                        {"Cart is not Empty"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Would you like to hold or clear the cart
                        </DialogContentText>
                        <TextField
                            id="outlined-name"
                            label="Title"
                            defaultValue={this.state.default}
                            onChange={this.handleChange('Title')}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClearCart} className='btnmodalsecondary' variant="outlined">
                            Clear Cart
                        </Button>
                        <Button onClick={this.handleHold} className='btnmodalprimary' variant="outlined">
                            Hold Cart
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state) {
    let { cartHoldData, type } = state;
    let unHoldedItem = _get(cartHoldData, 'unHoldedItem', []);

    return {
        unHoldedItem,
        type
    }
}

export default connect(mapStateToProps)(AlertCartClear);