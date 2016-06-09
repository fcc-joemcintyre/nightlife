# Nightlife Design

The *Nightlife* application is a full stack application project defined by
FreeCodeCamp at

https://www.freecodecamp.com/challenges/build-a-nightlife-coordination-app

## License
This document is licensed under a Creative Commons Attribution 4.0
International License (CC-BY).

The source code for the project is made available under a MIT license,
https://www.github.com/fcc-joemcintyre/nightlife/LICENSE.txt

# Overview

Nightlife uses Yelp to provide information about bars in/near a city, or a
zip code. It also shows the number of people that have indicated that they
are going to each bar.

For users that register and login, they can add or remove themselves from the
people planning to go to the bars.

An instance of the application is hosted on Heroku at
https://nightlife-jm/herokuapp.com

# Design

## Functional Requirements

Client Loading:

- The server will serve a web application to a connecting browser

Client Display:

- home page shows a search field, allowing entry of a city or zip code
- search will use the Yelp API to find bars and display them with their
provided review, location, and number of people planning to visit
- new users can register for additional features
- logged in users,
  - will see a + or - button on each bar, allowing adding / removing themselves
  to the count of people planning to visit the bar
  - logging in will not require initiating the current search, instead the
  current search results will be updated

Data Exchange:

- The server will accept REST calls for,
  - register
  - login, logout, verifyLogin (for continuing session)
  - search for bars
  - add/remove current logged in user from the count for each bar

## Data Definitions

#### User

| Field    | Description |
| -------- | ----------- |
| username | Unique, indexed. Short text name for user |
| hash     | password hash |
| salt     | password salt |

#### Bars

| Field    | Description |
| -------- | ----------- |
| id       | Unique, indexed. Yelp id for bar. |
| going    | Array of User.id that are planning to go to this bar |

## Non-Functional Requirements

The application processor, memory and storage requirements will fit within the
constraints to be hosted on a free Heroku dyno.

No redundancy or scaling features are implemented.

The Heroku instance uses HTTPS for transport security between the browser and
application. Other deployments of this application must also use HTTPS since
authentication and sessions are essential to the applications function.

## Technology Selections

The server is implemented with Node.js version 6.x and uses ES2015 Javascript
conforming to the native ES2015 support provided in this version of Node.js.
Data is stored in MongoDB (3.0.x).

The client interface is implemented with React 15.x using ES2015 Javascript
as supported by Babel. Redux and react-router are also used.

Stylesheets are defined with SCSS, with Sass used as the CSS preprocessor.

Gulp is used for build.
