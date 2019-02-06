import React, { Component } from 'react';
import Product from './Product';
import LoadingProducts from '../loaders/Products';
import NoResults from "../empty-states/NoResults";
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import _find from 'lodash/find';

class Products extends Component {
	constructor() {
		super();
	}
	render() {
		let productsData;
		let productTotQuantity = this.props.productQuantityTot;
		let productListHeight = (this.props.windowHeight - 70)
		let cartItems = this.props.cartItems;
		let term = this.props.searchTerm;
		let x;

		function searchingFor(term) {
			return function (x) {
				if (x.name) {
					return x.name.toLowerCase().includes(term.toLowerCase()) || (x.itemCode && x.itemCode.includes(term)) || !term;
				}
			}
		}

		if (this.props.selectedProducts.length > 0) {
			productsData = [];
			this.props.productsList.map(product => {
				this.props.selectedProducts.map(prod => {
					if (prod === product.id) {
						let cartProduct = _find(cartItems, { 'id': product.id })
						let quantity = 1;
						if (cartProduct)
							quantity = cartProduct.quantity;
						productsData.push(
							<Product cartItems={cartItems} productTotQuantity={productTotQuantity} key={product.id} code={product.itemCode} price={product.price} description={product.description} name={product.name} image={product.image}
								id={product.id} addToCart={this.props.addToCart} productQuantity={quantity} updateQuantity={this.props.updateQuantity} openModal={this.props.openModal} />
						)
					}
				})
			})
		} else {
			productsData = this.props.productsList.filter(searchingFor(term)).map(product => {
				let cartProduct = _find(cartItems, { 'id': product.id })
				let quantity = 1;
				if (cartProduct)
					quantity = cartProduct.quantity;
				return (
					<Product
						cartItems={cartItems}
						productTotQuantity={productTotQuantity}
						key={product.id}
						code={product.itemCode}
						price={product.price}
						description={product.description}
						name={product.name}
						image={product.image}
						id={product.id}
						addToCart={this.props.addToCart}
						productQuantity={quantity}
						updateQuantity={this.props.updateQuantity}
						openModal={this.props.openModal} />
				)
			}
			);
		}

		// Empty and Loading States
		let view;
		if (productsData.length <= 0 && !term) {
			view = <LoadingProducts />
		} else if (productsData.length <= 0 && term) {
			view = <NoResults />
		} else {
			view = <CSSTransitionGroup
				transitionName="fadeIn"
				transitionEnterTimeout={500}
				transitionLeaveTimeout={300}
				component="div"
				className="products">
				{productsData}
			</CSSTransitionGroup>
		}
		return (
			<div style={{ height: productListHeight }} className={this.props.drawer ? "products-wrapper shift-right" : "products-wrapper"}>
				{view}
			</div>
		)
	}
}

export default Products;