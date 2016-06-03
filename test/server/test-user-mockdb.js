'use strict';
const request = require ('request');
const mockdb = require ('./mockdb');
const url = require ('./test-main').url;
const hash = require ('../../dist/hash');

describe ('user module, error path tests', function () {
  describe ('db error in passport strategy', function () {
    it ('should generate error 500', function (done) {
      mockdb.init ();
      mockdb.setMock ('findUserByUsername', 'amy', undefined);
      let form = { form: {username:'amy', password:'test'}};
      request.post (`${url}api/login`, form, (err, res, body) => {
        if (err) { return done (err); }
        if (res.statusCode === 500) {
          return done ();
        }
        return done (new Error (`Invalid status code ${res.statusCode}`));
      });
    });
  });

  describe ('db error in passport deserializeUser', function () {
    let cookie;
    before (function (done) {
      mockdb.init ();
      let userHash = hash.create ('test')
      let user = {
        username: 'amy',
        hash: userHash.hash,
        salt: userHash.salt
      };
      mockdb.setMock ('findUserByUsername', 'amy', user);

      let form = { form: {username:'amy', password:'test'}};
      request.post (`${url}api/login`, form, (err, res, body) => {
        if (err) { return done (err); }
        if (res.statusCode === 200) {
          cookie = res.headers['set-cookie'][0];
          done ();
        }
      });
    });

    after (function (done) {
      request.post (`${url}api/logout`, (err, res, body) => {
        done ();
      });
    });

    it ('should generate error 500', function (done) {
      mockdb.init ();
      mockdb.setMock ('findUserByUsername', 'amy', undefined);
      let jar = request.jar ();
      jar.setCookie (cookie, 'http://localhost:3000');
      request.get ({url: `${url}api/verifylogin`, jar: jar}, (err, res, body) => {
        if (err) { return done (err); }
        if (res.statusCode === 500) {
          return done ();
        } else {
          return done (new Error (`Invalid status code ${res.statusCode}`));
        }
      });
    });
  });
});
