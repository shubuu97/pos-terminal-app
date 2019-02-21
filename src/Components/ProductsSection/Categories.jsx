import React, { Component } from 'react';
import Category from './Category';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _filter from 'lodash/filter';
import {connect} from 'react-redux';
//Pouch Import
import PouchDb from 'pouchdb';

//Redux Import
import { commonActionCreater } from '../../Redux/commonAction';

class Categories extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allCategory: [],
            rootCategory: [],
            subCategory: [],
            leafCategory: [],
            filteredSubCategory: [],
            filteredLeafCategory: [],
            categoryToDisplay: [],
            selectedCategory: '',
            level: 0
        }
    }

    componentDidMount() {
        let categoryDb = new PouchDb('categoryDb');
        categoryDb.search({
            query: '*:*',
            fields: ['categoryType'],
            filter: function(doc) {
                if(doc.categoryType === 1) {
                    return doc
                }
            },
            include_docs: true,
            skip: 0
        }).then((results) => {
            this.props.dispatch(commonActionCreater(results, 'GET_CATEGORY_DATA_SUCCESS'))
        }).catch((err) => {
            console.log(err);
        })
    }
    
    // componentWillReceiveProps(props)  {
    //     if(!_isEmpty(this.props.categoryList)) {
    //         let rootCategory = _filter(this.props.categoryList, category => {
    //             if(!_get(category,'doc.categoryType', '')) {
    //                 return true
    //             }        
    //         })
    //         let subCategory = _filter(this.props.categoryList, category => {
    //             return category.doc.categoryType == 1
    //         })
    //         let leafCategory = _filter(this.props.categoryList, category => {
    //             return category.doc.categoryType == 2
    //         })
    //         this.setState({ rootCategory, subCategory, leafCategory, 
    //         categoryToDisplay: rootCategory, allCategory: this.props.categoryList })
    //     }
    // }

    handleCategoryClick = ( id, level) => {
        let filteredSubCategory = _filter(_get(this.state,'subCategory', []), category => {
            return category.doc.parentCategoryId == id
        })
        this.setState({ categoryToDisplay: filteredSubCategory, filteredSubCategory })

        if(level == 1) {
            let filteredLeafCategory = _filter(_get(this.state,'leafCategory', []), category => {
                return category.doc.parentCategoryId == id
            })
            this.setState({ categoryToDisplay: filteredLeafCategory, filteredLeafCategory })
        }

        // let productsdb = new PouchDb('productsdb');
        //     productsdb.search({
        //         query: id,
        //         fields: ['product.category1','product.category2','product.category3'],
        //         include_docs: true,
        //         limit: 20,
        //         skip: 0
        //     }).then((res)=> {
        //         this.props.dispatch(commonActionCreater(res,'GET_PRODUCT_DATA_SUCCESS'));
        //     })
        //       .catch((err)=>{
        //         console.log(err);
        //   })
    }

    render() {
        console.log(this.props.categoryList, 'this.props.categoryList render')
        return (
            <div className='product-catogories' style={{height:this.props.categoriesHeight}}>
                {_get(this.state,'categoryToDisplay', []).map(category => {
                    return <Category 
                            category={category} 
                            clickHandler={this.handleCategoryClick} 
                        /> 
                })}
            </div>
        )
    }
}

const mapStateToProps = state => {
    let { categoryList } = state;
    categoryList = _get(categoryList, 'lookUpData.rows', [])
    return { categoryList }
}

export default connect(mapStateToProps)(Categories);