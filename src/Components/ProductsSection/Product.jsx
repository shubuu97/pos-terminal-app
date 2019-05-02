import React from 'react';
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

    addToCart = (product, cartItems, quantity, dispatch) => {
        let products = {
            doc: product.doc
        }
        if (!this.state.iconSelected) {
            addToCart(products, cartItems, quantity, dispatch)
            this.setState({
                qty: this.state.qty + quantity
            })
        }
    }

    render() {
        let index = this.props.index;
        let cartItems = _get(this.props, 'cart.cartItems', [])
        let data = _get(this.props, `data`, {});
        let id = data.id;
        let regex = /_design.*/g;
        let isddoc = regex.test(id);
        let dispatch = this.props.dispatch
        debugger
        return (
            <React.Fragment>
                {!isddoc ?
                    <div className='each-tile white-background flex-row relative' id='productCard' onClick={() => this.addToCart(data, cartItems, 1, dispatch)} index={this.props.index} key={this.props.key}>
                        <div className='absolute added-item-position'>
                            {(_find(cartItems, cartItem => cartItem.doc._id == data.id )) ? <div className='added-item-count'>{(_find(cartItems, cartItem => cartItem.doc._id == data.id)).qty}</div> : null}
                        </div>
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
                                    <span className='each-card-code'>{_get(data, 'doc.inventory.quantity', 0)}</span>
                                </div>
                                <div className="each-card-price flex-row">
                                    {_get(data, 'doc.product.salePrice.currencyCode', '')} {_get(data, 'doc.product.salePrice.price', 0).toFixed(2)}
                                    {/* <div className='indicator'></div> */}
                                </div>
                                <span
                                    onMouseLeave={() => this.setState({ iconSelected: false })}
                                    onMouseEnter={() => this.setState({ iconSelected: true })}
                                    onClick={() => this.viewProductDetails(index)}
                                    className="quick-view each-card-more"
                                    title="View Details">
                                    <InfoOutlined style={{ color: '#000' }} />
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
                            cartItems={cartItems}
                            product={data}
                            dispatch={dispatch}
                            addToCart={(product, cartItems, qty, dispatch) => this.addToCart(product, cartItems, qty, dispatch)}
                        /> : ''
                }
            </React.Fragment>)
    }
}

const mapStateToProps = state => {
    let { cart } = state;

    return {
        cart
    }
};

export default connect(mapStateToProps)(Product);



