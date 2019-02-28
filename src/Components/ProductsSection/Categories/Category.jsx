import React from 'react';
import _get from 'lodash/get';

const Category = (props) => {
    // const {id, name, categoryType} = props.category
    const {category} = props

    return (
        <div className='each-tile blue-background'
            onClick={() => props.clickHandler(category)}
            style={{'cursor': 'pointer'}}>
            <span className='category-text'>
                {category.name}
            </span>
        </div>
    )
}

export default Category;