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

    populateProducts = () => {
        let productList = _get(this, 'props.productList.lookUpData', [])
        let products = []
        productList.map((data, index) => {
            products.push(
                <div className='each-tile white-background flex-row'>
                    <div className='flex-column fwidth'>
                        <div className='truncate'>
                            <span className="each-card-name">{_get(data, 'name', '')}</span>
                        </div>
                        <div className='truncate'>
                            <span className="each-card-code-head">Code : </span>
                            <span className='each-card-code'>{_get(data, 'id', '')}</span>
                        </div>
                        <div className="each-card-price flex-row">
                            {_get(data, 'salePrice.currencyCode', '')} {_get(data, 'salePrice.price', '')}
                            <div className='indicator'></div>
                        </div>
                        <span className="quick-view each-card-more" title="View Details"></span>
                    </div>
                </div>
            )
        })

        return (
            <div className='pos-products' style={{ height: this.props.productListHeight }}>
                {products}
            </div>
        )
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


                {this.populateProducts()}

            </div>
        );
    }
}

export default ProductsSection;