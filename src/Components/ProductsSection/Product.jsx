import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _findIndex from 'lodash/findIndex';
import _find from 'lodash/find'
/* Material import */

/* Redux Imports */
import { commonActionCreater } from '../../Redux/commonAction'

class Product extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    // componentDidMount()
    // {
    // let cartItems = _get(this, 'props.CartItems', [])
    // let data =  _get(this, `props.productList.lookUpData[${this.props.index}]`, {})

    //     if(_find(cartItems, data)){
    //         let cartQuantity = (_find(cartItems, data)).cartQuantity;
    //         this.setState({cartQuantity})
    //     }
    // }
    componentWillReceiveProps(props) {
        let cartItems = _get(props, 'cart.cartItems', [])
        let data = _get(props, `productList.lookUpData[${props.index}]`, {})

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
        let data = _get(this, `props.productList.lookUpData[${index}]`, {})
        let reqObj
        if (_isEmpty(_find(cartItems, data))) {
            reqObj = [
                ...cartItems,
                { 
            ...data, cartQuantity: 1,subTotal:data.salePrice.price*1 }
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
            reqObj[index].subTotal = data.salePrice.price*cartQuantity;
            this.setState({cartQuantity})
        }
        this.props.dispatch(commonActionCreater(reqObj, 'CART_ITEM_LIST'));
    }
    render() {
        let data = this.props.data;
        let index = this.props.index;
        return (
            <div className='each-tile white-background flex-row relative' onClick={() => this.addToCart(index)}>
                <div className='absolute added-item-position'>
                    {this.state.cartQuantity ? <div className='added-item-count'>{this.state.cartQuantity}</div> : null}
                </div>
                <div className='flex-column fwidth'>
                    <div className='truncate'>
                        <span className="each-card-name">{_get(data, 'name', 'undefined')}</span>
                    </div>
                    <div className='truncate'>
                        <span className="each-card-code-head">Code : </span>
                        <span className='each-card-code'>{_get(data, 'id', '')}</span>
                    </div>
                    <div className="each-card-price flex-row">
                        {_get(data, 'salePrice.currencyCode', '')} {_get(data, 'salePrice.price', 'NaN')}
                        <div className='indicator'></div>
                    </div>
                    <span className="quick-view each-card-more" title="View Details"></span>
                </div>
            </div>)
    }
}

export default Product;