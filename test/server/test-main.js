'use strict';
const mongoClient = require ('mongodb').MongoClient;
const server = require ('../../dist/server');
const db = require ('../../dist/db');
const promiseTry = require ('../promiseTry');

const port = 3999;
const url = `http://localhost:${port}/`;
exports.url = url;

const dbURI = 'mongodb://localhost:27017/nightlifeTest';

class Yelp {
  search (criteria) {
    return new Promise ((resolve, reject) => {
      if (criteria.location === 'waco') {
        resolve (require ('../data/dataWaco'));
      } else {
        resolve (require ('../data/dataBelton'));
      }
    });
  }
}

before ((done) => {
  promiseTry (() => {
    return resetDatabase ();
  }).then (() => {
    return db.init (dbURI);
  }).then (() => {
    return db.insertUser ('amy', 'test');
  }).then (() => {
    return db.insertBar ({ id: 'the-dancing-bear-pub-waco', going: [] });
  }).then (() => {
    return db.close ();
  }).then (() => {
    let yelp = new Yelp ();
    return server.start (port, dbURI, yelp);
  }).then (() => { done (); })
  .catch (err => { done (err); });
});

function resetDatabase () {
  return new Promise ((resolve, reject) => {
    promiseTry (() => {
      return mongoClient.connect (dbURI);
    }).then (instance => {
      let db = instance;
      let users = db.collection ('users');
      users.ensureIndex ({username: 1}, {unique: true})
      .then (() => {
        return users.remove ({});
      }).then (() => {
        let bars = db.collection ('bars');
        bars.ensureIndex ({id: 1}, {unique: true})
        .then (() => {
          return bars.remove ({});
        }).then (() => {
          resolve ();
        });
      });
    }).catch (err => {
      reject (err);
    });
  });
}

describe ('test-main', () => {
  describe ('test-cmd', () => {
    require ('./test-cmd');
  });
  describe ('test-page', () => {
    require ('./test-page');
  });
  describe ('test-user', () => {
    require ('./test-user');
  });
  describe ('test-app', () => {
    require ('./test-app');
  });
});
