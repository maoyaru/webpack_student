import GetData from '@/utils/axios.js'

const { $get, $post } = new GetData()

const getHomeworkList = function(params) {
  return $get(`/api/homework/query/${params}`)
}

/**
 * 生成当前试卷
 * virtualClassId {number} 小班课Id
 * lessonId {number} 版本Id
 * studentId {number} 学生Id
 * tutorUserId {number} 家长Id
 */
const createHomeworkDetail = function(virtualClassId, lessonId, studentId, tutorUserId) {
  return $get(`/api/homework/buildStudentHomework/${virtualClassId}/${lessonId}/${studentId}/${tutorUserId}`)
}

/**
 * 获取当前试卷
 * lessonId {number} 版本Id
 * studentId {number} 学生Id
 */
const getHomeworkDetail = function(lessonId, studentId) {
  return $get(`/api/homework/queryStudentHomework/${lessonId}/${studentId}`)
}

/**
 * 教师评价
 * virtualClassId {number} 课堂Id
 * studentId {number} 学生Id
 */
const getHomeworkTeacherFeedback = function(virtualClassId, studentId) {
  return $get(`/api/homework/queryVirtualClassHomeworkResult/${virtualClassId}/${studentId}`)
}

/**
 * 保存学生家庭作业答案
 * virtualClassId {number} 小班课Id
 * lessonId {number} 版本Id
 * studentId {number} 学生Id
 * dto {object} 传输数据
 */
const saveHomework = function(virtualClassId, lessonId, studentId, dto) {
  return $post(`/api/homework/saveStudentHomeworkAnswer/${virtualClassId}/${lessonId}/${studentId}`, dto)
}

/**
 * 提交学生家庭作业答案
 * virtualClassId {number} 小班课Id
 * lessonId {number} 版本Id
 * studentId {number} 学生Id
 * dto {object} 传输数据
 */
const submitHomework = function(virtualClassId, lessonId, studentId, dto) {
  return $post(`/api/homework/submitStudentHomeworkAnswer/${virtualClassId}/${lessonId}/${studentId}`, dto)
}

/**
 * 单个学生历史课堂详情
 * studentId {number} 学生Id
 * status {number} 课堂状态，3正常，4异常
 * virtualClassId {number} 课堂标识
 */
const virtualClassHistoryDetail = function(studentId, status, virtualClassId) {
  return $get(`/api/schedule/student/virtualClass/historyDetail/${studentId}/${status}/${virtualClassId}`)
}

export default {
  getHomeworkList,
  createHomeworkDetail,
  getHomeworkDetail,
	getHomeworkTeacherFeedback,
  saveHomework,
  submitHomework,
  virtualClassHistoryDetail
}
