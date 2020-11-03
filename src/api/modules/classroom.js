import GetData from '@/utils/axios.js'
const { $get, $post } = new GetData()

/**
 * 创建班级
 * className	  string 班级名称
 * classTypeId	integer($int32) 班型标识，1：1对1；2：小班课；3：大班课；默认值2
 * remark	      string 班级描述信息
 * userId     	integer($int64) 班长的用户标识*
 */

const createClass = function(params) {
  return $post('/api/classroom/classinfo', params)
}

export default {
  createClass
}
