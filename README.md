# Nightlife - Evening Planning App

Planning your evening, need some suggestions for places to go, want to meet
up with friends ... this is your app.

This application is built using *React (15.0.x)*, *Redux* and *react-router* on
the client. The server uses *Nodejs (6.x)*, *Express* and *Passport*.

## Live instance

The application can be used at https://nightlife-jm.herokuapp.com

## Development setup

Clone the *Github* repo, then install the dependencies using *npm*.

```
git clone https://github.com/fcc-joemcintyre/nightlife.git
cd nightlife
npm install
```

The database supported is *MongoDB*. This can be a local or hosted instance (you
can also choose to use a local instance for dev/test and a hosted instance for
deployment). The database name for the application is *nightlife*. The database
name used by the test runner is *nightlifeTest*.

### Build

In a terminal, build can be activated with

```
npm run [build-local | build | build-stage]
```

The build uses *gulp* to run the set of tasks defined in *gulpfile.js*. The three
build options are,

- build-local: build a version of the application that uses local resources for
API calls, instead of real API endpoints
- build: regular build
- build-stage: build application ready to be deployed to Heroku or similar

*build-local* and *build* are continuous build options - the gulp build will
set up watches and rerun build elements as file changes are saved.
*build-stage* is a one time build option, run again to build a new stage output.

## Testing

Testing can be done for all components,

```
npm test
```

Or components individually,

```
npm run test-db
npm run test-server
```

### Server

In a terminal, continuous server operation, updating on changes,
can be activated with

```
npm start
```

The *nodemon* utility provides restart on update.

### Client

After starting a server instance, open a browser and then access the
application at http://localhost:3000

## Deployment

The build process creates the *dist* directory containing all the deployment
files (in the project directory or in the staging directory).

The entry point for the server is *main.js*.
The port number for the server can be passed on the command (-p/--port) or using
the PORT environment variable. For hosted environments, the PORT environment
variable provided by the hosting service is used.

The application also uses the following environment variables,

- SESSION_SECRET

HTTP Session secret (any text string).

- YELP_CONSUMER_KEY
- YELP_CONSUMER_SECRET
- YELP_TOKEN
- YELP_TOKEN_SECRET

Yelp API access values, provided by Yelp.

## License
MIT
