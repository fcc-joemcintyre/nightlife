'use strict';
const mongoClient = require ('mongodb').MongoClient;
const server = require ('../../dist/server');
const db = require ('../../dist/db');
const mockdb = require ('./mockdb');

const port = 3999;
const mockPort = 3998;
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

describe ('test-main (real database)', function () {
  before (function (done) {
    Promise.resolve ().then (() => {
      return resetDatabase ();
    }).then (() => {
      return db.init (dbURI);
    }).then (() => {
      return db.insertUser ('amy', 'test');
    }).then (() => {
      let data = [
        { id: 'the-dancing-bear-pub-waco', going: [] },
        { id: 'brazos-bar-and-bistro-waco', going: [] },
        { id: 'muddle-waco', going: ['amy'] },
        { id: 'nolan-creek-winery-and-wine-bar-belton', going: [] },
        { id: 'chupacabra-craft-beer-salado', going: ['amy'] }
      ];
      return db.insertBars (data);
    }).then (() => {
      let yelp = new Yelp ();
      return server.start (port, db, yelp);
    }).then (() => {
      done ();
    }).catch (err => {
      done (err);
    });
  });

  after (function (done) {
    Promise.resolve ().then (() => {
      return db.close ();
    }).then (() => {
      done ();
    }).catch (() => {
      done ();
    });
  });

  describe ('test-cmd', function () {
    require ('./test-cmd');
  });
  describe ('test-page', function () {
    require ('./test-page');
  });
  describe ('test-user', function () {
    require ('./test-user');
  });
  describe ('test-app', function () {
    require ('./test-app');
  });
});

describe ('test-main (mock database)', function () {
  before (function (done) {
    Promise.resolve ().then (() => {
      return mockdb.init ();
    }).then (() => {
      let yelp = new Yelp ();
      return server.start (mockPort, mockdb, yelp);
    }).then (() => {
      done ();
    }).catch (err => {
      done (err);
    });
  });

  describe ('test-user (mock db)', function () {
    require ('./test-user-mockdb');
  });
  //describe ('test-app (mock db)', function () {
  //  require ('./test-app-mockdb');
  //});
});

function resetDatabase () {
  return new Promise ((resolve, reject) => {
    Promise.resolve ().then (() => {
      return mongoClient.connect (dbURI);
    }).then (instance => {
      let db = instance;
      let users = db.collection ('users');
      let bars = db.collection ('bars');
      Promise.resolve ().then (() => {
        return users.ensureIndex ({username: 1}, {unique: true});
      }).then (() => {
        return users.remove ({});
      }).then (() => {
        return bars.ensureIndex ({id: 1}, {unique: true});
      }).then (() => {
        return bars.remove ({});
      }).then (() => {
        resolve ();
      });
    }).catch (err => {
      reject (err);
    });
  });
}
