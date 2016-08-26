/**
 * Creator: yeliex
 * Project: Eagle
 * Description:
 */

import { delay, takeLatest, takeEvery } from 'redux-saga';
import { take, call, put, fork } from 'redux-saga/effects';
import { error, success, loading } from '../../components/Message';

import Types from '../types';
const $ = {
  ajax: require('node.ajax')
};

function* count() {
  for (let i = 90; i >= 0; i--) {
    yield put({ type: Types.SMS_COUNT, count: i });
    yield delay(1000);
  }
}

function* sendSMS(action) {
  yield put({ type: Types.SMS_REQUEST });

  // 开始发送短信
  const req = $.ajax(`${window.api}/sms/varify/register`, 'POST', {
    mobile: action.payload.mobile
  });

  if (!req.status) {
    error(`验证码发送失败,${req.error}`);
    yield put({ type: Types.SMS_FAILED });
  } else {
    success('验证码发送成功');
    yield put(Object.assign({}, { type: Types.SMS_SUCCESS }, req.data));
  }

  yield count();
}

export default function* sms() {
  yield* takeEvery(Types.SMS_SEND, sendSMS);
}
