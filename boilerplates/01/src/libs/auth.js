const isLogin = function isLogin(auth) {
  return (auth.mobile && auth.userkey && auth.lastLogin);
};

const storage = function storage(auth) {
  if (!auth || typeof auth !== 'object') {
    return JSON.parse(localStorage.getItem('auth'));
  }

  localStorage.setItem('auth', JSON.stringify(auth));
  return true;
};

export {
  isLogin,
  storage
};
