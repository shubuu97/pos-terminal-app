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
                    {...this.props}
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