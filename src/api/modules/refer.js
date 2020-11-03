import GetData from '@/utils/axios.js'
const { $get, $post } = new GetData()

/**
 * 家长转介绍汇总
 */
const referSummary = function(parentUserId) {
  return $get('/api/finance/parent/refer/summary/' + parentUserId)
}
/**
 * 家长转介绍明细
 */
const referDetail = function(parentUserId, pageNum, pageSize) {
  return $get('/api/finance/parent/refer/detail/' + parentUserId + "/" + pageNum + "/" + pageSize)
}
export default {
  referSummary,
  referDetail
}
