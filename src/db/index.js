import PouchDb from 'pouchdb';
import generateV1uuid from './uuid';
import pouchdbfind from 'pouchdb-find'
PouchDb.plugin(pouchdbfind);

export default class Db {
  constructor(name) {
    this.db = new PouchDb(name);
    PouchDb.sync(name, `http://localhost:5984/${name}`, {
      live: true,
      retry: true
    }).on('change', function (info) {
      console.log("change event here", info);
    }).on('paused', function (err) {
      // replication paused (e.g. replication up to date, user went offline)
    }).on('active', function () {
      // replicate resumed (e.g. new changes replicating, user went back online)
    }).on('denied', function (err) {
      // a document failed to replicate (e.g. due to permissions)
    }).on('complete', function (info) {
      // handle complete
    }).on('error', function (err) {
      console.log(err, "1234")
      // handle error
    });
  }
  async getAllDocs() {
    let allNotes = await this.db.allDocs({ include_docs: true });
    let notes = {};

    //converting data from dbrows to javascript object
    allNotes.rows.forEach(n => notes[n.id] = n.doc);

    //returning object
    return notes
  }
  async createDoc(Note) {
    debugger;
    let resp = await this.db.put({
      _id: generateV1uuid(),
      ...Note
    });
    return resp;

  }
  async deleteDoc(doc) {
    let resp = await this.db.remove(doc);
    return resp;

  }
  async updateDoc(doc) {
    debugger;
    let resp = await this.db.put(doc);
    return resp;

  }
  async createIndex(fields) {
    console.log(fields,"create index result");
    try {
      var result = await this.db.createIndex({
        index: {
          fields: ['customerName']
        }
      });
      console.log(result,"create index result")
      return result
    } catch (err) {
      console.log(err, "err is here");
      return err;
    }
  }
  async findIndex(queryObj) {
    var result = await this.db.find(queryObj);
    return result;
  }
  async createView(ddoc)
  {
    
    
     let resp =  await this.db.put(ddoc);
     debugger;
     console.log(resp,"resp is here");
     return resp;
    
    // } catch (err) {
    //   debugger;
    //   if (err.name !== 'conflict') {
    //     return err;
    //     throw err;
    //   }
      // ignore if doc already exists
    
  }
  async queryToView(view,queryObj)
  {
    debugger;
    try {
    let result = await this.db.query(view,queryObj);
    console.log("result",result)
    debugger;
    return result;
  } catch (err) {
    return err
  }
  }

}