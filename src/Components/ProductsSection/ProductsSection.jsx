import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */

/* Redux Imports */

/* Component Imports */
import SideDrawer from '../SideDrawer'

class ProductsSection extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }

    render() {
        let { windowHeight, productListHeight, headerHeight, categoriesHeight } = this.props
        return (
            <div className='pos-products-collection' style={{ height: windowHeight }}>

                    {/* 
                // * Header Component
                */}
                    <div className='pos-header' style={{height:headerHeight}}>
                        <div className="header-top" >
                            <SideDrawer/>
                        </div>
                        <div className='header-bottom'>

                        </div>
                    </div>


                    {/* 
                // * Product Categories Component
                */}
                    <div className='product-catogories' style={{height:categoriesHeight}}>
                        <div className='each-tile blue-background'>
                            <span className='category-text'>
                                Hello
                            </span>
                        </div>
                        <div className='each-tile blue-background'>
                            <span className='category-text'>
                                Hello
                            </span>
                        </div>
                        <div className='each-tile blue-background'>
                            <span className='category-text'>
                                Hello
                            </span>
                        </div>
                        <div className='each-tile blue-background'>
                            <span className='category-text'>
                                Hello
                            </span>
                        </div>
                    </div>

                    {/* 
                // * Products List Component
                */}
                    <div className='pos-products' style={{ height: productListHeight }}>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Red Blue Green Rose</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Lorem Ipsem</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Code : </span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                    </div>
                </div>
        );
    }
}

export default ProductsSection;