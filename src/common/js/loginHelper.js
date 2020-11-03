import { saveToLocal, loadFromLocal } from "@/common/js/store";
import store from '@/store'
export function localLogin(user) {
    saveToLocal("login_info", "user", user);
    saveToLocal("login_token", "jwtToken", user.jwtToken)
    store.state.user.isLogin = true;
    store.state.user.jwtToken = user.jwtToken;
    store.state.user.user = user;
}

export function localLogout() {
    saveToLocal("login_info", "user", null);
    saveToLocal("login_token", "jwtToken", "");
    store.state.user.isLogin = false;
    store.state.user.jwtToken = "";
    store.state.user.user = {};
}