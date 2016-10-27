import React from 'react';

const ScriptTab = React.createClass({

  changeScript() {
    this.props.changeScript(this.props.script);
  },

  render() {
    return(
      <li onClick={this.changeScript}>
        {this.props.i == 0 ? 'Script' : 'Mission-'+this.props.i}
      </li>
    );
  }

});

export default ScriptTab;
