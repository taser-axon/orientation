import React from 'react';

const NavbarItem = React.createClass({

  changeSection() {
    this.props.changeSection(this.props.section);
  },

  render() {
    return (
      <li onClick={this.changeSection}>{this.props.section.title}</li>
    );
  }

});

export default NavbarItem;
