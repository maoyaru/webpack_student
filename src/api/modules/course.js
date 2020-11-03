import GetData from '@/utils/axios.js'
const { $get, $post } = new GetData()

const submitQuestionnaire = function(params) {
  return $post('/api/course/questionnaire/result', params)
}

export default {
  submitQuestionnaire
}
