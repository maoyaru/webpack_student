import { lgLocalStorage } from './store';

import { redirectList, findRedirect } from './redirectList';

export const isLogout = function() {
  let userInfo = lgLocalStorage('__lgzy__s__');
  if (userInfo && userInfo.login_info) {
    let token = userInfo.login_info.user.jwtToken;
    let tokenExpireTime = new Date(userInfo.login_info.user.jwtExpireTime).getTime();
    let now = Date.now();
    let notExpired = tokenExpireTime > now;
    let url = window.location.href;
    if (token && notExpired) {
      return false;
    } else {
      // 过期
      if (window.location.href.indexOf('login.html') == -1) {
        let redirect = findRedirect();
        redirect = encodeURIComponent(redirect + window.location.search);
        window.location.href = '/login.html?redirect=' + redirect;
        return true;
      }
    }
  } else {
    // 过期
    if (window.location.href.indexOf('login.html') == -1) {
      let redirect = findRedirect();
      redirect = encodeURIComponent(redirect + window.location.search);
      window.location.href = '/login.html?redirect=' + redirect;
      return true;
    }
  }
}
