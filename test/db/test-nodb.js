'use strict';
const db = require ('../../dist/db');

// mongo URI with port number not an active MongoDB instance
let badMongoUri = 'mongodb://localhost:22222/nightlifeTest';

describe ('init/close', function () {
  describe ('init', function () {
    it ('should generate an error', function (done) {
      Promise.resolve ().then (() => {
        return db.init (badMongoUri);
      }).then (() => {
        done (new Error ('init did not fail with bad URI'));
      }).catch (() => {
        done ();
      });
    });
  });

  describe ('close', function () {
    it ('should fail silently', function (done) {
      Promise.resolve ().then (() => {
        return db.close ();
      }).then (() => {
        done ();
      }).catch (() => {
        done (new Error ('close should fail silently'));
      });
    });
  });
});

describe ('users', function () {
  describe ('findUserByUsername', function () {
    it ('should generate an error', function (done) {
      Promise.resolve ().then (() => {
        return db.findUserByUsername ('amy');
      }).then (() => {
        done (new Error ('did not fail with no database connection'));
      }).catch (() => {
        done ();
      });
    });
  });

  describe ('insertUser', function () {
    it ('should generate an error', function (done) {
      Promise.resolve ().then (() => {
        return db.insertUser ('newuser', 'password');
      }).then (() => {
        done (new Error ('did not fail with no database connection'));
      }).catch (() => {
        done ();
      });
    });
  });

  describe ('removeUser', function () {
    it ('should generate an error', function (done) {
      Promise.resolve ().then (() => {
        return db.removeUser ('amy');
      }).then (() => {
        done (new Error ('did not fail with no database connection'));
      }).catch (() => {
        done ();
      });
    });
  });

  describe ('getBars', function () {
    it ('should generate an error', function (done) {
      Promise.resolve ().then (() => {
        return db.getBars ();
      }).then (() => {
        done (new Error ('did not fail with no database connection'));
      }).catch (() => {
        done ();
      });
    });
  });

  describe ('getBarByYelpId', function () {
    it ('should generate an error', function (done) {
      Promise.resolve ().then (() => {
        return db.getBarByYelpId ('test');
      }).then (() => {
        done (new Error ('did not fail with no database connection'));
      }).catch (() => {
        done ();
      });
    });
  });

  describe ('getBar', function () {
    it ('should generate an error', function (done) {
      Promise.resolve ().then (() => {
        return db.getBar ('000000000000000000000000');
      }).then (() => {
        done (new Error ('did not fail with no database connection'));
      }).catch (() => {
        done ();
      });
    });
  });

  describe ('insertBar', function () {
    it ('should generate an error', function (done) {
      Promise.resolve ().then (() => {
        return db.insertBar ({});
      }).then (() => {
        done (new Error ('did not fail with no database connection'));
      }).catch (() => {
        done ();
      });
    });
  });

  describe ('insertBars', function () {
    it ('should generate an error', function (done) {
      Promise.resolve ().then (() => {
        return db.insertBars ([{}, {}]);
      }).then (() => {
        done (new Error ('did not fail with no database connection'));
      }).catch (() => {
        done ();
      });
    });
  });

  describe ('setGoing', function () {
    it ('should generate an error', function (done) {
      Promise.resolve ().then (() => {
        return db.setGoing ('test', 'amy', true);
      }).then (() => {
        done (new Error ('did not fail with no database connection'));
      }).catch (() => {
        done ();
      });
    });
  });

  describe ('getGoing', function () {
    it ('should generate an error', function (done) {
      Promise.resolve ().then (() => {
        return db.getGoing ('test');
      }).then (() => {
        done (new Error ('did not fail with no database connection'));
      }).catch (() => {
        done ();
      });
    });
  });
});
