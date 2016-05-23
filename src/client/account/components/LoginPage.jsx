import React from 'react';
import {Link} from 'react-router';
import {login} from '../store/actions';

export default class LoginPage extends React.Component {
  constructor (props, context) {
    super (props, context);
    this.state = {
      user: '',
      password: '',
      error: false
    }
    this.login = this.login.bind (this);
  }

  login (event) {
    event.preventDefault ();
    if (! ((this.state.user === '') || (this.state.password === ''))) {
      this.context.store.dispatch (login (this.state.user, this.state.password))
      .then (success => {
        this.setState ({ error: false });
        if (this.props.location.state && this.props.location.state.nextPathname) {
          this.context.router.replace (this.props.location.state.nextPathname);
        } else {
          this.context.router.replace ('/');
        }
      })
      .catch (error => {
        console.log ('login error', error);
        this.setState ({ error: true });
      });
    }
  }

  render() {
    let errorMessage;
    if (this.state.error) {
      errorMessage = <span className='errorMessage'>Login failed, try again.</span>;
    }
    return (
      <div className='dialogUser'>
        <h2>Login</h2>
        <hr/>
        <form onSubmit={this.login}>
          {errorMessage}
          <input autoFocus={true}
            type='text'
            placeholder='user name'
            autoCapitalize='none'
            autoCorrect='off'
            onChange={(event) => { this.setState ({user: event.target.value}); }}/>
          <input
            type='password'
            placeholder='password'
            onChange={(event) => { this.setState ({password: event.target.value}); }}/>
          <button className='dialogButton'
            disabled={(this.state.user === '') || (this.state.password === '')}>
            Login
          </button>
        </form>
      </div>
    );
  }
}

LoginPage.contextTypes = {
  store: React.PropTypes.object.isRequired,
  router: React.PropTypes.object.isRequired
}
