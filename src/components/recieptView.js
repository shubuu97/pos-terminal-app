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
import BootstrapTable from 'react-bootstrap-table/lib/BootstrapTable';
import TableHeaderColumn from 'react-bootstrap-table/lib/TableHeaderColumn';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import RecieptData from './recieptData';
import ReactToPrint from "react-to-print";

class RecieptView extends React.Component {
    //   state = {
    //     open: this.props.open,
    //   };
    constructor(props) {
        super(props);

    }


    shouldComponentUpdate(props){
        if(props.open){
            return true;
        }else{
            return false;
        }
    }


    handleClose = () => {
        this.forceUpdate();
        this.props.closeModal();
    }
    onSendEmail= () =>{

    }




    render() {
        let cartItems = [];
        this.props.cartItems.map(product => {

            let tempObj = {};
            tempObj.productName = product.name;
            tempObj.quantity = product.quantity;
            tempObj.price = product.price;
            tempObj.totalPrice = Number(product.price) * Number(product.quantity);
            cartItems.push(tempObj);

        });

        return (
            <div>
                <Modal show={this.props.open} className='modal-invoice' style={{marginTop:'70px'}}>
                    {/* <Modal.Header>
                        <Modal.Title>All On Block</Modal.Title>
                    </Modal.Header> */}
                    <Modal.Body>
                    {/* <div> */}
                     <RecieptData 
                        data = {this.props.data}
                        cartItems = {this.props.cartItems}
                        ref={el => (this.componentRef = el)}
                        showHeader = {true}
                     />
                    {/* </div>        */}
                         

                        

                    </Modal.Body>
                    <Modal.Footer>
                         <div className="col-sm-4 plr-5">
                            <SaveButton Class_Name="btn-default btn-gray" buttonDisplayText={'New Order'} handlerSearch={this.handleClose} />
                        </div>
                        <div className="col-sm-4 plr-5" >
                            <ReactToPrint
                                trigger={() => <input type="button"  value="Print" className="btn btn-green" />}
                                content={() => this.componentRef}
                                onAfterPrint = {this.handleClose}
                            />
                            {/* <ComponentToPrint className="hidden" ref={el => (this.componentRef = el)} />             */}
                         </div>
                         <div className="col-sm-4 plr-5">
                            <SaveButton Class_Name="btn-default btn-gray" buttonDisplayText={'Send'} handlerSearch={this.onSendEmail} />
                        </div>
                        

                    </Modal.Footer>
                </Modal>

            </div>
        );
    }
}

export default RecieptView;