const state = { currentClassess: {} }

const mutations = {
  setCurrentClassess(state, val) {
    state.currentClassess = val
  }
}

const actions = {
  setCurrentClassess: ({
    commit
  }, currentClassess) => {
    commit('setCurrentClassess', currentClassess)
  }
}

const getters = {
  currentClassess: () => {
    return state.currentClassess;
  }
}

export default { namespaced: true, state, mutations, actions, getters }
