import GetData from '@/utils/axios.js';

const { $get, $post, $put } = new GetData();

/**
 * 登录
 * @param {Object} params 参数对象，包括：
 *        identify          {String} 用户名
 *        password          {String} 密码
 *        plainPassword     {String} 明文密码
 *        role              {int} 用户角色
 */
const login = (params) => {
  return $post('/api/user/login', params);
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
const register = (params) => {
  return $post('/api/user/register', params);
}

/**
 * 获取家庭孩子
 * @param userId {String} 用户名
 */
const getChildren = (userId) => {
  return $get('/api/user/children/' + userId);
}
/**
 * 更新孩子心性
 * @param {Object} params 参数对象，包括：
 *        userId          {String} 用户名
 */
const putChildren = (params) => {
  return $put('/api/user/children', params);
}

/**
 * 获取获取该家庭的儿童用户上课的概要信息
 * @param {Object} params 参数对象，包括：
 *          parentUserId   {int} 父母用户标识
 *          studentUserId  {int} 儿童用户标识
 */
const getBriefClassInfo = (params) => {
  return $get('/api/user/children/' + params.parentUserId + '/' + params.studentUserId);
}
/**
 * @param {Int} role        用户角色，1：家长；2：老师
 * @param {Int} userId      用户标识
 * @param {String} lastTime 上次拉取消息的时间，格式2019-08-25T02:30:00.000Z
 * @param {Int} category    通知消息类型，1：课程提醒；2：活动通知；3：系统通知
 * @param {Int} pageNum     页号，从1开始
 * @param {Int} pageSize    页尺寸
 */
const messageCenter = ({ role, userId, lastTime, category, pageNum, pageSize }) => {
  return $get(`/api/activity/notify/message/${role}/${userId}/${lastTime}/${category}/${pageNum}/${pageSize}`)
}

const changePassword = ({ role, userId, newPassword, oldPassword }) => {
  return $put(`/api/user/modify/password/${userId}/${role}`, {
    newPassword,
    oldPassword
  });
}

const getQuestionnaire = () => {
  return $get('/api/course/questionnaire');
}

const getTeacherInfo = (userId) => {
  return $get(`/api/user/tutor/info/${userId}`);
}
export default {
  login,
  register,
  getChildren,
  getBriefClassInfo,
  changePassword,
  getQuestionnaire,
  getTeacherInfo,
  putChildren,
  messageCenter
}
