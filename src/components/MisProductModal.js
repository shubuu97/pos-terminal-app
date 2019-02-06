import React from 'react';
import _get from 'lodash/get';
import Modal from 'react-bootstrap/lib/Modal';
import ModalBody from 'react-bootstrap/lib/ModalBody';
import ModalHeader from 'react-bootstrap/lib/ModalHeader';
import ModalFooter from 'react-bootstrap/lib/ModalFooter';
import ModalTitle from 'react-bootstrap/lib/ModalTitle';

import { findDOMNode } from 'react-dom';
import Button from "react-bootstrap/lib/Button";

import SaveButton from "../components/common/SaveButton.jsx";
import { triggerAddMisProduct } from '../actions/header'


class MisProductDialog extends React.Component {
    //   state = {
    //     open: this.props.open,
    //   };
    constructor(props) {
        super(props);
        this.enteredPin = '';
        this.validateUser = this.validateUser.bind(this);
        this.onLogout = this.onLogout.bind(this);
        this.isValid = true;
        this.state = { price: 0 }
    }





    handleClose = () => {
        this.enteredPin = '';
        this.props.closeModal();
        this.forceUpdate();
    }
    handleInput = (input) => {

        if (isNaN(input)) {
            this.state.price = this.state.price.substring(0, (this.state.price.length - 1));
            this.setState({ price: this.state.price })
        } else {

            this.state.price += input.toString();
            this.setState({ price: this.state.price });
        }
    }

    handleChange = (name) => (e) => {
        this.setState({ [name]: e.target.value });
    }
    onLogout() {
        this.props.onLogout();
    }
    validateUser() {
        if (this.enteredPin === this.props.pin) {
            this.isValid = true;
            this.handleClose();
        } else {
            this.isValid = false;
        }
        this.forceUpdate();
        // this.props.validateUser();

    }
    handleAddToCart = ()=>
    {
        let productObj = {};
        productObj.id = this.state.productUPC;
        productObj.quantity = 1;
        productObj.description = '';
        productObj.name = this.state.productName;
        productObj.code = this.state.productUPC;
        productObj.image = '';
        productObj.price = this.state.price;
        this.props.closeModal();
        this.props.dispatch(triggerAddMisProduct(true,productObj))
    }

    render() {

        return (
            <div>
                <Modal show={this.props.open} className="modal-login">
                    <Modal.Header>
                        <div className="col-sm-7 plr-5">
                            <SaveButton Class_Name="btn-info btn-green"
                             buttonDisplayText={'Cancel'}
                              handlerSearch={() => this.props.closeModal()} />
                        </div>
                        <Modal.Title>Custom Sale</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-sm-12">
                                <input className="login-number form-control"
                                    type="text"
                                    value={this.state.productName}
                                    onChange={this.handleChange('productName')}
                                    placeholder="Enter Product Name"
                                />
                            </div>
                            <div className="col-sm-12">
                                <input
                                    className="login-number form-control"
                                    type="text"
                                    value={this.state.productUPC}
                                    onChange={this.handleChange('productUPC')}
                                    placeholder="Enter Product UPC" />
                            </div>
                            <div className="col-sm-6">
                                <input
                                    className="login-number form-control"
                                    type="text"
                                    value={this.state.price}
                                    onChange={this.handleChange('price')}
                                    placeholder="Price" />
                            </div>
                            <div className="col-sm-6">
                                <input
                                    className="login-number form-control"
                                    type="text"
                                    value={this.state.tax}
                                    onChange={this.handleChange('tax')}
                                    placeholder="Tax" />
                            </div>

                        </div>
                        <div className="m-2 d-flex">
                            <div className="col-sm-4 dialpad-pt">
                                <Button onClick={() => this.handleInput(1)}>1</Button>
                            </div>
                            <div className="col-sm-4 dialpad-pt">
                                <Button onClick={() => this.handleInput(2)}>2</Button>
                            </div>
                            <div className="col-sm-4 dialpad-pt">
                                <Button onClick={() => this.handleInput(3)}>3</Button>
                            </div>
                        </div>
                        <div className="m-2 d-flex">
                            <div className="col-sm-4 dialpad-pt">
                                <Button onClick={() => this.handleInput(4)}>4</Button>
                            </div>
                            <div className="col-sm-4 dialpad-pt">
                                <Button onClick={() => this.handleInput(5)}>5</Button>
                            </div>
                            <div className="col-sm-4 dialpad-pt">
                                <Button onClick={() => this.handleInput(6)}>6</Button>
                            </div>
                        </div>
                        <div className="m-2 d-flex">
                            <div className="col-sm-4 dialpad-pt">
                                <Button onClick={() => this.handleInput(7)}>7</Button>
                            </div>
                            <div className="col-sm-4 dialpad-pt">
                                <Button onClick={() => this.handleInput(8)}>8</Button>
                            </div>
                            <div className="col-sm-4 dialpad-pt">
                                <Button onClick={() => this.handleInput(9)}>9</Button>
                            </div>
                        </div>
                        <div className="m-2 d-flex">
                            <div className="col-sm-4">

                            </div>
                            <div className="col-sm-4 dialpad-pt">
                                <Button onClick={() => this.handleInput(0)}> 0</Button>
                            </div>
                            <div className="col-sm-4 dialpad-pt last">
                                <Button onClick={() => this.handleInput('delete')}> {""}</Button>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="col-sm-5 plr-5">
                            <SaveButton Class_Name="btn-default btn-gray"
                                buttonDisplayText={'ADD TO Cart'}
                                handlerSearch={this.handleAddToCart} />
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default MisProductDialog;