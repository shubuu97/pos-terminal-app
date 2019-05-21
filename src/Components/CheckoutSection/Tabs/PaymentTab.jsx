import React from 'react';
import PouchDb from 'pouchdb';
import PAM from "pouchdb-adapter-memory";
/* Lodash Imports */
import _get from 'lodash/get';
import _findIndex from 'lodash/findIndex';
import _isArray from 'lodash/isArray';
/* Dinero Import */
import Dinero from 'dinero.js';
/* Material Icons */
import PermIdentityOutlined from '@material-ui/icons/PermIdentityOutlined'
import CloseIcon from '@material-ui/icons/Close'
import CreateIcon from '@material-ui/icons/Create'
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined'
import DeleteIcons from '@material-ui/icons/DeleteOutline';
/* Redux Imports */
import { connect } from 'react-redux'
import { commonActionCreater } from '../../../Redux/commonAction';
import { reset } from 'redux-form';
/* Global Imports */
import addGuestToCart from '../../../Global/PosFunctions/addGuestToCart';
import ReactSelect from '../../../Global/Components/ReactSelect/async-react-select';
/* Component Imports */
import CalculationSection from './CalculationSection'
import Customer from '../Customer';


const DineroObj = () => {
    return Dinero({
        amount: 0,
        currency: 'USD'
    })
}

class PaymentTab extends React.Component {

    constructor() {
        super();
        this.state = {
            guest: true,
            open: false,
            value: '',
            edit: false
        }
    }

    populateCart = () => {
        let cartItems = _get(this.props, 'cart.cartItems', [])
        let rows = []
        cartItems.map((data, index) => {
            let itemSubTotal = _get(data, 'subTotal', DineroObj())
            let itemTotalDiscount = _get(data, 'itemDiscountMoney', DineroObj()).add(_get(data, 'empDiscountMoney', DineroObj())).add(_get(data, 'cartDiscountMoney', DineroObj())).add(_get(data, 'loyaltyDiscountMoney', DineroObj()));
            let itemTaxAmount = _get(data, 'itemTaxAmount', DineroObj());
            let itemEffectiveTotal = _get(data, 'itemEffectiveTotal', DineroObj())
            rows.push(
                <div className='each-cart-item flex-row justify-space-between'>
                    {/* <div className='image-container'>
                        <img src={_get(data, 'doc.product.image', '')} alt="" />
                    </div> */}
                    <span className='product-name'>{_get(data, 'doc.product.name', '')}</span>
                    <div className='flex-column product-deductions justify-flex-end'>
                        <span className='product-cost-price flex-row justify-flex-end'>{itemSubTotal.toFormat('$0,0.00')}</span>
                        {
                            itemTotalDiscount.getAmount() ?
                                <span className='product-discount flex-row justify-flex-end'>-{itemTotalDiscount.toFormat('$0,0.00')}</span> : null
                        }
                        {
                            itemTaxAmount.getAmount() ?
                                <span className='product-tax flex-row justify-flex-end'>+{itemTaxAmount.toFormat('$0,0.00')}</span> : null
                        }
                    </div>
                    <span className='product-final-price flex-row justify-flex-end'>{itemEffectiveTotal.toFormat('$0,0.00')}</span>
                    <DeleteIcons
                        onClick={() => this.handleDelete(data)}
                        style={{ color: '#ff000096', fontSize: '2em', alignSelf: 'center' }} />
                </div>
            )
        })

        return (
            <div className='cart-section'>
                {rows}
                <CalculationSection
                    checkoutcalcArea={this.props.checkoutcalcArea}
                    handleClickOpenDiscount={this.handleClickOpenDiscount}
                    hideTotalArea={true}
                />
            </div>
        )
    }

    handleDelete = (item) => {
        let cartItems = [...this.props.cart.cartItems];
        let index = _findIndex(cartItems, cartItem => cartItem.doc._id == item.doc._id);
        cartItems.splice(index, 1);
        this.dispatchCartAction(cartItems)
    };

    handleSwitchToGuest = async () => {
        await addGuestToCart(this.props.dispatch);
        this.setState({edit: false})
        this.dispatchCartAction(_get(this.props, 'cart.cartItems', []), 0)
    }

    handleOpen = () => {
        this.setState({ open: true })
        this.props.dispatch(commonActionCreater(true, 'IS_CUSTOMER_DIALOGUE_OPEN'))
    }

    handleClose = (props) => {
        // ! Uncomment if you want to clear form values onclick of cancel button 
        this.props.dispatch(reset('CustomerForm'));
        this.props.dispatch(commonActionCreater(false, 'IS_CUSTOMER_DIALOGUE_OPEN'))
        this.setState({ open: false })
    }

    onInputChange = (newValue) => {
        //const inputValue = newValue.replace(/\W/g, '');
        this.setState({ value: newValue });
        return newValue;
    }

    onChange = (doc) => {
        let value = _get(doc, 'value');
        let employeeDiscount = _get(doc, 'value.employeeDiscount', 0);
        let storeId = localStorage.getItem('storeId');
        let empStoreId = _get(doc, 'value.employeeStoreId', '')
        //populating cart reducer with customer
        this.setState({ value: '' })
        if (storeId == empStoreId) {
            this.props.dispatch(commonActionCreater(employeeDiscount, 'ADD_EMPLOYEE_DISCOUNT'));
        }
        else {
            this.props.dispatch(commonActionCreater(0, 'ADD_EMPLOYEE_DISCOUNT'));
        }
        let cartDiscountObj = {}
        cartDiscountObj.loyaltyPoints = 0
        cartDiscountObj.cartItems = _get(this.props, 'cart.cartItems', [])
        cartDiscountObj.prevCart = _get(this, 'props.cart', {});
        this.props.dispatch(commonActionCreater(cartDiscountObj, 'CART_ITEM_LIST'));
        this.props.dispatch(commonActionCreater(doc.value, 'ADD_CUSTOMER_TO_CART'));

        //mapped data to state 
        let billingAddress = value.billingAddress;
        let customer = value.customer;
        let email = value.email;
        let phoneNumber = value.phoneNumber;
        let rewardPoints = value.rewardPoints;
        this.setState({ billingAddress, customer, email, phoneNumber, rewardPoints, loyalty: '', loyaltyValue: 0 });
    }

    loadOptions = (searchText, callback) => {
        console.log(searchText, "");
        let customerdb = new PouchDb(`customersdb${localStorage.getItem('storeId')}`);
        customerdb.search({
            query: searchText,
            fields: ['customer.firstName', 'customer.lastName', 'email', 'phoneNumber.phoneNumber', 'employeeId'],
            include_docs: true,
            limit: 20,
            skip: 0
        }).then((res) => {
            callback(this.mapCustomer(res))
        })
    };

    mapCustomer = (data) => {
        return data.rows.map(rowObj => {
            //structure of rowObj {doc:{},id:'',score:''}   
            let doc = rowObj.doc;
            let objectToReturn = {};
            objectToReturn.label = `${_get(doc, 'customer.firstName')} ${_get(doc, 'customer.lastName')}`;
            objectToReturn.value = doc;
            return objectToReturn;
        }
        );
    };

    dispatchCartAction = (cartItems, loyaltyPoints) => {
        let cartDiscountObj = {}
        cartDiscountObj.cartItems = cartItems
        cartDiscountObj.prevCart = _get(this, 'props.cart', {});
        if(loyaltyPoints != undefined){
            debugger
            cartDiscountObj.loyaltyPoints = loyaltyPoints
        }
        this.props.dispatch(commonActionCreater(cartDiscountObj, 'CART_ITEM_LIST'));
    }

    render() {
        let { cart, customer } = this.props
        let totalMoney = _get(cart, 'totalMoney', DineroObj()).toFormat('$0,0.00')
        return (
            <div className="payment-section relative">
                <div className='customer-section flex-row align-center justify-space-between'>
                    <div className='icon-width'>
                        <PermIdentityOutlined style={{ fontSize: '3em' }} />
                    </div>
                    <div className='customer-display flex-row'>
                        {
                            customer.guest ?
                                this.state.edit ?
                                    <ReactSelect
                                        value={this.state.value}
                                        onInputChange={this.onInputChange}
                                        defaultOptions
                                        onChange={this.onChange}
                                        loadOptions={this.loadOptions}
                                        className='fwidth'
                                    /> : <span>Guest Customer</span>
                                :
                                <div className='flex-column fwidth'>
                                    <span className='customer-name'>{_get(customer, 'customer.firstName')} {_get(customer, 'customer.lastName')}</span>
                                    <span className='customer-email'>{_get(customer, 'email')}</span>
                                    <span className='customer-phone'>+{_get(customer, 'phoneNumber.countryCode')} {_get(customer, 'phoneNumber.phoneNumber')}</span>
                                </div>
                        }
                    </div>
                    <div className='action-icons'>
                        {
                            !customer.guest || this.state.edit ?
                                <CloseIcon
                                    onClick={() => this.handleSwitchToGuest()}
                                />
                                :
                                <div className='fwidth'>
                                    <CreateIcon onClick={()=>this.setState({edit: true})} style={{ fontSize: '2em', paddingRight: '15px' }} />
                                    <PersonAddOutlinedIcon onClick={this.handleOpen} style={{ fontSize: '2em' }} />
                                </div>
                        }
                    </div>
                </div>
                {this.populateCart()}
                <div className='cart-total flex-row align-center'>
                    <span className='cart-total-amount'>{totalMoney}</span>
                </div>

                <Customer
                    open={this.state.open}
                    closeModal={this.handleClose}
                    fullScreen={false}
                />

            </div>
        );
    }
}

function mapStateToProps(state) {
    let cart = _get(state, 'cart');
    let customer = _get(state, 'cart.customer');
    return { cart, customer }
}

export default connect(mapStateToProps)(PaymentTab);