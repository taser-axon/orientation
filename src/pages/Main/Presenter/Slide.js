import React from 'react';

const socket = io();

const ACCESS_TOKEN = 'gvNePi0XgAAAAAAAAAABOHvXP3NPdA3qBoJSQJee5r-qjoEC7KuXnLou9NZDZ5xT';
const dbx = new Dropbox({ accessToken: ACCESS_TOKEN });

const Slide = React.createClass({

  slide() {
    socket.emit('orientation-display', {slide: this.props.slide})
  },

  render() {
    const { type, url } = this.props.slide;
    const src = type == 'mp4' ? 'assets/images/vid-thumb.png' : url;

    return(
      <li onClick={this.slide}>
        <img src={src} />
      </li>
    );
  }

});

export default Slide;
