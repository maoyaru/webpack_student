// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'
import 'babel-polyfill'
require('es6-promise').polyfill()
import App from '@/App'
import router from '@/router'
import store from '@/store'
// import elementUI from 'element-ui'
import i18n from '@/locales'
import DateTimeUtils from '@/utils/datetime_utils'
import ApiConstants from '@/utils/api_constants' // api公共常量量
import Constants from '@/utils/constants' // 本地常量
import ErrorCode from '@/utils/error_code' // api错误码
import MessageCenterCode from '@/utils/messageCenterCode'
import api from '@/api'
import '@/assets/theme-default/element-ui/index.css'
import '@/assets/theme-default/common/stylus/mixin.styl'
import '@/assets/theme-default/common/stylus/base.styl'
import '@/assets/theme-default/common/stylus/frame.styl'
import $toaster from '@/common/js/toaster'

import VideoPlayer from 'vue-video-player'
window.videojs = VideoPlayer.videojs
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
require('video.js/dist/lang/zh-CN.js')
Vue.use(VideoPlayer)

if (process.env.NODE_ENV == 'production') {
  Vue.config.devtools = false;
} else {
  Vue.config.devtools = true;
}

// cris start
// 引入 auto_components
require('@/auto-components');
require('@/directive');

window.axios = require('axios');
window.moment = require('moment');

// cris end

Vue.config.productionTip = false
Vue.prototype.$api = api;
Vue.prototype.ApiConstants = ApiConstants
Vue.prototype.Constants = Constants
Vue.prototype.ErrorCode = ErrorCode
Vue.prototype.DateTimeUtils = DateTimeUtils
Vue.prototype.MessageCenterCode = MessageCenterCode
Vue.prototype.$EventBus = new Vue()
// Vue.use(elementUI);
Vue.use($toaster);

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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  store,
  router,
  components: { App },
  template: '<App/>',
  mounted: function() {
    if (window.devicePixelRatio > 1 && navigator.userAgent.indexOf('Mobile') == -1) {
      let zoom = window.screen.width / 1700;
      document.documentElement.style.zoom = zoom;
    }
  }
});
