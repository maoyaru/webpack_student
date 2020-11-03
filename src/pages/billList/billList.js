// import Vue from 'vue'
import 'babel-polyfill'
require('es6-promise').polyfill()
import BillListApp from '@/BillListApp'
import store from '@/store'
// import elementUI from 'element-ui'
import router from '@/router'
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

window.moment = require('moment');

if (process.env.NODE_ENV == 'production') {
  Vue.config.devtools = false;
} else {
  Vue.config.devtools = true;
}

// 过滤器
import { filters } from '@/utils/filters'
filters.forEach(({ name, fun }) => {
  Vue.filter(name, function(value) {
    return fun(value);
  });
});

router.afterEach(function(to) {
  if (window.ga) {
    window.ga('set', 'page', to.fullPath);
    window.ga('send', 'pageview');
  }
});

Vue.config.productionTip = false
Vue.prototype.$api = api;
Vue.prototype.ApiConstants = ApiConstants
Vue.prototype.Constants = Constants
Vue.prototype.ErrorCode = ErrorCode
Vue.prototype.DateTimeUtils = DateTimeUtils
// Vue.use(elementUI);
// Vue.use($toaster);

/* eslint-disable no-new */
new Vue({
  el: '#billList',
  i18n,
  store,
  // router,
  components: { BillListApp },
  template: '<BillListApp/>'
})

import { isLogout } from '@/common/js/auth';
isLogout();
