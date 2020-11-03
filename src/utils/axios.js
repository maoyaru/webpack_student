import Vue from 'vue'
import axios from 'axios'
import { loadFromLocal, getLang } from '@/common/js/store'
import router from '../router'
import datetime from '@/utils/datetime_utils';
import { errorCodes } from '@/utils/error_code';
import { redirectList, findRedirect } from '@/common/js/redirectList';

const jstz = require('@/utils/jstz')
// 处理请求头数据和处理结果
class HandleParamAndResult {
  constructor() {
    var HOST = 'https://dev2.student.lingo-ace.com'
    // if (HOST == 'production' || HOST == 'development') {
    //   HOST = window.location.protocol + '//' + window.location.host;
    // }
    this.api = HOST;
    // this.api = 'https://dev.api.pplingo.com'
  }

  // 添加请求头
  _addHeaders() {
    // 自定义headers
    let timezone = jstz.jstz.determine();
    const headers = {
      'Content-Type': 'application/json;charset=UTF-8',
      'X-LNG': getLang(),
      'X-TZ': timezone.name() + ' ' + datetime.getTimeZone()
    }
    // console.log(getLang(), timezone.name() + ' ' + datetime.getTimeZone())
    const token = loadFromLocal('login_token', 'jwtToken', null);
    if (token) { // 是否有token
      headers.Authorization = `Bearer ${token}`
    }
    return headers
  }

  // 处理请求
  dealAxios(url, options) {
    const _this = this
    options.headers = this._addHeaders();
    // 判断登录没有并且接口不是注册和登录
    const local = loadFromLocal('login_info', 'user', null);
    // console.log('####登录####', url, local)
    if (url != '/api/user/login' && url != '/api/user/register' && url !== "/api/user/potential/country") {
      if (!local) {
        return false;
      }
    }
    // do something before request
    return new Promise((resolve, reject) => {

      axios(_this.api + url, options).then(res => {
      // axios(url, options).then(res => {
        // console.log('dddddddd',res.data)
        if (res.data.code == 200) {
          // 请求成功
        } else if (res.data.code == 500) {
          // 参数或者校验失败
          if (window.localStorage.getItem("localeLanguage") == 'zh') {
            Vue.prototype.$message({
              message: errorCodes[res.data.code][0],
              duration: 3000
            })
          } else {
            Vue.prototype.$message({
              message: errorCodes[res.data.code][1],
              duration: 3000
            });
          }
        } else if (res.data.code == 401) {
          if (window.localStorage.getItem("localeLanguage") == 'zh') {
            Vue.prototype.$message({
              message: errorCodes[res.data.code][0],
              duration: 3000
            });
          } else {
            Vue.prototype.$message({
              message: errorCodes[res.data.code][1],
              duration: 3000
            });
          }
          // router.push('/login');
          // 不够完美有瑕疵
          let redirect = findRedirect();
          redirect = encodeURIComponent(redirect + window.location.search);
          window.location.href = '/login.html?redirect=' + redirect;
          return false;
        } else {
          // 如果后端返回的错误码本地不存在
          if (!errorCodes[res.data.code]) {
            Vue.prototype.$message({
              message: res.data.message,
              duration: 3000
            })
            return
          }
          if (window.localStorage.getItem("localeLanguage") == 'zh') {
            Vue.prototype.$message({
              message: errorCodes[res.data.code][0],
              duration: 3000
            });
          } else {
            Vue.prototype.$message({
              message: errorCodes[res.data.code][1],
              duration: 3000
            });
          }
        }
        resolve(res)
      }).catch(error => {
        // console.log(_this.api + url)
        // console.log('error');
        reject(error.message);
        console.log(error.message);
      })
    })
  }
}
/**
 * 封装请求方法
 * @param { Number | String } 平台传递的版本号
 */
class RequestMethod {
  constructor() {
    this.$get = this.$get.bind(this)
    this.$post = this.$post.bind(this)
    this.$put = this.$put.bind(this)
    this.$delete = this.$delete.bind(this)
    this.$upload = this.$upload.bind(this)
    this._method = this._method.bind(this)
  }

  /**
   * 整合请求方法
   * @param { String } url 接口路由
   * @param { Object } axios配置 请求参数
   */
  _method(url, options) {
    return new HandleParamAndResult().dealAxios(url, options)
  }

  /**
   * get方法
   * @param { String } url 接口路由
   * @param { Object } data 请求参数
   */
  $get(url, data) {
    return this._method(url, {
      params: data,
      method: 'get'
    })
  }

  /**
   * post方法
   * @param { String } url 接口路由
   * @param { Object } data 请求参数
   */
  $post(url, data) {
    return this._method(url, {
      data: data,
      method: 'post',
      type: 'json'
    })
  }

  /**
   * put方法
   * @param { String } url 接口路由
   * @param { Object } data 请求参数
   */
  $put(url, data) {
    return this._method(url, {
      data: data,
      method: 'put',
      type: 'json'
    })
  }

  /**
   * delete方法
   * @param { String } url 接口路由
   * @param { Object } data 请求参数
   */
  $delete(url, data) {
    return this._method(url, {
      params: data,
      method: 'delete'
    })
  }

  /**
   * 上传方法
   * @param { String } url 接口路由
   * @param { Object } data 请求参数
   */
  $upload(url, data) {
    return this._method(url, {
      body: data,
      method: 'post',
      type: 'formData'
    })
  }
}

export default RequestMethod
