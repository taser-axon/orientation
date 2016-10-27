import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import Spinner from './components/Spinner';
import Main from './pages/Main';
import Missions from './pages/Missions';

const App = React.createClass({

  render() {
    return (
      <Router history={browserHistory}>
        <Route path='/' component={Main} />
        <Route path='/missions/:team' component={Missions} />
      </Router>
    );
  }

});

ReactDOM.render(<App />, document.querySelector('#app'));
