import React from 'react';
import Button from 'material-ui/Button';
import _get from 'lodash/get';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog/Dialog';
import DialogActions from 'material-ui/Dialog/DialogActions';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogContentText from 'material-ui/Dialog/DialogContentText';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
import Slide from 'material-ui/transitions/Slide';
import { findDOMNode } from 'react-dom';
import Counter from './Counter';


class FormDialog extends React.Component {
    //   state = {
    //     open: this.props.open,
    //   };
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        //document.addEventListener('click', this.handleClickOutside.bind(this), true);
    }

    componentWillUnmount() {
       // document.removeEventListener('click', this.handleClickOutside.bind(this), true);
    }

    handleClickOutside = (event) => {
        const domNode = findDOMNode(this.refs.modal);
        if (!domNode || !domNode.contains(event.target)) {
            // this.props.closeModal();
        }
    }

    handleClose = () => {
        this.props.closeModal();
    }

    render() {

        return (
            <div>
                <Dialog
                    fullWidth={true}
                    open={this.props.open}
                    onRequestClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                    transition={Slide}
                >
                    <DialogTitle id="form-dialog-title" style={{ textAlign: "center", paddingBottom: "5px" }}>{this.props.product.name}</DialogTitle>
                    <DialogContent>
                        <hr />
                        <div className="row">
                            <div className='cart-item-product-image-div'>
                                <img className='cart-item-product-image' src={this.props.product.image} alt={this.props.product.name} />

                            </div>
                             <div className="cart-item-product_qty">

                                    <Counter  productQuantity={this.props.product.quantity} updateQuantity={this.props.updateQuantity.bind(this, this.props.product)} resetQuantity={this.resetQuantity} />
                                </div>

                            <div className="cart-text-price-div">
                                <p >{this.props.product.quantity+" Product added"}</p>
                                <p >{this.props.totalProduct+" total Products in cart"}</p>
                            </div>

                        </div>



                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Close
            </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default FormDialog;