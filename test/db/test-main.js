'use strict';
const mongoClient = require ('mongodb').MongoClient;
const db = require ('../../dist/db');
const promiseTry = require ('../promiseTry');

const uri = 'mongodb://localhost:27017/nightlifeTest';
let testdb = {
  db: null,
  users: null,
  bars: null
};
exports.testdb = testdb;

before ((done) => {
  promiseTry (() => {
    return mongoClient.connect (uri);
  }).then (db => {
    testdb.db = db;
    testdb.users = testdb.db.collection ('users');
    return testdb.users.ensureIndex ({username: 1}, {unique: true});
  }).then (() => {
    return testdb.users.remove ({});
  }).then (() => {
    testdb.bars = testdb.db.collection ('bars');
    return testdb.bars.ensureIndex ({id: 1}, {unique: true});
  }).then (() => {
    return testdb.bars.remove ({});
  }).then (() => {
    let data = [
      { id: 'the-dancing-bear-pub-waco', going: [] },
      { id: 'dichotomy-coffee-and-spirits-waco-2', going: [] },
      { id: 'brazos-bar-and-bistro-waco', going: [] },
      { id: 'trojan-cork-and-keg-waco', going: [] }
    ];
    return testdb.bars.insert (data, {w:1});
  }).then (() => {
    return db.close ();
  }).then (() => {
    return db.init (uri);
  }).then (() => {
    done ();
  }).catch (err => {
    done (err);
  });
});

after ((done) => {
  promiseTry (() => {
    testdb.db.close ();
  }).then (() => {
    done ();
  }).catch (err => {
    done (err);
  });
});

describe ('test-main', () => {
  describe ('test-user', () => {
    require ('./test-user');
  });
  describe ('test-app', () => {
    require ('./test-app');
  });
});
