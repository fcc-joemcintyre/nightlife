'use strict';
const db = require ('../../dist/db');
const promiseTry = require ('../promiseTry');

describe ('users', () => {
  beforeEach ((done) => {
    promiseTry (() => {
      return db.insertUser ('amy', 'test');
    }).then (() => { done ();
    }).catch (err => { done (err); });
  });

  afterEach ((done) => {
    promiseTry (() => {
      return db.removeUser ('amy');
    }).then (() => { done ();
    }).catch (err => { done (err); });
  });

  describe ('find amy', () => {
    it ('should be found', (done) => {
      promiseTry (() => {
        return db.findUserByUsername ('amy');
      }).then (result => {
        if (result) {
          done ();
        } else {
          done (new Error ('not found'));
        }
      }).catch (err => { done (err); });
    });
  });

  describe ('find amyy', () => {
    it ('should not be found', (done) => {
      promiseTry (() => {
        return db.findUserByUsername ('amyy');
      }).then (result => {
        if (result) {
          done (new Error ('should not be found'));
        } else {
          done ();
        }
      }).catch (err => { done (err); });
    });
  });
});
