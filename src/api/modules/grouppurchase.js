import GetData from '@/utils/axios.js'
const { $get, $post, $put, $delete } = new GetData();

/**
 * 获取学生未上的小班课
 * @param {Object} params 参数对象，包括：
 * pageNum      {Int} 页号
 * pageSize     {Int} 页尺寸
 * userId       {Int} 学生的用户标识
 */
const getBeforeSmallCalssList = function(userId, pageNum, pageSize) {
  return $get('/api/schedule/student/upcoming/smallclass/' + userId + '/' + pageNum + '/' + pageSize)
}
/**
 * 获取学生已完成的小班课
 * @param {Object} params 参数对象，包括：
 * pageNum      {Int} 页号
 * pageSize     {Int} 页尺寸
 * userId       {Int} 学生的用户标识
 */
const getAfterSmallClassList = function(userId, pageNum, pageSize) {
  return $get('/api/schedule/student/completed/smallclass/' + userId + '/' + pageNum + '/' + pageSize)
}
/**
 * 获取当前学生加入的所有班级
 * @param {Object} params 参数对象，包括：
 * userId {Int} 学生id
 */
const getStudentsInClassGroup = function(userId) {
  return $get('/api/classroom/joinedClass/' + userId)
}
/**
 * 转让班长
 * @param {Object} params 参数对象，包括：
 * 班级标识 {Int} classId
 * 当前班长用户标识 {Int} dleaderUserId
 * 新班长用户标识 {Int} newLeaderUserId
 */
const leaderChange = function(classId, dleaderUserId, newLeaderUserId) {
  return $put('/api/classroom/classmember/' + classId + '/' + dleaderUserId + '/' + newLeaderUserId)
}
/**
 * 获取最近一堂课的信息
 * @param {Object} params 参数对象，包括：
 * userId   {Int} 学生的用户标识
 */
const getLatelyClassInfo = function(userId) {
  return $get('/api/schedule/student/virtualclass/' + userId)
}
/**
 * 更新班级信息
 * @param {Object} params 参数对象，包括：
 * params {Object} 参数信息
 *        classId {Int} 班级
 *        className {String} 班级名称
 *        remark {String} 班级描述
 *        userId {Int} 班长的用户标识
 */
const updateClassInfo = function(params) {
  return $put('/api/classroom/classinfo', params)
}
/**
 * 获取当前学生可以加入的所有班级
 * @param {Object} params 参数对象，包括：
 * pageNum  {Int} 页号
 * pageSize     {Int} 页尺寸
 * studentUserId    {Int} 学生标识
 */
const getStudentsCanJoinClass = function(pageNum, pageSize, studentUserId) {
  return $get('/api/classroom/freeClass/' + studentUserId + '/' + pageNum + '/' + pageSize)
}
/**
 * 新成员加入班级
 * @param {Object} params 参数对象，包括：
 * classId  {Int} 班级标识
 * userId   {Int} 当前学生的用户标识
 */
const newStudentJoinClass = function(params) {
  return $post('/api/classroom/classmember', params)
}
/**
 * 学生退出班级
 * @param {Object} params 参数对象，包括：
 * classId  {Int} 班级标识
 * userId   {Int} 退出班级的成员用户标识
 */
const studentSignoutClass = function(classId, userId) {
  return $delete('/api/classroom/classmember/' + classId + '/' + userId)
}
/*我的小班课信息列表*/
const smallclassList = function(classId) {
  return $get(`/api/schedule/smallclass/virtualclass/${classId}`);
}

const allClassList = function(classId) {
  return $get(`/api/schedule/student/allclass/${studentUserId}`)
}

export default {
  getBeforeSmallCalssList,
  getAfterSmallClassList,
  getStudentsInClassGroup,
  leaderChange,
  getLatelyClassInfo,
  updateClassInfo,
  getStudentsCanJoinClass,
  newStudentJoinClass,
  studentSignoutClass,
  smallclassList,
  allClassList,
}
