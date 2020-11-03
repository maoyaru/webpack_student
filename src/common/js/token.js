import { lgLocalStorage } from './store'

export function getTokenExpire() {
  let userinfo = lgLocalStorage('__lgzy__s__');
  if(userinfo && userinfo.login_info && userinfo.login_info.user) {
    let expire = new Date(userinfo.login_info.user.jwtExpireTime);
    let expireTimes = expire.getTime();
    let now = Date.now();
    return now < expireTimes;
  }
  return false;
}
