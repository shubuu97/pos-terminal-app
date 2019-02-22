import React from "react";
import _get from 'lodash/get';
import {connect} from 'react-redux'; 
import Button from '@material-ui/core/Button';
import PouchDb from 'pouchdb';
import {commonActionCreater} from '../../Redux/commonAction';
import _isEmpty from 'lodash/isEmpty';
import setProduct from '../../Redux/setProduct';
class PaginationComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      productList: [],
      offset: 0,
      startVal: 1,
      endVal: 10,
      pageNo: 1,
      startKey: '' ,
      itemCount: 10
    };
  }

//   static getDerivedStateFromProps(nextProps, prevState){
//    let startKey
//     if(nextProps.productList !== prevState.productList){
//       return { productList: nextProps.productList};
//    }
//     if(!_isEmpty(nextProps.productList)) {
//       startKey = productList[productList.length - 1].id
//     }
//    else return null;
//  }
 
  getPrevProducts = () => {
  }

  getNextProducts = () => {
      let startKey = this.props.lastItemId  
      let productsdb = new PouchDb('productsdb');
      debugger;
        productsdb.allDocs({
            include_docs: true,
            startKey,
            limit: this.state.itemCount,
            skip: 1
        }).then((result) => {
          debugger
            let lastItemId = result.rows[result.rows.length - 1].id
            this.props.dispatch(setProduct(result, lastItemId, 'GET_PRODUCT_DATA_SUCCESS'));
            lastItemId = ''
        }).catch((err) => {
            console.log(err)
      });
  }
 
  render() {
    let {productCount, lastItemId} = this.props
    return (
      <div>
          <div>
            <label>Showing {this.state.startVal} - {this.state.endVal} products of {productCount} products.</label>
          </div>
          <div>
          <Button onClick={this.getPrevProducts} variant='contained' color='primary'>Prev
          </Button>
          <Button onClick={this.getNextProducts} 
                  variant='contained' color='primary'>Next
          </Button>
          </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  let { productList } = state
  let productCount = _get(productList, 'lookUpData.total_rows', '')
  let lastItemId = _get(productList, 'lastItemId', '')
  return {
    productCount,
    lastItemId
  }
}
  
export default connect(mapStateToProps)(PaginationComponent);