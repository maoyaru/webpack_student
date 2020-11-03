import { saveToLocal, loadFromLocal, deleteCurrentChild } from "@/common/js/store";
import api from '@/api'

const state = {
  parentInfo: {
    form: {},
    referrerDisable: true
  }

};

const getters = {
  getParentInfo: (state) => state.parentInfo
}

const actions = {

  getParentInfoAction({ commit }, parentId) {
    return new Promise((resolve, reject) => {
      api.supplementuser.getParentInfo(parentId).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          data = data.data;
          let form = {
              facebook: "", //暂时没有
              email: data.email,
              phone: data.phone,
              whatsapp: data.whatsapp,
              wechat: data.wechat,
              countryOfResidence: data.countryOfResidence,
              referrerUserIdentify: data.referrerUserIdentify,
              google: "" ////暂时没有
            },
            referrerDisable;
          if (!data.referrerUserIdentify) {
            referrerDisable = false;
          }
          commit('parentInfoMutation', { form, referrerDisable });
          resolve(data.data)
        } else {
          reject('error')
        }
      })
    })
  }
}

const mutations = {
  parentInfoMutation(state, data) {
    state.form = {
      ...data.form,
      referrerDisable: data.referrerDisable
    };
  }
}

export default { namespaced: true, state, mutations, actions, getters }
