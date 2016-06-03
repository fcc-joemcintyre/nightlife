'use strict';
const express = require ('express');
const bodyParser = require ('body-parser');
const cookieParser = require ('cookie-parser');
const expressSession = require ('express-session');
const path = require ('path');
const passport = require ('passport');
const auth = require ('./auth');
const routes = require ('./routes');

// the secret for the session, should be set in an environment variable
// some random text used as a placeholder for dev
const sessionSecret = process.env.SESSION_SECRET || 'randomtext_aseroja';

// ensure HTTPS is used for all interactions
let httpsOnly = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] &&
    req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect (['https://', req.hostname, req.url].join (''));
  }
  next ();
};

// Start the server.
function start (port, db, yelp) {
  return new Promise ((resolve, reject) => {
    console.log ('Starting server');
    Promise.resolve ().then (() => {
      // set up static HTML serving
      let app = express ();

      if (process.env.NODE_ENV === 'production') {
        app.use (httpsOnly);
      }

      // set up HTTP parsers and session manager
      app.use (cookieParser ());
      app.use (bodyParser.json ());
      app.use (bodyParser.urlencoded ({extended:true}));
      app.use (expressSession ({
        secret: sessionSecret,
        saveUninitialized: true,
        resave: true
      }));

      // set up passport authentication, attach to express session manager
      auth.init (db);
      app.use (passport.initialize ());
      app.use (passport.session ());

      // create server with HTML and REST routes
      routes.init (app, db, yelp);

      app.get ('*.js', (req, res) => {
        res.set ({
          'content-type': 'text/javascript',
          'content-encoding': 'gzip'
        });
        res.sendFile (path.join (__dirname, 'public' + req.path + '.gz'));
      });

      // static file handling
      app.use (express.static (path.join (__dirname, 'public')));

      // for not explicitly handled REST routes, return 404 message
      app.use ('/api/*', (req, res) => {
        res.status (404).json ({});
      });
      // for all other routes, let client react-router handle them
      app.get ('*', (req, res) => {
        res.sendFile (path.join (__dirname, 'public/index.html'));
      });

      app.listen (port, () => {
        console.log ('Server listening on port ' + port);
        resolve ();
      });
    }).catch (err => {
      reject (err);
    });
  });
}

exports.start = start;
