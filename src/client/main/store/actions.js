import { SET_BARS, SET_BAR_COUNT, CLEAR_GOING, SET_GOING } from './constants';
import request from 'request';
import wlocation from '../../util/wlocation';

// get bars matching location and populate store
export function setBars (location) {
  return dispatch => {
    return new Promise ((resolve, reject) => {
      request.get (wlocation.origin + '/api/bars?loc=' + location, (err, res, body) => {
        if (err) {
          reject (err);
        } else if (res.statusCode !== 200) {
          reject (res.statusCode);
        } else {
          let bars = JSON.parse (body);
          dispatch ({ type: SET_BARS, bars: bars});
          resolve ();
        }
      });
    });
  };
}

// set the going status for current set of bars
export function updateGoing (bars, username, add) {
  return dispatch => {
    return new Promise ((resolve, reject) => {
      if (add === false) {
        dispatch ({ type: CLEAR_GOING });
      } else {
        let api = '/api/going';
        request.get (wlocation.origin + api, {}, (err, res, body) => {
          if (err) {
            reject (err);
          } else if (res.statusCode !== 200) {
            reject (res.statusCode);
          } else {
            let list = JSON.parse (body);
            dispatch ({ type: SET_GOING, list });
            resolve ();
          }
        });
      }
    });
  };
}

// change the going status for the current user for one bar
export function going (bar, going) {
  return dispatch => {
    return new Promise ((resolve, reject) => {
      let api = '/api/bars/' + bar.id + '/going/' + (going ? '1' : '0');
      request.post (wlocation.origin + api, {}, (err, res, body) => {
        if (err) {
          reject (err);
        } else if (res.statusCode !== 200) {
          reject (res.statusCode);
        } else {
          body = JSON.parse (body);
          dispatch ({ type: SET_BAR_COUNT, id: bar.id, count: body.count, going: going });
          resolve ();
        }
      });
    });
  };
}
