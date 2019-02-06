import React from 'react';
import _get from 'lodash/get';
import Modal  from 'react-bootstrap/lib/Modal';
import ModalBody  from 'react-bootstrap/lib/ModalBody';
import ModalHeader  from 'react-bootstrap/lib/ModalHeader';
import ModalFooter  from 'react-bootstrap/lib/ModalFooter';
import ModalTitle  from 'react-bootstrap/lib/ModalTitle';

import { findDOMNode } from 'react-dom';
import Button from "react-bootstrap/lib/Button";

import SaveButton from "../components/common/SaveButton.jsx";


class SecurePinModal extends React.Component {
    //   state = {
    //     open: this.props.open,
    //   };
    constructor(props) {
        super(props);       
        this.enteredPin = '';
        this.validateUser =  this.validateUser.bind(this);
        this.onLogout = this.onLogout.bind(this);
        this.isValid = true;
    }
  

    shouldComponentUpdate(props){
        if(props.open){
            return true;
        }else{
            return false;
        }
    }


    handleClose=()=> {
        this.enteredPin = '';        
        this.props.closeModal();
        this.forceUpdate();
    }
    handleInput = (input) => {
        
            if(isNaN(input)){
                this.enteredPin = this.enteredPin.substring(0,(this.enteredPin.length-1));
            }else{
                if(this.enteredPin.length<4){
                    this.enteredPin += input.toString();
                }
            }
            this.forceUpdate();
             
    }
    handleChange = (e) => {
        this.enteredPin = e.target.value;
        this.forceUpdate();
    }
    onLogout () {
        this.props.onLogout();
    }
    validateUser(){
        if(this.enteredPin === this.props.pin){
            this.isValid = true;
            this.handleClose();
        }else{
            this.isValid = false;
        }
        this.forceUpdate();
        // this.props.validateUser();

    }
   

    render() {

        return (
            <div>
                 <Modal show={this.props.open}  className="modal-login">
                    <Modal.Header>
                        <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <div className="row">
                            {!this.isValid && 
                            <span className="correct pin"> Please Enter correct Pin. </span>
                            }
                            <div className="col-sm-12">
                                <input 
                                className="login-number form-control" maxLength="4" type="password" value={this.enteredPin} onChange={this.handleChange} name="pin" />
                            </div>
                            
                    </div>
                    <div className="m-2 d-flex">
                        <div className="col-sm-4 dialpad-pt">
                            <Button onClick={()=>this.handleInput(1)}>1</Button>
                        </div>
                        <div className="col-sm-4 dialpad-pt">
                            <Button onClick={()=>this.handleInput(2)}>2</Button>
                        </div>
                        <div className="col-sm-4 dialpad-pt">
                            <Button onClick={()=>this.handleInput(3)}>3</Button>
                        </div>
                    </div>
                    <div className="m-2 d-flex">
                        <div className="col-sm-4 dialpad-pt">
                            <Button onClick={()=>this.handleInput(4)}>4</Button>
                        </div>
                        <div className="col-sm-4 dialpad-pt">
                            <Button onClick={()=>this.handleInput(5)}>5</Button>
                        </div>
                        <div className="col-sm-4 dialpad-pt">
                            <Button onClick={()=>this.handleInput(6)}>6</Button>
                        </div>
                    </div>
                    <div className="m-2 d-flex">
                        <div className="col-sm-4 dialpad-pt">
                            <Button onClick={()=>this.handleInput(7)}>7</Button>
                        </div>
                        <div className="col-sm-4 dialpad-pt">
                            <Button onClick={()=>this.handleInput(8)}>8</Button>
                        </div>
                        <div className="col-sm-4 dialpad-pt">
                            <Button onClick={()=>this.handleInput(9)}>9</Button>
                        </div>
                    </div>
                    <div className="m-2 d-flex">
                        <div className="col-sm-4">
                            
                        </div>
                        <div className="col-sm-4 dialpad-pt">
                            <Button onClick={()=>this.handleInput(0)}> 0</Button>
                        </div>
                        <div className="col-sm-4 dialpad-pt last">
                            <Button onClick={()=>this.handleInput('delete')}> {""}</Button>
                        </div>
                    </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <div className="col-sm-5 plr-5">
                        <SaveButton Class_Name="btn-default btn-gray" buttonDisplayText={'Logout'} handlerSearch={this.onLogout} />
                        </div>
                        <div className="col-sm-7 plr-5">
                        <SaveButton Class_Name="btn-info btn-green" buttonDisplayText={'Validate'} handlerSearch={()=>this.validateUser()} />                        
                            </div>
                    </Modal.Footer>
                </Modal>                
                {/* <Dialog
                    open={this.props.open}
                    // onClose={this.handleClose}
                    aria-labelledby="secure-pin-modal"
                    transition={Slide}
                    style={{ width: "100%" }}
                >
                    <DialogTitle id="form-dialog-title-customer" style={{ textAlign: "center", paddingBottom: "5px" }}><h2>Confirmation</h2></DialogTitle>
                    <DialogContent>                        
                       
                        <div className="col-sm-12">
                            {!this.isValid && 
                            <h4> Please Enter correct Pin. </h4>
                            }
                            <div className="col-sm-12">
                                <input className="col-sm-12" maxLength="4" type="number" value={this.enteredPin} onChange={this.handleChange} name="pin" />
                            </div>
                            <div className="col-sm-12">
                                <div className="col-sm-4">
                                    <Button onClick={()=>this.handleInput(1)}> 1</Button>
                                </div>
                                <div className="col-sm-4">
                                    <Button onClick={()=>this.handleInput(2)}> 2</Button>
                                </div>
                                <div className="col-sm-4">
                                    <Button onClick={()=>this.handleInput(3)}> 3</Button>
                                </div>
                            </div>
                            <div className="col-sm-12">
                                <div className="col-sm-4">
                                    <Button onClick={()=>this.handleInput(4)}> 4</Button>
                                </div>
                                <div className="col-sm-4">
                                    <Button onClick={()=>this.handleInput(5)}> 5</Button>
                                </div>
                                <div className="col-sm-4">
                                    <Button onClick={()=>this.handleInput(6)}> 6</Button>
                                </div>
                            </div>
                            <div className="col-sm-12">
                                <div className="col-sm-4">
                                    <Button onClick={()=>this.handleInput(7)}> 7</Button>
                                </div>
                                <div className="col-sm-4">
                                    <Button onClick={()=>this.handleInput(8)}> 8</Button>
                                </div>
                                <div className="col-sm-4">
                                    <Button onClick={()=>this.handleInput(9)}> 9</Button>
                                </div>
                            </div>
                            <div className="col-sm-12">
                                <div className="col-sm-4">
                                    
                                </div>
                                <div className="col-sm-4">
                                    <Button onClick={()=>this.handleInput(0)}> 0</Button>
                                </div>
                                <div className="col-sm-4">
                                    <Button onClick={()=>this.handleInput('delete')}> {"<X"}</Button>
                                </div>
                            </div>
                        </div>
                       



                    </DialogContent>
                    <DialogActions>
                       
                        <SaveButton  buttonDisplayText={'Validate'} handlerSearch={()=>this.validateUser()} />
                        <SaveButton  buttonDisplayText={'Logout'} handlerSearch={this.handleClose} />
                      

                    </DialogActions>
                </Dialog> */}
            </div>
        );
    }
}

export default SecurePinModal;