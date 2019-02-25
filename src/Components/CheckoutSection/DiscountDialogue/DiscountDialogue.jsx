import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Slide from '@material-ui/core/Slide';
import _get from 'lodash/get';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class AlertDialogSlide extends React.Component {

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
        let cartDiscountPercent = 0;
        let maxDiscount = 80;
        if(this.state.type === '$') {
            maxDiscount = _get(this.props, 'cartTotal', 0) * 80/100;
        }
        if (parseFloat(discount) > maxDiscount) {
            discount = maxDiscount.toFixed(2);
        }

        this.setState({
            discount: discount,
        })
    }

    handleDiscount = () => {
        this.props.handleDiscount(this.state.discount, this.props.identifier, this.props.itemIndex, this.state.type)
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
                    <DialogTitle id="alert-dialog-slide-title">
                        {`Add Discount (Max Discount to be given 80%)`}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Warning! This action will require manager's approval.
                            <div className="mui-col-md-6">
                                <TextField
                                    id="discount"
                                    label="Discount"
                                    value={this.state.discount}
                                    onChange={() => { }}
                                    margin="outline"
                                    fullWidth
                                    type='text'
                                    variant="outlined"
                                    className='mt-10'
                                />
                            </div>
                            <div className="mui-col-md-6">
                                <div className='discount-keypad'>
                                    <div className={this.state.type === '%' ? 'discount-keys active': 'discount-keys'} onClick={() => this.handleDiscountType('%')}>%</div>
                                    <div className={this.state.type === '$' ? 'discount-keys active': 'discount-keys'} onClick={() => this.handleDiscountType('$')}>$</div>
                                </div>
                            </div>
                        </DialogContentText>
                        <div className="mui-col-md-12">
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
                        <Button onClick={this.props.handleClose} color="primary">
                            Disagree
                    </Button>
                        <Button onClick={this.handleDiscount} color="primary">
                            Agree
                    </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default AlertDialogSlide;