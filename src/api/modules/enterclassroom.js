import GetData from '@/utils/axios.js'
const { $get, $post } = new GetData()

/**
 * 进入课堂
 */
const enterClassroom = function(virtualclassId, studentUserId) {
  return $get('/api/classroom/enter/' + virtualclassId + "/" + studentUserId)
}

export default {
  enterClassroom
}
