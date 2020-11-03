import GetData from '@/utils/axios.js'

const { $get, $post } = new GetData()

/**
 * 登录
 * @param {Object} params 参数对象，包括：
 *        identify          {String} 用户名
 *        password          {String} 密码
 *        plainPassword     {String} 明文密码
 *        role              {int} 用户角色
 */
const login = function(params) {
  return $post('/api/user/login', params)
}

/**
 * 注册
 * @param {Object} params 参数对象，包括：
 *        identify          {String} 用户名
 *        password          {String} 密码
 *        role              {int} 用户角色
 *        verifyCode        {String} 验证码
 *        verifyToken       {String} 注册token
 */
const register = function(params) {
  return $post('/api/user/register', params)
}

export default {
  login,
  register
}
