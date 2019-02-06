import React, { Component } from 'react';
import Counter from './Counter';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import _find from 'lodash/find';

import styles from './styles/temp.css';

class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedProduct: {},
            quickViewProduct: {},
            isAdded: false,
            showBox: false,
        }
        this.totalQuantity = 0;
    }
    addToCart(image, name, price, id, quantity, description, code) {
        this.setState({
            selectedProduct: {
                image: image,
                name: name,
                price: price,
                id: id,
                code: code,
                description: description,
                quantity: quantity
            }
        }, function () {
            this.props.addToCart(this.state.selectedProduct);
        })
        this.setState({
            isAdded: true
        }, function () {
            setTimeout(() => {
                this.setState({
                    isAdded: false,
                    selectedProduct: {}
                });
            }, 3500);
        });

        this.totalQuantity += quantity;

    }
    quickView(image, name, price, id, quantity, description) {
        this.setState({
            quickViewProduct: {
                image: image,
                name: name,
                price: price,
                id: id,
                description: description
            }
        }, function () {
            this.setState({ showBox: true })
            this.props.openModal(this.state.quickViewProduct);
        })
    }
    render() {
        let image = this.props.image;
        let name = this.props.name;
        let price = this.props.price;
        let id = this.props.id;
        let code = this.props.code;
        let quantity = this.props.productQuantity;
        let description = this.props.description;
        let cartItems = this.props.cartItems;
        let product = _find(cartItems, { 'id': id });

        return (

            // <div className="product">
            //     <div className="product-content">
            //         <div className="product-image">
            //             <img className="img-responsive" src={image} alt={this.props.name} onClick={this.addToCart.bind(this, image, name, price, id, quantity, description, code)} />
            //         </div>
            //         <div className="product-price">${this.props.price}</div>
            //         <div className="product-code">Item Code:<span> {code}</span></div>
            //         <h4 className="product-name">{this.props.name}</h4>
            //         <span className="quick-view" title="View Details"
            //             onClick={this.quickView.bind(this, image, name, price, id, quantity, description)}></span>

            //         {(product) ?
            //             <div className="qty-holder product-added-qty ">Added<br />{quantity}</div> : ''}
            //         {/* <div className="qty-holder product-left-qty">Left<br/>45</div> */}
            //         {/* <Counter productQuantity={quantity} updateQuantity={this.props.updateQuantity} resetQuantity={this.resetQuantity}/> */}
            //         {/* <div className="product-action">
            //         <button className={!this.state.isAdded ? "" : "added"} type="button" onClick={this.quickView.bind(this, image, name, price, id, quantity)}>{!this.state.isAdded ? "ADD TO CART" : "✔ ADDED"}</button>
            //     </div> */}
            //     </div>
            // </div>

            <div className='each-card' onClick={this.addToCart.bind(this, image, name, price, id, quantity, description, code)}>
                <div className='flex-column'>
                    <div className='truncate'>
                        <span className="each-card-name">{this.props.name}</span>
                    </div>
                    <div>
                        <span className="each-card-code-head">Item Code:</span>
                        <span className='each-card-code'>{code}</span>
                    </div>
                </div>
                <div className="each-card-price flex-row">
                ${this.props.price}
                <div className='indicator'></div>
                </div>

                


                <span className="quick-view each-card-more" title="View Details" onClick={this.quickView.bind(this, image, name, price, id, quantity, description)}></span>
                {(product) ?
                    <div className="qty-holder product-added-qty ">Added<br />{quantity}</div> : ''}
            </div >
        )
    }
}

export default Product;
