'use strict';
const processCommand = require ('./cmd').processCommand;
const db = require ('./db');
const server = require ('./server');
const Yelp = require ('yelp');

if (require.main === module) {
  main ();
}

// Process command line to start server.
function main () {
  const command = processCommand (process.argv.slice (2));
  if (command.exit) {
    process.exit (command.code);
  }

  let port = process.env.PORT || command.port;
  let dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nightlife';
  let yelp = new Yelp ({
    consumer_key: process.env.YELP_CONSUMER_KEY,
    consumer_secret: process.env.YELP_CONSUMER_SECRET,
    token: process.env.YELP_TOKEN,
    token_secret: process.env.YELP_TOKEN_SECRET
  });

  Promise.resolve ().then (() => {
    return db.init (dbURI);
  }).then (() => {
    return server.start (port, db, yelp);
  }).catch (err => {
    console.log ('Error starting server:', err);
  });
}
