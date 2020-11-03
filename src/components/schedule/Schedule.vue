<template>
  <div class="schedule">
    <!-- <Header></Header> -->
    <div class="schedule_title">
      <span class="f28 comfortaa">{{$t('Schedule')}}</span>
      <div class="calendar" @click="changeScheduleForm">
        <div class="calendar_icon" :class="scheduleForm"></div>
        <span v-show="showScheduleList">{{$t('CALENDAR')}}</span>
        <span v-show="!showScheduleList">{{$t('LIST')}}</span>
      </div>
    </div>
    <ScheduleList v-if="showScheduleList" :showList="showScheduleList"></ScheduleList>
    <ScheduleTable v-else></ScheduleTable>
  </div>
</template>

<script>
import Header from "../common/Header";
import ScheduleTable from "./components/ScheduleTable"
import ScheduleList from "./components/ScheduleList"
export default {
  components: {Header, ScheduleList, ScheduleTable},
  data() {
    return {
      showScheduleList: true,
      showPreview: false
    };
  },
  computed: {
    scheduleForm() {
      if (this.showScheduleList) {
        return "list-img";
      } else {
        return "calendar-img"
      }
    }
  },
  methods: {
    changeScheduleForm() {
      this.showScheduleList = !this.showScheduleList
    },
    // showCoursewareDialog() {
    //   this.showCourseware = true
    // },
  },
};
</script>
<style lang='stylus' scoped>
.schedule_title {
  padding 25px 0 10px 30px
  display flex
  justify-content space-between
  color rgba(215,143,37,1)
  >span {
    line-height 40px
  }
  .calendar {
    width 160px
    height 40px
    background rgba(255,255,255,1)  
    border-radius 30px 
    padding 0px 23px 0px 23px
    display flex
    box-sizing border-box
    align-items center
    cursor pointer
    .calendar_icon {
      width 21px
      height 21px
      margin-right 10px
      background-size 100%
      // bg-image("../../assets/theme-default/images/")
    }
    &:hover {
      .list-img {
        bg-image("../../assets/theme-default/images/history/calendar_blue")
      }
      .calendar-img {
        bg-image("../../assets/theme-default/images/history/list_blue")
      }
    }
    .list-img {
      bg-image("../../assets/theme-default/images/history/calendar_grey")
    }
    .calendar-img {
      bg-image("../../assets/theme-default/images/history/list_grey")
    }
    span {
      font-family Rubik-Medium,Rubik
      font-weight 500
      color rgba(178,178,178,1)
    }
  }
  .calendar:hover span{
    color #56BECD
  }
}
</style>