'use strict';
const listenerUser = require ('./listenerUser');
const listenerApp = require ('./listenerApp');

// Initialize routes.
function init (app, db, yelp) {
  listenerUser.init (db);
  listenerApp.init (db, yelp);

  app.post ('/api/login', listenerUser.login);
  app.post ('/api/logout', listenerUser.logout);
  app.get ('/api/verifylogin', listenerUser.verifyLogin);
  app.post ('/api/register', listenerUser.register);
  app.get ('/api/bars', listenerApp.search);
  app.post ('/api/bars/:id/going/:going', isAuthenticated, listenerApp.going);
  app.get ('/api/going', isAuthenticated, listenerApp.goingList);
}

// authenticate, if passing continue, otherwise redirect to home page
function isAuthenticated (req, res, next) {
  if (req.isAuthenticated ()) {
    return next ();
  }
  res.status (401).json ({});
}

exports.init = init;
