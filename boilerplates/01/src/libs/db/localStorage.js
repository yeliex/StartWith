/**
 * Creator: yeliex
 * Project: Kratos
 * Description:
 */

const query = function query(key) {
  const data = localStorage.getItem(key);
  let parsed;
  try {
    parsed = JSON.parse(data);
  } catch (e) {
    parsed = data;
  }
  return parsed;
};

const drop = function remove(key) {
  const data = localStorage.getItem(key);
  localStorage.removeItem(key);
  return data;
};

const update = function update(key, data, replace = false) {
  let original = localStorage.getItem(key);
  if (original) {
    try {
      original = JSON.parse(original);
    } catch (e) {
    }
  }

  if (original && !replace) {
    if (Array.isArray(original) && Array.isArray(data)) {
      data = original.concat(data);
    } else if (typeof original === typeof data === 'object') {
      data = Object.assign({}, original, data);
    } else {
      data = original + data;
    }
  }

  localStorage.setItem(key, JSON.stringify(data));

  return localStorage.getItem(key);
};

module.exports = {
  query,
  drop,
  update
};
