import GetData from '@/utils/axios.js'
const { $get, $post } = new GetData();
/* 消费流水 */
const consume = ({ userId, pageNum = 1, pageSize = 10 }) => {
  return $get(`/api/finance/parent/consumer/${userId}/${pageNum}/${pageSize}`);
}
/* 充值流水 */
const topup = ({ userId, pageNum = 1, pageSize = 10 }) => {
  return $get(`/api/finance/parent/recharge/${userId}/${pageNum}/${pageSize}`);
}
/* 获取优惠列表 */
const coupon = ({ userId, status }) => {
  return $get(`/api/finance/coupon/code/${userId}/${status}`);
}
/* 添加优惠券 */
const addCoupon = ({ userId, code }) => {
  return $post(`/api/finance/coupon/code/${userId}/${code}`);
}
/* 可用货币 */
const currency = () => {
  return $get(`/api/finance/recharge/currency`);
}
/* 常用充值课时列表 */
const recharge = () => {
  return $get(`/api/finance/recharge/discount`);
}
/* 确认订单 */
const confirmRecharge = ({ userId, code, currencyId, rechargeAmount }) => {
  return $post(`/api/finance/recharge/billing/info/${userId}`, { code, currencyId, rechargeAmount });
}
/* 确认订单小班课 */
const confirmRechargeSgClassId = ({ userId, code, currencyId, sgClassId, rechargeAmount }) => {
  return $post(`/api/finance/recharge/billing/info/${userId}`, { code, currencyId, sgClassId, rechargeAmount });
}
/* 确认订单小班课 */
const confirmRechargePackage = ({ userId, code, currencyId, sgClassId, rechargeAmount, rechargePackageId }) => {
  return $post(`/api/finance/recharge/billing/info/${userId}`, { code, sgClassId, rechargeAmount, currencyId, rechargePackageId });
}
/* 小班课团购 */
const confirmRechargeMiniClass = ({ userId, code, currencyId, rechargeAmount, groupId, showState }) => {
  return $post(`/api/finance/recharge/billing/info/${userId}`, { code, currencyId, rechargeAmount, groupId, showState });
}
/* 添加银行卡 */
const addCards = (userId, info) => {
  return $post(`/api/finance/recharge/stripe/pay/method/${userId}`, info);
}
/* 获取支付方式 */
const getCards = (userId) => {
  return $get(`/api/finance/recharge/stripe/pay/method/${userId}`);
}
/* 通过stripe支付 */
const pay = (userId, payInfo) => {
  return $post(`/api/finance/recharge/order/stripe/pay/${userId}`, payInfo);
}
/* 银行卡支付 */
const cardPay = (userId, payInfo) => {
  return $post(`/api/pay/order/create/card/${userId}`, payInfo);
}
/* 支付宝支付 */
const aliPay = (userId, payInfo) => {
  return $post(`/api/pay/order/create/alipay/${userId}`, payInfo);
}
/* 微信支付 */
const weixinPay = (userId, payInfo) => {
  return $post(`/api/pay/order/create/wechat/${userId}`, payInfo);
}
/* 监测支付状态 */
const observePayStatus = (orderNo) => {
  return $get(`/api/pay/order/status/${orderNo}`);
}
const getSecretKey = (currency) => {
  return $get(`/api/pay/stripe/pubkey/${currency}`)
}
// 创建订单接口
const createOrder = ({ userId, code, currencyId, rechargeAmount, rechargeType, sgClassId, rechargePackageId, groupId, showState }) => {
  return $post(`/api/finance/recharge/order/${userId}`, { code, currencyId, rechargeAmount, rechargeType, sgClassId, rechargePackageId, groupId, showState });
}

// 获取银行卡支付时 clientSecret 和 key
const clientSecret = ({ channel, orderId, type }) => {
  return $post(`/api/pay/order/payment/${channel}/${orderId}/${type}`)
}

/* 3.6改造充值页面获取优惠列表 */
const getAllCoupon = ({ userId, accountClass, amount }) => {
  return $get(`/api/finance/coupon/code/${userId}/${accountClass}/${amount}`);
}

/* 3.6改造获取银行卡支付结果 */
const getPayResult = ({ paymentId }) => {
  return $get(`/api/pay/order/payment/result/${paymentId}`);
}

/* 3.6改造申请收据 */
const applayOrderReceive = ({ orderId }) => {
  return $get(`/api/order/apply/receipt/${orderId}`);
}

/* 3.6改造根据家长账户id查询标准课时定向课时信息 */
const getAccountLessons = ({ userId }) => {
  return $get(`/api/lesson/count/${userId}`);
}

/* 3.6改造 获取支付成功订单详情 */
const getOrderDetailBySucc = ({ orderId }) => {
  return $get(`/api/order/detail/success/${orderId}`);
}

/* 3.6改造 获取支付结果详情 */
const getOrderPayResultDetail = ({ paymentId, status }) => {
  return $get(`/api/pay/detail/${paymentId}/${status}`);
}

/* 3.6改造 获取顾问信息 */
const getAdviserInfo = ({ userId }) => {
  return $get(`/api/user/userInfo/${userId}`);
}

/* 3.7改造 获取地理位置信息 */
const getLocation = () => {
  return $get('/api/user/potential/country')
}

/* 3.8.0.1改造 获取地理信息 */
const getCountryInfo = () => {
  return $get('/api/common/country')
}

export default {
  consume,
  topup,
  coupon,
  addCoupon,
  currency,
  recharge,
  confirmRecharge,
  addCards,
  getCards,
  pay,
  cardPay,
  aliPay,
  weixinPay,
  observePayStatus,
  getSecretKey,
  confirmRechargeSgClassId,
  confirmRechargePackage,
  confirmRechargeMiniClass,
  createOrder,
  clientSecret,
  getAllCoupon,
  getPayResult,
  applayOrderReceive,
  getAccountLessons,
  getOrderDetailBySucc,
  getOrderPayResultDetail,
  getAdviserInfo,
  getLocation,
  getCountryInfo
}
