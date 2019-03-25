import React, { Component } from "react";
import Category from "./Category";
import BreadCrumb from "./BreadCrumb";
// Lodash Import
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
//Redux Import
import { commonActionCreater } from "../../../Redux/commonAction";
import { connect } from "react-redux";
//Pouch Import
import PouchDb from "pouchdb";
import Find from "pouchdb-find";
import PAM from "pouchdb-adapter-memory"
PouchDb.plugin(Find);
PouchDb.plugin(PAM);

let categoryDb = new PouchDb("categoryDb");

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
      this.setState({ selectedCategory: {categoryType: -1} });
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

    let productsdb = new PouchDb("productsdb");
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
        if(result.total_rows == 0) {
          emptyResult = {}
          this.props.dispatch(commonActionCreater(emptyResult, 'GET_PRODUCT_DATA_SUCCESS'))
        }
        result.pagination = {}
        result.pagination.method="categories"
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
    let productsdb = new PouchDb("productsdb");
    productsdb
      .allDocs({
        include_docs: true,
        attachments: true,
        limit: 39,
        skip: 0
      })
      .then(result => {
        result.pagination = {}
        result.pagination.method="allDocs"
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
        <div
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
