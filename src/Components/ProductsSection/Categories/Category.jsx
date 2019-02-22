import React from 'react';
import _get from 'lodash/get';

const Category = (props) => {
    // const {id, name, categoryType} = props.category
    const {category} = props

    return (
        <div className='each-tile blue-background'>
            <span className='category-text' 
                  onClick={() => props.clickHandler(category)}
                  style={{'cursor': 'pointer'}}>
                {category.name}
            </span>
        </div>
    )
}

export default Category;