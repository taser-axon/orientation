import React from 'react';

const socket = io();

const Projector = React.createClass({

  getInitialState() {
    return {type: '', url: ''}
  },

  componentDidUpdate() {
    if (this.state.type == 'mp4') {
      $('.projector video')[0].currentTime = 0;
      $('.projector video')[0].play();
    }
  },

  componentDidMount() {
    socket.on('orientation-display', (data) => {
      $('.projector video').trigger('pause');
      // if (data.type == 'mp4') {
      //   $('.projector #'+data.id+' video')[0].currentTime = 0
      //   $('.projector #'+data.id+' video')[0].play()
      // }
      this.setState({
        type: data.slide.type,
        url: data.slide.url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '')
      });
		});
		// socket.on('orientation-rankings', (data) => {
    //   ['charge', 'cloud', 'circuit'].map((team) => {
    //     width = data.attributes[team] / data.attributes.max_points * $('#rankings').width()
  	// 		$('.ranking[data-team="'+team+'"] .bar').width(width+'px')
    //   });
		// });
  },

  render() {
    return (
      <main className='projector'>
        <div className='projector-frame'>
          <ul>
            <li id='display'>
              {
                this.state.type == 'mp4' ?
                <video src={this.state.url} type='video/mp4' controls></video> :
                <img src={this.state.url} />
              }
            </li>
          </ul>
        </div>
      </main>
    );
  }

});

export default Projector;
