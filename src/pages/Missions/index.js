import React from 'react';
import Header from './Header';

const Missions = React.createClass({

  render() {
    return (
      <div>
        <Header />
        {this.props.params.team}
      </div>
    );
  }

});

export default Missions;
