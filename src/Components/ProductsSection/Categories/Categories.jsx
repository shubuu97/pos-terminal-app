import React, { Component } from "react";
import Category from "./Category";
import BreadCrumb from "./BreadCrumb";
// Lodash Import
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import { connect } from "react-redux";
//Redux Import
import { commonActionCreater } from "../../../Redux/commonAction";
//Pouch Import
import PouchDb from "pouchdb";
import Find from "pouchdb-find";

PouchDb.plugin(Find);

let categoryDb = new PouchDb("categoryDb");
categoryDb
  .createIndex({
    index: {
      fields: ["categoryType"]
    }
  })
  .then(function(result) {
    console.log(result);
  })
  .catch(function(err) {
    console.log(err);
  });

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
      console.log('category', category)
    debugger;
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
        limit: 20,
        skip: 0
      })
      .then(res => {
        this.props.dispatch(
          commonActionCreater(res, "GET_PRODUCT_DATA_SUCCESS")
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  getCategory = level => {
      debugger;
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
        limit: 20,
        skip: 0
      })
      .then(result => {
        this.props.dispatch(
          commonActionCreater(result, "GET_PRODUCT_DATA_SUCCESS")
        );
      })
      .catch(err => {});
  };

  render() {
    return (
      <div>
        <BreadCrumb
          homeClickHandler={this.handleHomeClick}
          categoryClickHandler={this.handleCategoryClick}
          selectedRootCategory={this.state.rootCategory}
          selectedSubCategory={this.state.subCategory}
          selectedLeafCategory={this.state.leafCategory}
          selectedCurrentCategory={this.state.selectedCategory}
        />
        <div
          className="product-catogories"
          style={{ height: this.props.categoriesHeight }}
        >
          {/* <span onClick={this.getProductData}>All</span>
            <span onClick={() => this.getCategory(0)}>Root Category</span>
            <span onClick={() => this.getCategory(1)}>Sub category</span> */}
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
