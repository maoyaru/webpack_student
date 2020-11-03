<template>
  <div v-loading="loading || loadingBrief" element-loading-spinner="custom-loading">
    <!-- <ul class="topbar">
      <li class="tl" @click="lastWeek()">
        <i class="el-icon-arrow-left"></i>{{$t("LAST WEEK")}}
      </li>
      <li>{{$t("All times listed are in your local timezone")}}</li>
      <li class="tr" @click="nextWeek()">
        {{$t("NEXT WEEK")}}
        <i class="el-icon-arrow-right"></i>
      </li>
    </ul> -->
    <div class="fix f14 c-classcard-header">
      <a href="javascript:;" class="fl c-oper-week" @click="lastWeek()">
        <i class="el-icon-arrow-left"></i>{{$t("LAST WEEK")}}
      </a>
      <div class="f20 c-classcard-title">{{$t("All times listed are in your local timezone")}}</div>
      <a href="javascript:;" class="fr c-oper-week" @click="nextWeek()">
        {{$t("NEXT WEEK")}}<i class="el-icon-arrow-right"></i>
      </a>
    </div>
    <div class="classcard">
      <dl class="weeek-ctl">
        <dt>{{$t("TIME")}}</dt>
        <dd v-for="(item,key) in list" :key="key">
          <div class="week">
            <template v-if="today == item.day">{{$t('Today')}}</template>
            <template v-else>
              {{$i18n.locale == 'en' ? DateTimeUtils._weekdayNameEn2[item.week] : DateTimeUtils._weekdayNameZh2[item.week]}}
            </template>
          </div>
          <div class="day">{{item.day}}</div>
        </dd>
      </dl>
      <div class="m-scroll" style="overflow: scroll;" v-class-card-scroll-screen>
        <dl class="day-ctl" v-for="(item,key) in datas[week]" :key="key">
          <dt>{{item.key}}</dt>
          <dd
            v-for="(day,dkey) in item.days"
            :class="day.active ? day.flag + ' ' + day.active : day.flag"
            @click="selectDay(day, key, dkey)"
            :key="dkey"
          >{{day.type ? $t(day.type) : ""}}</dd>
        </dl>
      </div>
      <div v-if="time.startTime">
        <SDialog @close="closeBookDialog" :isOpen="isOpen" :time="time" :only="only" :gt="bigThan5" :booked="booked" @book="book" :loading="loadingSubcribe"></SDialog>
        <CancelDialog @close="isOpenCancel = false" :isOpenCancel="isOpenCancel" :time="time" :only="only" @book="book" :loading="loadingSubcribe"></CancelDialog>
      </div>
      <AlertDialog @close="alertShow = false" @book="book" :isOpen="alertShow" @click="alertShow = false"></AlertDialog>
      <topUp @closeTopUp="topUpShow = false" :isOpen="topUpShow"></topUp>
      <tipDialog @close="tipShow = false" :isOpen="tipShow" :tip="tips"></tipDialog>
      <successSubcribeDialog @close="successShow = false" :isOpen="successShow" :message="message"></successSubcribeDialog>
    </div>
  </div>
</template>

<script>
import SDialog from "./sDialog";
import CancelDialog from "./cancelDialog";
import AlertDialog from "./alertDialog";
import topUp from "./topUpDialog";
import tipDialog from "./tipDialog";
import successSubcribeDialog from './successSubcribeDialog'
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  created() {
    this.group = this.$route.query.group
  },
  mounted() {
    let _currDate = new Date();
    let week = -1 * _currDate.getDay();
    if(week == 0) {
      week = -7;
    }
    this.monDate = this.DateTimeUtils.addDay(_currDate, week);
  },
  data() {
    //这里存放数据
    return {
      loading: false,
      loadingSubcribe: false,
      today: this.DateTimeUtils.formartDate(new Date(), "yyyy-MM-dd"),
      monDate: new Date(),
      currentDate: new Date(),
      time: {},
      isOpen: false,
      isOpenCancel: false,
      alertShow: false,
      topUpShow: false,
      tipShow: false,
      successShow: false,
      message: '',
      only: false,
      booked: false,  //是否已经约过试听课
      bigThan5:false,
      week: 0,
      key:'',
      dkey:'',
      list: [
        { day: 1, week: 1},
        { day: 2, week: 2},
        { day: 3, week: 3},
        { day: 4, week: 4},
        { day: 5, week: 5},
        { day: 6, week: 6},
        { day: 7, week: 0}
      ],
      reference:[],
      datas: {},
      group: '',
      bookItems: [],
      loadingBrief: false
    };
  },
  props: {
    teacherId: {
      default:''
    },
    studentId: {
      default: ''
    }
  },
  //监听属性 类似于data概念
  computed: {
    tips() {
      return this.$t('Only the owner of the group can cancel this class.');
    },
    point(){
      return this.user.userParentInfo.balance;
    },
    bonus(){
      return this.user.userParentInfo.bonusBalance;
    },
    ...mapGetters({
      user: "user/getUserInfo",
      classIds: "student/getClassIds",
      memberRole: "student/getMemberRole",
      currentStudent: 'student/getCurrentStudent',
      studentBriefInfo: 'user/getStudentBriefInfo',
      joinedClass: "student/getJoinedClassList"
    })
  },
  //监控data中的数据变化
  watch: {
    monDate() {
      if(this.monDate && this.classIds.is) {
        this.initCanlender();
      }
    },
    classIds() {
      if(this.monDate && this.classIds.is) {
        this.initCanlender();
      }
    },
    currentStudent(val) {
      if(val) {
        this.loadingBrief = true;
        let parentUserId = this.user.userParentInfo.id,
            studentUserId = val.id;
        this.getBriefClassInfo({parentUserId, studentUserId}).then(() => {
          this.loadingBrief = false;
        }, () => {
          this.loadingBrief = false;
        });
      }
    }
  },
  //方法集合
  methods: {
    ...mapActions({
      'getBriefClassInfo': 'user/getBriefClassInfoAction'
    }),
    ...mapMutations({
      'setStudentBriefInfo': 'user/setStudentBriefInfo'
    }),
    closeBookDialog() {
      this.isOpen = false;
      let item = this.datas[this.week][this.key].days[this.dkey];
      item.active = '';
    },
    lastWeek() {
      this.week -= 1;
      this.monDate = this.DateTimeUtils.addDay(this.monDate, -7);
      this.$forceUpdate();
    },
    nextWeek() {
      this.week += 1;
      this.monDate = this.DateTimeUtils.addDay(this.monDate, 7);
    },
    selectDay(day, key, dkey) {
      this.key = key;
      this.dkey = dkey;
      this.time = day;
      if (day.flag == "enable") {
        // 没有余额不能约课
        if(this.point*1 + this.bonus*1 <= 0) {
          this.topUpShow = true;
          return;
        }else if(this.point == 0 && this.bonus <= this.Constants.addStudentBounous * this.Constants.addStudentNumWithBounous) {
          // console.log(this.studentBriefInfo.completedClassNum, this.studentBriefInfo.firstCourse,this.studentBriefInfo.upcomingClassNum)
          // 只有一节或者两试听课
          if(this.studentBriefInfo.completedClassNum == 0 && this.studentBriefInfo.firstCourse == 1) {
            // 是试听课 即将上的课时0 已完成的课时0
            if(this.studentBriefInfo.upcomingClassNum == 0) {
              this.only = true;
              this.booked = false;
            }else {
              // 要求先听完试听课
              this.only = true;
              this.booked = true;
            }
          }else {
            if(this.point*1 + this.bonus*1 < 5) {
              this.bigThan5 = false;
            }else {
              this.bigThan5 = true;
            }
          }        
        }else {
          if(this.point*1 + this.bonus*1 < 5) {
            this.bigThan5 = false;
          }else {
            this.bigThan5 = true;
          }
        }
        day.active = 'active';
        this.isOpen = true;
      } else if (day.flag == "reserve") {
        this.alertShow = true;
      } else if (day.flag == 'booked') {
        this.isOpenCancel = true;
      } else if (day.flag == 'reserve group') {
        // 自己班级的小班课预占
        if(this.joinedClass.some((classItem) => classItem.classroomClassInfo.id == day.find.classId)) {
          this.$message({
            message: this.$t(
              "can not cancel group class"
            )
          });
        }else {
          this.tipShow = true;
        }
      } else if (day.flag == 'booked group') {
        // 自己班级的小班课
        if(this.joinedClass.some((classItem) => classItem.classroomClassInfo.id == day.find.classId)) {
          this.$message({
            message: this.$t(
              "can not cancel group class"
            )
          });
        }else {
          this.tipShow = true;
        }
      }
      // console.log(this.memberRole, this.ApiConstants.classMemberRoleLeader)
    },
    closeWin(flag) {
      this.isOpen = false;
    },
    /**
     * @Author   Yaodongxin
     * @DateTime 2019-12-10
     * @method   initCanlender  初始化课表二维表
     */
    initCanlender(){
      let self = this;
      let days, days2;
      this.weekCtlInit();
      // if(self.datas[self.week] && self.datas[self.week].length > 0) {
        // return;
      // }else {
        self.datas[self.week] = [];
      // }
      for(let i = 7; i <= 23; i++) {
        days = {}, days2 = {};
        for(let j = 1; j < 8; j++) {
          let startTime = self.setInitTime(self.DateTimeUtils.addDay(self.monDate, j), i, 0),
              endTime = self.setInitTime(self.DateTimeUtils.addDay(self.monDate, j), i, 55),
              startTime2 = self.setInitTime(self.DateTimeUtils.addDay(self.monDate, j), i, 30),
              endTime2 = self.setInitTime(self.DateTimeUtils.addDay(self.monDate, j), i+1, 25);
          days[j] = {
            flag: "disable",
            time: self.DateTimeUtils.addDay(self.monDate, 1),
            startTime,
            endTime,
            startTimeUTC: startTime.toISOString(),
            endTimeUTC: endTime.toISOString()
          }
          days2[j] = {
            flag: "disable",
            time: self.DateTimeUtils.addDay(self.monDate, 1),
            startTime: startTime2,
            endTime: endTime2,
            startTimeUTC: startTime2.toISOString(),
            endTimeUTC: endTime2.toISOString()
          }
        }
        let data = {
          key: i+':00 - '+i+':55',
          days:days
        },
        data2 = {
          key: i+':30 - '+(i+1)+':25',
          days:days2
        };
        this.datas[self.week].push(data);
        if(i+1 < 24)
        this.datas[self.week].push(data2);
      }
      this.tutorTimetable(self.week);
    },
    weekCtlInit() {
      this.list.forEach((item, index) => {
        item.time = this.DateTimeUtils.addDay(this.monDate, index + 1);
        item.day = this.DateTimeUtils.formartDate(item.time, "yyyy-MM-dd");
      });
    },
    /**
     * @Author   Yaodongxin
     * @DateTime 2019-12-10
     * @method   bodyCtlInit  为课表添加状态
     */
    bodyCtlInit(week) {
      let self = this;
      self.bookItems = [];
      self.datas[week].forEach((item, index) => {
        for (let day in item.days) {
          // 规定只能约12小时以后的课
          item.days[day].active = "";
          let find = self.findTutorTime(item.days[day].startTimeUTC, item.days[day].endTimeUTC);
          item.days[day].find = find;
          if (item.days[day].startTime.getTime() - (self.Constants.bookTimeLimit*3600*1000)< self.currentDate.getTime() ) {
            item.days[day].flag = "disable";
            item.days[day].type = "";
            switch(find.status){
              // 已预约未发布
              case this.ApiConstants.scheduleStatusSubscribe: {
                if(find.classTypeId == this.ApiConstants.classType1v1) {
                  // 1v1 自己预占
                  if(find.studentUserId == self.studentId) {
                    item.days[day].type = "ONE-ON-ONE";
                  }else {
                    // 别人预占
                    item.days[day].type = "OTHER";
                  }
                }else if(find.classTypeId == this.ApiConstants.classTypeSmallclass){
                  // 小班课 自己所在班级
                  if(this.joinedClass.some((classItem) => classItem.classroomClassInfo.id == find.classId)){
                    // 小班课
                    item.days[day].type = "GROUP";
                  }else {
                    item.days[day].type = "OTHER";
                  }
                }
                self.setDisable(index, day);
                break;
              }
              // 自己已经约课
              case this.ApiConstants.scheduleStudentSubscribe: {
                if(find.classTypeId == this.ApiConstants.classType1v1) {
                  // 1v1 自己预占
                  if(find.studentUserId == self.studentId) {
                    item.days[day].type = "ONE-ON-ONE";
                  }else {
                    // 别人预占
                    item.days[day].type = "OTHER";
                  }
                }else if(find.classTypeId == this.ApiConstants.classTypeSmallclass){
                  // 小班课 自己所在班级
                  if(this.joinedClass.some((classItem) => classItem.classroomClassInfo.id == find.classId)){
                    // 小班课
                    item.days[day].type = "GROUP";
                  }else {
                    item.days[day].type = "OTHER";
                  }
                }
                self.setDisable(index, day);
                break;
              }
            }
          } else {
            item.days[day].type = "";
            item.days[day].flag = "disable";
            if(find){
              switch(find.status){
                // 取消
                case this.ApiConstants.scheduleStatusCancel: {
                  item.days[day].flag = "disable";
                  break;
                }
                // 已发布未预约
                case this.ApiConstants.scheduleStatusPublish: {
                  item.days[day].flag = "enable";
                  break;
                }
                // 已预约未发布
                case this.ApiConstants.scheduleStatusSubscribe: {
                  item.days[day].flag = "reserve";
                  if(find.classTypeId == this.ApiConstants.classType1v1) {
                    // 1v1 自己预占
                    if(find.studentUserId == self.studentId) {
                      item.days[day].type = "ONE-ON-ONE";
                    }else {
                      // 别人预占
                      item.days[day].flag += ' disable';
                      item.days[day].type = "OTHER";
                    }
                  }else if(find.classTypeId == this.ApiConstants.classTypeSmallclass){
                    // 小班课 自己所在班级
                    if(this.joinedClass.some((classItem) => classItem.classroomClassInfo.id == find.classId)){
                      // 小班课
                      item.days[day].flag += ' group';
                      item.days[day].type = "GROUP";
                    }else {
                      item.days[day].flag += ' disable';
                      item.days[day].type = "OTHER";
                    }
                  }
                  self.setDisable(index, day);
                  // item.days[day].type = this.$t("RESERVE");
                  break;
                }
                // 自己已经约课
                case this.ApiConstants.scheduleStudentSubscribe: {
                  item.days[day].flag = "booked";
                  if(find.classTypeId == this.ApiConstants.classType1v1) {
                    // 1v1 自己预占
                    if(find.studentUserId == self.studentId) {
                      item.days[day].type = "ONE-ON-ONE";
                    }else {
                      // 别人预占
                      item.days[day].flag += ' disable';
                      item.days[day].type = "OTHER";
                    }
                    // item.days[day].type = this.$t("ONE-ON-ONE");
                  }else if(find.classTypeId == this.ApiConstants.classTypeSmallclass){
                    // 小班课 自己所在班级
                    if(this.joinedClass.some((classItem) => classItem.classroomClassInfo.id == find.classId)){
                      // 小班课
                      item.days[day].flag += ' group';
                      item.days[day].type = "GROUP";
                    }else {
                      item.days[day].flag += ' disable';
                      item.days[day].type = "OTHER";
                    }
                    // item.days[day].type = this.$t("GROUP")
                  }
                  self.setDisable(index, day);
                  break;
                }
              }
            }
          }
        }
      });
      self.setDisableItems();
      self.$forceUpdate();
    },
    setDisable(key, skey) {
      this.bookItems.push({
        key: key,
        skey: skey
      })
    },
    /**
     * @Author   Yaodongxin
     * @DateTime 2019-12-31
     * @method   setDisableItems  学生不能连续约课
     */
    setDisableItems() {
      for(let i = 0; i < this.bookItems.length; i++) {
        let key = this.bookItems[i].key * 1;
        let skey = this.bookItems[i].skey * 1;
        let prev, next;
        let hasDisable;
        // console.log(key, skey)
        if(key + 1 <= this.datas[this.week].length - 1) {
          prev = this.datas[this.week][key + 1].days[skey];
          hasDisable = prev.flag.indexOf('disable');
          if(hasDisable == -1) {
            prev.flag += ' disable'
          }
        }
        if(key - 1 >= 0) {
          next = this.datas[this.week][key - 1].days[skey];
          hasDisable = next.flag.indexOf('disable');
          if(hasDisable == -1) {
            next.flag += ' disable'
          }
        }
      }
    },
    /**
     * @Author   Yaodongxin
     * @DateTime 2019-12-09
     * @method   setInitTime      初始化每个课程时间的开始和结束时间信息
     * @param    {object}   item  课程对象(记录状态和时间)
     */
    setInitTime(date, h = 0, m = 0){
      date.setHours(h);
      date.setMinutes(m);
      date.setSeconds(0);
      date.setMilliseconds(0);
      return date;
    },
    /**
     * @Author    Yaodongxin
     * @DateTime  2019-12-09
     * @method    findTutorTime   找出有状态的课程时间
     * @param     {string}        s 开始时间，utc时间字符串
     * @param     {string}        e 结束时间，utc时间字符串
     * @return    {object}        找到的时间
     */
    findTutorTime(s, e) {
      for(let i = 0, len = this.reference.length; i < len; i++) {
        if(s == this.reference[i].startTime && e == this.reference[i].endTime){
          return this.reference[i];
        }
      }
      return false;
    },
    async tutorTimetable(week) {
      this.loading = true;
      let start = new Date(this.monDate.getTime() + 1000 * 60 * 60 * 24),
          end  = new Date(this.monDate.getTime() + 1000 * 60 * 60 * 24 * 8);
          start.setSeconds(0);
          start.setMilliseconds(0);
          start.setHours(0);
          start.setMinutes(0);

          end.setHours(0);
          end.setMinutes(0);
          end.setSeconds(0);
          end.setMilliseconds(0);
      let startUTC = start.toISOString(),
          endUTC =  end.toISOString();
      this.$api.schedule.tutorTimetable(this.teacherId, startUTC, endUTC).then((res) => {
        if(res.data.code == 200) {
          this.reference = res.data.data;
          this.bodyCtlInit(week);
        }
        this.loading = false;
      })
      
      
    },
    async book(obj) {
      this.loadingSubcribe = true;
      let item = this.datas[this.week][this.key].days[this.dkey];
      let params = {
        "endRecurringTime": item.find.endTime,
        "endTime": item.find.endTime,
        "opType": obj.optype,
        "startTime": item.find.startTime,
        "studentUserId": this.studentId*1,
        "tutorUserId": item.find.tutorUserId
      }
      let res;
      let msg;
      // 约课或者取消约课
      if(obj.active != 'first'){
        params.endRecurringTime = obj.endTime;
      }
      if(obj.optype == this.ApiConstants.scheduleStudentCancel) {
        msg = 'Successful Cancelled';
        params.classTypeId = item.find.classTypeId;
        params.classId = item.find.classId;
      }else {
        msg = 'Successful Booking';
        params.classTypeId = this.group;
        params.classId = this.classIds.ids;
      }
      res = await this.$api.booking.subscribeClass(params);
      // 处理返回结果
      this.isOpen = false;
      this.isOpenCancel = false;
      this.alertShow = false;
      this.loadingSubcribe = false;
      
      if(res.data.code == 200){
        this.successShow = true;
        this.message = msg;
        // this.changeStatus(obj.active, obj.optype);
        this.tutorTimetable(this.week);
        if(obj.optype == this.ApiConstants.scheduleStudentCancel) {
          this.setStudentBriefInfo({
            upcomingClassNum: this.studentBriefInfo.upcomingClassNum - 1
          });
        }else {
          this.setStudentBriefInfo({
            upcomingClassNum: this.studentBriefInfo.upcomingClassNum * 1 + 1
          });
        }
      } else if (res.data.code === 30004) {
        item.active = '';
      }
    }
  },
  components: {
    SDialog,
    AlertDialog,
    topUp,
    CancelDialog,
    tipDialog,
    successSubcribeDialog
  }
};
</script>
<style lang='stylus' scoped>
.c-classcard-header{
  line-height 49px
  position relative
  margin-top -20px
  .c-classcard-title{
    position absolute
    top 0
    left 50%
    margin-left -210px
    width 420px
    text-align center
  }
}
.c-oper-week{
  color #B2B2B2
  text-decoration none
}
.classcard {
  .weeek-ctl {
    display: flex;
    margin: 0;
    border-bottom: 1px solid rgba(217, 217, 217, 1);

    dt, dd {
      margin: 0;
      height: 48px;
      flex: 1;
      line-height: 48px;
      text-align: center;
      background: rgba(244, 244, 244, 1);
      font-family: Rubik-Medium, Rubik;

      .week {
        height: 19px;
        font-size: 14px;
        font-family: RobotoCondensed-Regular, RobotoCondensed;
        font-weight: 400;
        color: rgba(52, 54, 77, 1);
        line-height: 28px;
      }

      .day {
        height: 28px;
        font-size: 16px;
        font-family: RobotoCondensed-Regular, RobotoCondensed;
        font-weight: 500;
        color: #34364D;
        line-height: 24px;
      }
    }
  }

  .day-ctl {
    display: flex;
    margin: 0;
    border-left: 1px solid rgba(217, 217, 217, 1);

    dt, dd {
      margin: 0;
      height: 36px;
      flex: 1;
      line-height: 36px;
      text-align: center;
      font-size: 14px;
      font-family: Rubik-Regular, Rubik;
      font-weight: 400;
      color: rgba(52, 54, 77, 1);
      border-bottom: 1px solid rgba(217, 217, 217, 1);
      border-right: 1px solid rgba(217, 217, 217, 1);

      &.disable {
        background: rgba(245, 245, 245, 1)!important;
        color: #ccc!important;
        cursor: not-allowed!important;
      }
      
      &.enable{
        cursor: pointer;
        background: #80D0DC;
      }

      &.booked{
        background: #D78F25;
        color: #fff;
        cursor:pointer;
      }
      &.reserve {
        background-color: #eed3ab;
        color: #fff;
        opacity: 0.8;
      }
      &.active {
        background-color: #1b9eb2;
        color: #fff;
      }
    }
  }
}
</style>