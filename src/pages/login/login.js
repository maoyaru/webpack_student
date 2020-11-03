// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'
import 'babel-polyfill'
require('es6-promise').polyfill()
import LoginApp from '@/LoginApp'
import router from '@/router'
// import router from '@/router'
import store from '@/store'
// import elementUI from 'element-ui'
import i18n from '@/locales'
import DateTimeUtils from '@/utils/datetime_utils'
import ApiConstants from '@/utils/api_constants' // api公共常量量
import Constants from '@/utils/constants' // 本地常量
import ErrorCode from '@/utils/error_code' // api错误码
import api from '@/api'
import '@/assets/theme-default/element-ui/index.css'
import '@/assets/theme-default/common/stylus/mixin.styl'
import '@/assets/theme-default/common/stylus/base.styl'
// import $toaster from '@/common/js/toaster'

if (process.env.NODE_ENV == 'production') {
  Vue.config.devtools = false;
} else {
  Vue.config.devtools = true;
}

Vue.config.productionTip = false
Vue.prototype.$api = api;
Vue.prototype.ApiConstants = ApiConstants
Vue.prototype.Constants = Constants
Vue.prototype.ErrorCode = ErrorCode
Vue.prototype.DateTimeUtils = DateTimeUtils
// Vue.use(elementUI);
// Vue.use($toaster);
router.afterEach(function(to) {
  if (window.ga) {
    window.ga('set', 'page', to.fullPath);
    window.ga('send', 'pageview');
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#login',
  i18n,
  store,
  // router,
  components: { LoginApp },
  template: '<LoginApp/>'
});
