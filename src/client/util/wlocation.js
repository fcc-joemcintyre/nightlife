/**
 * window.location is a global object provided in the browser that provides
 * the location for interacting with the serving server (e.g. where to make
 * REST calls to). To make this available independent of execution environment,
 * browser, headless test, etc, this small library provides the window.location
 * value, using the global if available, or the default if not.
 *
 * Copyright (c) 2016, Joe McIntyre
 * License: MIT
 */
'use strict';

let real = {};
if (typeof (window) !== 'undefined') {
  real = window.location;
  real.setDefaultLocation = () => {};
}

let mock = {
  origin: '',
  setDefaultLocation: setDefaultLocation
};

/**
 * Set the window.location for environments that do not otherwise provide it.
 * @param {string} defaultLocation Location (e.g. http://localhost:8080)
 */
function setDefaultLocation (defaultLocation) {
  mock.origin = defaultLocation;
}

exports = module.exports = (typeof (window) === 'undefined') ? mock : real;
