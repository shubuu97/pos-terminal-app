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

import SaveButton from "../components/common/SaveButton.jsx";


class TransactionDialog extends React.Component {
    //   state = {
    //     open: this.props.open,
    //   };
    constructor(props) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);

        this.state = {
            activeKey: '1'
        };
    }

    handleSelect(activeKey) {
        this.setState({ activeKey });
    }

    componentDidMount() {
        // document.addEventListener('click', this.handleClickOutside.bind(this), true);
    }

    componentWillUnmount() {
        // document.removeEventListener('click', this.handleClickOutside.bind(this), true);
    }

    handleClickOutside(event) {
        const domNode = findDOMNode(this.refs.modal);
        if (!domNode || !domNode.contains(event.target)) {
           this.props.closeModal();
        }
    }

    handleClose=()=> {
       this.props.closeModal();
    }
    handleSubmit=()=>{
        this.props.closeModal();
        this.props.handleTransactionSubmit();
    }

    render() {

        return (
            <div>
                <Dialog
                    open={this.props.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                    transition={Slide}
                    style={{ width: "100%" }}
                >
                    <DialogTitle id="form-dialog-title-customer" style={{ textAlign: "center", paddingBottom: "5px" }}><h2>Confirmation</h2></DialogTitle>
                    <DialogContent>                        
                       {this.props.customerName!=='' && <div className="col-sm-12">
                        <h5>
                            Are you sure, You want to confirm this Transaction?</h5>
                        </div>} 
                        {this.props.customerName==='' && <div className="col-sm-12">
                        <h5 style={{color:"red"}}>
                            Please Enter Customer Name to proceed.</h5>
                        </div>} 
                       



                    </DialogContent>
                    <DialogActions>
                       
                        <SaveButton  buttonDisplayText={'Close'} handlerSearch={this.handleClose} />

                       {this.props.customerName!=='' && 
                       <SaveButton  buttonDisplayText={'Ok'} handlerSearch={this.handleSubmit} />
                        }

                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default TransactionDialog;