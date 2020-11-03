// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'
import 'babel-polyfill'
require('es6-promise').polyfill()
import '@/assets/theme-default/element-ui/index.css'
import Questionnaire from '@/Questionnaire'
import i18n from '@/locales'
import router from '@/router'
import api from '@/api'
import ApiConstants from '@/utils/api_constants' // api公共常量量

Vue.config.productionTip = false;
Vue.prototype.$api = api;
Vue.prototype.ApiConstants = ApiConstants;

if (process.env.NODE_ENV == 'production') {
  Vue.config.devtools = false;
} else {
  Vue.config.devtools = true;
}

router.afterEach(function(to) {
  if (window.ga) {
    window.ga('set', 'page', to.fullPath);
    window.ga('send', 'pageview');
  }
});
/* eslint-disable no-new */
new Vue({
  el: '#demo',
  i18n,
  components: { Questionnaire },
  template: '<Questionnaire/>'
})
