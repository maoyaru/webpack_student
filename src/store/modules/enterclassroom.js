import api from "../../api";

const state = {
  classroomInfo: []
}

const getters = {

}

const mutations = {
  setClassroomInfo(state, payload) {
    state.classroomInfo = payload
  }
}

const actions = {
  classroomAction({ commit }, query) {
    return new Promise((resolve, reject) => {
      let {
        virtualclassId,
        studentUserId,
      } = query
      api.enterclassroom.enterClassroom(virtualclassId, studentUserId)
        .then(({ status, data }) => {
          if (status === 200) {
            if (data.code === 200) {
              commit("setClassroomInfo", data.data)
            }
            resolve(data)
          } else {
            reject('error')
          }
        })
    })
  },
}

export default { namespaced: true, state, mutations, actions, getters }
