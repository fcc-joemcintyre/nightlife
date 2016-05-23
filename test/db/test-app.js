'use strict';
const testdb = require ('./test-main').testdb;
const db = require ('../../dist/db');
const promiseTry = require ('../promiseTry');

describe ('bars', () => {
  describe ('query existing bar', () => {
    it ('should be found', (done) => {
      promiseTry (() => {
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

  describe ('query non-existing bar', () => {
    it ('should not be found', (done) => {
      promiseTry (() => {
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

  describe ('add new bar', () => {
    it ('should have inserted count 1', (done) => {
      promiseTry (() => {
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

  describe ('add duplicate bar', () => {
    it ('should have inserted count 0', (done) => {
      promiseTry (() => {
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

describe ('patrons', () => {
  beforeEach ((done) => {
    promiseTry (() => {
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

  describe ('add patron to bar', () => {
    it ('should show username added to going list', (done) => {
      promiseTry (() => {
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

  describe ('add 2 patrons to bar', () => {
    it ('should show 2 on going list', (done) => {
      promiseTry (() => {
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

  describe ('add duplicate patron to bar', () => {
    it ('should show 1 on going list', (done) => {
      promiseTry (() => {
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

  describe ('add and remove patron', () => {
    it ('should show 0 on going list', (done) => {
      promiseTry (() => {
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
