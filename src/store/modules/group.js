import apiConsts from '../../utils/api_constants';
import api from '../../api';

const state = {
  classLeaderStudent: {}, //班长信息
  classOrdinaryStudents: [], //普通成员列表
  smallclassInfo: {
    classroomClassInfo: {},
    classroomClassMemberInfoList: [],
    userTutorInfoList: [],
    classroomSmallClassCourseInfoList: [],
    endNumber: 0
  },
  loading: false
};

const getters = {
  smallclassInfo: (state) => state.smallclassInfo,
  loading: (state) => state.loading
};

const actions = {
  /**
   * @Author   Yaodongxin
   * @DateTime 2020-03-10
   * @method   getSmallClassAction 获取小班课信息列表
   * @param    {Number}  classid   班级id
   */
  getSmallClassAction({ commit, state }, classId) {
    return new Promise((resolve, reject) => {
      api.grouppurchase.smallclassList(classId).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          commit('setSmallclassInfoMutation', data.data);
          state.loading = false;
          resolve(data);
        } else {
          state.loading = false;
          reject('error');
        }
      });
    });
  },

};

const mutations = {
  /**
   * 设置班长信息
   */
  setClassLeaderStudent(state, payload) {
    state.classLeaderStudent = payload.params
  },
  /**
   * 设置普通成员列表
   */
  setClassOrdinaryStudents(state, payload) {
    state.classOrdinaryStudents = payload.params
  },
  setLoadingMutation(state, data) {
    state.loading = data;
  },
  setSmallclassInfoMutation(state, data) {
    state.smallclassInfo = data;
    state.smallclassInfo.endNumber = 0;
    if (!state.smallclassInfo.classroomClassMemberInfoList) {
      state.smallclassInfo.classroomClassMemberInfoList = [];
    }
    if (!state.smallclassInfo.userTutorInfoList) {
      state.smallclassInfo.userTutorInfoList = [];
    }
    if (!state.smallclassInfo.classroomSmallClassCourseInfoList) {
      state.smallclassInfo.classroomSmallClassCourseInfoList = [];
    } else {
      state.smallclassInfo.classroomSmallClassCourseInfoList.forEach((item) => {
        let date = Date.parse(item.startTime);
        let now = Date.now();
        if (date < now) {
          item.isEnd = true;
        } else {
          item.isEnd = false;
          state.smallclassInfo.endNumber++;
        }
      })
    }
  }
};


export default { namespaced: true, state, mutations, actions, getters }
