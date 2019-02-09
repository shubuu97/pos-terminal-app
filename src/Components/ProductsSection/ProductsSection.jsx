import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */

/* Redux Imports */

/* Component Imports */
import SideDrawer from '../SideDrawer'
/* dummy images */
import img1 from '../../assets/images/flowers/flower1.jpg'
import img2 from '../../assets/images/flowers/flower2.jpg'
import img3 from '../../assets/images/flowers/flower3.jpg'
import img4 from '../../assets/images/flowers/flower4.jpg'
import img5 from '../../assets/images/flowers/flower5.jpg'
import img6 from '../../assets/images/flowers/flower6.jpg'
import img7 from '../../assets/images/flowers/flower7.jpg'
import img8 from '../../assets/images/flowers/flower8.JPG'
import img9 from '../../assets/images/flowers/flower9.jpg'
import img10 from '../../assets/images/flowers/flower10.jpg'


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
                <div className='pos-header' style={{ height: headerHeight }}>
                    <div className="header-top" >
                        <SideDrawer />
                    </div>
                    <div className='header-bottom'>

                    </div>
                </div>


                {/* 
                // * Product Categories Component
                */}
                <div className='product-catogories' style={{ height: categoriesHeight }}>
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

                    <div className='each-tile white-background flex-row'>
                        <div className='each-tile-img'>
                            <img src={img1} alt="" className='width-100-percent'/>
                        </div>
                        <div className='flex-column'>
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