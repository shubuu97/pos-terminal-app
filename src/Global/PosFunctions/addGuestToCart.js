import { commonActionCreater } from '../../Redux/commonAction';
import  PouchDb  from 'pouchdb';
import Find from "pouchdb-find";
import _get from 'lodash/get'

PouchDb.plugin(Find);
let customersdb = new PouchDb('customersdb');

const addGuestToCart = (dispatch) => {
    customersdb.find({selector:{guest:true}}).then((data)=>{
        dispatch(commonActionCreater(_get(data,'docs[0]',[]), 'ADD_CUSTOMER_TO_CART'));
    })

}

export default addGuestToCart;