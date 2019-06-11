import React from 'react';
import _get from 'lodash/get';
import Product from './Product';
import _isEmpty from 'lodash/isEmpty';



const Products = (props) => {

    let productList = _get(props, 'productList', [])
    let products
    if (productList.length == 0) {
        products = <div className="no-product-found">
            <h1>No Product Found!</h1>
        </div>
    } else {
        products = productList.map((data, index) => {
            let productData = {
                doc: {
                    

                }
            }
            if (localStorage.getItem('cannabisStore')) {
                productData.doc = data.doc.product
            }
            return <Product
                data={productData}
                key={index}
                index={index}
                productList={props.productList}
                //cart={_get(props, 'cart', [])}
                dispatch={props.dispatch}
                isProductModalOpen={props.isProductModalOpen}
            />
        })
    }



    return (
        <React.Fragment>
            {products}
        </React.Fragment>
    )
}

export default Products;