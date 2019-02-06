import React, {Component} from 'react';
import CartScrollBar from './CartScrollBar';
import Counter from './Counter';
import EmptyCart from '../empty-states/EmptyCart';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import {findDOMNode} from 'react-dom';
import logo from './../assets/images/aobLogo.png';
import Link from 'react-router-dom/Link';
import { Offline, Online } from "react-detect-offline";


class Header extends Component{
    constructor(props){
        super(props);
        this.state = {
            showCart: false,
            cart: this.props.cartItems,
            mobileSearch: false,
            searchParam: '',
        };
        this.toggleShowSecurePin = this.toggleShowSecurePin.bind(this);
        this.showHome = this.showHome.bind(this);
        this.drawerClose = this.drawerClose.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.toggleRightDrawer = this.toggleRightDrawer.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }
    handleCart(e){
        e.preventDefault();
        this.setState({
            showCart: !this.state.showCart
        })
    }
    handleSubmit(e){
        this.props.handleSearch(this.state.searchParam);
        // e.preventDefault();
    }
    handleSearch(e){
        this.setState({
            searchParam: e.target.value,
        })   
        this.props.handleSearch(e.target.value);    
    }
    toggleShowSecurePin(){
        this.props.toggleShowSecurePin();
    }
    toggleMisProduct = ()=>
    {
        this.props.toggleMisProduct();
    }
    handleMobileSearch(e){
        e.preventDefault();
        this.setState({
            mobileSearch: true
        })
    }
    handleSearchNav(e){
        e.preventDefault();
        this.setState({
            mobileSearch: false
        }, function(){
            this.refs.searchBox.value = "";
            this.props.handleMobileSearch();
        })
    }
    handleClickOutside(event) {
        const cartNode = findDOMNode(this.refs.cartPreview);
        const buttonNode = findDOMNode(this.refs.cartButton);
        if(cartNode.classList.contains('active')){
            if (!cartNode || !cartNode.contains(event.target)){
                this.setState({
                    showCart: false
                })
                event.stopPropagation();
            }
        } 
    }
    drawerClose() {
        this.props.drawerClose();
        this.props.onCustomerHistoryClose();
    }
    componentDidMount() {
    //   document.addEventListener('click', this.handleClickOutside.bind(this), true);
    }
    componentWillUnmount() {
    //   document.removeEventListener('click', this.handleClickOutside.bind(this), true);
    }
    showHome() {
        this.props.showHome();
    }
    toggleDrawer  () {
        if(!this.props.showSecurePin)
            this.props.toggleDrawer();
    }
    toggleRightDrawer () {
        debugger;
        if(!this.props.showSecurePin)
            this.props.toggleRightDrawer();
    }
    render(){
        let cartItems;
        let loggedInDate = localStorage.getItem('loggedInDate');
        let loggedInTime =  localStorage.getItem('loggedInTime');
        let finalTime = loggedInDate && loggedInTime ? loggedInDate + " " + loggedInTime : undefined
        cartItems = this.state.cart.map(product =>{
			return(
				<li className="cart-item" key={product.name}>
                    <img className="product-image" src={product.image} />
                    <div className="product-info">
                        <p className="product-name">{product.name}</p>
                        <p className="product-price">{product.price}</p>
                    </div>
                    <div className="product-total">
                        <p className="quantity">{product.quantity} {product.quantity > 1 ?"Nos." : "No." } </p>
                        <p className="amount">{product.quantity * product.price}</p>
                    </div>
                    <a className="product-remove" href="#" onClick={this.props.removeProduct.bind(this, product.id)}>×</a>
                </li>
			)
		});
        let view;
        if(cartItems.length <= 0){
			view = <EmptyCart />
		} else{
			view = <CSSTransitionGroup transitionName="fadeIn" transitionEnterTimeout={500} transitionLeaveTimeout={300} component="ul" className="cart-items">{cartItems}</CSSTransitionGroup>
		}
        return(
            <header>
                <div className="container">
                    <div className="row marg-none">
                    <div className="col-md-9  pad-none">
                    <ul className="header-block">
                        {this.props.showBackButton ?
                            <li className="back-page icon-set" onClick={this.drawerClose} title="Close"></li>
                            :
                            <li  className="category-nav icon-set" onClick={this.toggleDrawer} title="Menu"></li>

                        }
                        <li className="header-logo" title="AllOnBlock"><img className="logo" src={logo} alt="Logo"/></li>
                        <li className="notify icon-set" title="Notification"></li>
                        <Link to="/product"><li className="home-screen icon-set" onClick={()=>this.showHome()} title="Home"></li></Link>
                        <li className="search">
                        <form action="#" method="get" className={this.state.mobileSearch ? "search-form active" : "search-form"}>                          
                            <input type="search" ref="searchBox" placeholder="Search for Products" className="search-keyword" onChange={(event)=>this.handleSearch(event)}/>
                            <button className="search-button" type="button" onClick={()=>this.handleSubmit()}></button>
                        </form></li>
                        <li className="search barcode">
                        <form action="#" method="get" className={this.state.mobileSearch ? "search-form active" : "search-form"}>
                            <input autoFocus type="search" ref="searchBox" placeholder="Scan Products" className="search-keyword" onChange={this.props.handleScanProduct}/>
                        </form></li>
                        <li className="pin icon-set pull-right" onClick={this.toggleShowSecurePin}  title="Secure Pin"></li>
                        <li className="misc-pro icon-set  pull-right" onClick={this.toggleMisProduct}  title="Misc. Products"></li>
                     </ul>
                    </div>
                    <div className="col-md-3  pad-none">
                    <ul className="header-block pull-right">                    
                    <li style={{paddingTop:"10px"}} className="user-details"><strong>{this.props.userName || 'Mike'}</strong><br/>{"ID:"+this.props.userId}<br/> Logged In: {finalTime || '12:01:00'}</li>
                    <Online> <li className="user-section icon-set-online"  title="You are online"></li></Online>
                    <Offline><li className="user-section icon-set-offline"  title="You are offline"></li></Offline>
                   
                    </ul>
                    </div>
                    <div >
                    </div>
                    </div>
                    {/* <div className="cart"> 
                        <div className="cart-info">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>No. of items</td>
                                        <td>:</td>
                                        <td><strong>{this.props.totalItems}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>Sub Total</td>
                                        <td>:</td>
                                        <td><strong>{this.props.total}</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <a className="cart-icon" style={{cursor:"hand", cursor:"pointer"}} onClick={this.handleCart.bind(this)} ref="cartButton">
                            <img className={this.props.cartBounce ? "tada" : " "} src="https://res.cloudinary.com/sivadass/image/upload/v1493548928/icons/bag.png" alt="Cart"/>
                            {this.props.totalItems ? <span className="cart-count">{this.props.totalItems}</span> : "" }
                        </a>
                        <div className={this.state.showCart ? "cart-preview active" : "cart-preview"} ref="cartPreview">
                            <CartScrollBar>
                                {view}
                            </CartScrollBar>
                            <div className="action-block">
                                <button type="button" className={this.state.cart.length > 0 ? " " : "disabled"}>PROCEED TO CHECKOUT</button>
                            </div>
                        </div>
                    </div> */}
                    
                </div>
            </header>
        )
    }
}

export default Header;
