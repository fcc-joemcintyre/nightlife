'use strict';
const mongoClient = require ('mongodb').MongoClient;
const db = require ('./db');
const server = require ('./server');
const promiseTry = require ('./promiseTry');

const port = 3000;
const dbURI = 'mongodb://localhost:27017/nightlifeTest';

class Yelp {
  search (criteria) {
    return new Promise ((resolve, reject) => {
      if (criteria.location === 'waco') {
        resolve (require ('./dataWaco'));
      } else {
        resolve (require ('./dataBelton'));
      }
    });
  }
}

function resetDatabase () {
  return new Promise ((resolve, reject) => {
    mongoClient.connect (dbURI)
    .then (instance => {
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
    })
    .catch (err => { reject (err); });
  });
}

function main () {
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
  })
  .catch (err => {
    console.log ('Error starting server:', err);
  });
}

main ();
