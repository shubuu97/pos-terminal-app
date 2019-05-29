import React from 'react';
import PouchDb from 'pouchdb';
import PAM from "pouchdb-adapter-memory";
// import { Detector } from 'react-detect-offline';
/* Lodash Imports */
import _get from 'lodash/get';
import _findIndex from 'lodash/findIndex';
import _isArray from 'lodash/isArray';
/* Dinero Import */
import Dinero from 'dinero.js'
/* Material import */
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress';
/* Material Icons */
import PersonAdd from '@material-ui/icons/PersonAddOutlined';
import History from '@material-ui/icons/History';
/* Redux Imports */
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import { commonActionCreater } from '../../../Redux/commonAction';
/* Global Imports */
import ReactSelect from '../../../Global/Components/ReactSelect/async-react-select';
import globalClearCart from '../../../Global/PosFunctions/clearCart';
import addGuestToCart from '../../../Global/PosFunctions/addGuestToCart';
import splitDotWithInt from '../../../Global/PosFunctions/splitDotWithInt'
/* Component Imports */
import CalculationSection from './CalculationSection';
import Customer from '../Customer';



PouchDb.plugin(PAM);
PouchDb.plugin(require('pouchdb-quick-search'));
const styles = theme => ({
    barColorPrimary: {
        backgroundColor: '#da2020',
    },
    darkColor: {
        background: theme.palette.secondary.light,
        color: theme.palette.secondary.text,
        height: '50px'
    }
})



class CannabisCustomerTab extends React.Component {

    constructor() {
        super();
        this.state = {
            open: false,
            value: ''
        }
    }

    handleClickProceed = () => {
        this.props.dispatch(commonActionCreater(3, 'SWITCH_TAB_NUMBER'))
    }

    handleClearCart = () => {
        globalClearCart(this.props.dispatch);
        addGuestToCart(this.props.dispatch);
    };

    handleHideWhenOffline = ({ online }, onlineContent, offlineContent) => {
        if (online) {
            return onlineContent
        }
        else
            return offlineContent
    }

    applyLoyaltyDiscount = () => {
        let loyaltyPoints = this.state.loyalty;
        let cartDiscountObj = {}
        cartDiscountObj.cartItems = _get(this.props, 'cart.cartItems', [])
        cartDiscountObj.prevCart = _get(this, 'props.cart', {});
        cartDiscountObj.loyaltyPoints = splitDotWithInt(loyaltyPoints)
        this.props.dispatch(commonActionCreater(cartDiscountObj, 'CART_ITEM_LIST'));
        this.setState({
            loyalty: '',
            loyaltyValue: 0
        })
    }

    disablePaymentTab = () => {
        let result = this.props.disablePaymentTab()
        return result
    }

    render() {
        let { checkoutactionArea, checkoutMainPart, checkoutCustomerArea, checkoutcalcArea, checkoutcartArea, guest, employee, customer } = this.props
        const { classes } = this.props;
        return (
            <div className="customer-section" >
                <div className="cannabis-customer-main flex-column align-center" style={{ height: checkoutcartArea }}>
                    {
                        _get(this.props, 'customerQueue.customer.queueId', false) ?
                            <div className='flex-row fwidth flex-wrap pt-20'>
                                <div className='cannabis-selected-customer flex-column pad-10 pl-20'>
                                    <span className='cannabis-heading'>Name</span>
                                    <span className='cannabis-value'>{_get(this.props, 'customerQueue.customer.customer.customer.firstName', '')} {_get(this.props, 'customerQueue.customer.customer.customer.lastName', '')}</span>
                                </div>
                                <div className='cannabis-selected-customer flex-column pad-10 pl-20'>
                                    <span className='cannabis-heading'>State</span>
                                    <span className='cannabis-value'>{_get(this.props, 'customerQueue.customer.customer.billingAddress.state', '...')}</span>
                                </div>
                                <div className='cannabis-selected-customer flex-column pad-10 pl-20'>
                                    <span className='cannabis-heading'>Med ID</span>
                                    <span className='cannabis-value'>{_get(this.props, 'customerQueue.customer.customer.medicalLicenseNumber', '...')}</span>
                                </div>
                                <div className='cannabis-selected-customer flex-column pad-10 pl-20'>
                                    <span className='cannabis-heading'>ID</span>
                                    <span className='cannabis-value'>{_get(this.props, 'customerQueue.customer.customer.id', '...')}</span>
                                </div>
                                <div className='cannabis-selected-customer flex-column pad-10 pl-20'>
                                    <span className='cannabis-heading'>Gram Limit</span>
                                    <span className='cannabis-value'>{_get(this.props, 'customerQueue.customer.customer.gramLimit', '100')}</span>
                                </div>
                                <div className='cannabis-selected-customer flex-column pad-10 pl-20'>
                                    <span className='cannabis-heading'>Plant Count Limit</span>
                                    <span className='cannabis-value'>{_get(this.props, 'customerQueue.customer.customer.plantCountLimit', '20')}</span>
                                </div>

                            </div>
                            :
                            <div className='flex-column align-center no-customer-selected'>
                                <span className='select-new-customer-text'>Please Select a Customer from the Queue</span>
                                <Button
                                    className='mr-10'
                                    variant='contained'
                                    color="primary"
                                    style={{ width: '50%' }}
                                    onClick={() => this.props.handleClickOpenCustomer()}
                                >Customer Queue</Button>
                            </div>
                    }

                </div>
                <div className="order-amount-section">
                    <LinearProgress
                        variant="buffer"
                        value={_get(this.props, 'cart.cartQty', 0) * 10}
                        classes={
                            _get(this.props, 'cart.cartQty', 0) > 10 ?
                                { barColorPrimary: classes.barColorPrimary } : {}
                        }
                        style={{
                            width: '100%',
                            height: '15px',
                            borderRadius: '8px',
                        }}
                    />
                    <CalculationSection
                        checkoutcalcArea={checkoutcalcArea}
                    />
                    <div className='button-section flex-row ' style={{ height: checkoutactionArea }}>
                        <Button className='mr-20 btnsecondary' variant="outlined" onClick={this.handleClearCart}>Clear</Button>
                        <Button className={_get(this, 'props.cartItems', []).length ? 'mr-20 btnsecondary' : 'mr-20 btnsecondary disable-button'} variant="outlined" onClick={this.props.handleClickOpen}>Hold</Button>
                        <Button className={!(this.disablePaymentTab()) ? 'btnprimary' : 'btnprimary disable-button'} style={{ flex: 1 }} onClick={this.handleClickProceed} variant="contained">Proceed</Button>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    let customer = _get(state, 'cart.customer');
    let customerQueue = _get(state, 'customerQueue');
    let cart = _get(state, 'cart');
    let redemptionRules = _get(state, 'RedemptionRules.lookUpData.redemptionRule', {})
    return { customer, cart, redemptionRules, customerQueue }
}

export default connect(mapStateToProps)(withStyles(styles)(CannabisCustomerTab));

