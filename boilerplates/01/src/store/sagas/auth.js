import { takeLatest, takeEvery } from 'redux-saga';
import { take, call, put, fork } from 'redux-saga/effects';
import { error, success, loading } from '../../components/Message';
import { redirect } from '../../libs/util';
import Types from '../types';
import db from '../../libs/db';

const $ = {
  ajax: require('node.ajax')
};

const login = function *login({ payload }) {
  yield put({ type: Types.LOGIN_REQUEST });

  // 执行登录进程
  const req = $.ajax(`${window.api}/auth/login`, 'POST', payload);

  if (!req.status) {
    error(`登录失败,${req.error}`);
    yield put({ type: Types.LOGIN_LOGOUT });
  } else {
    loading(`欢迎回来,${req.data.user}`, 3000, false);
    db.drop('auth');
    db.update('auth', req.data);

    setTimeout(() => {
      redirect('/');
    }, 3000);

    yield put({ type: Types.LOGIN_SUCCESS, auth: req.data });
  }
};

const register = function *register({ payload }) {
  yield put({ type: Types.REGISTER_REQUEST });
  yield put({ type: Types.LOGIN_LOGOUT });

  // 执行登录进程
  const req = $.ajax(`${window.api}/auth/register`, 'POST', payload);

  if (!req.status) {
    error(`注册失败,${req.error}`);
  } else {
    loading('注册成功,即将跳转到登录', 3000, false);
    setTimeout(() => {
      redirect('/auth/login');
    }, 3000)
  }

  yield put({ type: Types.REGISTER_FINISH, user: req.data });
};

export default function*() {
  yield [
    takeEvery(Types.LOGIN_START, login),
    takeEvery(Types.REGISTER_START, register)
  ];
}
