/**
 * Creator: yeliex
 * Project: Eagle
 * Description:
 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import '../style/nav.css';

const Nav = ({ title, fixed, position, className, ...props }) => {
  return (
    <nav className={[fixed && fixed !== 'false' ? 'fixed' : '', position, className].join(' ')} {...props}>
      {title}
    </nav>
  )
};

Nav.propTypes = {};

module.exports = {
  Nav: connect(({ window }) => {
    return {
      title: window.title
    }
  }, () => {
    return {}
  })(Nav)
};
