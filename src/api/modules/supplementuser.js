import GetData from '@/utils/axios.js'
const { $get, $post, $put } = new GetData();

/**
 * @Author    Yaodongxin
 * @DateTime  2019-12-05
 * @method    getParentInfo 获取家长用户信息
 * @param     {string}    userId    家长id
 */
const getParentInfo = function(userId) {
  return $get(`/api/user/parent/info/${userId}`);
}
/**
 * @Author   Yaodongxin
 * @DateTime 2019-12-05
 * @method   updataParentInfo 更新家长信息
 * @param    {object}   info 家长信息
 */
const updataParentInfo = function(info) {
  return $put('/api/user/parent/update', info);
}
/**
 * @Author   Yaodongxin
 * @DateTime 2019-12-05
 * @method   upgradeParentAccount 升级成为家长号
 * @param    {[type]}   userId [description]
 * @return   {[type]}          [description]
 */
const upgradeParentAccount = function(userId) {
  return $get(`/api/user/upgrade/parent/${userId}`);
}

/**
 * @Author   Yaodongxin
 * @DateTime 2019-12-05
 * @method   addStudentInfo 添加孩子信息
 */
const addStudentInfo = function(info) {
  return $post('/api/user/children', info)
}
/**
 * @Author   Yaodongxin
 * @DateTime 2019-12-06
 * @method   [version]
 * @param    {string}   pid 家长id
 */
const getChildrenInfos = function(pid) {
  return $get(`/api/user/children/${pid}`)
}
/**
 * @Author   Yaodongxin
 * @DateTime 2019-12-07
 * @method   linkAccountAjax
 * @param    {object}   info 关联账户信息
 */
const linkAccountAjax = function(info) {
  return $post('/api/user/joinChildren', info)
}

/**
 * 
 * @method   更新孩子信息
 * @param    {object}   info 关联账户信息
 */
const upgradeChildInfo = function(info) {
  return $post('/api/user/children', info)
}


export default {
  getParentInfo,
  updataParentInfo,
  upgradeParentAccount,
  addStudentInfo,
  getChildrenInfos,
  upgradeChildInfo,
  linkAccountAjax
}
