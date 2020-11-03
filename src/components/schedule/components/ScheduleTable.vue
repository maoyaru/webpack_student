<template>
  <div class="calendar clearfix table-shadow">
    <div class="title">
      <div class="last_month" @click="reduceMonth()">
        <i class="last_month_icon"></i>
        <span class="f14">{{$t('LAST MONTH')}}</span>
      </div>
      <span>{{firstdayInSelectedMonth && DateTimeUtils.monthName(firstdayInSelectedMonth.getMonth())}} {{firstdayInSelectedMonth && firstdayInSelectedMonth.getFullYear()}}</span>
      <div class="next_month" @click="addMonth()">
        <span class="f14">{{$t('NEXT MONTH')}}</span>
        <i class="next_month_icon"></i>
      </div>
    </div>
    <div class="body">
      <div class="weekdayName">
        <div class="week_day" :class="weekdayClass(index)" v-for="(item, index) in oneWeekday" :key="index">{{item}}</div>
      </div>
      <div class="oneMonthBox">
        <div class="month_day" v-for="(item, index) in oneMonthDays" :key="index">
          <div class="mask" v-if="(item.getYear() - now.getYear()) * 12 + item.getMonth() != now.getMonth() + currentMonth"></div>
          <el-popover placement="right" width="220" trigger="hover" :disabled="!scheduleMap[item.toLocaleDateString()]">
            <!-- hover展示框 start -->
            <div class="m-schedule-poper">
              <div class="arrow"></div>
              <div class="all-class" v-for="(classItem, index) in scheduleMap[item.toLocaleDateString()]" :key="index">
                <i class="reserve" v-if="classItem.status == ApiConstants.scheduleStatusSubscribe"></i>
                <p class="f18">{{DateTimeUtils.classTimeInScheduleTable(classItem.startTime, classItem.endTime)}}</p>
                <div class="icons">
                  <div class="trial f12" v-if="scheduleMap[item.toLocaleDateString()][0].firstCourse == ApiConstants.scheduleCourseFirstcourse"><span>trial</span></div>
                  <div class="group f12" v-if="scheduleMap[item.toLocaleDateString()][0].classTypeId == ApiConstants.classTypeSmallclass"><span>group</span></div>
                </div>
                <p class="level_and_Lesson_container f13">
                  <!-- <div>L{{classItem.courseLevel | courseLevelShowFilter}}</div> -->
                  <!-- <div>Lesson {{classItem.lessonNo}}</div>  -->
                  <div>{{ classItem.lessonDescription }}</div>
                </p>
                <div class="profile">
                  <el-avatar :size="30" :src="classItem.tutorAvatar" fit="cover"></el-avatar>
                  <span class="f16 username">{{classItem.tutorUsername}}</span>
                </div>
              </div>
            </div>
            <!-- hover展示框 end -->
            <!-- 日历start -->
            <div class="day-content" slot="reference">
              <div class="dots" v-if="scheduleMap[item.toLocaleDateString()] && scheduleMap[item.toLocaleDateString()].length > 0">
                <div v-for="(classItem, index) in scheduleMap[item.toLocaleDateString()]" :key="index">
                  <i class="success" v-if="classItem.status == ApiConstants.scheduleStatusSuccess"></i>
                  <i class="reserve" v-else></i>
                </div>
              </div>
              <span>{{item.getDate()}}</span>
              <div v-if="scheduleMap[item.toLocaleDateString()] && scheduleMap[item.toLocaleDateString()].length > 0">
                <i class="reserve" v-if="scheduleMap[item.toLocaleDateString()][0].status == ApiConstants.scheduleStatusSubscribe"></i>
                <div class="class_info" v-if="scheduleMap[item.toLocaleDateString()][0]">
                  <div class="label">
                    <div class="trial" v-if="scheduleMap[item.toLocaleDateString()][0].firstCourse == ApiConstants.scheduleCourseFirstcourse"><span>trial</span></div>
                    <div class="group" v-if="scheduleMap[item.toLocaleDateString()][0].classTypeId == ApiConstants.classTypeSmallclass"><span>group</span></div>
                  </div>
                  <p class="class_time f14">{{DateTimeUtils.classTimeInScheduleTable(scheduleMap[item.toLocaleDateString()][0].startTime, scheduleMap[item.toLocaleDateString()][0].endTime)}}</p>
                  <p class="level f13 level_and_Lesson_container">
                    <!-- <span class="item" style="margin-right: 5px;">L{{scheduleMap[item.toLocaleDateString()][0].courseLevel | courseLevelShowFilter}}</span>  -->
                    <!-- <span class="item">Lesson {{scheduleMap[item.toLocaleDateString()][0].lessonNo}}</span> -->
                    <span>{{ scheduleMap[item.toLocaleDateString()][0].lessonDescription }}</span>
                    <div></div>
                  </p>
                  <p class="teacher f14 wby thidden">{{scheduleMap[item.toLocaleDateString()][0].tutorUsername}}</p>
                </div>
              </div>
            </div>
          </el-popover>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {

  },
  data() {
    return {
      oneWeekday: this.DateTimeUtils._weekdayNameEn,
      currentMonth: 0,
      firstdayInSelectedMonth: null,
      scheduleMap: {},
      now: this.DateTimeUtils.now(),
      currentStudentId: this.$store.state.student.currentStudent.id
    };
  },
  watch: {
    currentStudentId() {
      this.getOneMonthSchedule();
    }
  },
  computed: {
    oneMonthDays() {
      let monthArr = []
      let now = this.DateTimeUtils.now()
      //当前月份的一号
      let firstdayInSelectedMonth = new Date(now.getFullYear(), now.getMonth() + this.currentMonth, 1)
      this.firstdayInSelectedMonth = firstdayInSelectedMonth
      //当前月份的天数
      let daysSelectedMonth = this.DateTimeUtils.daysPerMonthTime(firstdayInSelectedMonth)
      //当前月份的上个月的天数
      let daysLastMonth = this.DateTimeUtils.daysPerMonthTime(new Date(firstdayInSelectedMonth.getFullYear(), firstdayInSelectedMonth.getMonth() - 1, 1))
      //当前月份一号的星期数
      let firstdayWeek = new Date(firstdayInSelectedMonth.getFullYear(), firstdayInSelectedMonth.getMonth(), 1).getDay()
      //当前月份最后一天的星期
      let lastdayWeek = new Date(firstdayInSelectedMonth.getFullYear(), firstdayInSelectedMonth.getMonth(), daysSelectedMonth).getDay()

      //如果选中月份的一号不是周一，
      if (firstdayWeek != 1) {
        if (firstdayWeek == 0) {
          for (let i = 0; i < 6; i++) {
            monthArr.unshift(this.DateTimeUtils.dayFirst(new Date(firstdayInSelectedMonth.getFullYear(), firstdayInSelectedMonth.getMonth() - 1, daysLastMonth - i)))
          }
        } else {
          for (let i = 0; i < firstdayWeek - 1; i++) {
            monthArr.unshift(this.DateTimeUtils.dayFirst(new Date(firstdayInSelectedMonth.getFullYear(), firstdayInSelectedMonth.getMonth() - 1, daysLastMonth - i)))
          }
        }
      }

      for (let i = 1; i <= daysSelectedMonth; i++) {
        monthArr.push(this.DateTimeUtils.dayFirst(new Date(firstdayInSelectedMonth.getFullYear(), firstdayInSelectedMonth.getMonth(), i)))
      }
      if (lastdayWeek != 0) {
        for (let i = 0; i < 7 - lastdayWeek; i++) {
          monthArr.push(this.DateTimeUtils.dayFirst(new Date(firstdayInSelectedMonth.getFullYear(), firstdayInSelectedMonth.getMonth() + 1, i + 1)))
        }
      }
      return monthArr
    }
  },
  mounted() {
    this.getOneMonthSchedule()
  },
  methods: {
    weekdayClass(index) {
      // 如果为周六周日，字体颜色为红色
      if (index == 5 || index == 6) {
        return "redStyle"
      }
    },
    addMonth() {
      this.currentMonth++;
      this.scheduleMap = {};
      this.getOneMonthSchedule();
    },
    reduceMonth() {
      if (this.currentMonth != 0) {
        this.currentMonth--;
        this.scheduleMap = {};
        this.getOneMonthSchedule()
      }
      if(this.currentMonth == 0){
       this.$notify.info({
          message: '已经到底啦!',
          position: 'top-left',
          customClass:'promptMessage',
          showClose:false
        });
      }
    },
    getOneMonthSchedule() {
      //选中月份的今天
      let todayInSelectedMonth = new Date(this.now.getFullYear(), this.now.getMonth() + this.currentMonth, this.now.getDate())
      this.$api.schedule.getSchedule(
        this.$store.state.student.currentStudent.id,
        this.oneMonthDays[0].toISOString(),
        this.DateTimeUtils.dayLast(this.oneMonthDays[this.oneMonthDays.length - 1]).toISOString()
      ).then(res => {
        if (res.data.code == 200) {
          let scheduleResult = res.data.data;
          let _scheduleMap = {};
          let dayItem = this.oneMonthDays[0].toLocaleDateString();
          _scheduleMap[dayItem] = [];

          scheduleResult.forEach((item, index) => {
            if (dayItem != new Date(item.startTime).toLocaleDateString()) {
              dayItem = new Date(item.startTime).toLocaleDateString();
              _scheduleMap[dayItem] = [];
            }

            _scheduleMap[dayItem].push(item)

          })
          this.scheduleMap = _scheduleMap
        }
      })
    }
  }
};

</script>
<style scoped lang="stylus">
.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ddd;
  z-index: 100;
}

.level_and_Lesson_container span {
  display: inline-block;
}


</style>
<style>
.promptMessage {
  width:166px;
  height: 50px;
  left: 260px!important;
  top:150px!important;
}
</style>
