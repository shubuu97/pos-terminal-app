import React, { Component } from 'react';
import Category from './Category';
// Lodash Import
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _filter from 'lodash/filter';
import {connect} from 'react-redux';
//Redux Import
import { commonActionCreater } from '../../../Redux/commonAction';
//Pouch Import
import PouchDb from 'pouchdb';
import Find from 'pouchdb-find'

PouchDb.plugin(Find)

let categoryDb = new PouchDb('categoryDb');
categoryDb.createIndex({
    index: {
      fields: ['categoryType']
    }
  }).then(function (result) {
    console.log(result)
}).catch(function (err) {
    console.log(err);
  });

class Categories extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categoryToDisplay: []
        }
    }

    componentDidMount() {
        categoryDb.find({
           selector:{"categoryType": 0}
        }).then((results) => {
            this.props.dispatch(commonActionCreater(results.docs, 'GET_CATEGORY_DATA_SUCCESS'))
        }).catch((err) => {
            console.log(err);
        })
    }

    componentWillReceiveProps(nextProps) {
        if(!_isEmpty(nextProps.categoryList)) {
            this.setState({categoryToDisplay: nextProps.categoryList})
        }
    }

    handleCategoryClick = ( id, level) => {
        this.setState({selectedId: id})
        categoryDb.find({
            selector:{"parentCategoryId": id}
         }).then((results) => {
             this.props.dispatch(commonActionCreater(results.docs, 'GET_CATEGORY_DATA_SUCCESS'))
         }).catch((err) => {
             console.log(err);
         })

        let productsdb = new PouchDb('productsdb');
            productsdb.search({
                query: id,
                fields: ['product.category1','product.category2','product.category3'],
                include_docs: true,
                limit: 20,
                skip: 0
            }).then((res)=> {
                this.props.dispatch(commonActionCreater(res,'GET_PRODUCT_DATA_SUCCESS'));
            })
              .catch((err)=>{
                console.log(err);
          })
    }

    getCategory = (id) => {
        categoryDb.find({
            selector:{"categoryType": id}
         }).then((results) => {
             this.props.dispatch(commonActionCreater(results.docs, 'GET_CATEGORY_DATA_SUCCESS'))
         }).catch((err) => {
             console.log(err);
         })
    }

    getProductData = () => {
        let productsdb = new PouchDb('productsdb');
        productsdb.allDocs({
            include_docs: true,
            attachments: true,
            limit: 20,
            skip: 0
        }).then((result) => {
            this.props.dispatch(commonActionCreater(result, 'GET_PRODUCT_DATA_SUCCESS'));
        }).catch((err) => {

        });
    }


    render() {
        return (
            <div className='product-catogories' style={{height:this.props.categoriesHeight}}>
            <span onClick={this.getProductData}>All</span>
            <span onClick={() => this.getCategory(0)}>Root Category</span>
            <span onClick={() => this.getCategory(1)}>Sub category</span>
            {_get(this.state,'categoryToDisplay', []).map(category => {
                return <Category 
                        category={category} 
                        clickHandler={this.handleCategoryClick} /> 
            })}
            </div>
        )
    }
}

const mapStateToProps = state => {
    let { categoryList } = state;
    categoryList = _get(categoryList, 'lookUpData', [])
    return { categoryList }
}

export default connect(mapStateToProps)(Categories);