import React from 'react';
import _get from 'lodash/get';
import Product from './Product';

const Products = (props) => {
    let productList = _get(props, 'productList', [])
    let products = []
    products = productList.map((data, index) => {
        return <Product
            data={data}
            key={index}
            index={index}
            productList={props.productList}
            cart={_get(props, 'cart', [])}
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