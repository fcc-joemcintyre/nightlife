import React from 'react';

export default class AboutPage extends React.Component {
  render () {
    return (
      <div className='aboutPage'>
        <h2>About Nightlife</h2>
        <p>Written by Joe McIntyre, Nightlife is a full stack project defined by
        FreeCodeCamp. (<a href='https://www.freecodecamp.com/challenges/build-a-nightlife-coordination-app' target='_blank'>Link</a>)</p>
        <p>The source code is published on GitHub under a MIT license. (
        <a href='https://github.com/fcc-joemcintyre/nightlife' target='_blank'>Link</a>)</p>
        <p>Technologies used include:</p>
        <ul>
          <li>Client: React (15.0.x), React-Redux and React-Router</li>
          <li>Server: Node (6.1.x) using Express and Passport</li>
          <li>Database: Mongo (3.0.x)</li>
          <li>Languages: Javascript (ES2015), CSS (Sass)</li>
        </ul>
        <p>Thanks to:</p>
        <ul>
          <li>GitHub (source hosting)</li>
          <li>Heroku (app hosting)</li>
          <li>mlab (database hosting)</li>
          <li>TravisCI (continuous integration testing)</li>
        </ul>
      </div>
    );
  }
}
