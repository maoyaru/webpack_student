import { saveToLocal, lgLocalStorage, clearLoacl } from "@/common/js/store";
import { urlParse } from "@/common/js/util";
import api from '@/api'
import MD5 from "crypto-js/md5";

const state = {
  user: {
    userParentInfo: {
      balance: 0,
      bonusBalance: 0
    }
  },
  isLogin: false,
  teacherInfo: {},
  studentBriefInfo: {}
}

const getters = {
  getParentInfo: (state) => {
    let userParentInfo;
    if (state.user.userParentInfo.id) {
      return state.user.userParentInfo
    } else {
      let userInfo = lgLocalStorage('__lgzy__s__');
      if (userInfo && userInfo.login_info.user.jwtToken) {
        userParentInfo = userInfo.login_info.user.userParentInfo;
      }
      return userParentInfo;
    }
  },
  getUserInfo: (state) => state.user,
  getBlance: (state) => state.user.userParentInfo.bonusBalance * 1 + state.user.userParentInfo.balance * 1,
  getTeacherInfo: (state) => state.teacherInfo,
  getStudentBriefInfo: (state) => state.studentBriefInfo
}

const actions = {
  /**
   * @Author   Yaodongxin
   * @DateTime 2019-12-12
   * @method   loginAction
   * @param    {function}   options.commit commit
   * @param    {object}     options.user   用户登录信息
   * @param    {object}     options.self   vue组件对象
   */
  loginAction({ commit }, { user, self, callback }) {
    return new Promise((resolve, reject) => {
      api.user.login(user).then(({ status, data }) => {
        if (status === 200) {
          if (data.code === 200) {
            saveToLocal("login_info", "user", data.data);
            saveToLocal("login_token", "jwtToken", data.data.jwtToken);
            commit('loginMutation', {
              isLogin: true,
              jwtToken: data.data.jwtToken,
              user: data.data
            });
            let querys;
            try {
              querys = self.$router.query
            } catch (e) {
              querys = urlParse();
            }
            // if(self.$router.query && self.$router.redirect) {
            //   self.$router.push(self.$router.query.redirect);
            // }else {
            //   self.$router.push("/index");
            // }
            if (querys && querys.redirect) {
              let redirect = decodeURIComponent(decodeURIComponent(querys.redirect));
              if (redirect.indexOf('billList.html') > -1) {
                window.location.href = redirect;
              } else {
                window.location.href = "/#" + redirect;
              }
            } else {
              window.location.href = "/";
            }
            resolve(data);
            if (typeof callback == 'function') {
              callback();
            }
          } else {
            reject('error');
          }
        } else {
          reject('error');
        }
      });
    });
  },
  /**
   * @Author   Yaodongxin
   * @DateTime 2019-12-12
   * @method   logoutAction  退出登录
   * @param    {function}    options.commit  commit
   * @param    {function}    cal             成功回调
   */
  logoutAction({ commit }, cal) {
    // 清除本地存储
    clearLoacl();
    commit('logoutMutation');
    cal();
  },
  /**
   * @Author   Yaodongxin
   * @DateTime 2019-12-12
   * @method   registerAction 注册
   * @param    {function}   options.commit commit
   * @param    {object}   options.user   注册的用户信息
   * @param    {object}   options.self   vue组件对象
   */
  registerAction({ commit, dispatch }, { user, self }) {
    return new Promise((resolve, reject) => {
      let registerUser = Object.assign({}, user);
      let loginUser = {};
      registerUser.password = MD5(user.password).toString();
      loginUser.identify = registerUser.identify;
      loginUser.password = registerUser.password;
      loginUser.plainPassword = user.password;
      loginUser.role = user.role;

      api.user.register(registerUser).then(({ status, data }) => {
        if (status === 200) {
          if (data.code === 200) {
            self.$message({
              message: data.message,
              onClose: function() {
                if (self.isIndonesia) {
                  let callback = () => {
                    self.$router.push("/index");
                  }
                  dispatch('loginAction', { user: loginUser, self: self, callback })
                } else {
                  if (self.isPc === false) {
                    self.isSuccess = true
                  } else {
                    let callback = () => {
                      self.$router.push("/index");
                    }
                    dispatch('loginAction', { user: loginUser, self: self, callback })
                  }
                }
              }
            })
          }
          resolve(data)
        } else {
          reject('error');
        }
      });
    });
  },
  changePasswordAction({ commit }, { role, userId, newPassword, oldPassword }) {
    return new Promise((resolve, reject) => {
      api.user.changePassword({ role, userId, newPassword, oldPassword }).then(({ status, data }) => {
        if (status === 200 && data.code === 200) {
          resolve();
        } else {
          reject();
        }
      });
    })

  },
  /**
   * @Author   Yaodongxin
   * @DateTime 2020-01-02
   * @method   getParentInfoAction  重新拉家长信息
   * @param    {Function}      options.commit   commit
   * @param    {Number}        userId           家长id
   */
  getParentInfoAction({ commit }, userId) {
    return new Promise((resolve, reject) => {
      api.supplementuser.getParentInfo(userId).then(({ status, data }) => {
        if (status === 200 && data.code === 200) {
          data.data = data.data ? data.data : {};
          commit('updataParentInfo', data.data);
          resolve(data.data);
        } else {
          reject();
        }
      });
    })
  },
  /**
   * @Author   Yaodongxin
   * @DateTime 2020-01-02
   * @method   getTeacherInfoAction  获取教师信息
   * @param    {Function}      options.commit  commit
   * @param    {Number}        userId          教师id
   */
  getTeacherInfoAction({ commit }, userId) {
    return new Promise((resolve, reject) => {
      api.user.getTeacherInfo(userId).then(({ status, data }) => {
        if (status === 200 && data.code === 200) {
          data.data = data.data ? data.data : {};
          commit('teacherInfoMutation', data.data);
          resolve(data.data);
        } else {
          reject();
        }
      });
    })
  },
  /**
   * @Author   Yaodongxin
   * @DateTime 2020-01-03
   * @method   putChildrenAction  更新孩子信息
   * @param    {Function}      options.commit  commit
   * @param    {Object}        params           
   */
  putChildrenAction({ commit }, params) {
    return new Promise((resolve, reject) => {
      api.user.putChildren(params).then(({ status, data }) => {
        if (status === 200 && data.code === 200) {
          data.data = data.data ? data.data : {};
          resolve(data.data);
        } else {
          reject();
        }
      });
    })
  },
  /**
   * @Author   Yaodongxin
   * @DateTime 2020-01-06
   * @method   getBriefClassInfoAction 获取学生概要信息，得到学生最新的信息包含余额
   * @param    {Function}      options.commit        commit
   * @param    {Number}      options.parentUserId    家长id
   * @param    {Number}      options.studentUserId   学生id
   */
  getBriefClassInfoAction({ commit }, { parentUserId, studentUserId }) {
    return new Promise((resolve, reject) => {
      api.user.getBriefClassInfo({ parentUserId, studentUserId }).then(({ status, data }) => {
        if (status === 200 && data.code === 200) {
          data.data = data.data ? data.data : {};
          commit('setStudentBriefInfo', data.data);
          resolve(data.data);
        } else {
          reject();
        }
      });
    });
  }
};

const mutations = {
  loginMutation(state, { user, isLogin, jwtToken }) {
    state.user = user;
    state.isLogin = isLogin;
    state.jwtToken = jwtToken;
  },
  logoutMutation(state, data) {
    state = {
      user: {
        userParentInfo: {
          balance: 0,
          bonusBalance: 0
        }
      },
      isLogin: false
    };
  },
  updataParentInfo(state, data) {
    state.user.userParentInfo = {
      ...state.user.userParentInfo,
      ...data
    };
    // 更新本地存储信息
    let userInfo = lgLocalStorage('__lgzy__s__');
    userInfo.login_info.user.userParentInfo = state.user.userParentInfo;
    lgLocalStorage('__lgzy__s__', userInfo);
  },
  updateBlance(state, data) {
    // state.user.userParentInfo.balance = state.user.userParentInfo.balance * 1 + data.balance * 1;
    // state.user.userParentInfo.bonusBalance = state.user.userParentInfo.bonusBalance * 1 + data.bonusBalance * 1;
    state.user.userParentInfo.balance = state.user.userParentInfo.balance * 1;
    state.user.userParentInfo.bonusBalance = state.user.userParentInfo.bonusBalance * 1;
    // 更新本地存储信息
    let userInfo = lgLocalStorage('__lgzy__s__');
    userInfo.login_info.user.userParentInfo.balance = state.user.userParentInfo.balance;
    userInfo.login_info.user.userParentInfo.bonusBalance = state.user.userParentInfo.bonusBalance;
    lgLocalStorage('__lgzy__s__', userInfo);
  },
  teacherInfoMutation(state, data) {
    state.teacherInfo = Object.assign({}, state.teacherInfo, data);
  },
  setStudentBriefInfo(state, data) {
    state.studentBriefInfo = Object.assign({}, state.studentBriefInfo, data);
    // 设置user state updateBlance
    // if (data.bonusBalance) {
    //   state.user.userParentInfo.bonusBalance = data.bonusBalance;
    // }
    // if (data.balance) {
    //   state.user.balance = data.balance;
    // }
  }
}

export default { namespaced: true, state, mutations, actions, getters }
