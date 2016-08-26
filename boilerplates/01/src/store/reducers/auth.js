/**
 * Creator: yeliex
 * Project: Eagle
 * Description:
 */

import { handleActions } from 'redux-actions';
import Types from '../types';
import db from '../../libs/db';

const auth = handleActions({
  [Types.LOGIN_REQUEST](state) {
    // 请求登录
    return { ...state, loading: true, onlogin: true };
  },
  [Types.LOGIN_SUCCESS](state, action) {
    return { ...state, ...action.auth, onlogin: false }
  },
  [Types.LOGIN_STATUS](state) {
    return state;
  },
  [Types.LOGIN_LOGOUT](state) {
    let exists = db.query('auth') || {};
    if (typeof exists === 'string' && exists.match(/object/g)) {
      exists = {};
    }
    exists.userkey = null;
    db.drop('auth');
    db.update('auth', exists);
    return { ...state, userkey: null, onlogin: false };
  },
  [Types.REGISTER_REQUEST](state) {
    // 请求注册
    return { ...state, loading: true, onRegister: true };
  },
  [Types.REGISTER_FINISH](state) {
    // 请求注册
    return { ...state, loading: false, onRegister: false, user: state.user };
  }
}, Object.assign(
  {},
  db.query('auth'),
  {
    onlogin: false,
    onRegister: false,
    loading: false
  }
));

export default auth;
