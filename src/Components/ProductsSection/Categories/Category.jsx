import React from 'react';
import _get from 'lodash/get';

const Category = (props) => {
    const {id, name, categoryType} = props.category
    
    return (
        <div className='each-tile blue-background'>
            <span className='category-text' 
                  onClick={() => props.clickHandler(id, categoryType)}
                  style={{'cursor': 'pointer'}}>
                {name}
            </span>
        </div>
    )
}

export default Category;