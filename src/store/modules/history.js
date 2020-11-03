import apiConsts from '../../utils/api_constants';
import api from '../../api'

const state = {
  coursewareInfo: null
};

const getters = {

};

const actions = {

};

const mutations = {
  setCourswareInfo(state, payload) {
    state.coursewareInfo = { ...payload.params }
  }
};


export default { namespaced: true, state, mutations, actions, getters }
