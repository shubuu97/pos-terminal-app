import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty'
/* Redux Imports */
import { connect } from 'react-redux';
import {commonActionCreater} from '../../../Redux/commonAction';
/* Material Imports */
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class HoldCartDialogue extends React.Component {

    constructor(){
        super();
        this.state = {
            Title: ''
        }
    }

    componentDidMount(){
        debugger
        if(_get(this, 'props.unHoldedItem')){
            this.setState({
                Title: _get(this, 'props.unHoldedItem.title'),
                default: _get(this, 'props.unHoldedItem.title'),
            })
        }
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleHold = () => {
        this.props.handleHold(this.state.Title);
        let unHoldedCart = {}
        this.props.dispatch(commonActionCreater(unHoldedCart, 'ON_HOLD_DATA'));
        this.props.handleClose();
    };


    render() {
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.props.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">
                        {"Put this cart on hold?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Please enter a title
                        </DialogContentText>
                        <TextField
                            id="outlined-name"
                            label="Title"
                            defaultValue={this.state.default}
                            onChange={this.handleChange('Title')}
                            margin="normal"
                            variant="outlined"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.handleClose} color="primary">
                            Disagree
                        </Button>
                        <Button onClick={this.handleHold} color="primary">
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state) {
    let { cartHoldData } = state;
    let unHoldedItem = _get(cartHoldData, 'unHoldedItem', []);

    return {
        unHoldedItem,
    }
}

export default connect(mapStateToProps)(HoldCartDialogue);