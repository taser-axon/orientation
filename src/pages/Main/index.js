import React from 'react';
import Presenter from './Presenter';
import Projector from './Projector';

const Main = React.createClass({

  views: {
    presenter: Presenter,
    projector: Projector,
  },

  getInitialState() {
    return {view: 'presenter'};
  },

  componentDidMount() {
    $(window).load(this.moveTabBorder);
  },

  changeView(e) {
    this.setState({view: $(e.target).data('view')}, this.moveTabBorder);
  },

  moveTabBorder() {
    const currentTab = $('[data-view="'+this.state.view+'"]');
    $('.tabBorder').css({
      width: currentTab.outerWidth(),
      left: currentTab.position().left,
      top: currentTab.position().top + currentTab.height() - 10,
    })
  },

  render() {
    const styles = {
      tab: {
        padding: '0 20px',
      },
      tabBorder: {
        position: 'absolute',
        transition: '.6s',
        height: 2,
        background: '#fff',
      }
    };

    const View = this.views[this.state.view];

    return (
      <div>
        <header>
          <img className='logo' src='assets/images/hybrid-logo.png' />
          <h1 className='title'>Specialized Recruitment</h1>
          <ul className='views'>
            <li style={styles.tab} data-view='presenter' onClick={this.changeView}>Presenter</li>
            <li style={styles.tab} data-view='projector' onClick={this.changeView}>Projector</li>
            <li style={styles.tabBorder} className='tabBorder'></li>
          </ul>
        </header>
        <View />
      </div>
    );
  }

});

export default Main;
