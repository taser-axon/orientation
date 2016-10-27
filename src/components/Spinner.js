import React, { PropTypes } from 'react';
import SpinnerImage from '../../assets/images/loading-cropped.gif';

const Spinner = React.createClass({

  propTypes: {
    style: PropTypes.object,
    containerStyle: PropTypes.object
  },

  render() {
    let spinnerStyle = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      marginTop: '-125px',
      marginLeft: '-125px',
      borderRadius: '50%'
    };
    let containerStyle = {
      height: '85vh'
    };
    spinnerStyle = Object.assign(spinnerStyle, this.props.style);
    containerStyle = Object.assign(containerStyle, this.props.containerStyle);
    return (
      <div style={containerStyle}>
        <img src={SpinnerImage} style={spinnerStyle}/>
      </div>
    );
  }

});

export default Spinner;
