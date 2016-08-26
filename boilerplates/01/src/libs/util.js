/**
 * Creator: yeliex
 * Project: Kratos
 * Description:
 */

import store from '../store';
import { push } from 'react-router-redux';
import { WINDOW_TITLE } from '../store/types';
import classNames from 'classnames';

const setTitle = function setTitle(title) {
  store.dispatch({ type: WINDOW_TITLE, title });
};

const redirect = function redirect(url) {
  store.dispatch(push(url || '/'));
};

const className = function className(...props) {
  return { className: classNames(...props) };
};

export {
  setTitle,
  redirect,
  className
}
