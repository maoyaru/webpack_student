/*
 * 前端本地常量
 */
export default {
  /*
   * dev环境域名
   */
  devBaseUrl: 'https://dev.api.pplingo.com',
  // devBaseUrl : http://192.168.3.100:8080,
  /*
   * stage环境域名
   */
  stageBaseUrl: 'https://stage.api.pplingo.com',
  /*
   * product环境域名
   */
  prodBaseUrl: 'https://api.pplingo.com',
  /*
   * 密码长度最小值
   */
  passwordLengthMin: 6,
  /*
   * 密码长度最大值
   */
  passwordLengthMax: 16,
  /*
   * 1天时间
   */
  oneDay: 1,
  /*
   * 1周时间
   */
  oneWeek: 7,
  /*
   * 历史课堂请求显示个数
   */
  historyClassPageNum: 10,
  /*
   * 首页即将要上的课请求显示个数 
   */
  scheduleClassRecordPageNum: 3,
  /*
   * 开课前可以进入课堂的时间，15分钟
   */
  fiveMinutesBeforeClass: 15,
  /*
   * 开课前12小时倒计时
   */
  fiveHoursBeforeClass: 12,
  /*
   * 约课最长间隔3个月
   */
  threeMonth: 3,
  /*
   * 教师主页，点击预占课程跳转页面取消约课
   */
  cancelReservationClass: 5,
  /*
   * dev声网学生身份
   */
  devAgoraStudent: 3563,
  /*
   * dev声网教师身份
   */
  devAgoraTeacher: 3561,
  /*
   * dev声网video APP_ID
   */
  devAgoraVideoAppId: '973fa82dd6e9476ebf597ae2b8245a27',
  /*
   * dev声网whiteboard APP_ID
   */
  devAgoraWhiteboardAppId: '339fbcf5e166448cab9593c741398507',
  /*
   * dev声网APP_certificate_ID
   */
  devAgoraWhiteboardCertificateId: '9bbbd62e0b344a458dbc8c73afa0f290',

  langEn: 'en',
  langZh: 'zh',
  /**
   * 历史课每页显示条数
   */
  historyPageSize: 10,
  /**
   * 小班课每页显示条数
   */
  smallGroupPageSize: 10,
  /* 公用常规页size */
  pageSize: 10,
  /**小班内的最大人数 */
  groupMaxStudent: 4,
  /* 新加坡元 */
  currencySingapore: 'SGD',
  /* 美元 */
  currencyAmerican: 'USD',
  /* 添加一个孩子奖励的课时数 */
  addStudentBounous: 1,
  /* 添加的前几个孩子有奖励 */
  addStudentNumWithBounous: 2,
  /*支付轮询过期此时*/
  payTimesTimeout: 60,
  /* 限制12小时以内不能约课 */
  bookTimeLimit: process.env.bookTimeLimit,
  /* 订单已关闭 */
  orderStatusClose: 7
}
