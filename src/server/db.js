'use strict';
const mongoClient = require ('mongodb').MongoClient;
const ObjectId = require ('mongodb').ObjectId;
const hash = require ('./hash');

let db = null;
let users = null;
let bars = null;

// connect to database and set up collections
function init (uri) {
  return new Promise ((resolve, reject) => {
    if (db === null) {
      mongoClient.connect (uri, (err, instance) => {
        if (err) {
          return reject (err);
        }
        db = instance;
        users = db.collection ('users');
        users.ensureIndex ({username: 1}, {unique: true})
        .then (() => {
          bars = db.collection ('bars');
          bars.ensureIndex ({id: 1}, {unique: true})
          .then (() => { resolve (); })
          .catch (err => { reject (err); });
        })
        .catch (err => { reject (err); });
      });
    } else {
      resolve ();
    }
  });
}

// Close database and null out references
function close () {
  return new Promise ((resolve, reject) => {
    if (db) {
      users = null;
      bars = null;
      db.close ()
      .then (() => { db = null; resolve (); })
      .catch (() => { db = null; resolve (); });
    } else {
      resolve ();
    }
  });
}

// Find single user by user name
function findUserByUsername (username) {
  return users.findOne ({username: username });
}

// Insert single user with username, password only populated. Suitable for
// register user type functions.
function insertUser (username, password) {
  return new Promise ((resolve, reject) => {
    findUserByUsername (username)
    .then (result => {
      if (result !== null) {
        reject (new Error ('User already exists'));
      } else {
        let userHash = hash.create (password);
        let user = { username: username, hash: userHash.hash, salt: userHash.salt };
        users.insert (user, {w:1})
        .then (result => { resolve (result); })
        .catch (err => { reject (err); });
      }
    })
    .catch (err => {
      reject (err);
    });
  });
}

// remove user by username
function removeUser (username) {
  return users.remove ({ username: username });
}

// get all bars
function getBars () {
  return bars.find ().toArray ();
}

// get a single bar
function getBar (_id) {
  return bars.findOne ({ _id: new ObjectId (_id) });
}

// get single bar, using Yelp id
function getBarByYelpId (id) {
  console.log ('getBarByYelpId', id);
  return bars.findOne ({ id: id });
}

function insertBar (newbar) {
  return new Promise ((resolve, reject) => {
    bars.insert (newbar, {w:1})
    .then (() => { resolve (1); })
    .catch (() => { resolve (0); });
  });
}

// insert bars
// duplicates are ignored, no error is generated if duplicate id tried
function insertBars (newbars) {
  return new Promise ((resolve, reject) => {
    bars.insert (newbars, {w:1, ordered:false})
    .then ( result => { resolve (result.nInserted); })
    .catch (err => { resolve (err.nInserted); });
  });
}

// Add user to list of patrons going to bar
function setGoing (id, username, going) {
  if (going) {
    return bars.update (
      { id: id },
      { $addToSet: { going: username } }
    );
  } else {
    return bars.update (
      { id: id },
      { $pull: { going: username } }
    );
  }
}

function getGoing (id) {
  return new Promise ((resolve, reject) => {
    bars.findOne ({id: id})
    .then (result => {
      resolve ((result) ? result.going : []);
    })
    .catch (err => {
      reject (err);
    });
  });
}

exports.init = init;
exports.close = close;
exports.findUserByUsername = findUserByUsername;
exports.insertUser = insertUser;
exports.removeUser = removeUser;
exports.getBars = getBars;
exports.getBar = getBar;
exports.getBarByYelpId = getBarByYelpId;
exports.insertBar = insertBar;
exports.insertBars = insertBars;
exports.setGoing = setGoing;
exports.getGoing = getGoing;
