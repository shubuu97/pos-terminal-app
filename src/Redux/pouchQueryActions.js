import PouchDb from 'pouchdb';

const pouchQueryAction = ({skip,limit,db,dispatch,constants})=>{
    db.allDocs({
        include_docs: true,
        attachments: true,
        skip,
        limit
      }).then(function (result) {
        dispatch(constants.success)
      }).catch(function (err) {
        console.log(err);
      });

}