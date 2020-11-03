import GetData from '@/utils/axios.js'
const { $get, $post } = new GetData()

/**
 * 家长账号获取订单信息
 */
const getOrderList = function(pageNum, pageSize, userParentId) {
  return $get(`/api/order/list/${pageNum}/${pageSize}/${userParentId}`)
}

/**
 *	获取订单详情
 */
const getOrderDetail = function(orderId) {
  return $get(`/api/order/detail/${orderId}`)
}

/**
*	课时变动记录
	pageNum 页码
	pageSize 每页数量
	parentUserId	家长用户标识
	type 账户课时分类 1-标准课时 2-定向课时
	startTime 开始时间
*/
const getLessonList = function(pageNum, pageSize, parentUserId, type, params) {
  return $get(`/api/lesson/list/${pageNum}/${pageSize}/${parentUserId}/${type}`, params)
}

/**
* 取消订单
  orderId 订单id
*/

const cancelOrder = function(orderId) {
  return $get(`/api/order/cancel/${orderId}`)
}

/**
* 自动取消订单
  orderId 订单id
*/

const autoCancelOrder = function(orderId) {
  return $get(`/api/order/auto/cancel/${orderId}`)
}

/**
* 申请售后
  parentUserId 家长Id
*/
const getAdviserOrXgInfo = function(parentUserId) {
  return $get(`/api/user/userInfo/${parentUserId}`)
}

/**
* 申请收据
  orderId 订单Id
  email 邮箱
*/
const applyToSendOrderInfo = function(orderId) {
  return $get(`/api/order/apply/receipt/${orderId}`)
}

/**
* 用户待支付订单统计
  parentUserId 
*/

const getUserParentUndoNumber = function(parentUserId) {
  return $get(`/api/order/undo/number/count/${parentUserId}`)
}

export default {
  getOrderList,
  getOrderDetail,
  getLessonList,
  cancelOrder,
  autoCancelOrder,
  getAdviserOrXgInfo,
  applyToSendOrderInfo,
  getUserParentUndoNumber
}
