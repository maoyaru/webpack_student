<template>
  <div>
    <el-card :body-style="{display:'flex',padding:'30px'}">
      <div class="info">
        <!-- <div class="time">{{DateTimeUtils.classTime(item.startTime, item.endTime)}}</div> -->
        <div class="time f28">{{time()}}</div>
        <div class="level f16">
          <i class="lg-icon icon-trial" v-if="classInfo.firstCourse == ApiConstants.scheduleCourseFirstcourse"></i>
          <!-- <i class="lg-icon icon-group"></i> Level{{classInfo.courseLevel | courseLevelShowFilter}} Lesson{{classInfo.lessonNo}} -->
          <i class="lg-icon icon-group" v-if="classInfo.classTypeId == ApiConstants.classTypeSmallclass"></i>
          <template v-if="classInfo.status != ApiConstants.scheduleStatusSubscribe">
            <!-- Level{{classInfo.courseLevel | courseLevelShowFilter}} Lesson{{classInfo.lessonNo}} -->
            {{classInfo.lessonDescription}}
          </template>
        </div>
        <div class="teacher">
          <el-avatar class="c-teacher mr10" :size="60" :src="classInfo.tutorAvatar"></el-avatar>
          <div class="name f18">
            <span class="teacher-name">{{classInfo.tutorRealName}}</span>
            <slot name="students-name"></slot>
          </div>
        </div>
      </div>
      <slot name="reserve" v-if="classInfo.status == ApiConstants.scheduleStatusSubscribe"></slot>
      <slot name="homework-status"></slot>
      <slot name="btn-warpper">
        <!-- <el-button plain round @click="showPreview=true">{{$t("PREVIEW")}}</el-button>
        <el-button plain round @click="cancelAppointment(item)">{{$t("CANCEL")}}</el-button> -->
      </slot>
    </el-card>
  </div>
</template>

<script>
export default {
  props: ["classInfo"],
  data() {
    return {};
  },
  methods: {
    time() {
      let { classInfo, DateTimeUtils } = this;
      let tempStartTime = new Date(classInfo.startTime)
      let ymd = DateTimeUtils.formartDateFromUTC(
          classInfo.startTime,
          "yyyy.MM.dd(w)"
        ),
        hmStartTime = DateTimeUtils.formartDateFromUTC(
          classInfo.startTime,
          "hh:mm"
        ),
        hmEndTime = DateTimeUtils.formartDateFromUTC(
          classInfo.classTypeId === 3 ? tempStartTime.setMinutes(tempStartTime.getMinutes() + classInfo.duration) : classInfo.endTime,
          "hh:mm"
        );
      return ymd + " " + hmStartTime + "-" + hmEndTime;
    }
  },
  components: {}
};
</script>

<style scoped lang="stylus">
.el-card {
  margin-top: 20px;
  position: relative;

  .info {
    position: relative;

    .time {
      margin-bottom: 10px;
      color: rgba(52, 54, 77, 1);
    }

    .level {
      color: rgba(52, 54, 77, 1);
      margin-bottom: 10px;

      .lg-icon {
        width: 64px;
        height: 24px;
        background-size: 100%;
        margin-right: 10px;
      }

      .icon-trial {
        bg-image('../../assets/theme-default/images/common/icon-trial');
      }

      .icon-group {
        bg-image('../../assets/theme-default/images/common/icon-group');
      }
    }

    .teacher {
      display: flex;
      align-items: center;

      .name {
        height: 100%;
        padding: 6px 0px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }
  }
}
</style>
