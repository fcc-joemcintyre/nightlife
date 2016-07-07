import React from 'react';
import {logout} from '../store/actions';

export default class LogoutPage extends React.Component {
  // On component load, call logout
  componentDidMount () {
    this.context.store.dispatch (logout ());
  }

  render() {
    return (
      <div className='dialogMessage'>
        <p>You are now logged out.</p>
      </div>
    );
  }
}

LogoutPage.contextTypes = {
  store: React.PropTypes.object.isRequired
};
