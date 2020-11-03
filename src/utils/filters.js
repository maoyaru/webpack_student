import datetime from './datetime_utils';
import ApiConstants from '@/utils/api_constants' // api公共常量量
import Constants from '@/utils/constants' // 本地常量
import { getLang } from '@/common/js/store'
import DateTimeUtils from '@/utils/datetime_utils'
import i18n from '@/locales'
import Vue from 'vue'
const validVue = Vue.extend({ i18n });

export const filters = [
  // {
  //  name: 'gender',
  //  fun: (value) => {
  //    if (!value) return ''
  //    let val = '';
  //    switch(value) {
  //      case ApiConstants.userGenderFemale: {
  //        val = '男';
  //        break;
  //      }
  //      case ApiConstants.userGenderMale: {
  //        val = '女';
  //        break;
  //      }
  //      case ApiConstants.userGenderUnknown: {
  //        val = '未知';
  //        break;
  //      }
  //      default: {
  //        val = '未知';
  //      }
  //    }
  //    return val;
  //  }
  // },
  // {
  //  name: 'age',
  //  fun: (value) => {
  //    if (!value) return ''
  //    let val = datetime.getMinusYear(value);
  //    return parseInt(val);
  //  }
  // },
  // {
  //  name: 'getReason', //异常原因
  //  fun: (reason) => {
  //    let reasonStr = '';
  //    switch(reason) {
  //      case ApiConstants.classEndStuEquipmentAbnormal: {
  //        reasonStr = '学生设备或网络故障';
  //        break;
  //      }
  //      case ApiConstants.classEndtutorEquipmentAbnormal: {
  //        reasonStr = '老师设备或网络故障';
  //        break;
  //      }
  //      case ApiConstants.classEndStuAbsent: {
  //        reasonStr = '学生缺席';
  //        break;
  //      }
  //      default: {
  //        reasonStr = '其他原因';
  //        break;
  //      }
  //    }
  //    return reasonStr;
  //  }
  // },
  {
    name: 'date',
    fun(d, format = 'YYYY-MM-DD') {
      if (!d) return '';
      if (!moment.isMoment(d)) {
        d = moment(d);
      }
      return d.format(format);
    }
  },
  {
    name: 'setExperience',
    fun: (value) => {
      let utc = value;
      let y = DateTimeUtils.getMinusYear(utc);
      let str = new validVue().$t("years or more teaching experience");
      let str2 = new validVue().$t("years teaching experience");
      let str3 = new validVue().$t("Less than");
      let str4 = new validVue().$t("year");
      switch (true) {
        case y < 1:
          {
            return str3 + " 1 " + str4;
          }
        case y < 3 && y >= 1:
          {
            return "1-3 " + str2;
          }
        case y < 8 && y >= 5:
          {
            return "5-8 " + str2;
          }
        case y < 10 && y >= 8:
          {
            return "8-10 " + str2;
          }
        case y >= 10:
          {
            return "10 " + str;
          }
        default:
          {
            return "";
          }
      }
    }
  },
  {
    name: 'dollarInteger',
    fun: (value) => {
      return parseInt(value);
    }
  },
  {
    name: 'dollarDecimal',
    fun: (value) => {
      let a = String(value).split('.');
      if (!a[1]) {
        return '00';
      } else {
        if (a[1].length == 1) {
          return `0${a[1]}`;
        } else {
          return String(a[1]).substring(0, 2);
        }
      }
    }
  },
  {
    name: 'levelTitle',
    fun: (value) => {
      let editionLevel = 'Chinese';
      switch (value) {
        case ApiConstants.courseEditionNn:
          {
            editionLevel = "Advanced Chinese";
            break;
          }
        case ApiConstants.courseEditionIn:
          {
            editionLevel = "International Chinese";
            break;
          }
        case ApiConstants.courseEditionSg:
          {
            editionLevel = "SG Chinese";
            break;
          }
        case ApiConstants.courseEditionBLNA:
          {
            editionLevel = "BLNA Chinese";
            break;
          }
        case ApiConstants.courseEditionWrite:
          {
            editionLevel = "Write Chinese";
            break;
          }
        case ApiConstants.courseAdvancedGroup:
          {
            editionLevel = "Advanced Group";
            break;
          }
        case ApiConstants.courseNewInternationalGroup:
          {
            editionLevel = "New International Group";
            break;
          }
        case ApiConstants.courseInternationalGroup:
          {
            editionLevel = "International Group";
            break;
          }
        case ApiConstants.courseNewAdvanced:
          {
            editionLevel = "New Advanced";
            break;
          }
        case ApiConstants.courseKidsEdition:
          {
            editionLevel = "Kids Edition";
            break;
          }
        default:
          {
            editionLevel = "Chinese";
          }
      }
      return editionLevel;
    }
  },
  {
    name: 'courseLevelShowFilter',
    fun: (value) => {
      if (value == 7) {
        return '5h';
      } else if (value == 8) {
        return '6h';
      } else {
        return value;
      }
    }
  },
  {
    name: 'orderCreateDateToFilter',
    fun: (value) => {
      let zhWeek = null
      let enWeek = null
      let week = moment(value).day()
      if (week == 1) {
        zhWeek = '周一'
        enWeek = 'MON'
      } else if (week == 2) {
        zhWeek = '周二'
        enWeek = 'TUE'
      } else if (week == 3) {
        zhWeek = '周三'
        enWeek = 'WED'
      } else if (week == 4) {
        zhWeek = '周四'
        enWeek = 'THU'
      } else if (week == 5) {
        zhWeek = '周五'
        enWeek = 'FRI'
      } else if (week == 6) {
        zhWeek = '周六'
        enWeek = 'SAT'
      } else if (week == 0) {
        zhWeek = '周日'
        enWeek = 'SUN'
      }
      let weekResult = i18n.locale == 'en' ? enWeek : zhWeek
      return `${moment(value).format('YYYY-MM-DD')} (${weekResult}) ${moment(value).format('HH:mm')}`
    }
  },
  {
    name: 'classtime',
    fun: ({ value, lang }) => {
      if (!value) return '';
      // 12 Jan 13:00-13:55 (Sun)
      let res = '';
      let valArr = value.split('$$');
      let startDate = new Date(valArr[0]),
        endDate = new Date(valArr[1]),
        startMonth = startDate.getMonth() * 1 + 1,
        startDay = startDate.getDate(),
        startWeek = week[lang][startDate.getDay()],
        startHour = startDate.getHours(),
        startMins = startDate.getMinutes(),
        endHour = endDate.getHours(),
        endMins = endDate.getMinutes();
      startHour = startHour > 9 ? startHour : '0' + startHour;
      startMins = startMins > 9 ? startMins : '0' + startMins;
      endHour = endHour > 9 ? endHour : '0' + endHour;
      endMins = endMins > 9 ? endMins : '0' + endMins;
      if (lang == 'en') {
        startMonth = month[lang][startMonth - 1];
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
    }
  },
  {
    name: 'filterInterge',
    fun: (val) => {
      let tempArr = String(Number(val).toFixed(2)).split('.')
      return tempArr[0]
    }
  },
  {
    name: 'filterDollarDecimal',
    fun: (val) => {
      let tempArr = String(Number(val).toFixed(2)).split('.')
      return tempArr[1]
    }
  },
  {
    name: 'videoTime',
    fun: (val) => {
      if (val) {
        const length = Number(val)
        let 
          hour = Math.floor(length / 3600),
          minute = Math.floor((length - hour * 3600) / 60),
          sec = length - (hour * 3600 + minute * 60)

          minute = minute.toString().padStart(2, 0)
          sec = sec.toString().padStart(2, 0)
        if (hour > 0) {
          hour = hour.toString().padStart(2, 0)
          return `${hour} : ${minute} : ${sec}`
        } else {
          return `${minute} : ${sec}`
        }
      } else {
        return ''
      }
    }
  }
];
