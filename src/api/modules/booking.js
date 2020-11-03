import GetData from '@/utils/axios.js'
const { $get, $post } = new GetData();

const getTutorFreeTime = function(userId, classTypeId, startTime, endTime) {
  return $get(`/api/schedule/tutor/schedule/freeTime/${userId}/${classTypeId}/${startTime}/${endTime}`)
}

const subscribeClass = function(info) {
  return $post(`/api/schedule/student/subscribe`, info)
}

export default {
  getTutorFreeTime,
  subscribeClass
}
