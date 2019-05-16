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
    this.props.getHomeClicked()
    this.setState({ selectedCategory: { categoryType: -1 } });
    this.getProductData();
    this.getCategory(0);
  };

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
  };

  getProductData = () => {
    let productsdb = new PouchDb(`productsdb${localStorage.getItem("storeId")}`);
    productsdb
      .allDocs({
        include_docs: true,
        attachments: true,
        limit: 39,
        skip: 0
      })
      .then(result => {
        result.pagination = {}
        result.pagination.method = "allDocs"
        result.pagination.firstItemId = result.rows[0].id
        result.pagination.lastItemId = result.rows[result.rows.length - 1].id
        result.pagination.pageNo = 1
        result.pagination.startVal = 1
        result.pagination.endVal = result.rows.length
        this.props.dispatch(
          commonActionCreater(result, "GET_PRODUCT_DATA_SUCCESS")
        );
      })
      .catch(err => { });
  };
  getHotProduct = () => {
    genericPostData({
      url: 'HotProducts/ByStore/Get',
      dispatch: this.props.dispatch,
      reqObj: { id: localStorage.getItem('storeId') },
      identifier: 'HOT_PRODUCT_GET',
      constants: {
        init: 'HOT_PRODUCT_GET_LOGIN_INIT',
        success: 'HOT_PRODUCT_GET_LOGIN_SUCCESS',
        error: 'HOT_PRODUCT_GET_LOGIN_ERROR'
      },
      dontShowMessage: true,
      successCb: this.hotProductGetResult
    });
  }
  hotProductGetResult = (result) => {
    debugger;
    let products = _get(result, 'products', []).map((product) => {
      let productt = { ...product }
      _set(productt, 'id', productt.id);
      _set(productt, 'doc', { product });
      return productt;

    })
    this.setState({ hotProducts: products });
    result.pagination = {}
    result.pagination.method = "allDocs"
    result.pagination.firstItemId = _get(result, 'products', [])[0].id
    let length = _get(result, 'products', []).length
    result.pagination.lastItemId = _get(result, `products$[${length - 1}].id`)
    _set(result, 'rows', products);
    result.pagination.pageNo = 1
    result.pagination.startVal = 1
    result.pagination.endVal = _get(result, 'products', []).length
    this.props.dispatch(
      commonActionCreater(result, "GET_PRODUCT_DATA_SUCCESS")
    );
  }
  render() {
    return (
      <div>
        <div className="breadcrumbs">
          <BreadCrumb
            homeClickHandler={this.handleHomeClick}
            categoryClickHandler={this.handleCategoryClick}
            selectedRootCategory={this.state.rootCategory}
            selectedSubCategory={this.state.subCategory}
            selectedLeafCategory={this.state.leafCategory}
            selectedCurrentCategory={this.state.selectedCategory}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{ width: '90%' }}
            className="product-catogories"
          // style={{ height: this.props.categoriesHeight }}
          >
            {_get(this.state, "categoryToDisplay", []).map(category => {
              return (
                <Category
                  category={category}
                  clickHandler={this.handleCategoryClick}
                />
              );
            })}
          </div>
          <div style={{ width: '10%' }} className="hotIcon" onClick={this.getHotProduct} style={{ width: '10%' }}>
            <label class="checker">
              <input class="checkbox" type="checkbox" />
              <div class="check-bg"></div>
              <div class="checkmark">
                <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" /><path d="M0 0h24v24H0z" fill="none" /></svg>
              </div>
            </label>
          </div>
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
