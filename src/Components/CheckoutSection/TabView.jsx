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
        this.setState({ value }, () => {this.toggleView()});
    };

    toggleView = () => {
        if(this.state.value == 2){
            this.props.toggleViewPayment()
        }
        else{
            this.props.toggleViewProduct()
        }
    }

    handleChangeIndex = index => {
        this.setState({ value: index }, () => {this.toggleView()});
    };
    toggleViewPayment = () => {
        this.props.toggleViewPayment()
    }

    toggleViewProduct = () => {
        this.props.toggleViewProduct()
    }
    componentDidUpdate(){
      if(this.props.afterSellRedirectToCart){
        this.setState({ value:this.props.afterSellRedirectToCart-1});
        if(this.props.afterSellRedirectToCart==1||this.props.afterSellRedirectToCart==2){
            this.props.toggleViewProduct();
        }
        if(this.props.afterSellRedirectToCart==3){
            this.props.toggleViewPayment();
        }
        this.props.dispatch(commonActionCreater(0,'SWITCH_TAB_NUMBER'))
      }
    }

    render() {
        const { cart,cartItems } = this.props;

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
                        <Tab label="Cart" />
                        <Tab label="Customer" />
                        <Tab label="Payment" />
                    </Tabs>
                </AppBar>
                <SwipeableViews
                    //   axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={this.state.value}
                    onChangeIndex={this.handleChangeIndex}
                >
                    <TabContainer >
                        <OrdersTab
                            cartItems={cartItems}
                            cart={cart}
                            dispatch={this.props.dispatch}
                            checkoutMainPart={this.props.checkoutMainPart}
                            checkoutcalcArea={this.props.checkoutcalcArea}
                            checkoutactionArea={this.props.checkoutactionArea}
                            checkoutcartArea={this.props.checkoutcartArea}
                            handleClickOpen={this.props.handleClickOpen}
                        />
                    </TabContainer>

                    <TabContainer >
                        <CustomersTab
                            {...this.props}
                            checkoutMainPart={this.props.checkoutMainPart}
                            checkoutactionArea={this.props.checkoutactionArea}
                            checkoutCustomerArea={this.props.checkoutCustomerArea}
                            checkoutcalcArea={this.props.checkoutcalcArea}
                            checkoutcartArea={this.props.checkoutcartArea}
                            handleClickOpen={this.props.handleClickOpen}
                            handleHistoryOpen={this.props.handleHistoryOpen}
                        />
                    </TabContainer>
                    <TabContainer >
                        <PaymentTab
                            checkoutMainPart={this.props.checkoutMainPart}
                        />
                    </TabContainer>
                </SwipeableViews>
            </div>
        );
    }
}

function mapStateToProps(state) {
    let cartItems = _get(state, 'cart.cartItems', []);
    let cart = _get(state, 'cart', {});
    let afterSellRedirectToCart = _get(state,'afterSellRedirectToCart.lookUpData')
    return { cartItems, cart,afterSellRedirectToCart };
  }
  export default connect(mapStateToProps)(FullWidthTabs);
  