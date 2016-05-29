'use strict';
const request = require ('request');
const url = require ('./test-main').url;

describe ('login/logout/register', () => {
  describe ('valid login request', () => {
    it ('should return valid login', (done) => {
      let form = { form: {username:'amy', password:'test'}};
      request.post (`${url}api/login`, form, (err, res, body) => {
        if (err) { return done (err); }
        if (res.statusCode === 200) {
          return done ();
        }
        return done (new Error (`Invalid status code ${res.statusCode}`));
      });
    });
  });

  describe ('invalid login request', () => {
    it ('should return 401 error', (done) => {
      let form = { form: {username:'notauser', password:'test'}};
      request.post (`${url}api/login`, form, (err, res, body) => {
        if (err) { return done (err); }
        if (res.statusCode === 401) {
          return done ();
        }
        return done (new Error (`Invalid status code ${res.statusCode}`));
      });
    });
  });

  describe ('valid login and logout request', () => {
    it ('should have no errors', (done) => {
      let form = { form: {username:'amy', password:'test'}};
      request.post (`${url}api/login`, form, (err, res, body) => {
        if (err) { return done (err); }
        if (res.statusCode === 200) {
          request.post (`${url}api/logout`, function (err2, res2, body2) {
            if (res2.statusCode === 200) {
              return done ();
            } else {
              return done (new Error (`Invalid logout status code ${res2.statusCode}`));
            }
          });
        } else {
          return done (new Error (`Invalid login status code ${res.statusCode}`));
        }
      });
    });
  });

  describe ('check authentication for logged in user', () => {
    let cookie;
    before ((done) => {
      let form = { form: {username:'amy', password:'test'}};
      request.post (`${url}api/login`, form, (err, res, body) => {
        if (err) { return done (err); }
        if (res.statusCode === 200) {
          cookie = res.headers['set-cookie'][0];
          done ();
        }
      });
    });

    after ((done) => {
      request.post (`${url}api/logout`, (err, res, body) => {
        done ();
      });
    });

    it ('should have no errors', (done) => {
      let jar = request.jar ();
      jar.setCookie (cookie, 'http://localhost:3000');
      request.get ({url: `${url}api/verifylogin`, jar: jar}, (err, res, body) => {
        if (err) { return done (err); }
        if (res.statusCode === 200) {
          body = JSON.parse (body);
          if (body.authenticated === true) {
            return done ();
          } else {
            return done (new Error (`Invalid data ${JSON.stringify (body)}`));
          }
        } else {
          return done (new Error (`Invalid status code ${res.statusCode}`));
        }
      });
    });
  });

  describe ('check authentication for no logged in user', () => {
    it ('should return false with no errors', (done) => {
      request.get (`${url}api/verifylogin`, (err, res, body) => {
        if (res.statusCode === 200) {
          body = JSON.parse (body);
          if (body.authenticated === false) {
            return done ();
          } else {
            return done (new Error (`Invalid response ${JSON.stringify (body)}`));
          }
        } else {
          return done (new Error (`Invalid authenticated status code ${res.statusCode}`));
        }
      });
    });
  });

  describe ('register, login and logout', () => {
    it ('should have no errors', (done) => {
      let form = { form: {username:'newuser', password:'test'}};
      request.post (`${url}api/register`, form, (err, res, body) => {
        if (err) { return done (err); }
        if (res.statusCode === 200) {
          let form2 = { form: {username:'newuser', password:'test'}};
          request.post (`${url}api/login`, form2, function (err2, res2, body2) {
            if (err2) { return done (err2); }
            if (res2.statusCode === 200) {
              request.post (`${url}api/logout`, function (err3, res3, body3) {
                if (res3.statusCode === 200) {
                  return done ();
                } else {
                  return done (new Error (`Invalid response logout ${res3.statusCode}`));
                }
              });
            } else {
              return done (new Error (`Invalid login status code ${res2.statusCode}`));
            }
          });
        } else {
          return done (new Error (`Invalid register status code ${res.statusCode}`));
        }
      });
    });
  });

  describe ('register same user twice', () => {
    it ('should fail on second register call', (done) => {
      let form = { form: {username:'newuser2', password:'test'}};
      request.post (`${url}api/register`, form, (err, res, body) => {
        if (err) { return done (err); }
        if (res.statusCode === 200) {
          request.post (`${url}api/register`, form, (err2, res2, body2) => {
            if (err2) { return done (err2); }
            if (res2.statusCode === 403) {
              return done ();
            }
            return done (new Error (`Invalid response logout 2 ${res2.statusCode}`));
          });
        } else {
          return done (new Error (`Invalid response logout 1 ${res.statusCode}`));
        }
      });
    });
  });
});

describe ('REST call validation', () => {
  describe ('login: missing body', () => {
    it ('should fail with 400', (done) => {
      request.post (`${url}api/login`, {form: {}}, (err, res, body) => {
        if (err) { return done (err); }
        if (res.statusCode === 400) {
          return done ();
        }
        return done (new Error (`Invalid statusCode ${res.statusCode}`));
      });
    });
  });

  describe ('Login: missing username', () => {
    it ('should fail with 400', (done) => {
      request.post (`${url}api/login`, {form: { password: 'password'}}, (err, res, body) => {
        if (err) { return done (err); }
        if (res.statusCode === 400) {
          return done ();
        }
        return done (new Error (`Invalid statusCode ${res.statusCode}`));
      });
    });
  });

  describe ('login: missing password', () => {
    it ('should fail with 400', (done) => {
      request.post (`${url}api/login`, {form: { username: 'username'}}, (err, res, body) => {
        if (err) { return done (err); }
        if (res.statusCode === 400) {
          return done ();
        }
        return done (new Error (`Invalid statusCode ${res.statusCode}`));
      });
    });
  });

  describe ('register: missing body', () => {
    it ('should fail with 400', (done) => {
      request.post (`${url}api/register`, (err, res, body) => {
        if (err) { return done (err); }
        if (res.statusCode === 400) {
          return done ();
        }
        return done (new Error (`Invalid statusCode ${res.statusCode}`));
      });
    });
  });

  describe ('register: missing username', () => {
    it ('should fail with 400', (done) => {
      request.post (`${url}api/register`, {form: { password: 'password'}}, (err, res, body) => {
        if (err) { return done (err); }
        if (res.statusCode === 400) {
          return done ();
        }
        return done (new Error (`Invalid statusCode ${res.statusCode}`));
      });
    });
  });

  describe ('register: missing password', () => {
    it ('should fail with 400', (done) => {
      request.post (`${url}api/register`, {form: { username: 'username'}}, (err, res, body) => {
        if (err) { return done (err); }
        if (res.statusCode === 400) {
          return done ();
        }
        return done (new Error (`Invalid statusCode ${res.statusCode}`));
      });
    });
  });
});
