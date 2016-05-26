import { SET_AUTHENTICATED } from './constants';
import request from 'request';

export function register (id, password) {
  return dispatch => {
    return new Promise ((resolve, reject) => {
      let form = { form: {username: id, password: password}};
      request.post (location.origin + '/api/register', form, (err, res, body) => {
        if (err) {
          reject (err);
        } else if (res.statusCode !== 200) {
          reject (res.statusCode);
        } else {
          resolve ();
        }
      });
    });
  };
}

export function login (id, password) {
  return dispatch => {
    return new Promise ((resolve, reject) => {
      let form = { form: {username: id, password: password}};
      request.post (location.origin + '/api/login', form, (err, res, body) => {
        if (err) {
          reject (err);
        } else if (res.statusCode !== 200) {
          reject (res.statusCode);
        } else {
          let user = JSON.parse (body);
          dispatch (setAuthenticated (true, user.username));
          resolve ();
        }
      });
    });
  };
}

export function logout () {
  return dispatch => {
    return new Promise ((resolve, reject) => {
      request.post (location.origin + '/api/logout', (err, res, body) => {
        dispatch (setAuthenticated (false, ''));
        if (err) {
          reject (err);
        } else if (res.statusCode !== 200) {
          reject (res.statusCode);
        } else {
          resolve ();
        }
      });
    });
  };
}

export function verifyLogin () {
  return dispatch => {
    return new Promise ((resolve, reject) => {
      request.get (location.origin + '/api/verifylogin', (err, res, body) => {
        if (err) {
          reject (err);
        } else if (res.statusCode !== 200) {
          reject (res.statusCode);
        } else {
          body = JSON.parse (body);
          let username = body.authenticated ? body.user.username : '';
          dispatch (setAuthenticated (body.authenticated, username));
          resolve (body.authenticated);
        }
      });
    });
  };
}

export function setAuthenticated (authenticated, username) {
  return { type: SET_AUTHENTICATED, authenticated, username };
}
