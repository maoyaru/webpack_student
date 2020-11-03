<template>
  <div class="page-container">
    <NoFeedBack v-if="completedClassData.length === 0"></NoFeedBack>
    <!-- <el-checkbox class="unfinished-homework" v-model="checkType">未完成作业</el-checkbox> -->
    <div class="cardWrapper" v-for="(item,key) in completedClassDataFilter" :key="key">
      <div v-if="item.status !== 3 || (item.status === 3 && !checkType)">
        <div class="unitWrapper" v-if="item.unitReport === ApiConstants.needUnitReport">
          <!-- v-if="item.unitReport === ApiConstants.needUnitReport" -->
          <!-- <span class="edit">Level{{item.courseLevel | courseLevelShowFilter}} Unit{{item.unitNo}}</span> -->
          <span class="edit"> Level{{item.courseLevel | courseLevelShowFilter}} {{ item.unitName }}</span>
          <span class="mainBtn" @click="jumpToUnitPage(item)">{{$t('Progress Report')}}></span>
        </div>
        <el-card v-show="completedClassData.length > 0" :body-style="{display:'flex',padding:'30px'}">
          <div class="info">
            <div class="time f28">{{item.classTime}}</div>
            <div class="level f16">
              <i class="lg-icon icon-trial" v-if="item.firstCourse === ApiConstants.scheduleCourseFirstcourse"></i>
              <i class="lg-icon icon-group" v-if="item.classTypeId === ApiConstants.classTypeSmallclass"></i>
              <!-- Level{{item.courseLevel | courseLevelShowFilter}} Lesson{{item.lessonNo}} -->
              {{ item.lessonDescription }}
            </div>
            <!-- <div class="bottom_box"> -->
            <div class="teacher">
              <el-avatar class="c-teacher" :size="60" :src="item.tutorAvatar"></el-avatar>
              <div>
                <div class="name f18">{{item.tutorRealName}}</div>
                <div class="studentsName">
                  <span v-if="item.classTypeId != ApiConstants.classTypeBigclass">
                    <span class="f16" v-for="(ite, i) in item.classroomClassMemberInfoList" :key="i">
                      <!-- <i v-if="ite.role === 1"></i> -->
                      {{ite.realName}}
                      <b v-if="i != item.classroomClassMemberInfoList.length-1">|</b>
                    </span>
                  </span>
                  <span v-else>
                    {{$i18n.locale == 'zh' ? item.classNameZh : item.className}}
                  </span>
                </div>
              </div>
            </div>
            <div class="btn-warpper">
              <!-- v-if="item.bothFirstCourse === ApiConstants.needFirstClassReport" -->
              <el-button round class="f14 feedbackReport" v-if="item.bothFirstCourse === ApiConstants.needFirstClassReport" @click.stop="jumpToFirstClassPage(item)">{{$t("Feedback Report")}}</el-button>
              <el-button type="primary" round class="f14" @click.stop="selectClass(item,'fifth')">
                {{$t("COMMENT")}}</el-button>
              <el-button type="primary" round class="f14" @click.stop="selectClass(item,'first')">{{$t("REVIEW")}}
              </el-button>
              <el-button type="primary" round class="f14" @click="lookBeforeVideo(item)">{{$t("PLAYBACK")}}
              </el-button>
              <el-button type="primary" :disabled="item.homeworkStatus===0" round class="f14" @click.stop="selectClass(item,'third')">{{$t("HOMEWORK")}}</el-button>
            </div>
            <!-- </div> -->
          </div>
          <div class="homework_status" :class="homework_status(item)"></div>
        </el-card>
      </div>
    </div>
    <div class="seeMoreWrapper">
      <el-button :loading="seeMoreLoadingFlag" class="seeMore" @click="seeMore" v-if="showSeeMore()">{{$t('SEE MORE')}}
      </el-button>
    </div>
    <el-dialog :title="$t('Playback List')" :center="true" :show-close="false" :visible.sync="isOpen" width="400px" append-to-body class="m-alert-dialog-with-title">
      <div class="c-tips">
        <ul>
          <li v-for="(item, index) in playbackList" :key="index">
            <a :href="item" target="__blank">{{$t('PLAYBACK')}} {{index+1}}</a>
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ClassItem from "../../common/Class";
import NoFeedBack from "./NoFeedBack";
import request from "../../../api/index";
import datetimeUtils from "../../../utils/datetime_utils";
import constans from "../../../utils/constants";
import api from "@/api/index";
export default {
  props: [],
  data() {
    return {
      checkType: false,
      // 1: 已批改 2：未批改 3：未提交
      selectedClass: null,
      activeName: "first",
      seeMoreLoadingFlag: false,
      completedClassData: [],
      pageNum: 1,
      isOpen: false,
      playbackList: [],
      playbackLoading: false
    };
  },
  computed: {
    completedClassDataFilter() {
      if (this.checkType) {
        return JSON.parse(JSON.stringify(this.completedClassData)).filter(i => {
          i.status !== 3;
        });
      } else {
        return JSON.parse(JSON.stringify(this.completedClassData));
      }
    },
  },
  mounted() {
    this.getCompletedClass();
  },
  methods: {
    jumpToUnitPage(obj) {
      obj.courseLevel = obj.courseLevel == '7' ? '5h' : (obj.courseLevel == '8' ? '6h' : obj.courseLevel);
      this.$router.push(`/unitReport?unit=${obj.unitReportId}&teacherurl=${obj.tutorAvatar}&teachername=${obj.tutorRealName}&edit=${obj.courseEditionId}&level=${obj.courseLevel}`)
    },
    jumpToFirstClassPage(obj) {
      this.$router.push(`/firstClassReport?feedback=${obj.firstReportId}&teacherurl=${obj.tutorAvatar}&teachername=${obj.tutorRealName}&startTime=${obj.startTime}&endTime=${obj.endTime}&courseEditionId=${obj.courseEditionId}&lessonNo=${obj.lessonNo}&courseLevel=${obj.courseLevel}`)
    },
    seeMore() {
      this.pageNum += 1;
      this.getCompletedClass();
    },
    showSeeMore() {
      if (this.completedClassData.length <= constans.historyPageSize - 1) {
        return false;
      } else {
        return true;
      }
    },
    getCompletedClass() {
      this.seeMoreLoadingFlag = true;
      let studentId =
        this.$store.state.student.currentStudent.id ||
        window.localStorage.getItem("currentChild");
      request.history
        .getHistoryClassListFn(
          this.pageNum,
          constans.historyPageSize,
          this.ApiConstants.completedClassStutes,
          studentId
        )
        .then(res => {
          if (res.data.code === 200) {
            if (res.data.data.list) {
              if (res.data.data.list.length === 0) {
                this.seeMoreLoadingFlag = false;
              } else {
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
                let arr = [...this.completedClassData, ...res.data.data.list];
                this.completedClassData = arr;
                this.seeMoreLoadingFlag = false;
              }
            }
          } else {
            return;
          }
        });
    },
    homework_status(item) {
      //判断本堂课 作业状态
      if (item.homeworkStatus === 0) {
        return "";
      } else if (item.homeworkStatus === 1) {
        return "not-submitted";
      } else if (item.homeworkStatus === 2) {
        return "not-corrected";
      } else if (item.homeworkStatus === 3) {
        if (item.score === 1) {
          return "score1";
        } else if (item.score === 2) {
          return "score2";
        } else if (item.score === 3) {
          return "score3";
        } else if (item.score === 4) {
          return "score4";
        } else if (item.score === 5) {
          return "score5";
        }
      }
    },
    selectClass(item, path) {
      // api.homework.createHomeworkDetail(item.virtualclassId, item.lessonId, this.$store.state.student.currentStudent.id, item.tutorUserId).then(res => {
      //   if (res.status === 200 && res.data.code === 200) {
      //     this.$router.push({
      //       name: "detail",
      //       params: {
      //         classInfo: item,
      //         activeName: path
      //       },
      //       query: {
      //         lessonId: item.lessonId,
      //         virtualclassId: item.virtualclassId,
      //         tutorUserId: item.tutorUserId,
      //         studentId: this.$store.state.student.currentStudent.id,
      //         activeName: path
      //       }
      //     });
      //   } else {
      //     this.$message(res.data.message);
      //   }
      // });
      this.$router.push({
        name: "detail",
        params: {
          classInfo: item,
          activeName: path
        },
        query: {
          lessonId: item.lessonId,
          virtualclassId: item.virtualclassId,
          tutorUserId: item.tutorUserId,
          studentId: this.$store.state.student.currentStudent.id,
          activeName: path
        }
      });
    },

    lookBeforeVideo(item) {
      let { virtualclassId } = item;
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
  },
  components: {
    ClassItem,
    NoFeedBack
  }
};

</script>
<style scoped lang="stylus">
.feedbackReport {
  background: rgba(86, 190, 205, 1);
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  border 1px solid rgba(86, 190, 205, 1)
}

.unitWrapper {
  width 100%;
  height: 60px;
  background: rgba(86, 190, 205, 0.68);
  box-shadow: 0px 4px 8px 4px rgba(182, 182, 182, 0.08);
  border-radius: 8px;
  margin-top: 20px;
  display flex;
  align-items center;
  justify-content space-between;
  box-sizing border-box;
  padding 0 28px;
  color #fff;

  .edit {
    font-size: 24px;
    font-family: Rubik-Regular, Rubik;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
  }

  .mainBtn {
    font-size: 19px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    cursor pointer
  }
}

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
    width: 144px;
    height: 100px;
    position: absolute;
    top: 30px;
    right: 0;
    background-size: 100%;
  }

  .studentsName {
    margin-top: 13px;
    margin-left: 11px;
    color: #999999;

    b {
      margin: 0 4px;
    }

    i {
      display: inline-block;
      width: 18px;
      height: 18px;
      transform: translateY(4px);
      margin-right: 2px;
      bg-image('../../../assets/theme-default/images/group/class_leader');
    }
  }

/*  .score1 {
    bg-image('../../../images/homework/countF');
  }

  .score2 {
    bg-image('../../../images/homework/countC');
  }*/

  .score3 {
    bg-image('../../../assets/theme-default/images/history/score3');
  }

  .score4 {
    bg-image('../../../assets/theme-default/images/history/score4');
  }

  .score5 {
    bg-image('../../../assets/theme-default/images/history/score5');
  }

  .not-corrected {
    bg-image('../../../assets/theme-default/images/history/tobe_corrected');
  }

  .not-submitted {
    bg-image('../../../assets/theme-default/images/history/not_submitted');
  }
}

.page-container {
  position: relative;

/*  .unfinished-homework {
    position: absolute;
    right: 5px;
    top: -55px;
  }*/
  // margin-top: 20px;
  // margin-left: 5px;
}

</style>
