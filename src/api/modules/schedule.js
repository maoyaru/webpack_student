import GetData from '@/utils/axios.js'
const { $get, $post } = new GetData()
/**
 * 课堂
 * @param {Object} params 参数对象，包括：
 *        userId          {String} 用户名
 *        startTime       {Date} 课表开始时间
 *        endTime         {Date} 课表结束时间
 */
const tutorTimetable = function(userId, startTime, endTime) {
  return $get('/api/schedule/tutor/timetable/' + userId + '/' + startTime + '/' + endTime)
}

/**
 * 课堂信息列表
 * @param {Object} params 参数对象，包括：
 *        userId          {String} 用户名
 *        history         {Int} 课堂类型：0未开始 1已开始
 *        pageNum         {Int} 页数
 *        pageSize        {Int} 每页数目
 */
const getVirtualclass = function(userId, history, pageNum, pageSize) {
  return $get('/api/schedule/student/virtualclass/' + userId + '/' + history + '/' + pageNum + '/' + pageSize)
}

/**
 * 课表信息列表
 * @param {Object} params 参数对象，包括：
 *        userId          {String} 用户名
 *        history         {Int} 课堂类型：0未开始 1已开始
 *        pageNum         {Int} 页数
 *        pageSize        {Int} 每页数目
 */
const getSchedule = function(userId, startTime, endTime) {
  return $get('/api/schedule/student/timetable/' + userId + '/' + startTime + '/' + endTime)
}

const frequentlyUsedTeachers = (userId, classTypeId, userEligibleTutorParam, pageNum = 1, pageSize = 100) => {
  if (userEligibleTutorParam) {
    return $get(`/api/schedule/tutor/frequent/${userId}/${classTypeId}/${pageNum}/${pageSize}`, {
      preferTime: userEligibleTutorParam
    })
  } else {
    return $get(`/api/schedule/tutor/frequent/${userId}/${classTypeId}/${pageNum}/${pageSize}`)
  }
}

const otherRecommendedTeachers = (userId, classTypeId, userEligibleTutorParam, pageNum = 1, pageSize = 3) => {
  if (userEligibleTutorParam) {
    return $get(`/api/schedule/tutor/eligible/${userId}/${classTypeId}/${pageNum}/${pageSize}`, {
      preferTime: userEligibleTutorParam
    });
  } else {
    return $get(`/api/schedule/tutor/eligible/${userId}/${classTypeId}/${pageNum}/${pageSize}`);
  }

}
/**
 * @Author   Yaodongxin
 * @DateTime 2019-12-10
 * @method   memberRole  查询学员的角色（班长||普通学员）
 * @param    {string}   userId 学员id
 */
const memberRole = (userId) => {
  return $get(`/api/schedule/student/memberRole/${userId}`);
}

const joinedClass = (userId) => {
  return $get(`/api/classroom/joinedClass/${userId}`)
}

export default {
  tutorTimetable,
  getVirtualclass,
  frequentlyUsedTeachers,
  getSchedule,
  otherRecommendedTeachers,
  memberRole,
  joinedClass
}
