import React, { Component } from 'react';
import Category from './Category';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _filter from 'lodash/filter';

class Categories extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allCategory: [],
            rootCategory: [],
            subCategory: [],
            leafCategory: []
        }
    }
    
    componentWillReceiveProps(props)  {
        if(!_isEmpty(props.categoryList)) {
            let rootCategory = _filter(props.categoryList, category => {
                if(!_get(category,'doc.categoryType', '')) {
                    return true
                }        
            })
            let subCategory = _filter(props.categoryList, category => {
                return category.categoryType === 1
            })
            let leafCategory = _filter(props.categoryList, category => {
                return category.categoryType === 2
            })
            this.setState({
               allCategory: props.categoryList, rootCategory, subCategory, leafCategory
            })
        }
    }

    render() {
        return (
            <div className='product-catogories' style={{height:this.props.categoriesHeight}}>
                {_get(this.state,'rootCategory', []).map(category => {
                    return <Category categoryName={category.doc.name} /> 
                })}
            </div>
        )
    }
}

export default Categories;