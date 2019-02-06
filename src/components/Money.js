import React from 'react';
import _get from 'lodash/get';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog/Dialog';
import DialogActions from 'material-ui/Dialog/DialogActions';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogContentText from 'material-ui/Dialog/DialogContentText';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
import Slide from 'material-ui/transitions/Slide';
import { findDOMNode } from 'react-dom';
import Button from "react-bootstrap/lib/Button";

import SaveButton from "../components/common/SaveButton.jsx";


class Money extends React.Component {
    //   state = {
    //     open: this.props.open,
    //   };
    constructor(props) {
        super(props);
        this.enteredAmount = this.props.receivedAmount;
    }

  
    handleInput = (input) => {

        if (isNaN(input)) {
            this.enteredAmount = this.enteredAmount.toString().substring(0, (this.enteredAmount.length - 1));
        } else {
                if(Number(this.enteredAmount)===0){
                    this.enteredAmount = input.toString();
                } 
                else if(Number(input)===11){
                    this.enteredAmount += '00';
                }
                else{
                    this.enteredAmount += input.toString();
                }                
        }        
        this.props.handleReceivedMoney(this.enteredAmount);
        this.forceUpdate();

    }
    handleChange = (e) => {
        this.enteredAmount = e.target.value;
        this.props.handleReceivedMoney(this.enteredAmount);
        this.forceUpdate();
    }

    render() {

        return (
            <div>


                <div className="amount-keypad">                   
                    <div className="col-sm-12  plr-0">
                        <input className="amount-input" type="number" value={this.enteredAmount} onChange={this.handleChange} name="money" />
                    </div>
                    <div className="col-sm-12 plr-0">
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
                    <div className="col-sm-12 plr-0">
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
                    <div className="col-sm-12 plr-0">
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
                    <div className="col-sm-12 plr-0">
                        <div className="col-sm-4 dialpad-pt">
                            <Button onClick={() => this.handleInput(11)}>00</Button>
                        </div>
                        <div className="col-sm-4 dialpad-pt">
                            <Button onClick={() => this.handleInput(0)}>0</Button>
                        </div>
                        <div className="col-sm-4 dialpad-pt">
                            <Button  className="delete-no" onClick={() => this.handleInput('delete')}></Button>
                        </div>
                    </div>
                </div>




            </div>
        );
    }
}

export default Money;