'use strict';
const request = require ('request');
const baseUrl = require ('./test-main').url;

describe ('search/going', () => {
  let cookie;
  before ((done) => {
    let form = { form: {username:'amy', password:'test'}};
    request.post (`${baseUrl}api/login`, form, (err, res, body) => {
      if (err) { return done (err); }
      if (res.statusCode === 200) {
        cookie = res.headers['set-cookie'][0];
        return done ();
      }
      return done (new Error (`Invalid status code ${res.statusCode}`));
    });
  });

  after ((done) => {
    request.post (`${baseUrl}api/logout`, (err, res, body) => {
      done ();
    });
  });

  describe ('valid search request', () => {
    it ('should return list', (done) => {
      let jar = request.jar ();
      jar.setCookie (cookie, 'http://localhost:3000');
      let url = `${baseUrl}api/bars?loc=waco`;
      request.get ({url: url, jar: jar}, (err, res, body) => {
        if (err) { return done (err); }
        if (res.statusCode === 200) {
          let bars = JSON.parse (body);
          if (bars.length === 20) {
            return done ();
          } else {
            return done (new Error ('wrong number of bars: ', bars.length));
          }
        }
        return done (new Error (`Invalid status code ${res.statusCode}`));
      });
    });
  });

  describe ('add to going list', () => {
    it ('should return 200', (done) => {
      let jar = request.jar ();
      jar.setCookie (cookie, 'http://localhost:3000');
      let url = `${baseUrl}api/bars/the-dancing-bear-pub-waco/going/true`;
      request.post ({url: url, jar: jar}, (err, res, body) => {
        if (err) { return done (err); }
        if (res.statusCode === 200) {
          return done ();
        }
        return done (new Error (`Invalid status code ${res.statusCode}`));
      });
    });
  });

  describe ('remove from going list', () => {
    it ('should return 200', (done) => {
      let jar = request.jar ();
      jar.setCookie (cookie, 'http://localhost:3000');
      let url = `${baseUrl}api/bars/the-dancing-bear-pub-waco/going/false`;
      request.post ({url: url, jar: jar}, (err, res, body) => {
        if (err) { return done (err); }
        if (res.statusCode === 200) {
          return done ();
        }
        return done (new Error (`Invalid status code ${res.statusCode}`));
      });
    });
  });

  describe ('add to going list for invalid bar', () => {
    it ('should return 200', (done) => {
      let jar = request.jar ();
      jar.setCookie (cookie, 'http://localhost:3000');
      let url = `${baseUrl}api/bars/not-a-bar/going/true`;
      request.post ({url: url, jar: jar}, (err, res, body) => {
        if (err) { return done (err); }
        if (res.statusCode === 200) {
          return done ();
        }
        return done (new Error (`Invalid status code ${res.statusCode}`));
      });
    });
  });
});
