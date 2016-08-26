/**
 * Creator: yeliex
 * Project: Kratos
 * Description:
 */

// 判断平台使用不同的东西

// 优先使用websql

// 不支持websql,但是支持localStorage时使用localStorage

// if (indexedDB) {
//   module.exports = require('./webSQL');
// } else if (localStorage && typeof localStorage === 'object') {
module.exports = require('./localStorage');
// } else {
//   module.exports = {};
//   alert('您的浏览器版本已不被支持,请使用我们的客户端');
// }
