import { saveToLocal, loadFromLocal } from "@/common/js/store";
import apiConsts from '@/utils/api_constants';
import zConsts from '@/utils/constants.js';
import api from '@/api';

const state = {
  consume: {
    list: [],
    pageNum: 1,
    totalPage: 0,
    total: 0,
    pageSize: zConsts.pageSize
  },
  topup: {
    list: [],
    pageNum: 1,
    totalPage: 0,
    total: 0,
    pageSize: zConsts.pageSize
  },
  coupon: {
    unused: {
      list: []
    },
    used: {
      list: []
    },
    invalid: {
      list: []
    }
  },
  currency: [],
  recharge: [],
  confirmRecharge: {
    currentCurrency: {},
    bill: {},
    loading: true
  },
  stripeList: []

}

const getters = {
  getConsume: (state) => state.consume,
  getTopup: (state) => state.topup,
  getUnused: (state) => state.coupon.unused,
  getUsed: (state) => state.coupon.used,
  getInvalid: (state) => state.coupon.invalid,
  getCurrency: (state) => state.currency,
  getRecharge: (state) => state.recharge,
  getConfirmRecharge: (state) => state.confirmRecharge,
  getBill: (state) => state.confirmRecharge.bill,
  getStripeList: (state) => state.stripeList
}

const mutations = {
  consumeMutation(state, data) {
    state.consume = {
      ...state.consume,
      ...data
    };
  },
  topupMutation(state, data) {
    state.topup = {
      ...state.topup,
      ...data
    };
  },
  couponMutation(state, { data, st }) {
    if (st == apiConsts.financeCouponStatusUnused) {
      state.coupon.unused.list = data;
    } else if (st == apiConsts.financeCouponStatusUsed) {
      state.coupon.used.list = data;
    } else {
      state.coupon.invalid.list = data;
    }
  },
  addCouponMutation(state, data) {
    state.coupon.unused.list.unshift(data);
  },
  currencyMutation(state, data) {
    state.currency = data;
  },
  rechargeMutation(state, data) {
    state.recharge = data;
  },
  confirmRechargeMutation(state, data) {
    state.confirmRecharge = {
      ...state.confirmRecharge,
      ...data
    }
  },
  stripeListMutation(state, data) {
    state.stripeList = data;
  }
}

const actions = {
  consumeAction({ commit, state }, userId) {
    return new Promise((resolve, reject) => {
      api.finance.consume({ userId, pageNum: state.consume.pageNum, pageSize: state.consume.pageSize }).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          commit('consumeMutation', data.data);
          resolve(data.data);
        } else {
          reject('error');
        }
      })
    })
  },
  topupAction({ commit, state }, userId) {
    return new Promise((resolve, reject) => {
      api.finance.topup({ userId, pageNum: state.topup.pageNum, pageSize: state.topup.pageSize }).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          commit('topupMutation', data.data);
          resolve(data.data);
        } else {
          reject('error')
        }
      })
    })
  },
  couponAction({ commit }, { userId, st }) {
    return new Promise((resolve, reject) => {
      api.finance.coupon({ userId, status: st }).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          commit('couponMutation', { data: data.data, st });
          resolve(data.data);
        } else {
          reject('error')
        }
      })
    })
  },
  addCouponAction({ commit }, { userId, code }) {
    return new Promise((resolve, reject) => {
      api.finance.addCoupon({ userId, code }).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          commit('addCouponMutation', data.data);
          resolve(data.data);
        } else {
          reject('error')
        }
      })
    })
  },
  /**
   * 获取币种
   *
   */
  currencyAction({ commit, dispatch, state }, { userId, point, sgclassid, packageid, rechargeAmount, groupId, showState = false, code = '', location = '', pa = null, callback }) {
    return new Promise((resolve, reject) => {
      api.finance.currency().then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          commit('currencyMutation', data.data);
          for (let i = 0; i < data.data.length; i++) {
            // 新加坡小班课充值，设置币种为新加坡币
            if (sgclassid && data.data[i].currency == 'SGD') {
              commit('confirmRechargeMutation', { currentCurrency: data.data[i] });
              break;
              // 根据定位信息设置默认币种
            } else if (location) {
              // 定位为新加坡-SGD/香港-HKD/其他-USD
              switch (location) {
                case 'Singapore':
                  if (data.data[i].currency == 'SGD') {
                    commit('confirmRechargeMutation', { currentCurrency: data.data[i] });
                  }
                  break
                case 'Hong Kong':
                  if (data.data[i].currency == 'HKD') {
                    commit('confirmRechargeMutation', { currentCurrency: data.data[i] });
                  }
                  break
                default:
                  if (data.data[i].currency == 'USD') {
                    commit('confirmRechargeMutation', { currentCurrency: data.data[i] });
                  }
              }
              // 其他情况默认为美元
            } else if (data.data[i].currency == 'USD') {
              commit('confirmRechargeMutation', { currentCurrency: data.data[i] });
              break;
            }
          }
          if (packageid) {
            if (rechargeAmount) {
              let rechargeAmount = rechargeAmount;
            } else {
              rechargeAmount = null
            }
            dispatch('confirmRechargePackageAction', {
              userId,
              code,
              currencyId: state.confirmRecharge.currentCurrency.currencyId,
              rechargePackageId: packageid,
              rechargeAmount: rechargeAmount,
              sgClassId: sgclassid,
              callback
            })
          } else if (sgclassid) {
            if (rechargeAmount) {
              let rechargeAmount = rechargeAmount;
            } else {
              rechargeAmount = null
            }
            dispatch('confirmRechargeSgClassIdAction', {
              userId,
              code,
              currencyId: state.confirmRecharge.currentCurrency.currencyId,
              sgClassId: sgclassid,
              rechargeAmount: rechargeAmount,
              pa,
              callback
            })
          } else if(showState) {
            dispatch('confirmRechargeMiniClassAction', {
              userId,
              code: '',
              currencyId: state.confirmRecharge.currentCurrency.currencyId,
              rechargeAmount: point,
              groupId,
              showState,
              callback
            })
          }
          else{
            dispatch('confirmRechargeAction', {
              userId,
              code: '',
              currencyId: state.confirmRecharge.currentCurrency.currencyId,
              rechargeAmount: point,
              callback
            })
          }
          resolve(data.data);
        } else {
          reject('error')
        }
      })
    })
  },
  // 获取常用约课课时
  rechargeAction({ commit }) {
    return new Promise((resolve, reject) => {
      api.finance.recharge().then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          commit('rechargeMutation', data.data);
          resolve(data.data);
        } else {
          reject('error')
        }
      })
    })
  },
  /**
   * @Author   Yaodongxin
   * @DateTime 2019-12-14
   * @method   confirmRechargeAction 值账单确认信息
   * @param    {[type]}   options.commit         [description]
   * @param    {[type]}   options.userId         [description]
   * @param    {[type]}   options.code           [description]
   * @param    {[type]}   options.currencyId     [description]
   * @param    {[type]}   options.rechargeAmount [description]
   * @return   {[type]}                          [description]
   */
  confirmRechargeAction({ commit }, { userId, code, currencyId, rechargeAmount, callback, pa = null }) {
    return new Promise((resolve, reject) => {
      commit('confirmRechargeMutation', { loading: true });
      api.finance.confirmRecharge({ userId, code, currencyId, rechargeAmount }).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          // data.data.ambassadorUsername = 'nananan'; // 测试城市合伙人
          commit('confirmRechargeMutation', { bill: data.data });
          typeof callback == 'function' && callback(data.data);
          resolve(data.data);
        } else if (data.code === 40005) {
          if (pa) {
            pa.bill.code = '';
            pa.bill.discountIndex = -1;
            typeof callback == 'function' && callback(state.confirmRecharge.bill);
            pa.resetBill()
          }
        } else {
          reject('error')
        }
        commit('confirmRechargeMutation', { loading: false });
      })
    })
  },
  // 小班课团购
  confirmRechargeMiniClassAction({ commit }, { userId, code, currencyId, rechargeAmount, groupId, showState, callback }) {
    return new Promise((resolve, reject) => {
      commit('confirmRechargeMutation', { loading: true });
      api.finance.confirmRechargeMiniClass({ userId, code, currencyId, rechargeAmount, groupId, showState }).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          commit('confirmRechargeMutation', { bill: data.data });
          typeof callback == 'function' && callback(data.data);
          resolve(data.data);
        } else {
          reject('error')
        }
        commit('confirmRechargeMutation', { loading: false });
      })
    })
  },
  // 充值小班课
  confirmRechargeSgClassIdAction({ commit }, { userId, code, currencyId, sgClassId, rechargeAmount, callback, pa = null }) {
    return new Promise((resolve, reject) => {
      commit('confirmRechargeMutation', { loading: true });
      api.finance.confirmRechargeSgClassId({ userId, code, currencyId, sgClassId, rechargeAmount }).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          commit('confirmRechargeMutation', { bill: data.data });
          typeof callback == 'function' && callback(data.data);
          resolve(data.data);
        } else if (data.code === 40005) {
          // 优惠券不满足使用条件
          if (pa) {
            pa.bill.code = '';
            pa.bill.discountIndex = -1;
            typeof callback == 'function' && callback(state.confirmRecharge.bill);
            pa.resetBill()
          }
        } else {
          reject('error')
        }
        commit('confirmRechargeMutation', { loading: false });
      })
    })
  },
  // 充值课时包
  confirmRechargePackageAction({ commit }, { userId, code, currencyId, rechargeAmount, sgClassId, rechargePackageId, callback }) {
    return new Promise((resolve, reject) => {
      commit('confirmRechargeMutation', { loading: true });
      api.finance.confirmRechargePackage({ userId, code, currencyId, rechargePackageId, rechargeAmount, sgClassId }).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          commit('confirmRechargeMutation', { bill: data.data });
          typeof callback == 'function' && callback(data.data);
          resolve(data.data);
        } else {
          reject('error')
        }
        commit('confirmRechargeMutation', { loading: false });
      })
    })
  },
  getStripeListAction({ commit }, userId) {
    return new Promise((resolve, reject) => {
      api.finance.getCards(userId).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          commit('stripeListMutation', data.data);
          resolve(data.data);
        } else {
          reject('error')
        }
      })
    })
  },
  // 丢弃
  payAction({ commit }, { userId, payInfo }) {
    return new Promise((resolve, reject) => {
      api.finance.pay(userId, payInfo).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          resolve(data.data);
        } else {
          reject('error')
        }
      })
    })
  },
  /**
   * @Author   Yaodongxin
   * @DateTime 2019-12-31
   * @method   cardPayAction 银行卡支付
   * @param    {Function}    options.commit         commit
   * @param    {Number}      options.userId   家长id
   * @param    {[type]}      options.payInfo        支付详细信息，见接口描述
   */
  cardPayAction({ commit }, { userId, payInfo }) {
    return new Promise((resolve, reject) => {
      api.finance.cardPay(userId, payInfo).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          resolve(data);
        } else {
          reject('error')
        }
      })
    })
  },
  /**
   * @Author   Yaodongxin
   * @DateTime 2019-12-31
   * @method   cardPayAction 银行卡支付
   * @param    {Function}    options.commit         commit
   * @param    {Number}      options.userId   家长id
   * @param    {[type]}      options.payInfo        支付详细信息，见接口描述
   */
  cardPayActionSgClassId({ commit }, { userId, payInfo }) {
    return new Promise((resolve, reject) => {
      api.finance.cardPay(userId, payInfo).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          resolve(data);
        } else {
          reject('error')
        }
      })
    })
  },
  /**
   * @Author   Yaodongxin
   * @DateTime 2019-12-31
   * @method   aliPayAction  支付宝支付
   * @param    {Function}    options.commit  commit
   * @param    {Object}      options.payInfo 支付信息
   */
  aliPayAction({ commit }, { userId, payInfo }) {
    return new Promise((resolve, reject) => {
      api.finance.aliPay(userId, payInfo).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          resolve(data.data);
        } else {
          reject('error')
        }
      })
    })
  },
  /**
   * @Author   Yaodongxin
   * @DateTime 2019-12-31
   * @method   aliPayAction  微信支付
   * @param    {Function}    options.commit  commit
   * @param    {Object}      options.payInfo 支付信息
   */
  weixinPayAction({ commit }, { userId, payInfo }) {
    return new Promise((resolve, reject) => {
      api.finance.weixinPay(userId, payInfo).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          resolve(data.data);
        } else {
          reject('error')
        }
      })
    });
  },
  /**
   * @Author   Yaodongxin
   * @DateTime 2019-12-31
   * @method   轮训支付状态
   * @param    {[type]}      options.commit [description]
   * @param    {[type]}      orderNo        [description]
   * @return   {[type]}                     [description]
   */
  observePayStatusAction({ commit }, orderNo) {
    return new Promise((resolve, reject) => {
      api.finance.observePayStatus(orderNo).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          resolve(data);
        } else {
          reject('error')
        }
      })
    });
  },
  getSecretKeyAction({ commit }, currency) {
    return new Promise((resolve, reject) => {
      api.finance.getSecretKey(currency).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          resolve(data.data);
        } else {
          reject('error')
        }
      })
    });
  }
}
export default { namespaced: true, state, mutations, actions, getters }
