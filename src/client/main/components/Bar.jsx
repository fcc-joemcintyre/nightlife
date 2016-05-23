import React from 'react';

export default class Bar extends React.Component {
  render () {
    let button;
    if (this.props.loggedIn) {
      button =
        <button onClick={this.props.onClick}>
          {this.props.bar.going ? '-' : '+'}
        </button>;
    }

    return (
      <div className='bar'>
        <h3>{this.props.bar.name}</h3>
        <div className='imageContainer'>
          <img src={this.props.bar.ratingImageUrl}/>
        </div>
        <div className='countArea'>
          <span>{this.props.bar.count}</span>
          {button}
        </div>
        <div className='descriptionArea'>
          <div className='imageContainer'>
            <img src={this.props.bar.snippetImageUrl}/>
          </div>
          <p>{this.props.bar.snippetText}</p>
        </div>
        <div className='addressArea'>
          <hr/>
          <p>{this.props.bar.address}</p>
        </div>
      </div>
    );
  }
}

Bar.propTypes = {
  loggedIn: React.PropTypes.bool.isRequired,
  bar: React.PropTypes.object.isRequired,
  onClick: React.PropTypes.func.isRequired
}
