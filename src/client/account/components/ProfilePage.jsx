import React from 'react';
import {Link} from 'react-router';
import {updateProfile} from '../store/actions';

export default class ProfilePage extends React.Component {
  constructor (props, context) {
    super (props, context);
    this.state = context.store.getState ().user;
    this.state.error = null;

    this.onSubmit = this.onSubmit.bind (this);
  }

  onSubmit (event) {
    event.preventDefault ();
    this.context.store.dispatch (updateProfile (this.state.username, this.state.name, this.state.email))
    .then (() => {
      this.context.router.push ('/');
    })
    .catch (() => {
      this.setState ({error: 'Error saving profile information'});
    });
  }

  render() {
    return (
      <div className='dialogProfile'>
        <h2>Profile</h2>
        <hr/>
        <form onSubmit={this.onSubmit}>
          <div>
            <label htmlFor='name'>Name</label>
            <input id='name' autoFocus={true}
              type='text'
              value={this.state.name}
              onChange={event => { this.setState ({name: event.target.value}); }}/>
          </div>
          <div>
            <label htmlFor='email'>email</label>
            <input id='email'
              type='text'
              value={this.state.email}
              onChange={event => { this.setState ({email: event.target.value}); }}/>
          </div>
          <button className='dialogButton'>Save</button>
        </form>
      </div>
    );
  }
}

ProfilePage.contextTypes = {
  store: React.PropTypes.object.isRequired,
  router: React.PropTypes.object.isRequired
}
