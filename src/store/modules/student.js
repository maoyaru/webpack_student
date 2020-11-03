import apiConsts from '@/utils/api_constants';
import api from '@/api'
import { saveCurrentChild, saveToLocal, lgLocalStorage } from "@/common/js/store";

const state = {
  students: null,
  isInit: false,
  currentStudent: {
    id: '',
    realName: ''
  },
  studentBriefInfo: {},
  memberRole: 0,
  classIds: {
    is: false,
    ids: ''
  },
  isNewUser: true,
  joinedClass: []
}

const actions = {
  setStudentRole: ({ commit }, uid) => {
    api.schedule.memberRole(uid).then(({ status, data }) => {
      if (data.code == 200) {
        let memberRole = data.data.memberRole;
        commit('setGroupMutation', memberRole);
        commit('setClassIdsMutation', data.data.classId);
      } else {
        console.log('get member role fail');
      }
    });
  },
  getChildren({ commit, state }, params) {
    let { parentId, isAdd } = params
    return new Promise((resolve, reject) => {
      api.user.getChildren(parentId).then(({ status, data }) => {
        if (status == 200) {
          if (data.code == 200) {
            if (!data.data) {
              commit('setStudents', []);
              resolve(data)
              return
            } else {
              commit('setStudents', data.data);
            }
            let currentChild = window.localStorage.getItem("currentChild") // ''
            let i = data.data.findIndex(item => item.id == currentChild) //[]
            i = i > -1 ? i : 0;
            //0: 不是新添加的学生；   1: 新添加的学生
            if (isAdd === 1) {
              commit('setCurrentStudent', 0);
            } else {
              // commit('setCurrentStudent', i);
            }
            if (i > -1) {
              data.data.splice(0, 0, data.data.splice(i, 1)[0])
              commit('setStudents', data.data);
              commit('setCurrentStudent', 0);
            }
            resolve(data)
          } else {
            reject('errorwww');
          }
        } else {
          reject('error');
        }
      })
    })
  },
  getJoinedClass({ commit, state }, userId) {
    return new Promise((resolve, reject) => {
      api.schedule.joinedClass(userId).then(({ status, data }) => {
        if (status == 200) { 
          if (data.code == 200) {
            commit('setJoinedClass', data.data);
            resolve(data)
          } else {
            reject('errorwww');
          }
        } else {
          reject('error');
        }
      })
    })
  }
}

const mutations = {
  setStudents(state, data) {
    state.students = data;
  },
  setCurrentStudent(state, key) {
    state.currentStudent = state.students[key];
    saveToLocal('currentStudentInfo', 'studentInfo', state.students[key]);
    saveCurrentChild(state.students[key].id);
  },
  setGroupMutation(state, memberRole) {
    // console.log(isMonitor)
    state.memberRole = memberRole;
  },
  setClassIdsMutation(state, classIds) {
    state.classIds = {
      ids: classIds,
      is: true
    };
  },
  setJoinedClass(state, joinedClassList) {
    state.joinedClass = joinedClassList
  }
}

const getters = {
  students: (state) => state.students,
  getMemberRole: (state) => state.memberRole,
  getClassIds: (state) => state.classIds,
  getCurrentStudent: (state) => {
    // if(state.currentStudent.id) {
    return state.currentStudent
    // }
    // let userInfo = lgLocalStorage('__lgzy__s__');
    // if(userInfo && userInfo.login_info.user.jwtToken) {
    //   if(userInfo.currentStudentInfo && userInfo.currentStudentInfo.studentInfo)
    //   return userInfo.currentStudentInfo.studentInfo;
    // }
  },
  getIsNewUser: (state) => {
    if (state.students && state.students.length > 0) {
      for (let i = 0; i < state.students.length; i++) {
        if (state.students[i].firstCourse != apiConsts.scheduleCourseFirstcourse) {
          state.isNewUser = true;
          break;
        }
      }
    }
    return state.isNewUser;
  },
  getJoinedClassList: (state) => state.joinedClass
}

export default { namespaced: true, state, mutations, actions, getters }
