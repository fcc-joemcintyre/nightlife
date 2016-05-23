'use strict';
const processCommand = require ('./cmd').processCommand;
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

  let yelp = new Yelp ({
    consumer_key: process.env.YELP_CONSUMER_KEY,
    consumer_secret: process.env.YELP_CONSUMER_SECRET,
    token: process.env.YELP_TOKEN,
    token_secret: process.env.YELP_TOKEN_SECRET
  });

  let port = process.env.PORT || command.port;
  let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nightlife';
  server.start (port, uri, yelp);
}
