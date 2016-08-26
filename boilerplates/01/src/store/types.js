/**
 * Creator: yeliex
 * Project: Eagle
 * Description: 定义所有 action types (keymirror的array实现)
 */

const Types = [
  'LOGIN_START',
  'LOGIN_REQUEST',
  'LOGIN_SUCCESS',
  'LOGIN_STATUS',
  'LOGIN_LOGOUT',
  'REGISTER_START',
  'REGISTER_REQUEST',
  'REGISTER_FINISH',
  'SMS_SEND',
  'SMS_REQUEST',
  'SMS_SUCCESS',
  'SMS_FAILED',
  'SMS_COUNT',
  'WINDOW_TITLE',
  'WINDOW_SIDEBAR'
];

const types = (() => {
  const that = {};
  for (const item of Types) {
    that[item] = item;
  }
  return that;
})();

export default types;
