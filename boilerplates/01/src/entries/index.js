/**
 * Creator: yeliex
 * Project: Eagle
 * Description:
 */

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

if (process.env.NODE_ENV !== 'production') {
  window.api = `/api`;
} else {
  window.api = '/api';
}

import '../../views/index.html';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import Store from '../store';
import Routes from '../routes';

const history = syncHistoryWithStore(hashHistory, Store);

ReactDOM.render((
  <Provider store={Store}>
    <Routes history={history} />
  </Provider>
), document.getElementById('root'));
