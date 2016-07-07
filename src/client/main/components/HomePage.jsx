import React from 'react';
import Bar from './Bar.jsx';
import {setBars, updateGoing, going} from '../store/actions';
import Masonry from 'react-masonry-component';

export default class HomePage extends React.Component {
  constructor (props, context) {
    super (props, context);
    let s = context.store.getState ();
    this.state = {
      location: '',
      bars: s.bars,
      loggedIn: s.user.authenticated
    }
  }

  componentWillMount () {
    this.unsubscribe = this.context.store.subscribe (() => {
      let s = this.context.store.getState ();
      this.setState ({bars: s.bars, loggedIn: s.user.authenticated});
    });
  }

  componentWillUnmount () {
    this.unsubscribe ();
  }

  render () {
    let items = [];
    let bars = this.state.bars;
    for (let bar of bars) {
      items.push (
        <Bar key={bar.id}
          loggedIn={this.state.loggedIn}
          bar={bar}
          onClick={() => {
            console.log ('>', bar);
            this.context.store.dispatch (going (bar, bar.going ? false : true));
          }}/>
      );
    }
    let message = null;
    if (this.state.loggedIn === false) {
      message = (
        <div>
          <p><i>Register</i> to create a free account. <i>Login</i> anytime
            to update your plans for the night.</p>
          <hr/>
        </div>
      );
    }

    return (
      <div className='homePage'>
        <h1>Find your destinations for tonight</h1>
        <div>
          <input type='text'
            placeholder='City or Zip Code'
            maxLength={30}
            onChange={(e) => { this.setState ({location: e.target.value}); }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                if (e.target.value.trim () !== '') {
                  this.context.store.dispatch (setBars (this.state.location));
                }
              }
            }}/>
          <button
            disabled={this.state.location.trim () === ''}
            onClick={() => { this.context.store.dispatch (setBars (this.state.location)); }}>
            Find
          </button>
        </div>
        <div className='items'>
          <Masonry elementType='div'>
            {items}
          </Masonry>
        </div>
      </div>
    );
  }
}

HomePage.contextTypes = {
  store: React.PropTypes.object.isRequired
}
