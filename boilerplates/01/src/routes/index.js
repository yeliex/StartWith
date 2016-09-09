import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import App from '../components/App';

const Routes = ({ history }) => (
  <Router history={history}>
    <Route path="/" component={App}>
      <IndexRoute component={require('../models')} />
    </Route>
    <Route path="/user" component={require('../models/user')}>
      <IndexRoute component={require('../models/user/login')} />
      <Route path="/user/login" component={require('../models/user/login')} />
      <Route path="/user/register" component={require('../models/user/register')} />
    </Route>
    <Route path="*" component={require('../models/error/404')} />
  </Router>
);

Routes.propTypes = {
  history: PropTypes.any
};

export default Routes;
