/**
 * Creator: yeliex
 * Project: Eagle
 * Description: require.context返回所有可用的reducers
 */

const context = require.context('./', false, /\.js$/);
const keys = context.keys().filter(item => item !== './login.js');

const reducers = keys.reduce((memo, key) => {
  memo[key.match(/([^\/]+)\.js$/)[1]] = context(key);
  return memo;
}, {});

export default reducers;
