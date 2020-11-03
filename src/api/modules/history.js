import GetData from '@/utils/axios.js'
const { $get, $post } = new GetData()

/**
 * 历史和未上课堂信息列表
 * @param {Object} params 参数对象，包括：
 *        history          {Int} 课堂信息类型，0：未开始；1：历史课堂
 *        pageNum          {Int} 页号，从1开始
 *        pageSize         {Int} 页尺寸
 *        userId           {Int} 学生的用户标识
 */
const getHistoryClassList = function(history, pageNum, pageSize, userId) {
  return $get('/api/schedule/student/virtualclass/' + userId + '/' + history + '/' + pageNum + '/' + pageSize)
}

/**
 * 历史课堂正常和异常信息列表
 * @param {Object} params 参数对象，包括：
 *        pageNum          {Int} 页号
 *        history          {Int} 页尺寸
 *        status           {Int} 课堂状态，3：正常结束；4：异常结束
 *        userId           {Int} 学生的用户标识
 */
const getHistoryClassListFn = function(pageNum, pageSize, status, userId) {
  return $get('/api/schedule/student/virtualclass/history/' + userId + '/' + status + '/' + pageNum + '/' + pageSize)
}
/**
 * 获取课堂相关的课件和扩展课件
 * @param {Object} params 参数对象，包括：
 *        virtualclassId    课堂标识
 *        classroomVirtualclassEvaluateParamList   
 *        userId          {Int} 老师用户表示
 *        virtualclassId  {Int} 课堂标识
 */
const getCoursewareInfo = function(virtualclassId) {
  return $get('/api/classroom/student/courseware/' + virtualclassId)
}
/**
 * 获取课堂中老师对学生的评价
 * @param {Object} params 参数对象，包括：
 *        virtualclassId  {Int} 课堂标识
 */
const getClassedTeacherForStudents = function(virtualclassId) {
  return $get('/api/classroom/student/evaluate/' + virtualclassId)
}
/**
 * 课堂中学生对老师的评价
 * @param {Object} params 参数对象，包括：
 * params  {Object} 提交信息
 * userId {Int} 学生用户信息
 * virtualclassId {Int} 课堂标识
 */
const studentsToTeacherComment = function(params, userId, virtualclassId) {
  return $post('/api/classroom/student/evaluate/' + virtualclassId + '/' + userId, params)
}
/**
 * 获取一堂课的家庭作业提交和批改情况
 *  @param {Object} params 参数对象，包括：
 * virtualclassId {Int} 课堂标识
 */
const getClassHomeworkStutes = function(virtualclassId) {
  return $get('/api/course/homework/result/' + virtualclassId)
}
/**
 * 文件上传
 * @param {Object} params 参数对象，包括：
 * category {string} 类型
 * file {formData} file
 */
const upLoad = function(params) {
  return $post('/api/upload/uploadFile', params)
}
/**
 * 每节课的家庭作业题目
 * @param {Object} params 参数对象，包括：
 * lessonId {Int} 第几课标识
 */
const getHomeworkInfo = function(lessonId) {
  return $get('/api/course/homework/' + lessonId)
}
/**
 * @param {Object} params 参数对象，包括：
 * attachmentList {Array} 作业附件 ： {attachment:附件内容,attachmentType:附件类型1：文本；2：文件；3：语音；4：视频；默认1，length:附件大小}
 * homeworkId {Int} 家庭作业标识
 * studentUserId {Int} 学生的用户标识
 * tutorUserId {Int} 老师的用户标识
 * virtualclassId {Int} 课堂标识
 */
const submitHomework = function(params) {
  return $post('/api/course/homework/result', params)
}
/**
 * 获取课堂回放
 * @param {Int} virtualclassId 课堂标识
 */
const lookBeforeVideo = function(virtualclassId) {
  return $get('/api/classroom/replay/' + virtualclassId)
}
/**
 * 获取单元报告信息
 * @param {Int} unitReportId 单元报告标识
 */
const getUnitReportDetailData = function(unitReportId) {
  return $get(`/api/course/unitReportResult/info/${unitReportId}`)
}
/**
 * 获取首次课报告信息
 * @param {Int} firstReportId 首次课报告标识
 */
const getFirstClassFeedbackDetailData = function(firstReportId) {
  return $get(`/api/course/firstReportResult/info/${firstReportId}`)
}
export default {
  getHistoryClassList,
  getHistoryClassListFn,
  getCoursewareInfo,
  getClassedTeacherForStudents,
  studentsToTeacherComment,
  getClassHomeworkStutes,
  upLoad,
  getHomeworkInfo,
  submitHomework,
  lookBeforeVideo,
  getUnitReportDetailData,
  getFirstClassFeedbackDetailData
}
