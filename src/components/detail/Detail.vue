<template>
  <div class="historyTabs">
    <FullScreen :showFullScreen="showFullScreenFile" @closeDialog="closeDialog"></FullScreen>
    <el-card :body-style="{display:'flex',padding:'30px'}">
      <div class="info" v-if="classInfo">
        <!-- <div class="time">{{DateTimeUtils.classTime(item.startTime, item.endTime)}}</div> -->
        <div class="time f28" v-if="classInfo">{{classInfo.classTime}}</div>
        <div class="level f16">
          <i
            class="lg-icon icon-trial"
            v-if="classInfo.firstCourse == ApiConstants.scheduleCourseFirstcourse"
          ></i>
          <!-- <i class="lg-icon icon-group"></i> Level{{classInfo.courseLevel | courseLevelShowFilter}} Lesson{{classInfo.lessonNo}} -->
          <i class="lg-icon icon-group" v-if="classInfo.classTypeId===2"></i>
          <!-- <span>{{$t("Level")}} {{classInfo.courseLevel | courseLevelShowFilter}} {{$t("Lesson")}}{{classInfo.lessonNo}}</span> -->
          <span>{{ classInfo.lessonDescription }}</span>
        </div>
        <div class="teacher">
          <el-avatar class="c-teacher" :size="60" :src="classInfo.tutorAvatar"></el-avatar>
          <div class="name f18">{{classInfo.tutorRealName}}</div>
        </div>
      </div>
      <el-button
        type="primary"
        round
        class="f14"
        @click="lookBeforeVideo"
      >{{$t('PLAYBACK')}}</el-button>
    </el-card>
    <el-tabs v-model="activeName" v-if="classInfo" class="detail-tabs">
      <el-tab-pane :label="$t('Courseware')" name="first">
        <Courseware @func="getMsgFromSon" :classInfo="classInfo" :label="Courseware"></Courseware>
      </el-tab-pane>
      <el-tab-pane :label="$t('Expanding Courseware')" name="second">
        <Courseware @func="getMsgFromSon" :classInfo="classInfo" :label="ExpandingCourseware"></Courseware>
      </el-tab-pane>
      <el-tab-pane :label="$t('My Homework')" name="third">
        <SubmitHomework :classInfo="classInfo" :propsHomeworkId="homeworkList[0] && homeworkList[0].id || null"></SubmitHomework>
        <!-- <question-list-hw :queryInfo="queryInfo" v-if="qs"></question-list-hw> -->
      </el-tab-pane>
      <el-tab-pane :label="$t('Original Homework')" name="fourth">
        <OriginalHomework :classInfo="classInfo" :propsPdfUrl="homeworkList[0] && homeworkList[0].hwContent || ''"></OriginalHomework>
      </el-tab-pane>
      <el-tab-pane :label="$t('Comment')" name="fifth">
        <Comment :classInfo="classInfo"></Comment>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Courseware from "./components/Courseware";
import FullScreen from "./components/FullScreen";
import OriginalHomework from "./components/OriginalHomework";
import Comment from "./components/Comment";
import SubmitHomework from "./components/SubmitHomework";
import api from "@/api/index";
import datetimeUtils from "../../utils/datetime_utils";
export default {
  props: [],
  data() {
    return {
      qs: true,
      queryInfo: this.$route.query,
      classInfo: null,
      activeName: this.$route.query.activeName,
      showFullScreenFile: false,
      ExpandingCourseware: "ExpandingCourseware",
      Courseware: "Courseware",
      homeworkList: []
    };
  },
  mounted() {
    this.getClassInfo()
    this.getHomeWorkInfo()
  },
  methods: {
    getClassInfo() {
      api.homework.virtualClassHistoryDetail(this.$route.query.studentId, 3, this.$route.query.virtualclassId).then(res => {
        if (res.status === 200 && res.data.code === 200) {
          const resultData = res.data.data
          let ymd = datetimeUtils.formartDateFromUTC(resultData.startTime, "yyyy.MM.dd(w)"),
              hmStartTime = datetimeUtils.formartDateFromUTC(resultData.startTime, "hh:mm"),
              hmEndTime = datetimeUtils.formartDateFromUTC(resultData.endTime, "hh:mm")
          resultData.classTime = ymd + " " + hmStartTime + "-" + hmEndTime
          this.classInfo = resultData
        }
      })
    },
    getMsgFromSon(data) {
      this.fullScreenFile = data;
      this.showFullScreenFile = true;
    },
    closeDialog() {
      this.showFullScreenFile = false;
    },
    toPlayback() {

    },
    lookBeforeVideo() {
      let { virtualclassId } = this.classInfo;
      this.$api.history.lookBeforeVideo(virtualclassId).then(res => {
        if (res.status === 200 && res.data.code === 200) {
          if (res.data.data != null) {
            if (res.data.data.length === 1) {
              window.open(res.data.data[0], "__blank");
            } else if (res.data.data.length > 1) {
              this.isOpen = true;
              this.playbackList = res.data.data;
            } else {
              this.$message({
                message: this.$t(
                  "Playback video will be generated within 24 hours after class, you can check later"
                )
              });
            }
          } else {
            this.$message({
              message: this.$t(
                "Playback video will be generated within 24 hours after class, you can check later"
              )
            });
          }
        }
        this.playbackLoading = false;
      });
    },
    getHomeWorkInfo () {
      const lessonId = this.$route.query.lessonId
      this.$api.history.getHomeworkInfo(lessonId).then(res => {
        if (res.data.code === 200 && res.data.data) {
          this.homeworkList = res.data.data
        }
      }, err => {
        console.log('err', err)
      })
    },
  },
  components: {
    Courseware,
    FullScreen,
    OriginalHomework,
    Comment,
    SubmitHomework
  }
};
</script>

<style lang="stylus">
.historyTabs {
  .el-tabs {
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0px 4px 8px 4px rgba(182, 182, 182, 0.08);
    border-radius: 8px;
    padding: 30px;
    box-sizing: border-box;
  }

  .detail-tabs {
    div.is-top {
      z-index: 1;
    }
  }

  .el-card {
    position: relative;
    margin-bottom: 20px;

    .info {
      width: 100%;

      .time {
        margin-bottom: 13px;
      }

      .level {
        .icon-trial {
          width: 64px;
          height: 24px;
          bg-image('../../assets/theme-default/images/index/icon-trial');
          background-size: 100%;
          margin-right: 10px;
        }

        .icon-group {
          width: 64px;
          height: 24px;
          bg-image('../../assets/theme-default/images/index/icon-group');
          background-size: 100%;
          margin-right: 10px;
        }
      }

      .teacher {
        margin-top: 12px;
        display: flex;
        align-items: center;

        .name {
          margin-left: 10px;
        }
      }

      .btn-warpper {
        position: absolute;
        top: 127px;
        right: 30px;

        .el-button.is-round {
          border-radius: 44px;
          padding: 10px 10px;
        }
      }
    }

    .el-button.is-round {
      border-radius: 44px;
      padding: 12px 12px;
      height: 40px;
      box-sizing: border-box;
      position: absolute;
      right: 30px;
      bottom: 33px;
    }
  }
}
</style>
