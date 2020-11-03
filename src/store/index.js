import vue from 'vue';
import vuex from 'vuex';
import user from './modules/user';
import student from './modules/student';
import schedule from './modules/schedule';
import booking from './modules/booking';
import finance from './modules/finance';
import history from './modules/history';
import group from './modules/group';
import enterclassroom from './modules/enterclassroom';

vue.use(vuex)

const store = new vuex.Store({
  modules: {
    user,
    student,
    schedule,
    booking,
    finance,
    history,
    group,
    enterclassroom
  }
});

export default store;
