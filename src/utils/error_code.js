// GENERATED CODE - DO NOT MODIFY BY HAND
export const errorCodes = {
  10001: ['用户已存在', 'Existed user'],
  10002: ['用户不存在', 'Non-existent user'],
  10003: ['推荐人用户不存在', 'Non-existent user'],
  10004: ['推荐人用户无效', 'Invalid user'],
  10005: ['用户名或密码错误', 'Wrong username or password'],
  10006: ['用户角色错误', 'Wrong user role'],
  10007: ['用户禁止登录', 'Login forbidden'],
  10008: ['验证码错误', 'Wrong verification code'],
  10009: ['家庭中的孩子用户禁止登录', 'Student role users are not allowed to login'],
  10010: ['用户未定级', 'No Chinese level'],
  10011: ['推荐人用户无充值记录', 'Recommender needs to be a recharged user'],
  10019: ['您已经设置了推荐人，首次充值时可享受额外奖励课时', 'You have successfully set up the referral program, bonus classes will be credited to your account once the initial top-up has been made.'],
  10101: ['无可用的合伙人标识码', 'No available ambassador ID'],
  10102: ['合伙人不存在', 'Partner does not exist'],
  10103: ['未查到您的手机号码，请使用其他号码注册','Your mobile number is not found, please register with another number'],
  20001: ['班级不存在', 'Non-existent group'],
  20002: ['用户已经加入了班级', 'The user has joined other group'],
  20003: ['班级已经满员', 'The group is full'],
  20004: ['用户不是该班级成员', 'The user is not a member of this group'],
  20005: ['用户不是班长', 'The user is not owner of this group'],
  20006: ['班级还有成员班长不能退出', 'There are still students in the group, the owner can\'t exit now'],
  20007: ['课前和课后时间太短不能退出', 'There are classes in 2 hours, so you can\'t exit from the group'],
  20008: ['课前和课后时间太短不能变更班长', 'There are classes in 2 hours, so you can\'t transfer the group to others'],
  20009: ['用户不是老师', 'The user is not a teacher'],
  30001: ['上课前两小时不能取消预约', 'Cancellations are not allowed within 2 hours before class'],
  30002: ['发布或者约课时间有冲突', 'There is a conflict'],
  30003: ['发布或者约课时间小于当前时间', 'This time is in the past'],
  30101: ['课堂不存在', 'Non-existent classroom'],
  30102: ['课堂中没有学生', 'No students in this classroom'],
  30103: ['课堂未开始或者已关闭，禁止关闭课堂', 'Classroom has not been started or has been closed'],
  30201: ['学生没有预约了但是未上的课', 'The student has no classes to attend'],
  30202: ['班级没有预约了但是未上的课', 'The group has no classes to attend'],
  30301: ['这节课不存在', 'Non-existent class'],
  30401: ['请勿重复关联', 'Do not duplicate associations'],
  30402: ['未关联相关扩展课件', 'No related extension courseware'],
  30403: ['课堂已开始或者已关闭，禁止关联或取消关联', 'Class has begun or closed, banning or disassociating'],
  40001: ['无效的优惠码', 'Invalid coupon code'],
  40002: ['优惠码已经添加过了', 'The coupon code has been added'],
  40003: ['无效的课时包', 'Invalid package'],
  50001: ['请勿重复提交', 'Please click only once'],
  50002: ['扩展课件不存在', 'Non-existent expanding courseware'],
  60001: ['文件上传失败', 'Failed to upload'],
  200: ['操作成功', 'Successful operation'],
  500: ['操作失败', 'Operation failed'],
  401: ['暂未登录或token已经过期', 'Not logged in or token expired'],
  404: ['参数检验失败', 'Parameter test failed'],
  403: ['没有相关权限', 'No permission'],
  20011: ['您已经预约了一节课，如要预约更多课程请等待课程顾问与您联系', 'You have booked a class, please wait for the course consultant to contact you to book more classes'],
  20012: ['您已经预约了两节课，如要预约更多课程请等待课程顾问与您联系', 'You have booked 2 classes, please wait for the course consultant to contact you to book more classes'],
  20013: ['如要使用多次约课请等待课程顾问与您联系', 'To schedule additional appointments, our course consultants will contact you'],
  40005: ['优惠券不满足使用条件', 'Coupon does not meet the conditions of use'],
  40006: ['优惠券已使用', 'Coupon used'],
  41010: ['订单已关闭，请联系您的课程顾问提供帮助', 'The order has been closed and the payment will be returned within 24 hours'],
  30004: ['账户余额不足', 'Insufficient account balance'],
  // 3.6 新增错误码
  10012: ['用户名不能为空', 'Username cannot be empty'],
  10013: ['该账号已存在，邀请好友试听有机会得赠课', 'This account already exists. Invite friends to trial to get bonus points'],
  10014: ['请输入有效的手机号码','Please enter a valid mobile phone number'],
  10015: ['微信信息获取失败！', 'Failed to obtain WeChat information!'],
  10016: ['推荐人信息为空', 'Referral information is empty'],
  10017: ['您的微信账号已绑定其它账号', 'Your WeChat account is already bound to another account'],
  10018: ['添加学生失败，已达到添加上限！', 'Failed to add students, the limit for adding students has been reached!'],
  20010: ['非新加坡版本用户不能加入新加坡小班', 'Users of non-Singapore version cannot join the Singapore group class'],
  30005: ['未充值学生只可约14天之内的课程', 'You can only take classes within 14 days'],
  30104: ['课堂类型未知', 'Class type unknown'],
  30302: ['这节课未结束', 'This class is not ended'],
  30303: ['提交的评论为空', 'Comment submitted is empty'],
  30404: ['不能提交空的家庭作业', 'Cannot submit empty homework'],
  40004: ['购买课时包次数限制', 'Limit on the number of purchases of course packages'],
  41002: ['订单不存在', 'Order does not exist'],
  41003: ['课时费已经发放，请勿重复操作', 'Class hours have been paid, please do not repeat the operation'],
  41004: ['支付不存在', 'Payment does not exist'],
  41005: ['账户余额不足', 'Insufficient account balance'],
  41006: ['课程价格未指定', 'The course price is not set'],
  41007: ['订单未支付成功', 'The order was not paid successfully'],
  41008: ['您有2笔待支付订单，请前往订单中心继续支付或取消订单后重新下单', 'You have 2 pending orders, please go to the order center to continue the payment or cancel the order and re-order'],
  41009: ['支付金额不一致', 'The payment amount is inconsistent'],
  41010: ['订单已关闭，请联系您的课程顾问提供帮助', 'The order has been closed, please contact your course consultant for assistance'],
  41011: ['本订单状态不能取消！', 'The status of this order cannot be cancelled'],
  41012: ['本订单处于支付中，无法取消', 'This order is in payment and cannot be cancelled'],
}
export default {
  /*
   * 用户已存在
   */
  userExisted: 10001,

  /*
   * 用户不存在
   */
  userNotExist: 10002,

  /*
   * 用户名或密码错误
   */
  userPasswordError: 10005,

  /*
   * 用户禁止登录
   */
  userInvalid: 10006,

  /*
   * 验证码错误
   */
  userVerifyCodeError: 10007,

  /*
   * 班级不存在
   */
  classInfoNotExist: 20001,

  /*
   * 用户已经加入了班级
   */
  classMemberExist: 20002,

  /*
   * 课前和课后时间太短不能退出
   */
  classMemberTimeshortExitForbidden: 20005,

  /*
   * 课前和课后时间太短不能变更班长
   */
  classMemberTimeshortLeaderNoTransfer: 20006,

  /*
   * 用户不是老师
   */
  classMemberNotTutor: 20007,

  /*
   * 上课前两小时不能取消预约
   */
  scheduleNoCancel: 30001,

  /*
   * 发布或者约课时间有冲突
   */
  scheduleTimeConflict: 30002,

  /*
   * 发布或者约课时间小于当前时间
   */
  scheduleTimeBeforeNow: 30003,

  /*
   * 课堂不存在
   */
  classRoomNotExist: 30101,

  /*
   * 课堂中没有学生
   */
  classRoomNotStudent: 30102,

  /*
   * 课堂未开始或者已关闭，禁止关闭课堂
   */
  classRoomNoStop: 30101,

  /*
   * 操作成功
   */
  success: 200,

  /*
   * 操作失败
   */
  failed: 500,

  /*
   * 参数检验失败
   */
  validateFailed: 404,

  /*
   * 暂未登录或token已经过期
   */
  unauthorized: 401,

  /*
  * 您已经预约了一节课，付费后可以预约更多课程
  */
 bookedOneBeforeTopUp: 20011,
  /*
  * 您已经预约了两节课，付费后可以预约更多课程
  */
 bookedTwoBeforeTopUp: 20012,
  /*
  * 付费后可以使用多次约课
  */
 regularAppointAfterTopUp: 20013,

 /*
  *  优惠券不可用
  */
 couponNotOfUse: 40005,
}
