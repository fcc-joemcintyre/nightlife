'use strict';
const mongoClient = require ('mongodb').MongoClient;
const ObjectId = require ('mongodb').ObjectId;
const hash = require ('./hash');

let db = null;
let users = null;
let bars = null;

// connect to database and set up collections
function init (uri) {
  console.log ('db.init');
  return new Promise ((resolve, reject) => {
    if (db === null) {
      mongoClient.connect (uri, (err, instance) => {
        if (err) {
          console.log ('init err:', err);
          return reject (err);
        }
        db = instance;
        Promise.resolve ().then (() => {
          users = db.collection ('users');
          return users.ensureIndex ({username: 1}, {unique: true});
        }).then (() => {
          bars = db.collection ('bars');
          return bars.ensureIndex ({id: 1}, {unique: true});
        }).then (() => {
          resolve ();
        }).catch (err => {
          reject (err);
        });
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
      Promise.resolve ().then (() => {
        return db.close ();
      }).then (() => {
        db = null;
        resolve ();
      }).catch (() => {
        db = null;
        resolve ();
      });
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
    Promise.resolve ().then (() => {
      return findUserByUsername (username);
    }).then (result => {
      if (result !== null) {
        return reject (new Error ('User already exists'));
      }
      let userHash = hash.create (password);
      let user = { username: username, hash: userHash.hash, salt: userHash.salt };
      return users.insert (user, {w:1});
    }).then (result => {
      resolve (result);
    }).catch (err => {
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
  return bars.findOne ({ id: id });
}

// insert bar
// duplicates are ignored, no error is generated if duplicate id tried
function insertBar (newBar) {
  return new Promise ((resolve, reject) => {
    Promise.resolve ().then (() => {
      return bars.insert (newBar, {w:1});
    }).then (() => {
      resolve (1);
    }).catch (err => {
      if (err.code === 11000) {
        resolve (0);
      } else {
        reject (err);
      }
    });
  });
}

// insert bars
// duplicates are ignored, no error is generated if duplicate id tried
function insertBars (newBars) {
  return new Promise ((resolve, reject) => {
    Promise.resolve ().then (() => {
      return bars.insert (newBars, {w:1, ordered:false});
    }).then ( result => {
      resolve (result.insertedCount);
    }).catch (err => {
      // if multiple errors, reduce insert count by number of dups/errors
      if (err.writeErrors) {
        resolve (newBars.length - err.writeErrors.length);
      } else if (err.code === 11000) {  // single duplicate
        resolve (newBars.length - 1);
      } else {
        reject (err);
      }
    });
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
    Promise.resolve ().then (() => {
      return bars.findOne ({id: id});
    }).then (result => {
      resolve ((result) ? result.going : []);
    }).catch (err => {
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
