export default {
  /*
   * 语言 
   */
  localeLanguage: window.localStorage.localeLanguage,
  /*
   * 月份名称中英文
   */
  _monthNameEn: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  _monthNameZh: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  /*
   * 月份名称英文全称
   */
  _monthFullNameEn: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  /*
   * 星期名称中英文
   */
  _weekdayNameEn: ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
  _weekdayNameZh: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],

  /*
   * 星期名称中英文
   */
  _weekdayNameEn2: ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'],
  _weekdayNameZh2: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],

  week: {
    en: ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'],
    zh: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  },
  month: {
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    zh: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  },
  getLang() {
    return window.localStorage.getItem('localeLanguage');
  },
  /*
   * 当前本地时间
   */
  now() {
    return new Date()
  },
  // /*
  //  * 本周一最早时间
  //  */
  // mondayFirst = () => _mondayFirst(),
  // /*
  //  * 本周一最晚时间
  //  */
  // mondayLast = () => _mondayLast(),
  // /*
  //  * 本周日最早时间
  //  */
  // sundayFirst = () => _sundayFirst(),
  // /*
  //  * 本周日最晚时间
  //  */
  // sundayLast = () => _sundayLast(),
  /*
   * 每个月的天数 
   */
  daysPerMonth(year, month) {
    return (month == 1) ? (year % 4 == 0 ? 29 : 28) : ((month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11) ? 31 : 30)
  },
  daysPerMonthTime(date) {
    return this.daysPerMonth(date.getFullYear(), date.getMonth())
  },
  /*
   * 每天最早时间
   */
  dayFirst(date) {
    date = date || new Date();
    date.setHours(0, 0, 0, 0);
    return date
    // return new Date(date.toLocaleDateString())
  },
  // dayFirst(date) {
  //   return date.subtract(Duration(hours: date.hour, minutes: date.minute, seconds: date.second, milliseconds: date.millisecond, microseconds: date.microsecond)),
  // }

  /*
   * 每天最晚时间
   */
  dayLast(date) {
    date = date || new Date();
    date.setHours(23, 59, 59, 999);
    return date
    // return new Date(new Date(date.toLocaleDateString()).getTime()+24*60*60*1000-1)
  },
  // dayLast(date) {
  //   return date.add(Duration(hours: (23-date.hour), minutes: (59-date.minute), seconds: (59-date.second), milliseconds: (999-date.millisecond), microseconds: (999-date.microsecond))),
  // }
  /*
   * 每月最早时间
   */
  monthFirst(date) {
    return this.dayFirst(new Date(date.getFullYear(), date.getMonth(), 1))
  },
  /*
   * 每月最晚时间
   */
  monthLast(date) {
    return this.dayLast(new Date(date.getFullYear(), date.getMonth(), this.daysPerMonthTime(date)))
  },
  /*
   * 月份名称
   */
  monthName(month) {
    return this.localeLanguage === 'zh' ? this._monthNameZh[month] : this._monthNameEn[month]
  },
  // /*
  //  * 月份全称
  //  */
  // static String monthFullName(int month) {
  //   return Application.isPreferZh?_monthNameZh[month-1]:_monthFullNameEn[month-1],
  // }
  /*
   * 星期名称
   */
  weekName(weekday) {
    return this.localeLanguage === 'zh' ? this._weekdayNameZh[weekday == 0 ? 6 : weekday - 1] : this._weekdayNameEn[weekday == 0 ? 6 : weekday - 1]
  },
  /*
   * 课堂上课时间
   */
  classTime(startTime, endTime) {
    startTime = new Date(startTime)
    endTime = new Date(endTime)
    return `${startTime.getDate()} ${this.monthName(startTime.getMonth())} ${startTime.getHours()<10?'0':''}${startTime.getHours()}:${startTime.getMinutes()<10?'0':''}${startTime.getMinutes()}-${endTime.getHours()<10?'0':''}${endTime.getHours()}:${endTime.getMinutes()<10?'0':''}${endTime.getMinutes()} (${this.weekName(startTime.getDay())})`
  },
  /*
   * 日历页上课时间
   */
  classTimeInScheduleTable(startTime, endTime) {
    startTime = new Date(startTime)
    endTime = new Date(endTime)
    return `${startTime.getHours()<10?'0':''}${startTime.getHours()}:${startTime.getMinutes()<10?'0':''}${startTime.getMinutes()}-${endTime.getHours()<10?'0':''}${endTime.getHours()}:${endTime.getMinutes()<10?'0':''}${endTime.getMinutes()}`
  },
  /*
   * 转成最少两位数字显示方式
   */
  getTwoDigit(digit) {
    return `${digit<=9?'0':''}${digit}`
  },
  /*
   * 多次约课或取消的日期格式 xxxx-xx-xx 例如：2019-09-01
   */
  scheduleTime(utc) {
    let date = new Date(utc);
    // let locale = date.toLocaleDateString();
    locale = this.formartDate(date, 'yyyy-MM-dd');
    return locale;
  },
  /**
   * 转成 2019-08-01 16:15 这种格式
   */
  dateClockTime(utc) {
    let date = new Date(utc);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    let H = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    let Mi = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    let S = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    let tempDate = Y + M + D + H + Mi + S;
    return tempDate
  },

  /**
   * 获取到本地日期对象
   */
  getLocalDate(utc) {
    let date = new Date(utc);
    return date;
  },

  /**
   * 获取两个年份的差值
   */
  getMinusYear(utc) {
    let end = new Date();
    let start = this.getLocalDate(utc);
    if (start.getTime() > end.getTime()) {
      let temp = start;
      start = end;
      end = temp;
    }
    let yearStart = start.getFullYear() * 1;
    let yearEnd = end.getFullYear() * 1;
    let year = yearEnd - yearStart;
    let month;
    let monthStart = start.getMonth() * 1 + 1;
    let monthEnd = end.getMonth() * 1 + 1;
    if (monthEnd < monthStart) {
      month = monthStart - monthEnd;
    } else {
      month = (monthStart - monthEnd) * -1
    }
    year = year + month / 12;
    return year.toFixed(2);
  },
  formartDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }

    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'w+': this.week[this.getLang()][date.getDay()]
    };

    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + '';
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : this.padLeftZero(str));
      }
    }
    return fmt;
  },
  padLeftZero(str) {
    return ('00' + str).substr(str.length);
  },
  formartDateFromUTC(utc, fmt) {
    let self = this;
    return self.formartDate(self.getLocalDate(utc), fmt);
  },
  addDay(date, days) {
    date = new Date(date);
    let d = date.getDate();
    let dPlus = d * 1 + days * 1;
    date.setDate(dPlus)
    return date;
  },
  getTimeZone() {
    let date = (new Date()).toString().substring(28);
    let arr = date.split('(');
    let times = arr[0].replace(' ', '');
    let time = times.substring(0, 3) + times.substring(3)
    // return arr[1].replace(')',' ') + time;
    return time
  },
  getClasstime({ value, lang }) {
    if (!value) return '';
    // 12 Jan 13:00-13:55 (Sun)
    let res = '';
    let valArr = value.split('$$');
    let startDate = new Date(valArr[0]),
      endDate = new Date(valArr[1]),
      startMonth = startDate.getMonth() * 1 + 1,
      startDay = startDate.getDate(),
      startWeek = this.week[lang][startDate.getDay()],
      startHour = startDate.getHours(),
      startMins = startDate.getMinutes(),
      endHour = endDate.getHours(),
      endMins = endDate.getMinutes();
    startHour = startHour > 9 ? startHour : '0' + startHour;
    startMins = startMins > 9 ? startMins : '0' + startMins;
    endHour = endHour > 9 ? endHour : '0' + endHour;
    endMins = endMins > 9 ? endMins : '0' + endMins;
    if (lang == 'en') {
      startMonth = this.month[lang][startMonth - 1];
      // 英文版处理
      res = startDay + ' ' + startMonth + ' ' +
        startHour + ':' + startMins +
        '-' + endHour + ':' + endMins +
        '(' + startWeek + ')';
    } else {
      // 中文版处理
      res = startMonth + '月' + startDay + '日' + ' ' +
        startHour + ':' + startMins +
        '-' + endHour + ':' + endMins +
        '(' + startWeek + ')';
    }
    return res;
  },
  getClasstimeMore(start, end) {
    let sh = this.formartDateFromUTC(start, 'hh:mm');
    let eh = this.formartDateFromUTC(end, 'hh:mm');
    return sh + '-' + eh;
  }
  // /*
  // * 充值的日期格式 xxxx-xx-xx xx:xx:xx 例如：2019-09-01 15:03:24
  // */
  // static String topUpTime(DateTime dateTime) {
  //   return '${dateTime.year}-${getTwoDigit(dateTime.month)}-${getTwoDigit(dateTime.day)} ${getTwoDigit(dateTime.hour)}:${getTwoDigit(dateTime.minute)}:${getTwoDigit(dateTime.second)}',
  // }
  // /*
  //  * 本周一最早本地时间
  //  */
  // static DateTime _mondayFirst() {
  //   DateTime now = DateTime.now(),
  //   return dayFirst(now.subtract(Duration(days: now.weekday-1))),
  // }
  // /*
  //  * 本周一最晚本地时间
  //  */
  // static DateTime _mondayLast() {
  //   DateTime now = DateTime.now(),
  //   return dayLast(now.subtract(Duration(days: now.weekday-1))),
  // }
  // /*
  //  * 本周日最早本地时间
  //  */
  // static DateTime _sundayFirst() {
  //   DateTime now = DateTime.now(),
  //   return dayFirst(now.add(Duration(days: 7-now.weekday))),
  // }
  // /*
  //  * 本周日最晚本地时间
  //  */
  // static DateTime _sundayLast() {
  //   DateTime now = DateTime.now(),
  //   return dayLast(now.add(Duration(days: 7-now.weekday))),
  // }
}
