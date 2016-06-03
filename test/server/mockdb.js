'use strict';

let mock;

function setMock (fn, param, value) {
  mock[fn] = {};
  mock[fn][param] = value;

  console.log ('mock', JSON.stringify (mock));
}

function init () {
  mock = {};
}

function close () {
  mock = {};
}

function findUserByUsername (username) {
  console.log ('>> findUserByUsername');
  if (mock.findUserByUsername[username] === undefined) {
    return Promise.reject (new Error ());
  } else {
    return Promise.resolve (mock.findUserByUsername[username]);
  }
}

module.exports.setMock = setMock;
module.exports.init = init;
module.exports.close = close;
exports.findUserByUsername = findUserByUsername;
/*
exports.insertUser = insertUser;
exports.removeUser = removeUser;
exports.getBars = getBars;
exports.getBar = getBar;
exports.getBarByYelpId = getBarByYelpId;
exports.insertBar = insertBar;
exports.insertBars = insertBars;
exports.setGoing = setGoing;
exports.getGoing = getGoing;
*/
