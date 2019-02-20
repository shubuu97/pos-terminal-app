import React from 'react';
import PropTypes from 'prop-types';
import moment from "moment";
/* Lodash Imports */
import _get from 'lodash/get';
/* Redux Imports */
import { commonActionCreater } from '../Redux/commonAction'
/* Material Imports */
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
/* Material Icons */
import DeleteIcons from '@material-ui/icons/DeleteOutline';
/*  */
import applyCart from '../Global/PosFunctions/applyCart'

const styles = {
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
};

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class HoldDialogue extends React.Component {

    UnHoldCart = (index) => {
        let holdCartData = this.props.holdCartData
        applyCart(this.props.dispatch, holdCartData[index].cart)
        this.deleteHold(index);
        this.props.handleClose()
    }

    deleteHold = (index) => {
        let holdCartData = this.props.holdCartData
        holdCartData.splice(index, 1);
        let reqObj = [
            ...holdCartData
        ]
        this.props.dispatch(commonActionCreater(reqObj, 'DELETE_HOLD_CART_ITEM'));
    }
    
    populateHoldCards = () => {
        let holdCartData = this.props.holdCartData
        let cards = []
        holdCartData.map((data, index) => {
            cards.push(
                <div className='card' key={index} >
                    <div className='flex-row justify-space-between'>
                        <span className='card-title'>{_get(data, 'title')}</span>
                        <span>
                            <DeleteIcons style={{ color: '#ff000096', fontSize: '1.5em' }} onClick={()=>this.deleteHold(index)}/>
                        </span>
                    </div>
                    <div className='flex-row ' onClick={()=>this.UnHoldCart(index)}>
                        <div className='flex-column des'>
                            <span className='des-title'>Items</span>
                            <span>{_get(data, 'cart.cartItems', []).length}</span>
                        </div>
                        <div className='flex-column des'>
                            <span className='des-title'>Time</span>
                            <span>{moment(_get(data, 'time')).format("hh:mm:ss a")}</span>
                            
                        </div>
                        <div className='flex-column des'>
                            <span className='des-title'>Customer</span>
                            <span>{_get(data, 'customerName')}</span>
                        </div>
                    </div>
                </div>
            )
        })
        return (
            <div className='fwidth flex-row mt-16 flex-wrap'>
                {cards}
            </div>
        )
    }

    render() {
        const { classes } = this.props;
        return (
            <div className='hold-dialogue'>
                <Dialog
                    fullScreen
                    open={this.props.open}
                    onClose={this.props.handleClose}
                    TransitionComponent={Transition}
                >
                    <div className='on-hold-section'>
                        <div className='on-hold-header'>
                            <IconButton color="inherit" onClick={this.props.handleClose} aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                            <span className='ml-20'>Carts On Hold</span>
                        </div>
                        {this.populateHoldCards()}
                    </div>
                </Dialog>
            </div>
        );
    }
}

HoldDialogue.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HoldDialogue);