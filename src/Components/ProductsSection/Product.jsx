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

import img1 from '../../assets/images/flowers/flower1.jpg'
//import mapStateToProps from 'react-redux/lib/connect/mapStateToProps';

class Product extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            openModal: false,
            counter: 0,
            qty: 0
        };
        this.ProductDetails = [];
    }


    addToCart = (index, quantity) => {
        if (!this.state.iconSelected) {
            let cartItems = _get(this, 'props.cart.cartItems', [])
            let data = _get(this, `props.data`, {});
            let reqObj = []
            if (_isEmpty(_find(cartItems, data))) {
                reqObj = [
                    ...cartItems,
                    {
                        ...data,
                        qty: quantity ? quantity : 1,
                        saleType: 0
                    }
                ];
                // this.setState({ qty: quantity ? quantity : 1 })
            } else {
                let qty = (_find(cartItems, data)).qty + (quantity ? quantity : 1)
                let index = _findIndex(cartItems, ['id', data.id]);
                reqObj = [
                    ...cartItems
                ]
                reqObj[index].qty = qty;
                this.setState({ qty })
            }
            this.props.dispatch(commonActionCreater(reqObj, 'CART_ITEM_LIST'));
        }
    }


    viewProductDetails = (index) => {
        this.setState({ openModal: true })
    }

    onClose = () => {
        this.setState({ openModal: false })
    }

    render() {
        let index = this.props.index;
        let cartItems = _get(this.props, 'cart.cartItems', [])
        let data = _get(this.props, `data`, {});
        return (
            <React.Fragment>
                <div className='each-tile white-background flex-row relative' id='productCard' onClick={() => this.addToCart(index)} index={this.props.index} key={this.props.key}>
                    <div className='absolute added-item-position'>
                        {(_find(cartItems, { id: data.id })) ? <div className='added-item-count'>{(_find(cartItems, { id: data.id })).qty}</div> : null}
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
                                {_get(data, 'doc.product.salePrice.currencyCode', '')} {_get(data, 'doc.product.salePrice.price', 'NaN')}
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
                </div>
                {
                    this.state.openModal ?
                        <SimpleModal
                            open={this.state.openModal}
                            onClose={this.onClose}
                            title={'Product Details'}
                            productDetails={_get(this.props, 'data.doc.product', {})}
                            inventoryDetails={_get(this.props, 'data.doc.inventory', {})}
                            index={index}
                            addToCart={(index, qty) => this.addToCart(index, qty)}
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



