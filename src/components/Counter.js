import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _set from 'lodash/set';

class Counter extends Component {
	constructor(props){
		super(props)
		this.state = { value: this.props.productQuantity };
		this.increment = this.increment.bind(this);
		this.decrement = this.decrement.bind(this);
	}

	increment(e){
    	this.setState(prevState => ({
      	value: Number(this.props.productQuantity) + 1
    	}), function(){
				_set(this.props,'productQuantity',(Number(this.state.value)));
				this.props.updateQuantity(this.state.value);
		});
		e.preventDefault();
		this.forceUpdate();
  };

	decrement(e){
		e.preventDefault();
		if(this.props.productQuantity <= 1){
			return this.props.productQuantity;
		}
		else{
			this.setState(prevState => ({
				value: Number(this.props.productQuantity) - 1
			}), function(){
				_set(this.props,'productQuantity',(Number(this.state.value)));
				this.props.updateQuantity(this.state.value);
			});
		}
		this.forceUpdate();
	};

	feed(e){
		this.setState({
			value: this.refs.feedQty.value
		}, function(){
				_set(this.props,'productQuantity',this.refs.feedQty.value);
				this.props.updateQuantity(this.state.value);
		})
	};

	resetQuantity(){
		this.setState({
			value: 1
		})
	}
	render() {
		return (
			<div className="counter-main">
				<button type='button' className="btn btn-warning" onClick={this.decrement}>–</button>
				<input ref="feedQty" type="number" className="cart-item-product_qty-input" value={this.props.productQuantity} onChange={this.feed.bind(this)} />
				<button type='button'type='button' className="btn btn-warning"  onClick={this.increment}>+</button>
			</div>
		)
	}
}

Counter.propTypes = {
  value: PropTypes.number
};

export default Counter;