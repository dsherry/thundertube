const MongoClient = require('mongodb').MongoClient;

const DATABASE_NAME = 'thunderbird';
const COLLECTION_NAME = 'allcodes';

/**
 * A wrapper around MongoDB. Exposes methods to save and query saved codes
 * to/from the database at the given path.
 */
class Database {
  constructor() {
    this.database_ = null;
  }

  /**
   * Tries to connect to a database at the given path. If credentials are
   * required, they should be incorporated into the path.
   */
  connect(path) {
    if (this.database_) {
      console.error("Already connected to a database!");
      return;
    }
    console.log('Attempting to connect to database at: ' + path);
    MongoClient.connect(
        path, {useNewUrlParser: true}, this.onConnect_.bind(this));
  }

  /**
   * Saves the given array of stuff to the database. Returns a void promise that
   * fulfills when this work is finished.
   */
  saveAllCodes(allCodes) {
    return this.getCollection_()
        .then(collection => collection.findOneAndReplace(
              {} /* filter */,
              allCodes,
              {upsert: true}));
  }

  /**
   * Queries the database for the saved array of stuff. Returns a promise that
   * fulfills with the saved array of stuff after the query is finished. The
   * promise fulfills with null if there is no saved stuff.
   */
  loadAllCodes() {
    return this.getCollection_()
        .then(collection => collection.findOne());
  }

  /** Callback function after an attempt to connect to the database. */
  onConnect_(err, database) {
    if (err) {
      console.error('Error connecting to database: ' + err);
      console.error('WARNING: Codes will NOT be saved!');
      return;
    }
    console.log('Successfully connected to database.');
    this.database_ = database;
  }

  /**
   * Callback function after an attempt to query a collection in the database.
   */
  getCollection_() {
    const promise = new Promise(function(resolve, reject) {
      if (!this.database_) {
        reject("Tried to operate on repertoire collection without connecting " +
            "to database.");
        return;
      }
      this.database_
          .db(DATABASE_NAME)
          .collection(
              COLLECTION_NAME,
              (err, collection) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(collection);
                }
              });
    }.bind(this));
    return promise;
  }
}

exports.Database = Database;