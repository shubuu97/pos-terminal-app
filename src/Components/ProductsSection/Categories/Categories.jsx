import React, { Component } from "react";
import Category from "./Category";
import BreadCrumb from "./BreadCrumb";
// Lodash Import
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import _set from "lodash/set";
//Redux Import
import { commonActionCreater } from "../../../Redux/commonAction";
import { connect } from "react-redux";
//Pouch Import
import PouchDb from "pouchdb";
import Find from "pouchdb-find";
import PAM from "pouchdb-adapter-memory"
import genericPostData from '../../../Global/dataFetch/genericPostData';
/* Material Icons */
import Whatshot from '@material-ui/icons/Whatshot'
PouchDb.plugin(Find);
PouchDb.plugin(PAM);

// let categoryDb = new PouchDb(`categoryDb${localStorage.getItem("storeId")}`);

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryToDisplay: [],
      displayLevel: 0,
      //!mute 
      // hotActive: true,
      rootCategory: {
        name: "",
        categoryType: 0,
        id: ""
      },
      subCategory: {
        name: "",
        categoryType: 1,
        id: ""
      },
      leafCategory: {
        name: "",
        categoryType: 2,
        id: ""
      },
      selectedCategory: {
        name: "",
        categoryType: -1,
        id: ""
      }
    };
  }

  componentDidMount() {
    //!mute hot proudct
    // let hps = localStorage.getItem('hotProducts') || '[]';
    // hps = JSON.parse(hps)
    // if (hps.length > 0) {
    //   localStorage.setItem('IS_HOT_PRODUCT_ACTIVE', true);
    //   // this.setState({ hotActive: true })

    // }
    // else {
    //   localStorage.setItem('IS_HOT_PRODUCT_ACTIVE', false);
    //   //this.setState({ hotActive: false })
    // }
    let categoryDb = new PouchDb(`categoryDb${localStorage.getItem("storeId")}`);
    categoryDb
      .find({
        selector: { categoryType: 0 }
      })
      .then(results => {
        this.props.dispatch(
          commonActionCreater(results.docs, "GET_CATEGORY_DATA_SUCCESS")
        );
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentWillReceiveProps(nextProps) {
    if (!_isEmpty(nextProps.categoryList)) {
      this.setState({ categoryToDisplay: nextProps.categoryList });
    }
  }

  handleHomeClick = () => {
    this.props.getHomeClicked();
    localStorage.setItem('IS_HOT_PRODUCT_ACTIVE', false);
    //!mute
    // this.setState({ selectedCategory: { categoryType: -1 }, hotActive: false });
    this.setState({ selectedCategory: { categoryType: -1 } });
    this.props.getProductData();
    this.getCategory(0);
  };

  handleCannaCategoryClick = category => {
    let filters = [
      { "field": "retailerId", "value": localStorage.getItem('retailerId') },
      { "field": "availableAtStores", "value": localStorage.getItem('storeId') },
  ]
    this.setState({ selectedCategory: category });

    if (category.categoryType === 0) {
      filters.push({ "field": "category1", "value": category.id })
      this.setState({ rootCategory: category });
    }
    if (category.categoryType === 1) {
      filters.push({ "field": "category2", "value": category.id })

      this.setState({ subCategory: category });
    }
    if (category.categoryType === 2) {
      filters.push({ "field": "category3", "value": category.id })
      this.setState({ leafCategory: category });
    }
    let customerType = localStorage.getItem('selectedCustomerType')

    if (customerType == 1) {
      filters = [...filters,
      { 'field': 'productType', 'value': '1' },
      { 'field': 'productType', 'value': '2' },
      { 'field': 'productType', 'value': '3' },


      ]
    }
    else if (customerType == 2) {
      filters = [
        ...filters,
        { 'field': 'productType', 'value': '1' },
        { 'field': 'productType', 'value': '3' },
      ]
    }
    let reqObj = {
      request: {
        "text": '',
        "offset": 0,
        "limit": 39,
        "filters": filters
      },
      storeId: localStorage.getItem('storeId')
    }
    let categoryDb = new PouchDb(`categoryDb${localStorage.getItem("storeId")}`);
    categoryDb
      .find({
        selector: { parentCategoryId: category.id }
      })
      .then(results => {
        this.props.dispatch(
          commonActionCreater(results.docs, "GET_CATEGORY_DATA_SUCCESS")
        );
      })
      .catch(err => {
        console.log(err);
      });

    genericPostData({
      dispatch: this.props.dispatch,
      reqObj: reqObj,
      url: 'Search/Inventory',
      dontShowMessage: true,
      constants: {
        init: 'ELASTIC_SEARCH_PRODUCTS_INIT',
        success: 'ELASTIC_SEARCH_PRODUCTS_SUCCESS',
        error: 'ELASTIC_SEARCH_PRODUCTS_ERROR'
      },
      identifier: 'ELASTIC_SEARCH_PRODUCTS_RULES',
      successCb: (data) => { }
    }).then((data) => {
      let result = {}
      result.pagination = {}
      result.pagination.method = "allDocs"
      result.pagination.firstItemId = _get(data, 'products[0].id', '')
      result.pagination.lastItemId = _get(data, 'products[data.products.length - 1].id', '')
      result.pagination.pageNo = 1
      result.pagination.startVal = 1
      result.pagination.endVal = _get(data, 'products.length', 0)
      let rows = _get(data, 'products', []).map((d) => {
        let obj = {
          doc: {
            product: d
          },
          id: d.product.id
        }
        return obj
      })
      result.rows = rows
      console.log(result, 'result')
      this.props.dispatch(commonActionCreater(result, 'GET_PRODUCT_DATA_SUCCESS'));
    })

  }


  handleCategoryClick = category => {

    this.setState({ selectedCategory: category });

    if (category.categoryType === 0) {
      this.setState({ rootCategory: category });
    }
    if (category.categoryType === 1) {
      this.setState({ subCategory: category });
    }
    if (category.categoryType === 2) {
      this.setState({ leafCategory: category });
    }
    let categoryDb = new PouchDb(`categoryDb${localStorage.getItem("storeId")}`);
    categoryDb
      .find({
        selector: { parentCategoryId: category.id }
      })
      .then(results => {
        this.props.dispatch(
          commonActionCreater(results.docs, "GET_CATEGORY_DATA_SUCCESS")
        );
      })
      .catch(err => {
        console.log(err);
      });

    let productsdb = new PouchDb(`productsdb${localStorage.getItem("storeId")}`);
    productsdb
      .search({
        query: category.id,
        fields: ["product.category1", "product.category2", "product.category3"],
        include_docs: true,
        limit: 39,
        skip: 0
      })
      .then(result => {
        let emptyResult
        if (result.total_rows == 0) {
          emptyResult = {}
          this.props.dispatch(commonActionCreater(emptyResult, 'GET_PRODUCT_DATA_SUCCESS'))
        }
        result.pagination = {}
        result.pagination.method = "categories"
        result.pagination.query = category.id
        result.pagination.fields = ["product.category1", "product.category2", "product.category3"]
        result.pagination.firstItemId = result.rows[0].id
        result.pagination.lastItemId = result.rows[result.rows.length - 1].id
        result.pagination.pageNo = 1
        result.pagination.startVal = 1
        result.pagination.endVal = result.rows.length
        this.props.dispatch(commonActionCreater(result, "GET_PRODUCT_DATA_SUCCESS")
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  getCategory = level => {
    let categoryDb = new PouchDb(`categoryDb${localStorage.getItem("storeId")}`);
    categoryDb
      .find({
        selector: { categoryType: level }
      })
      .then(results => {
        this.props.dispatch(
          commonActionCreater(results.docs, "GET_CATEGORY_DATA_SUCCESS")
        );
      })
      .catch(err => {
        console.log(err);
      });
  }

  getHotProduct = () => {
    if (!this.state.hotActive == false) {
      localStorage.setItem('IS_HOT_PRODUCT_ACTIVE', false);
      this.setState({ hotActive: false });
      this.handleHomeClick();
      return;
    }
    this.getHotProductFromPouch();
  }
  getHotProductFromPouch = () => {
    let hotProducts = localStorage.getItem('hotProducts') || '[]';
    hotProducts = JSON.parse(hotProducts);
    if (hotProducts.length == 0) {
      this.handleHomeClick()
      return;
    }
    this.setState({ hotActive: true });
    localStorage.setItem('IS_HOT_PRODUCT_ACTIVE', true);
    let result = { rows: [] }
    result.rows = hotProducts.map(hotProduct => {
      let obj = {};
      _set(obj, 'id', hotProduct._id)
      _set(obj, 'doc', hotProduct);
      return obj;
    });
    result.pagination = {}
    result.pagination.method = "allDocs"
    result.pagination.firstItemId = result.rows[0].id
    result.pagination.lastItemId = result.rows[result.rows.length - 1].id
    result.pagination.pageNo = 1
    result.pagination.startVal = 1
    result.pagination.endVal = result.rows.length;
    this.props.dispatch(commonActionCreater(result, 'GET_PRODUCT_DATA_SUCCESS'));
  }

  render() {
    return (
      <div>
        <div className="breadcrumbs">
          <BreadCrumb
            homeClickHandler={this.handleHomeClick}
            categoryClickHandler={localStorage.getItem('cannabisStore') ? this.handleCannaCategoryClick : this.handleCategoryClick}
            selectedRootCategory={this.state.rootCategory}
            selectedSubCategory={this.state.subCategory}
            selectedLeafCategory={this.state.leafCategory}
            getHotProductFromPouch={this.getHotProductFromPouch}
            selectedCurrentCategory={this.state.selectedCategory}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{ width: '100%' }}
            className="product-catogories"
          // style={{ height: this.props.categoriesHeight }}
          >
            {_get(this.state, "categoryToDisplay", []).map(category => {
              return (
                <Category
                  category={category}
                  clickHandler={localStorage.getItem('cannabisStore') ? this.handleCannaCategoryClick : this.handleCategoryClick}
                />
              );
            })}
          </div>
          {/* <div onClick={this.getHotProduct} style={this.state.hotActive ? { width: '10%', color: '#f57c7c', borderColor: '#f57c7c', background: '#fff4f4' } : { width: '10%' }} className="hot-icon" >
            <Whatshot style={this.state.hotActive ? { width: '24px', height: '24px', color: '#f57c7c' } : { width: '24px', height: '24px', color: 'rgba(0,0,0,0.6)' }} />
            <span className='hot-text' style={this.state.hotActive ? { color: '#f57c7c', fontWeight: 'bold' } : {}}>Hot Products</span>
          </div> */}
          {/* <Whatshot style={{ fontSize: '3em', color: 'red' }} /> */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  let { categoryList } = state;
  categoryList = _get(categoryList, "lookUpData", []);
  return { categoryList };
};

export default connect(mapStateToProps)(Categories);
