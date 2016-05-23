import React from 'react';
import {Link} from 'react-router';
import {register, login} from '../store/actions';

export default class RegisterPage extends React.Component {
  constructor (props, context) {
    super (props, context);
    this.state = {
      user: '',
      password: '',
      verify: '',
      error: false
    }
    this.register = this.register.bind (this);
  }

  register (event) {
    event.preventDefault ();
    if (! ((this.state.user === '') || (this.state.password === ''))) {
      this.context.store.dispatch (register (this.state.user, this.state.password))
      .then (success => {
        this.context.store.dispatch (login (this.state.user, this.state.password))
        .then (success => {
          this.setState ({ error: false });
          if (this.props.location.state && this.props.location.nextPathname) {
            this.context.router.replace (this.props.location.nextPathname);
          } else {
            this.context.router.replace ('/');
          }
        })
        .catch (error => {
          this.setState ({ error: true });
        });
      });
    }
  }

  render() {
    return (
      <div className='dialogUser'>
        <h2>Register</h2>
        <hr/>
        <form onSubmit={this.register}>
          <input autoFocus={true}
            type='text'
            placeholder='user name'
            autoCapitalize='none'
            autoCorrect='off'
            onChange={event => { this.setState ({user: event.target.value}); }}/>
          <input
            type='password'
            placeholder='password'
            onChange={event => { this.setState ({password: event.target.value}); }}/>
          <input
            type='password'
            placeholder='verify password'
            onChange={event => { this.setState ({verify: event.target.value}); }}/>
          <button className='dialogButton'
            disabled={(this.state.user === '') || (this.state.password === '')
              || (this.state.password !== this.state.verify)}>
            Register
          </button>
        </form>
      </div>
    );
  }
}

RegisterPage.contextTypes = {
  store: React.PropTypes.object.isRequired,
  router: React.PropTypes.object.isRequired
}
