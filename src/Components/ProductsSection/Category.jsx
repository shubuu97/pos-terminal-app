import React from 'react';
import _get from 'lodash/get';

const Category = (props) => {
    return (
        <div className='each-tile blue-background'>
            <span className='category-text'>
                {_get(props,'categoryName', '')}
            </span>
        </div>
    )
}

export default Category;