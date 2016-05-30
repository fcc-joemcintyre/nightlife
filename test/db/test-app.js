'use strict';
const testdb = require ('./test-main').testdb;
const db = require ('../../dist/db');

describe ('bars', function () {
  describe ('query existing bar', function () {
    it ('should be found', function (done) {
      Promise.resolve ().then (() => {
        return db.getBarByYelpId ('the-dancing-bear-pub-waco');
      }).then (result => {
        if (result) {
          done ();
        } else {
          done (new Error ('id not found'));
        }
      }).catch (err => {
        done (err);
      });
    });
  });

  describe ('query non-existing bar', function () {
    it ('should not be found', function (done) {
      Promise.resolve ().then (() => {
        return db.getBarByYelpId ('not-a-valid-id');
      }).then (result => {
        if (result) {
          done (new Error ('id found'));
        } else {
          done ();
        }
      }).catch (err => {
        done (err);
      });
    });
  });

  describe ('add new bar', function () {
    it ('should have inserted count 1', function (done) {
      Promise.resolve ().then (() => {
        return db.insertBar ({ id:'new-bar', groups: [] });
      }).then (count => {
        if (count === 1) {
          done ();
        } else {
          done (new Error ('insert failed:', count));
        }
      }).catch (err => {
        done (err);
      });
    });
  });

  describe ('add duplicate bar', function () {
    it ('should have inserted count 0', function (done) {
      Promise.resolve ().then (() => {
        return db.insertBar ({ id:'the-dancing-bear-pub-waco', groups: [] });
      }).then (count => {
        if (count === 0) {
          done ();
        } else {
          done (new Error ('insert failed:', count));
        }
      }).catch (err => {
        done (err);
      });
    });
  });
});

describe ('patrons', function () {
  beforeEach (function (done) {
    Promise.resolve ().then (() => {
      return testdb.bars.update (
        { id: 'the-dancing-bear-pub-waco' },
        { $set: { going: [] } }
      );
    }).then (() => {
      done ();
    }).catch (err => {
      done (err);
    });
  });

  describe ('add patron to bar', function () {
    it ('should show username added to going list', function (done) {
      Promise.resolve ().then (() => {
        return db.setGoing ('the-dancing-bear-pub-waco', 'amy', true);
      }).then (() => {
        return db.getGoing ('the-dancing-bear-pub-waco');
      }).then (going => {
        if (going.length !== 1) {
          return done (new Error ('Wrong number of people going:', going.length));
        }
        done ();
      }).catch (err => {
        done (err);
      });
    });
  });

  describe ('add 2 patrons to bar', function () {
    it ('should show 2 on going list', function (done) {
      Promise.resolve ().then (() => {
        return db.setGoing ('the-dancing-bear-pub-waco', 'amy', true);
      }).then (() => {
        return db.setGoing ('the-dancing-bear-pub-waco', 'bob', true);
      }).then (() => {
        return db.getGoing ('the-dancing-bear-pub-waco');
      }).then (going => {
        if (going.length !== 2) {
          return done (new Error ('Wrong number of people going:', going.length));
        }
        done ();
      }).catch (err => {
        done (err);
      });
    });
  });

  describe ('add duplicate patron to bar', function () {
    it ('should show 1 on going list', function (done) {
      Promise.resolve ().then (() => {
        return db.setGoing ('the-dancing-bear-pub-waco', 'amy', true);
      }).then (() => {
        return db.setGoing ('the-dancing-bear-pub-waco', 'amy', true);
      }).then (() => {
        return db.getGoing ('the-dancing-bear-pub-waco');
      }).then (going => {
        if (going.length !== 1) {
          return done (new Error ('Wrong number of people going:', going.length));
        }
        done ();
      }).catch (err => {
        done (err);
      });
    });
  });

  describe ('add and remove patron', function () {
    it ('should show 0 on going list', function (done) {
      Promise.resolve ().then (() => {
        return db.setGoing ('the-dancing-bear-pub-waco', 'amy', true);
      }).then (() => {
        return db.setGoing ('the-dancing-bear-pub-waco', 'amy', false);
      }).then (() => {
        return db.getGoing ('the-dancing-bear-pub-waco');
      }).then (going => {
        if (going.length !== 0) {
          return done (new Error ('Wrong number of people going:', going.length));
        }
        done ();
      }).catch (err => {
        done (err);
      });
    });
  });
});
