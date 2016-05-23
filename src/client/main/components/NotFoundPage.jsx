import React from 'react';

// Content displayed for 404
export default class NotFoundPage extends React.Component {
  render() {
    return (
      <div className='dialogMessage'>
        <p>Sorry, could not find that page for you.</p>
      </div>
    );
  }
}
