import React from 'react';
/* Dinero Import */
import Dinero from "dinero.js";
/* Lodash Imports */
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _findIndex from 'lodash/findIndex';
import _find from 'lodash/find'
/* Material import */
import Info from '@material-ui/icons/Info';
import SimpleModal from '../../Global/Components/Modal/MaterialUIModal.jsx';
/* Material Icons */
import InfoOutlined from '@material-ui/icons/InfoOutlined'
/* Redux Imports */
import { commonActionCreater } from '../../Redux/commonAction';
import DefaultImage from '../../assets/images/notfound.png'
import { connect } from "react-redux";
/* Global Function Imports */
import addToCart from '../../Global/PosFunctions/addToCart'

const DineroInit = () => {
    return Dinero({
        amount: 0,
        currency: 'USD'
    })
}
class Product extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            openModal: false,
            counter: 0,
            qty: 0,
            iconSelected: false
        };
        this.ProductDetails = [];
    }

    viewProductDetails = (index) => {
        this.setState({ openModal: true })
    }

    onClose = () => {
        this.setState({ openModal: false })
    }

    handleProductClick = (data, cartItems, cart, qty, dispatch, index) => {
        if (this.props.cannabisRetailer) {
            this.viewProductDetails(index)
        }
        else {
            this.addToCart(data, cartItems, cart, qty, dispatch)
        }

    }

    addToCart = (product, cartItems, cart, quantity, dispatch, selectedPackage) => {
        let products = {
            doc: product.doc
        }
        if (!this.state.iconSelected) {
            addToCart(products, cartItems, cart, quantity, dispatch, selectedPackage)
            this.setState({
                qty: this.state.qty + quantity
            })
        }
    }

    render() {
        let index = this.props.index;
        let cartItems = _get(this.props, 'cart.cartItems', [])
        let cart = _get(this.props, 'cart', {})
        let data = _get(this.props, `data`, {});
        let id = data.id;
        let regex = /_design.*/g;
        let isddoc = regex.test(id);
        let dispatch = this.props.dispatch
        let Money = Dinero(_get(data, 'doc.product.salePrice', DineroInit()))
        return (
            <React.Fragment>
                {!isddoc ?
                    <div
                        className='each-tile white-background flex-row relative'
                        id='productCard'
                        onClick={() => this.handleProductClick(data, cartItems, cart, 1, dispatch, index)}
                        index={this.props.index}
                        key={this.props.key}>
                        {
                            localStorage.getItem('cannabisStore') ?
                                null :
                                <div className='absolute added-item-position'>
                                    {(_find(cartItems, cartItem => cartItem.doc.id == data.id)) ? <div className='added-item-count'>{(_find(cartItems, cartItem => cartItem.doc.id == data.id)).qty}</div> : null}
                                </div>
                        }
                        <div className='product-image'>
                            <img src={_get(data, 'doc.product.image') || DefaultImage} alt="" />
                        </div>
                        <div className='flex-column justify-space-between product-info'>
                            <div className='flex-column fwidth'>
                                <div className='truncate'>
                                    <span className="each-card-name">{_get(data, 'doc.product.name', 'undefined')}</span>
                                </div>
                                <div className='truncate'>
                                    <span className="each-card-code-head">Available Quantity : </span>
                                    {
                                        localStorage.getItem('cannabisStore') ?
                                            <span className='each-card-code'>{_get(data, 'doc.inventory.quantity', 0)} {_get(data, 'doc.inventory.quantity', 0) == 0 ? null : _get(data, 'doc.inventory.uom', '')}</span>
                                            :
                                            <span className='each-card-code'>{_get(data, 'doc.inventory.quantity', 0)}</span>
                                    }
                                </div>
                                <div className="each-card-price flex-row">
                                    {Money.toFormat('$0,0.00')}
                                </div>
                                <span
                                    onMouseLeave={() => this.setState({ iconSelected: false })}
                                    onMouseEnter={() => this.setState({ iconSelected: true })}
                                    onClick={() => this.viewProductDetails(index)}
                                    className="quick-view each-card-more"
                                    title="View Details">
                                    <InfoOutlined style={{ color: '#000' }} />
                                </span>
                                <span className="each-card-availabilty">
                                    <div
                                        className='indicator'
                                        style={
                                            _get(data, 'doc.inventory.quantity', 0) == 0 ?
                                                { background: '#e600007a' }
                                                :
                                                { background: '#00ca008c' }
                                        }></div>
                                </span>
                            </div>
                        </div>
                    </div> : null}
                {
                    this.state.openModal ?
                        <SimpleModal
                            open={this.state.openModal}
                            onClose={this.onClose}
                            title={'Product Details'}
                            productDetails={_get(this.props, 'data.doc.product', {})}
                            inventoryDetails={_get(this.props, 'data.doc.inventory', {})}
                            index={index}
                            cart={this.props.cart}
                            cartItems={cartItems}
                            product={data}
                            dispatch={dispatch}
                            cannabisRetailer={this.props.cannabisRetailer}
                            addToCart={(product, cartItems, cart, qty, dispatch, selectedPackage) => this.addToCart(product, cartItems, cart, qty, dispatch, selectedPackage)}
                        /> : ''
                }
            </React.Fragment>)
    }
}

const mapStateToProps = state => {
    let { cart } = state;
    let cannabisRetailer = _get(state, 'loginCreds.lookUpData.Retailer.type', false)
    return {
        cart,
        cannabisRetailer
    }
};

export default connect(mapStateToProps)(Product);



