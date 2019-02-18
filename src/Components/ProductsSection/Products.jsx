import React from 'react';
import _get from 'lodash/get';
import Product from './Product';

const Products = (props) => {
    let productList = _get(props, 'productList.lookUpData', [])
    let products = []
    products =  productList.map((data, index) => {
        return <Product
         data={data}
         index={index}
         productList = {props.productList}
         cartItems={_get(props,'cartItems',[])}
         dispatch={props.dispatch}
          />
    })

    return (
        <div className='pos-products' style={{ height: props.productListHeight }}>
            {products}
        </div>
    )
}

export default Products;