import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { connect } from 'react-redux';
import { commonActionCreater } from '../../Redux/commonAction';
let regex = /^\d*[\.\d]+$/;





/* Redux Imports */

/* Component Imports */

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: '80%',
        maxWidth: 500,
    },
    formControl2: {
        margin: theme.spacing.unit,
        minWidth: '40%',
        maxWidth: 500,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: theme.spacing.unit / 4,
    },
    noLabel: {
        marginTop: theme.spacing.unit * 3,
    },
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const names = [
    'Bereavement',
    'Service Recovery',
    'Department',
];
function getStyles(name, that) {
    return {
        fontWeight:
            that.state.name.indexOf(name) === -1
                ? that.props.theme.typography.fontWeightRegular
                : that.props.theme.typography.fontWeightMedium,
    };
}
class CostCenter extends React.Component {

    constructor() {
        super();
        this.state = {
            department: '',
            name: ''
        }
    }
    handleChangeSelectList = event => {
        this.props.dispatch(commonActionCreater({
            costCenterType: event.target.value,
            costCenterDepartment: this.props.costCenterDepartment,
            costCenterAmount: this.props.remainingAmount.toUnit(2).toFixed(2),
            totalAmount: this.props.totalAmount

        }, 'COST_CENTER_CHARGE'));
        this.setState({ name: event.target.value });
    };
    handleRemove = () => {
        this.props.dispatch(commonActionCreater({
            costCenterType: '',
            costCenterDepartment: '',
            costCenterAmount: '',
            totalAmount: ''

        }, 'COST_CENTER_CHARGE'));

        this.props.onRemovePaymentMethod('showCostCenter');
    }
    handleChangeTextField = (event) => {
        this.props.dispatch(commonActionCreater({
            costCenterType: this.props.costCenterType,
            costCenterDepartment: event.target.value,
            costCenterAmount: this.props.costCenterAmount,
            totalAmount: this.props.totalAmount
        }, 'COST_CENTER_CHARGE'));
        this.setState({ department: event.target.value });

    }
    amountToBeUsed = (event) => {
        this.setState({ department: event.target.value });
        let value = event.target.value;

        if (regex.test(value)) {
            this.props.dispatch(commonActionCreater({
                costCenterType: this.props.costCenterType,
                costCenterDepartment: this.props.costCenterDepartment,
                costCenterAmount: value,
                totalAmount: this.props.totalAmount
            }, 'COST_CENTER_CHARGE'));
        }
        else if (regex.test(value.substring(0, value.length - 1))) {
            this.props.dispatch(commonActionCreater({
                costCenterType: this.props.costCenterType,
                costCenterDepartment: this.props.costCenterDepartment,
                costCenterAmount: value,
                totalAmount: this.props.totalAmount
            }, 'COST_CENTER_CHgetValueFromProgressARGE'));
        }
        else {
            this.props.dispatch(commonActionCreater({
                costCenterType: this.props.costCenterType,
                costCenterDepartment: this.props.costCenterDepartment,
                costCenterAmount: '',
                totalAmount: this.props.totalAmount
            }, 'COST_CENTER_CHARGE'));
        }


    }
    componentWillUnmount() {
        //setting to the 0 again on unmouning
        this.props.dispatch(commonActionCreater({
            costCenterType: '',
            costCenterDepartment: '',
            costCenterAmount: '',
            totalAmount: this.props.totalAmount
        }, 'COST_CENTER_CHARGE'));

    }

    render() {
        let { classes } = this.props;
        return (
            <div className="default-card-pay">
                <span className='payment-title'>Cost Center Charge</span>

                {this.state.name == '' ? <div className="d-flex justify-space-between">
                    <FormControl className={classes.formControl}>
                        <InputLabel shrink={true} htmlFor="select-multiple">Cost Center Name
                    </InputLabel>
                        <Select
                            value={this.state.name}
                            onChange={this.handleChangeSelectList}
                            autoWidth={true}
                            MenuProps={MenuProps}
                        >

                            {names.map(name => (
                                <MenuItem key={name} value={name}>
                                    <ListItemText primary={name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <div className="d-flex flex-column justify-center">
                        <CloseIcon
                            onClick={this.handleRemove} />
                    </div>
                </div> : null}
                {this.state.name != '' ?

                    <div>
                        <div style={{ width: '100%' }} className="d-flex">
                            <FormControl className={classes.formControl2}>
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    autoFocus
                                    // onFocus={() => this.props.currentFocus({ fieldValue: 'giftPayNumber', handler: 'GIFT_CARD_NUMBER' })}
                                    id="Departement Name"
                                    label="Departement Name"
                                    type="text"
                                    // value={this.props.giftPayNumber}
                                    onChange={this.handleChangeTextField}
                                    margin="normal"
                                    fullWidth
                                    variant="outlined"
                                />
                            </FormControl>
                            <FormControl className={classes.formControl2}>
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    onFocus={() => this.props.currentFocus({ fieldValue: 'costCenterAmount', handler: 'COST_CENTER_CHARGE' })}
                                    id="Amount To Be Used"
                                    label="Amount To Be Used"
                                    type="text"
                                    value={_get(this.props,'costCenterAmount',0)}
                                    onChange={this.amountToBeUsed}
                                    margin="normal"
                                    fullWidth
                                    variant="outlined"
                                />

                            </FormControl>
                            <div className="d-flex flex-column justify-center">
                                <CloseIcon
                                    onClick={this.handleRemove} />
                            </div>


                        </div>
                        <div className="d-flex">
                            <span className={classes.themeSpaceing}>{"Cost Center Name:" + this.state.name}</span>
                        </div>

                    </div>

                    : null}

            </div>
        );
    }

}

function mapStateToProps(state) {
    let costCenterType = state.PaymentDetails.costCenterType;
    let costCenterAmount = state.PaymentDetails.costCenterAmount;
    let remainingAmount = state.PaymentDetails.remainingAmount;
    let costCenterDepartment = state.PaymentDetails.costCenterDepartment;
    let totalAmount = _get(state, 'cart.totalMoney');
    return { costCenterType, costCenterAmount, remainingAmount, costCenterDepartment, totalAmount };

}
export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(CostCenter));
