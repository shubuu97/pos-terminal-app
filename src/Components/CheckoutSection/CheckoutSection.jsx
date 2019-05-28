import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */

/* Redux Imports */

/* Global Imports */
import globalHoldCart from '../../Global/PosFunctions/holdCart';
/* Component Imports */
import TabView from './TabView'
import PutHoldCartDialogue from '../Dialogues/HoldCartDialogue/PutHoldCartDialogue'


class CheckoutSection extends React.Component {

    constructor() {
        super();
        this.state = {
            openOnHold: false,
        }
    }

    handleClickOpen = () => {
        this.setState({ openOnHold: true });
    };

    handleClose = () => {
        this.setState({ openOnHold: false });
    };

    handleHold = (title) => {
        const {firstName, lastName} = _get(this, 'props.cart.customer.customer', '')
        globalHoldCart(this.props.dispatch, this.props.cart, (title || ''), firstName + ' ' + lastName);
    }

    render() {
        let {CartItems}  = this.props;
        return (
            <div className='pos-checkout' style={{height: this.props.windowHeight}}>
                <TabView
                    offline={this.props.offline}
                    toggleViewPayment={this.props.toggleViewPayment}
                    toggleViewProduct={this.props.toggleViewProduct}
                    checkoutMainPart={this.props.checkoutMainPart}
                    checkoutcalcArea={this.props.checkoutcalcArea}
                    checkoutactionArea={this.props.checkoutactionArea}
                    checkoutcartArea={this.props.checkoutcartArea}
                    checkoutCustomerArea={this.props.checkoutCustomerArea}
                    cart={this.props.cart}
                    // ! Actions
                    handleClickOpen={this.handleClickOpen}
                    handleHistoryOpen={this.props.handleHistoryOpen}
                    handleClickOpenCustomer={this.props.handleClickOpenCustomer}
                />

                {
                    this.state.openOnHold ?
                        <PutHoldCartDialogue
                            handleClickOpen={this.handleClickOpen}
                            handleClose={this.handleClose}
                            open={this.state.openOnHold}
                            dispatch={this.props.dispatch}
                            handleHold={this.handleHold}
                        /> : null
                }

            </div>
        );
    }
}

export default CheckoutSection;