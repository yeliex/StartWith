/**
 * Creator: yeliex
 * Project: Eagle
 * Description:
 */

import '../style/base.css';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import { Nav } from './Navigation';
import { isLogin } from '../libs/auth';
import { setTitle } from '../libs/util';
import { WINDOW_SIDEBAR } from '../store/types';
import update from './Update';

const config = require('../../config/config.json');

setTitle(config.appname);

class App extends Component {
  componentDidMount() {
    if (!this.props.isLogined() && !this.props.url.match(/^\/auth/)) {
      this.props.dispatch(replace('/user/login'));
      return;
    }
    update();
  }

  toggleSidebar = () => {
    this.props.dispatch({ type: WINDOW_SIDEBAR });
  };

  render() {
    return (
      <div className={navigator.userAgent.match(/MicroMessenger/g) ? 'wechat' : ''}>
        <Nav fixed position="top" />
        <div className="wrapper">
          123123
        </div>
      </div>
    );
  }
}

export default connect(({ auth, window }, { location }) => {
  return {
    auth,
    url: location.pathname,
    isLogined: () => {
      return isLogin(auth);
    }
  }
})(App);
