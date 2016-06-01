'use strict';
const db = require ('../../dist/db');

// mongo URI with port number not an active MongoDB instance
let mongoUri = 'mongodb://localhost:27017/nightlifeTest';

describe ('init/close', function () {
  describe ('call init twice', function () {
    it ('should succeed both times', function (done) {
      Promise.resolve ().then (() => {
        return db.init (mongoUri);
      }).catch (err => {
        done (new Error (`init failed on first call ${err}`));
      }).then (() => {
        return db.init (mongoUri);
      }).then (() => {
        done ();
      }).catch (err => {
        done (new Error (`init failed on second call ${err}`));
      });
    });
  });

  describe ('call close twice', function () {
    it ('should succeed both times', function (done) {
      Promise.resolve ().then (() => {
        return db.close ();
      }).catch (err => {
        done (new Error (`close failed on first call ${err}`));
      }).then (() => {
        return db.close ();
      }).then (() => {
        done ();
      }).catch (err => {
        done (new Error (`close failed on second call ${err}`));
      });
    });
  });
});
