/**
 * Creator: yeliex
 * Project: Eagle
 * Description: 处理所有短信发送相关
 */

import { handleActions } from 'redux-actions';
import Types from '../types';

const sms = handleActions({
  [Types.SMS_REQUEST](state) {
    return { ...state, onsending: true, count: 0, smsId: '' };
  },
  [Types.SMS_SUCCESS](state, { smsId }) {
    return { ...state, onsending: false, count: 90, smsId };
  },
  [Types.SMS_FAILED](state) {
    return { ...state, onsending: false, count: 0, smsId: '' }
  },
  [Types.SMS_COUNT](state, { count }) {
    return { ...state, count };
  }
}, {
  onsending: false,
  count: 0,
  smsId: ''
});

export default sms;
