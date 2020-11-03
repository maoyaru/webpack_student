<template>
  <div>
    <NoFeedBack v-if="abnormalClassData.length === 0"></NoFeedBack>
    <el-card v-show="abnormalClassData.length > 0" :body-style="{display:'flex',padding:'30px'}" v-for="(item,key) in abnormalClassData" :key="key">
      <div class="info">
        <div class="time f18">{{item.classTime}}</div>
        <div class="level f16">
          <i class="lg-icon icon-trial" v-if="item.firstCourse === ApiConstants.scheduleCourseFirstcourse"></i>
          <i class="lg-icon icon-group" v-if="item.classroomClassMemberInfoList !== null && item.classroomClassMemberInfoList.length > 0"></i>
          <!-- Level{{item.courseLevel | courseLevelShowFilter}} Lesson{{item.lessonNo}} -->
          {{ item.lessonDescription }}
        </div>
        <div class="teacher">
          <el-avatar class="c-teacher" :size="60" :src="item.tutorAvatar"></el-avatar>
          <div class="name f18">{{item.tutorRealName}}</div>
        </div>
        <div class="course-name" v-if="item.classTypeId == ApiConstants.classTypeBigclass">课程名：{{$i18n.locale == 'zh' ? item.classNameZh : item.className}}</div>
      </div>
      <div class="homework_status f24" :class="homework_status(item)">{{homeworkStatusTxt[homework_status(item)]}}</div>
    </el-card>
    <div class="seeMoreWrapper">
      <el-button :loading="seeMoreLoadingFlag" class="seeMore" @click="seeMore" v-if="showSeeMore()">{{$t('SEE MORE')}}
      </el-button>
    </div>
  </div>
</template>
<script>
import NoFeedBack from "./NoFeedBack";
import request from "../../../api/index";
import datetimeUtils from "../../../utils/datetime_utils";
import constans from "../../../utils/constants";
export default {
  props: [],
  data() {
    return {
      abnormalClassData: [],
      pageNum: 1,
      seeMoreLoadingFlag: false
    };
  },
  mounted() {
    this.getAbnormalClassData();
  },
  computed: {
    homeworkStatusTxt() {
      return {
        incomplete: this.$t("incomplete"),
        absent: this.$t("absent"),
        cancelled: this.$t("cancelled")
      };
    }
  },
  methods: {
    homework_status(item) {
      //判断 课堂异常原因
      if (item.status === 4) {
        if (item.reason == 1) {
          return "absent";
        } else if (item.reason == 0) {
          return "cancelled";
        } else {
          return "incomplete";
        }
      } else if (item.status === 0) {
        return "cancelled";
      }
    },
    showSeeMore() {
      //判断 see More 按钮是否显示
      if (this.abnormalClassData.length <= constans.historyPageSize - 1) {
        return false;
      } else {
        return true;
      }
    },
    seeMore() {
      //加载更多数据
      this.pageNum += 1;
      this.getAbnormalClassData();
    },
    getAbnormalClassData() {
      let studentId =
        this.$store.state.student.currentStudent.id ||
        window.localStorage.getItem("currentChild");
      this.seeMoreLoadingFlag = true;
      // 请求异常列表
      request.history
        .getHistoryClassListFn(
          this.pageNum,
          constans.historyPageSize,
          this.ApiConstants.abnormalClassStutes,
          studentId
        )
        .then(res => {
          if (res.data.code === 200) {
            if (res.data.data.list.length === 0) {
              this.seeMoreLoadingFlag = false;
            } else {
              console.log(res.data.data.list);
              res.data.data.list.forEach(item => {
                let tempStartTime = new Date(item.startTime)
                let ymd = datetimeUtils.formartDateFromUTC(
                    item.startTime,
                    "yyyy.MM.dd(w)"
                  ),
                  hmStartTime = datetimeUtils.formartDateFromUTC(
                    item.startTime,
                    "hh:mm"
                  ),
                  hmEndTime = datetimeUtils.formartDateFromUTC(
                    item.classTypeId === 3 ? tempStartTime.setMinutes(tempStartTime.getMinutes() + item.duration) : item.endTime,
                    "hh:mm"
                  );
                item.classTime = ymd + " " + hmStartTime + "-" + hmEndTime;
              });
              let arr = [...this.abnormalClassData, ...res.data.data.list];
              this.abnormalClassData = arr;
              console.log(this.abnormalClassData);
              this.seeMoreLoadingFlag = false;
            }
          } else {
            return;
          }
        });
    }
  },
  components: {
    NoFeedBack
  }
};

</script>
<style scoped lang="stylus">
.seeMoreWrapper {
  width: 150px;
  height: 30px;
  margin: 10px auto;
}

.seeMore {
  background-color: rgba(255, 255, 255, 1);
  border-radius: 8px;
  border: 2px solid rgba(215, 143, 37, 1);
  color: #D78F25;
  cursor: pointer;
}

.el-card {
  margin-top: 20px;
  position: relative;

  .info {
    width: 100%;

    .time {
      margin-bottom: 13px;
    }

    .level {
      .icon-trial {
        width: 64px;
        height: 24px;
        bg-image('../../../assets/theme-default/images/index/icon-trial');
        background-size: 100%;
        margin-right: 10px;
      }

      .icon-group {
        width: 64px;
        height: 24px;
        bg-image('../../../assets/theme-default/images/index/icon-group');
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

  .homework_status {
    width: 179px;
    line-height: 56px;
    color: #fff;
    position: absolute;
    top: 30px;
    right: 0;
    background-size: 100%;
    padding-left: 22px;
    box-sizing: border-box;
    text-align: center;
    text-transform: capitalize;
  }

  .absent {
    background: url('~@/assets/theme-default/images/history/absent.png') no-repeat 0 0 / 100% 100%;
  }

  .cancelled {
    background: url('~@/assets/theme-default/images/history/cancelled.png') no-repeat 0 0 / 100% 100%;
  }

  .incomplete {
    background: url('~@/assets/theme-default/images/history/abnormal.png') no-repeat 0 0 / 100% 100%;
  }
}

.course-name {
  padding-top: 20px;
}

</style>
