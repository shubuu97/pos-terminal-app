import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */

/* Redux Imports */

/* Global Imports */
import globalHoldCart from '../../Global/PosFunctions/holdCart';
/* Component Imports */
import TabView from './TabView'
import HoldCartDialogue from './HoldCartDialogue/HoldCartDialogue'


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
        globalHoldCart(this.props.dispatch, this.props.cart, (title || ''), 'Harry Potter');
    }

    render() {
        let {CartItems}  = this.props;
        return (
            <div className='pos-checkout' style={{height: this.props.windowHeight}}>
                <TabView
                    toggleViewPayment={this.props.toggleViewPayment}
                    toggleViewProduct={this.props.toggleViewProduct}
                    checkoutMainPart={this.props.checkoutMainPart}
                    checkoutcalcArea={this.props.checkoutcalcArea}
                    checkoutactionArea={this.props.checkoutactionArea}
                    checkoutcartArea={this.props.checkoutcartArea}
                    checkoutCustomerArea={this.props.checkoutCustomerArea}
                    // ! Actions
                    handleClickOpen={this.handleClickOpen}
                />

                {
                    this.state.openOnHold ?
                        <HoldCartDialogue
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