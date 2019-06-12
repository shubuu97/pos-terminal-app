import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
/* Redux Imports */
import { connect } from 'react-redux';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material Imports */
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
/* Component Imports */
import OrdersTab from './Tabs/OrdersTab';
import CustomersTab from './Tabs/CustomersTab';
import CannabisCustomersTab from './Tabs/CannabisCustomersTab';
import PaymentTab from './Tabs/PaymentTab';
import { commonActionCreater } from '../../Redux/commonAction';

function TabContainer({ children, dir }) {
    return (
        <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
            {children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
    dir: PropTypes.string.isRequired,
};

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: 500,
    },
});

class FullWidthTabs extends React.Component {
    state = {
        value: 0,
    };

    handleChange = (event, value) => {
        this.setState({ value }, () => { this.toggleView() });
    };

    toggleView = () => {
        if (this.state.value == 2) {
            this.props.toggleViewPayment()
        }
        else {
            this.props.toggleViewProduct()
        }
    }

    handleChangeIndex = index => {
        this.setState({ value: index }, () => { this.toggleView() });
    };

    toggleViewPayment = () => {
        this.props.toggleViewPayment()
    }

    toggleViewProduct = () => {
        this.props.toggleViewProduct()
    }
    componentDidUpdate() {
        if (this.props.afterSellRedirectToCart) {
            this.setState({ value: this.props.afterSellRedirectToCart - 1 });
            if (this.props.afterSellRedirectToCart == 1 || this.props.afterSellRedirectToCart == 2) {
                this.props.toggleViewProduct();
            }
            if (this.props.afterSellRedirectToCart == 3) {
                this.props.toggleViewPayment();
            }
            this.props.dispatch(commonActionCreater(0, 'SWITCH_TAB_NUMBER'))
        }
    }


    orderTab = () => {
        // * This function was made to prevent rewriting of code
        const { cart, cartItems } = this.props;
        return (
            <TabContainer>
                <OrdersTab
                    cartItems={cartItems}
                    cart={cart}
                    handleChangeIndex={this.handleChangeIndex}
                    tabValue={this.state.value}
                    {...this.props}
                />
            </TabContainer>
        )
    }
    customersTab = () => {
        // * This function was made to prevent rewriting of code
        const { cart, cartItems } = this.props;
        let cannabisStore = localStorage.getItem('cannabisStore')
        return (
            <TabContainer>
                {
                    cannabisStore ?
                        <CannabisCustomersTab
                            cartItems={cartItems}
                            disablePaymentTab={this.disablePaymentTab}
                            {...this.props}
                        /> :
                        <CustomersTab
                            cartItems={cartItems}
                            {...this.props}
                        />
                }
            </TabContainer>
        )
    }

    disablePaymentTab = () => {
        let disabled = false
        if (_get(this.props, 'cart.cartItems', 0).length <= 0) {
            disabled = true
        }
        if (localStorage.getItem('cannabisStore')) {
            if (_get(this.props, 'cart.cannabisCartLimitPercentage', 0) > 100) {
                disabled = true
            }
            if(Object.entries(this.props.cannabisCustomer).length === 0){
                disabled = true
            }
        }
        return disabled
    }

    render() {
        const { cart, cartItems } = this.props;
        return (
            <div className=''>
                <AppBar position="static" color="default">
                    <Tabs
                        value={this.state.value}
                        onChange={this.handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                    >
                        <Tab label="Cart"
                            className={this.props.cardRefrenceId ? 'disable-button' : null||_get(this.props,'storeClose.storeClose')?'disable-button':null}
                            disabled={this.props.cardRefrenceId ? true : false||_get(this.props,'storeClose.storeClose')? true : false}
                        />
                        <Tab label="Customer"
                            className={this.props.cardRefrenceId ? 'disable-button' : null||_get(this.props,'storeClose.storeClose')?'disable-button':null}
                            disabled={this.props.cardRefrenceId ? true : false||_get(this.props,'storeClose.storeClose')? true : false} />
                        <Tab className={!(this.disablePaymentTab()) ? '' : 'disable-button'} label="Payment" disabled={this.disablePaymentTab()} />
                    </Tabs>
                </AppBar>

                {/* There is no easy way to disable single tab from SwipeableViews */}
                {
                    cartItems.length > 0 ?
                        <SwipeableViews
                            index={this.state.value}
                            onChangeIndex={this.handleChangeIndex}
                        >
                            {this.orderTab()}
                            {this.customersTab()}
                            <TabContainer>
                                <PaymentTab
                                    checkoutMainPart={this.props.checkoutMainPart}
                                />
                            </TabContainer>
                        </SwipeableViews> :
                        <SwipeableViews
                            index={this.state.value}
                            onChangeIndex={this.handleChangeIndex}
                        >
                            {this.orderTab()}
                            {this.customersTab()}
                        </SwipeableViews>
                }
            </div>
        );
    }
}

function mapStateToProps(state) {
    let cartItems = _get(state, 'cart.cartItems', []);
    let cart = _get(state, 'cart', {});
    let cannabisCustomer = _get(state, 'customerQueue.customer', {})
    let afterSellRedirectToCart = _get(state, 'afterSellRedirectToCart.lookUpData')
    let cardRefrenceId = _get(state, 'PaymentDetails.cardRefrenceId');
    let storeClose = _get(state, 'storeClose.lookUpData')


    return { cartItems, cart, afterSellRedirectToCart, cardRefrenceId, cannabisCustomer, storeClose };
}
export default connect(mapStateToProps)(FullWidthTabs);
