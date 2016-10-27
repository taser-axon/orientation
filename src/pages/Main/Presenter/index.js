import React from 'react';
import NavbarItem from './NavbarItem';
import ScriptTab from './ScriptTab';
import Slide from './Slide';
import { SetupModel } from '../../../models';

const socket = io();

const ACCESS_TOKEN = 'gvNePi0XgAAAAAAAAAABOHvXP3NPdA3qBoJSQJee5r-qjoEC7KuXnLou9NZDZ5xT';
const dbx = new Dropbox({ accessToken: ACCESS_TOKEN });

const Presenter = React.createClass({

  delayUpdate: null,

  getInitialState() {
    return {
      setup: {attributes: {max_points: '', charge: '', cloud: '', circuit: ''}},
      sections: [],
      scripts: [],
      slides: [],
    }
  },

  componentWillMount() {
    this.fetchDropboxFiles('', this.loadSections);
  },

  componentDidUpdate() {
    $('.points input').focus().blur();
  },

  fetchDropboxFiles(path, callback) {
    dbx.filesListFolder({path: path})
      .then(function (response) {
        callback(response.entries);
      })
      .catch(function (err) {
        console.log(err);
      });
  },

  loadSections(entries) {
    let sections = entries.map((entry) => {
      return {title: entry.name, path: entry.path_display}
    });
    new SetupModel().fetch({
      success: (model) => {this.setState({setup: model, sections: sections})}
    });
  },

  changeSection(section) {
    this.fetchDropboxFiles(section.path, (entries) => {
      let scripts = [''], slides = [];
      entries.map((entry) => {
        dbx.filesGetTemporaryLink({path: entry.path_display})
          .then((result) => {
            let title = entry.name;
            let type = title.slice(-3);
            let url = result.link;
            let path = entry.path_display;

            if (type == 'pdf' && title.toLowerCase().indexOf('script') > -1)
    					scripts[0] = url;
    				else if (type == 'pdf' && title.toLowerCase().indexOf('mission') > -1)
      				scripts.push(url);
    				else if (type == 'mp4' || type == 'png' || type == 'jpg')
    					slides.push({type, url, path});

            this.setState({scripts, slides});
          })
          .catch(function (err) {
            console.log(err);
          });
      });

      $('.script-frame iframe').attr('src', '');
    });
  },

  changeScript(script) {
    let src = 'http://docs.google.com/gview?embedded=true&url=';
    src += script.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '');
    $('.script-frame iframe').attr('src', src);
  },

  changeInput(e) {
    let field = $(e.target).attr('id');
    let setup = this.state.setup;
    setup.attributes[field] = e.target.value;
    this.setState({setup}, this.updateSetup);
  },

  updateSetup() {
    clearTimeout(this.delayUpdate);
    this.delayUpdate = setTimeout(() => {
      this.state.setup.save({}, {
        success: (model) => {
          Materialize.toast('Points updated.', 3000);
  				socket.emit('orientation-rankings', model);
        }
      });
    }, 400);
  },

  // rankings() {
  //   socket.emit('orientation-display', {id: 'rankings'});
  // },

  renderNavbarItem(section, i) {
    return (<NavbarItem key={i} section={section} changeSection={this.changeSection} />);
  },

  renderScriptTab(script, i) {
    return (<ScriptTab key={i} i={i} script={script} changeScript={this.changeScript} />);
  },

  renderSlide(slide, i) {
    return (<Slide key={i} slide={slide} changeSlide={this.changeSlide} />);
  },

  renderPointsInput(points, i) {
    return (
      <div key={points} className='points input-field'>
        <input id={points} type='text' value={this.state.setup.attributes[points]}
          onChange={this.changeInput} />
        <label htmlFor={points} style={{textAlign: 'center'}}>{points.replace('_', ' ')}</label>
      </div>
    );
  },

  render() {
    return (
      <main className='presenter'>
        <ul className='navbar'>
          {this.state.sections.map(this.renderNavbarItem)}
        </ul>
        <ul className='script-tabs'>
          {this.state.scripts.map(this.renderScriptTab)}
        </ul>
        <div className='script-frame'>
          <iframe src=''></iframe>
        </div>
        <ul className='slides'>
          {this.state.slides.map(this.renderSlide)}
        </ul>
        <div className='rankings'>
          {['max_points', 'charge', 'cloud', 'circuit'].map(this.renderPointsInput)}
          <button id='display' onClick={this.rankings}>Display Rankings</button>
        </div>
      </main>
    );
  }

});

export default Presenter;
