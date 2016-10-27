import React from 'react';
import HybridLogo from '../../../assets/images/hybrid-logo.png';

const Header = React.createClass({

  getInitialState() {
    return {team: $('script').last().attr('data-team')};
  },

  render() {
    return(
      <header>
        <img className='logo' src={HybridLogo} />
        <h1 className='title'>Specialized Recruitment - {this.state.team}</h1>

      </header>
    );
  }

});

export default Header;
