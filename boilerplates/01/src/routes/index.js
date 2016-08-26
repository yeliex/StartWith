/**
 * Creator: yeliex
 * Project: Eagle
 * Description:
 */

import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import App from '../components/App';

const Routes = ({ history }) => (
  <Router history={history}>
    <Route path="/" component={App}>
      <IndexRoute component={require('../pages')} />
    </Route>
    <Route path="/user" component={require('../models/user')}>
      <IndexRoute component={require('../models/user/user')} />
      <Route path="/user/register" component={require('../models/user/register')} />
      <Route path="/user/information" edit={false} component={require('../models/user/information')} />
      <Route path="/user/information/edit" edit={true} component={require('../models/user/information')} />
    </Route>
    <Route path="*" component={require('../models/error/404')} />
  </Router>
);

Routes.propTypes = {
  history: PropTypes.any
};

export default Routes;
