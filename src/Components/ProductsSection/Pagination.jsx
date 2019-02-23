import React from "react";
import _get from 'lodash/get';
import {connect} from 'react-redux'; 
import Button from '@material-ui/core/Button';
import PouchDb from 'pouchdb';
import {commonActionCreater} from '../../Redux/commonAction';
import _isEmpty from 'lodash/isEmpty';
import _sortBy from 'lodash/sortBy';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

class PaginationComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      productList: [],
      pageNo: 1,
      startKey: '' ,
      itemCount: 9
    };
  }
 
  getPrevProducts = () => {
    let startkey = this.props.firstItemId 
    let productsdb = new PouchDb('productsdb');
      productsdb.allDocs({
          include_docs: true,
          descending: true,
          startkey,
          limit: this.state.itemCount,
          skip: 1
      }).then((result) => {
          let sortedResult = _sortBy(result.rows, 'id')
          result.rows = sortedResult
          result.pagination = {}
          result.pagination.firstItemId = result.rows[0].id
          result.pagination.lastItemId = result.rows[result.rows.length - 1].id
          result.pagination.pageNo = this.props.pageNo - 1
          result.pagination.startVal = this.props.startVal - this.state.itemCount
          result.pagination.endVal = result.pagination.pageNo * this.state.itemCount
          this.props.dispatch(commonActionCreater(result, 'GET_PRODUCT_DATA_SUCCESS'));
      }).catch((err) => {
          console.log(err)
    });
  }

  getNextProducts = () => {
      let startkey = this.props.lastItemId  
      let productsdb = new PouchDb('productsdb');
        productsdb.allDocs({
            include_docs: true,
            startkey,
            limit: this.state.itemCount,
            skip: 1
        }).then((result) => {
            result.pagination = {}
            result.pagination.firstItemId = result.rows[0].id
            result.pagination.lastItemId = result.rows[result.rows.length - 1].id
            result.pagination.pageNo = this.props.pageNo + 1
            result.pagination.startVal = this.props.endVal + 1
            result.pagination.endVal = result.pagination.pageNo * this.state.itemCount
            if(result.pagination.endVal > this.props.productCount) {
              result.pagination.endVal = this.props.productCount
            }
            this.props.dispatch(commonActionCreater(result, 'GET_PRODUCT_DATA_SUCCESS'));
        }).catch((err) => {
            console.log(err)
      });
  }
 
  render() {
    let {productCount, pageNo} = this.props
    let {itemCount} = this.state
    let isLastPage = false
    if(productCount <  pageNo * itemCount) {
      isLastPage = true
    }

    return (
      <div>
          <div>
            <div>Page No: <span>{this.props.pageNo}</span></div>
            <label>Showing {this.props.startVal} - {this.props.endVal} products of {productCount} products.</label>
          </div>
          <div>
          {this.props.pageNo == 1 ? '' : 
            <IconButton
              color="inherit"
              onClick={this.getPrevProducts}
              aria-label="Previous Page"
            >
              <KeyboardArrowLeft />
            </IconButton>
          }
          {isLastPage ? '' : 
            <IconButton
              color="inherit"
              onClick={this.getNextProducts}
              aria-label="Next Page"
            >
              <KeyboardArrowRight />
            </IconButton>
          }
          </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  let { productList } = state
  let productCount = _get(productList, 'lookUpData.total_rows', '')
  let lastItemId = _get(productList, 'lookUpData.pagination.lastItemId', '')
  let firstItemId = _get(productList, 'lookUpData.pagination.firstItemId', '')
  let pageNo =  _get(productList, 'lookUpData.pagination.pageNo', '')
  let startVal =  _get(productList, 'lookUpData.pagination.startVal', '')
  let endVal =  _get(productList, 'lookUpData.pagination.endVal', '')
  return {
    productCount,
    lastItemId,
    firstItemId,
    pageNo,
    startVal,
    endVal
  }
}
  
export default connect(mapStateToProps)(PaginationComponent);