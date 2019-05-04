import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material Imports */
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import Slide from '@material-ui/core/Slide';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

const DialogTitle = withStyles(theme => ({
    root: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing.unit * 2,
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing.unit,
        top: theme.spacing.unit,
        color: theme.palette.grey[500],
    },
}))(props => {
    const { children, classes, onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});


class DiscountDialogue extends React.Component {

    constructor() {
        super();
        this.state = {
            discount: '',
            type: '%',
        }
    }

    handleTextChange = name => event => {
        this.setState({ [name]: event.target.value });
    }

    handleInputChange = num => event => {
        let discount = this.state.discount
        if (num != '<') {
            discount = discount + num;
        }
        else {
            discount = ''
        }

        let maxDiscount = 0 
        if(this.props.identifier == 'Discount'){
            if(this.state.type == '%'){
                maxDiscount = this.props.cart.allowedCartDiscount
            }
            else{
                maxDiscount = (Math.floor(this.props.cart.allowedCartDiscount*this.props.cart.discountableCartTotal*100)/10000)
            }
        }
        else{
            maxDiscount = this.props.cart.cartItems[this.props.itemIndex].allowedDiscountPercent
        }
        if (parseFloat(discount) > parseFloat(maxDiscount)) {
            discount = parseFloat(maxDiscount).toFixed(2);
        }

        this.setState({
            discount: discount,
        })
    }

    handleDiscount = () => {
        let type = this.state.type
        let discount = 0
        if (this.props.identifier != 'Discount') {
            type = '%'
            let item = this.props.cart.cartItems[this.props.itemIndex]
            let allowedDiscountPercent = item.allowedDiscountPercent
            if (this.state.discount <= allowedDiscountPercent) {
                discount = this.state.discount
                this.handleSuccessDiscountAdd(discount, this.props.identifier, this.props.itemIndex, type)
            }
            else {
                alert('Discount exceeds the limit')
            }
        }
        else {
            let allowedCartDiscount = _get(this.props, 'cart.allowedCartDiscount', 0)
            if (this.state.type == '%') {
                if (this.state.discount <= allowedCartDiscount) {
                    discount = this.state.discount
                    this.handleSuccessDiscountAdd(discount, this.props.identifier, this.props.itemIndex, type)
                }
                else {
                    alert('Discount exceeds the limit')
                }
            }
            else {
                let discountableAmount = _get(this.props, 'cart.discountableCartTotal', 0)
                if (this.state.discount <= parseFloat((Math.floor(allowedCartDiscount*discountableAmount*100)/10000).toFixed(2))) {
                    discount = this.state.discount
                    this.handleSuccessDiscountAdd(discount, this.props.identifier, this.props.itemIndex, type)
                }
                else {
                    alert('Discount exceeds the limit')
                }
            }
        }
    }

    handleSuccessDiscountAdd = (discount, identifier, itemIndex, type) => {
        this.props.handleDiscount(discount, identifier, itemIndex, type)
        this.setState({
            discount: ''
        })
        this.props.handleClose()
    }

    handleDiscountType = (type) => {
        this.setState({
            type,
        });
    }

    render() {
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    TransitionComponent={Transition}
                    keepMounted
                    fullWidth
                    onClose={this.props.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="customized-dialog-title" onClose={this.props.handleClose}>
                        Add Discount
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {/* <span>Warning! This action will require manager's approval.</span> */}
                        </DialogContentText>
                        <div className='mui-col-md-12'>
                            <div className=" d-flex mt-20">
                                <div className="mui-col-md-8">
                                    <TextField
                                        id="discount"
                                        label="Discount"
                                        value={this.state.discount}
                                        onChange={() => { }}
                                        margin="outline"
                                        fullWidth
                                        type='text'
                                        variant="outlined"
                                        helperText={
                                            this.props.open ?
                                                this.props.identifier == 'Discount' ?
                                                    this.state.type == '%' ?
                                                        `Allowed Discount: ${(this.props.cart.allowedCartDiscount)}`
                                                        :
                                                        `Allowed Discount: $ ${(this.props.cart.allowedCartDiscount * this.props.cart.discountableCartTotal / 100)}`
                                                    :
                                                    `Allowed Discount: ${(this.props.cart.cartItems[this.props.itemIndex].allowedDiscountPercent)}`
                                                :
                                                null
                                        }
                                    />
                                </div>
                                <div className="mui-col-md-4">
                                    <div className='d-flex justify-content-end'>
                                        <div className={this.state.type === '%' || this.props.identifier != 'Discount' ? 'discount-keys-top  active' : 'discount-keys-top '} onClick={() => this.handleDiscountType('%')}>%</div>
                                        {
                                            this.props.identifier == 'Discount' ?
                                                <div className={this.state.type === '$' ? 'discount-keys-top ml-10  active' : 'discount-keys-top ml-10 '} onClick={() => this.handleDiscountType('$')}>$</div> :
                                                null
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className='discount-keypad'>
                                <div className='discount-keys' onClick={this.handleInputChange('1')}>1</div>
                                <div className='discount-keys' onClick={this.handleInputChange('2')}>2</div>
                                <div className='discount-keys' onClick={this.handleInputChange('3')}>3</div>
                                <div className='discount-keys' onClick={this.handleInputChange('4')}>4</div>
                                <div className='discount-keys' onClick={this.handleInputChange('5')}>5</div>
                                <div className='discount-keys' onClick={this.handleInputChange('6')}>6</div>
                                <div className='discount-keys' onClick={this.handleInputChange('7')}>7</div>
                                <div className='discount-keys' onClick={this.handleInputChange('8')}>8</div>
                                <div className='discount-keys' onClick={this.handleInputChange('9')}>9</div>
                                <div className='discount-keys' onClick={this.handleInputChange('.')}>.</div>
                                <div className='discount-keys' onClick={this.handleInputChange('0')}>0</div>
                                <div className='discount-keys' onClick={this.handleInputChange('<')}>clear</div>
                            </div>
                        </div>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.handleClose} className='btnmodalsecondary' variant="outlined">
                            Disagree
                    </Button>
                        <Button onClick={this.handleDiscount} className='btnmodalprimary' variant="outlined">
                            Agree
                    </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default DiscountDialogue;