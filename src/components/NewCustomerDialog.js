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
import FormControl from "react-bootstrap/lib/FormControl";
import Panel from 'react-bootstrap/lib/Panel';
import PanelGroup from 'react-bootstrap/lib/PanelGroup';

class FormDialog extends React.Component {
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

    handleClose() {
      //  this.props.closeModal();
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
                    <DialogTitle id="form-dialog-title-customer" style={{ textAlign: "center", paddingBottom: "5px" }}><h2>New Customer</h2></DialogTitle>
                    <DialogContent>
                        <hr />
                        <div className="col-sm-6">
                            <FormControl
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                            //value={this.props.selectedValues.plantCount}
                            //onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)}
                            />
                            <FormControl
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                            // value={this.props.selectedValues.plantCount}
                            // onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)}
                            />
                        </div>
                        <div className="col-sm-6">
                            <FormControl
                                type="text"
                                name="email"
                                placeholder="Email"
                            // value={this.props.selectedValues.plantCount}
                            // onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)}
                            />
                            <FormControl
                                type="text"
                                name="plantCount"
                                placeholder="Plant Count"
                            // value={this.props.selectedValues.plantCount}
                            // onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)}
                            />
                        </div>
                       
                        <div>
                            <PanelGroup
                                accordion
                                id="accordion-controlled-example-customer"
                                activeKey={this.state.activeKey}
                                onSelect={this.handleSelect}
                            >
                                <Panel eventKey="1">
                                    <Panel.Heading>
                                        <Panel.Title toggle>Panel heading 1</Panel.Title>
                                    </Panel.Heading>
                                    <Panel.Body collapsible>Panel content 1</Panel.Body>
                                </Panel>
                            </PanelGroup>
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