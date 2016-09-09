import store from '../store';
import { push } from 'react-router-redux';
import { WINDOW_TITLE } from '../store/types';
import classNames from 'classnames';
const { appname } = require('../../config/config.json');

const setTitle = function setTitle(title) {
  store.dispatch({ type: WINDOW_TITLE, title: `${title ? `${title}-` : ''}${appname}` });
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
