import { commonActionCreater } from '../../Redux/commonAction';
import  PouchDb  from 'pouchdb';
import Find from "pouchdb-find";
import _get from 'lodash/get'
import PAM from 'pouchdb-adapter-memory'
PouchDb.plugin(PAM);
PouchDb.plugin(Find);

const addGuestToCart = async(dispatch) => {
    let customersdb = new PouchDb(`customersdb${localStorage.getItem('storeId')}`);
    customersdb.find({selector:{guest:true}}).then((data)=>{
        dispatch(commonActionCreater(_get(data,'docs[0]',[]), 'ADD_CUSTOMER_TO_CART'));
    })

}

export default addGuestToCart;