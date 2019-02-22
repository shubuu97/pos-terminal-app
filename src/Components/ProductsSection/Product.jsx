import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _findIndex from 'lodash/findIndex';
import _find from 'lodash/find'
/* Material import */
import Info from '@material-ui/icons/Info';
/* Redux Imports */
import { commonActionCreater } from '../../Redux/commonAction';
import SimpleModal from '../../Global/Components/Modal/MaterialUIModal.jsx';
import { Button } from '@material-ui/core';

class Product extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openModal: false,
            counter: 0
        };
        this.ProductDetails = [];
    }

    componentWillReceiveProps(props) {
        let cartItems = _get(props, 'cart.cartItems', [])
        let data = _get(this, `props.data`, {});

        if (_find(cartItems, data)) {
            let cartQuantity = (_find(cartItems, data)).cartQuantity;
            this.setState({ cartQuantity })
        }
        else {
            this.setState({ cartQuantity: 0 })
        }
    }

    addToCart = (index) => {
        let cartItems = _get(this, 'props.cart.cartItems', [])
        let data = _get(this, `props.data`, {});
        let reqObj
        if (_isEmpty(_find(cartItems, data))) {
            reqObj = [
                ...cartItems,
                {
                    ...data,
                    cartQuantity: 1,
                }
            ];
            this.setState({ cartQuantity: 1 })
        }
        else {
            let cartQuantity = (_find(cartItems, data)).cartQuantity + 1
            let index = _findIndex(cartItems, ['id', data.id]);
            reqObj = [
                ...cartItems
            ]
            reqObj[index].cartQuantity = cartQuantity;
            this.setState({ cartQuantity })
        }
        this.props.dispatch(commonActionCreater(reqObj, 'CART_ITEM_LIST'));
    }

    viewProductDetails = (index) => {
        this.setState({ openModal: true })
        let productDetails = _get(this.props, 'data.doc.product', {});
        this.ProductDetails.push(
            <div className="col-sm-12">
                <div className="col-sm-6 pop-img">
                    <img src={_get(productDetails, 'image', '')} alt={_get(productDetails, 'image', '')} />
                </div>

                <div className="col-sm-6">
                    <div className='flex-column fwidth'>
                        <div className='truncate'>
                            <span className="each-card-name">{_get(productDetails, 'name', '')}</span>
                        </div>
                        <div className='truncate'>
                            <span className="each-card-code-head">Code : </span>
                            <span className='each-card-code'>{_get(productDetails, 'id', '')}</span>
                        </div>
                        <div className="each-card-price flex-row">
                            {_get(productDetails, 'salePrice.currencyCode', '')} {_get(productDetails, 'salePrice.price', 'NaN')}
                            <div className='indicator'></div>
                        </div>
                        <div className='button-section flex-row '>
                            <Button className='mr-20' variant="outlined" onClick={() => this.addToCart(index)}>Add To Cart</Button>
                        </div>
                    </div>
                </div>

            </div>

        )
    }

    onClose = () => {
        this.setState({ openModal: false })
    }

    render() {
        let data = this.props.data;
        let index = this.props.index;
        return (
            <React.Fragment>
                <div className='each-tile white-background flex-row relative' onClick={() => this.addToCart(index)}>
                    <div className='absolute added-item-position'>
                        {this.state.cartQuantity ? <div className='added-item-count'>{this.state.cartQuantity}</div> : null}
                    </div>
                    <div className='flex-column fwidth'>
                        <div className='truncate'>
                            <span className="each-card-name">{_get(data, 'doc.product.name', 'undefined')}</span>
                        </div>
                        <div className='truncate'>
                            <span className="each-card-code-head">Code : </span>
                            <span className='each-card-code'>{_get(data, 'doc.product.id', '')}</span>
                        </div>
                        <div className="each-card-price flex-row">
                            {_get(data, 'doc.product.salePrice.currencyCode', '')} {_get(data, 'doc.product.salePrice.price', 'NaN')}
                            <div className='indicator'></div>
                        </div>
                        <span onClick={() => this.viewProductDetails(index)} className="quick-view each-card-more" title="View Details">
                            <Info />
                        </span>
                    </div>
                </div>
                {
                    this.state.openModal ?
                        <SimpleModal
                            open={this.state.openModal}
                            onClose={this.onClose}
                            title={'Product Details'}
                            description={this.ProductDetails}
                        /> : ''
                }
            </React.Fragment>)
    }
}

export default Product;