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
        document.addEventListener('click', this.handleClickOutside.bind(this), true);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside.bind(this), true);
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
                    open={this.props.open}
                    onRequestClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                    transition={Slide}
                >
                    <DialogTitle id="form-dialog-title" style={{ textAlign: "center", paddingBottom: "5px" }}><h2>Product Details</h2></DialogTitle>
                    <DialogContent>
                        <hr />
                        <div className="row">
                            <div className="col-sm-6 pop-img">
                                <img src={this.props.product.image} alt={this.props.product.name} />

                            </div>

                            <div className="product-info col-sm-6">
                                <p className="product-name">{this.props.product.name}</p>
                                <p className="product-price">{"$" +this.props.product.price}</p>
                                <p>{this.props.product.description}</p>
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