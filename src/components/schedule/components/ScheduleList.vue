<template>
  <div class="schedule_classes">
    <Courseware :showCourseware="showPreview" @closePreviewDialog="closeCourseware" :classInfo="classInfo"></Courseware>
    <CancelAppointment :classInfo="cancelClassInfo" :showCancelAppoint="showCancelClass"
      @closeCancelDialog="closeCancelAppoint" @cancelClass="cancelClass"></CancelAppointment>
    <div v-if="classesList_data.length == 0" class="no-class">
      <div class="no-class-img"></div>
      <p class="tip">{{$t('No upcoming class, book now ~')}}</p>
      <el-button type="primary" plain @click="jump" class="w300">{{$t("BOOKING")}}</el-button>
    </div>
    <Class v-for="(item, index) in classesList_data" :key="index" :classInfo="item">
      <template v-slot:reserve>
        <div class="reserve"></div>
      </template>
      <template v-slot:btn-warpper>
        <div class="btn-wrapper">
          <el-button plain round class="video-prev" v-if="item.courseVideoId" @click="goVideoDetail(item)">{{$t('Video Preview')}}</el-button>
          <el-button plain round @click="showCourseware(item)" :disabled="item.status === 3">{{$t("PREVIEW")}}
          </el-button>
          <el-button plain round @click="cancelAppointment(item)" v-if="showCancelBtn(item)" :disabled="item.classTypeId == ApiConstants.classTypeSmallclass || item.classTypeId == ApiConstants.classTypeBigclass">{{$t("CANCEL")}}
          </el-button>
        </div>
      </template>
      <template v-slot:students-name>
        <div class="studentsName">
          <span v-if="item.classTypeId == ApiConstants.classTypeBigclass">{{$i18n.locale == 'zh' ? item.classNameZh : item.className}}</span>
          <span class="f16" v-for="(ite, i) in item.classroomClassMemberInfoList" :key="i" v-else>
            <!-- <i v-if="ite.role === 1"></i> -->
            {{ite.realName}}
            <b v-if="i != item.classroomClassMemberInfoList.length-1">|</b>
          </span>
          <!-- <span v-if="item.classTypeId == ApiConstants.classTypeBigclass">{{$i18n.locale == 'zh' ? item.classroomClassInfo.classNameZh : item.classroomClassInfo.className}}</span> -->
        </div>
      </template>
    </Class>
  </div>
</template>

<script>
import CancelAppointment from "./CancelAppointment";
import Courseware from "../../common/Courseware";
import Class from "../../common/Class";
export default {
  components: { CancelAppointment, Courseware, Class },
  data() {
    return {
      circleUrl: "static/images/timg.jpeg",
      list: [{ flag: 1 }, { flag: 2 }, { flag: 3 }],
      showPreview: false,
      showCancelClass: false,
      cancelClassInfo: {},
      classesList_data: [],
      inqueryCurrentMonth: 0,
      loadModel: "",
      now: this.DateTimeUtils.now(),
      ifLoadMore: true,
      loading: false,
      classInfo: {},
      currentVideoInfo: {
        courseVideoId: 'video1',
        name: '这里是当前视频的描述文本',
        video_url: 'https://s3-us-west-1.amazonaws.com/media.pplingo.com/video/lession_1.mp4',
        poster_url: 'https://t8.baidu.com/it/u=2247852322,986532796&fm=79&app=86&size=h300&n=0&g=4n&f=jpeg?sec=1597300784&t=6446ea209133954b2eb78699bf9328c5',
        video_length: 4353,
        isAble: true,
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar sic tempor. Sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus pronin sapien nunc accuan eget.',
        title: 'Eat Zongzi on Dragon Boat Festival',
      },
    }
  },
  props: ["showList"],
  computed: {
    getScheduleStartTime() {
      if (this.inqueryCurrentMonth == 0) {
        return new Date();
      } else {
        return this.DateTimeUtils.dayFirst(
          new Date(
            this.now.getFullYear(),
            this.now.getMonth() + this.inqueryCurrentMonth,
            this.now.getDate() + 1
          )
        );
      }
    },
    getScheduleEndTime() {
      return this.DateTimeUtils.dayLast(
        new Date(
          this.now.getFullYear(),
          this.now.getMonth() + (this.inqueryCurrentMonth + 1),
          this.now.getDate()
        )
      );
    }
  },
  watch: {
    showList() {
      if (this.showList) {
        this.removeEventListener1();
      }
    }
  },
  methods: {
    jump() {
      this.$router.push("booking");
    },
    cancelAppointment(item) {
      if (item.studentUserId !== this.$store.state.student.currentStudent.id) {
        this.$message({
          message: this.$t("Only monitor can cancel the small class")
        });
      } else {
        this.cancelClassInfo = item;
        this.showCancelClass = true;
      }
    },
    closeCourseware() {
      this.showPreview = false;
    },
    closeCancelAppoint() {
      this.showCancelClass = false;
    },
    changeInquireTime() {
      if (!this.ifLoadMore) {
        return false;
      } else if (this.loading) {
        return false;
      }

      this.loading = true;
      this.inqueryCurrentMonth++;
      this.getOneMonthSchedule();
    },
    showCourseware(classItem) {
      this.showPreview = true;
      this.classInfo = classItem;
    },
    showCancelBtn(classItem) {
      return (
        new Date(classItem.startTime).getTime() >
        new Date().setHours(
          new Date().getHours() + 2 &&
            classItem.studentUserId ==
              window.localStorage.getItem("currentStudent")
        )
      );
    },
    //初始加载一个月课表信息
    initOneMonthSchedule() {
      this.$api.schedule
        .getSchedule(
          this.$store.state.student.currentStudent.id ||
            localStorage.currentChild,
          this.getScheduleStartTime.toISOString(),
          this.getScheduleEndTime.toISOString()
        )
        .then(res => {
          if (res.data.code == 200) {
            if (res.data.data.length == 0) {
              this.ifLoadMore = false;
            } else {
              this.classesList_data = [
                ...this.classesList_data,
                ...res.data.data
              ];
              this.loadModel = "schedule";
              this.loading = false;
              let that = this;
              setTimeout(function() {
                that.scrollEvent();
              }, 10);
            }
          }
        });
    },
    //记载更多
    getOneMonthSchedule() {
      // console.log(this.getScheduleStartTime.toISOString(), this.getScheduleEndTime.toISOString(), this.inqueryCurrentMonth);
      this.$api.schedule
        .getSchedule(
          this.$store.state.student.currentStudent.id ||
            localStorage.currentChild,
          this.getScheduleStartTime.toISOString(),
          this.getScheduleEndTime.toISOString()
        )
        .then(res => {
          if (res.data.code == 200) {
            if (res.data.data.length == 0) {
              this.ifLoadMore = false;
            } else {
              this.classesList_data = [
                ...this.classesList_data,
                ...res.data.data
              ];
              this.loadModel = "schedule";
              this.loading = false;
            }
          }
        });
    },
    //实现触底加载更多
    scrollEvent() {
      let self = this,
        indexWarpper = document.getElementById("app"),
        containerHeight = indexWarpper.clientHeight;
      indexWarpper.addEventListener(
        "scroll",
        function() {
          if (self.loadModel == "schedule") {
            let mainWarpper = document.querySelector(".main-warpper"),
              innerHeight = mainWarpper.offsetHeight,
              scrollTop = indexWarpper.scrollTop;

            if (scrollTop + containerHeight >= innerHeight + 120) {
              self.changeInquireTime();
            }
          }
        },
        false
      );
    },

    loadMore() {
      let indexWarpper = document.querySelector(".index-warpper");
      indexWarpper.removeEventListener("scroll", this.scrollEvent);
      indexWarpper.addEventListener("scroll", this.scrollEvent);
    },
    cancelClass() {
      let params = {
        classId:
          this.cancelClassInfo.classTypeId == this.ApiConstants.classType1v1
            ? null
            : this.cancelClassInfo.classId,
        classTypeId: this.cancelClassInfo.classTypeId,
        endRecurringTime: this.DateTimeUtils.dayLast(
          new Date(this.cancelClassInfo.startTime)
        ).toISOString(),
        endTime: this.cancelClassInfo.endTime,
        opType: this.ApiConstants.scheduleStudentCancel,
        startTime: this.cancelClassInfo.startTime,
        studentUserId: this.$store.state.student.currentStudent.id,
        tutorUserId: this.cancelClassInfo.tutorUserId
      };

      this.$api.booking.subscribeClass(params).then(res => {
        if (res.data.code == 200) {
          this.$message({
            showClose: true,
            message: "取消课程成功"
          });
          this.inqueryCurrentMonth = 0;
          this.classesList_data = [];
          this.showCancelClass = false;

          this.initOneMonthSchedule();
        }
      });
    },
    goVideoDetail(item) {
      this.$router.push({
        path: '/videoDetail',
        query: {
          courseVideoId: item.courseVideoId
        }
      })
    }
    // removeEventListener1() {
    //   let indexWarpper = document.getElementById('indexWarpper');
    //   indexWarpper.removeEventListener('scroll', this.scrollEvent);
    // }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.initOneMonthSchedule();
    console.log(this.$i18n.locale);
  },
  destroyed() {
    // this.removeEventListener1()
    this.loadModel = "";
  }
};
</script>
<style lang='stylus'>
.studentsName {
  margin-top: 13px;
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

.schedule_classes {
  .el-dialog {
		max-width: 100%;
    border-radius: 16px;

    .el-dialog__header {
      padding: 60px 20px 10px;
    }

    .el-dialog__body {
      padding: 0;
    }
  }

  .no-class {
    width: 940px;
    height: 500px;
    border-radius: 8px;
    box-shadow: 0px 4px 8px 4px rgba(182, 182, 182, 0.08);
    background: #fff;
    text-align: center;
    padding-top: 30px;
    position: relative;

    .no-class-img {
      width: 247px;
      height: 240px;
      bg-image('../../../assets/theme-default/images/home/icon-upcoming-no');
      margin: 0 auto 20px;
    }

    .tip {
      font-size: 18px;
      font-weight: 400;
      color: rgba(178, 178, 178, 1);
      line-height: 22px;
      margin-bottom: 54px;
    }
  }

  .title {
    height: 50px;
    line-height: 50px;
    font-size: 28px;
    font-weight: 400;
    color: rgba(215, 143, 37, 1);
    padding: 10px 30px;
  }

  .el-card {
    margin-bottom: 20px;

    .info {
      flex: 1;

      .time {
        height: 33px;
        font-size: 28px;
        font-weight: 400;
        color: rgba(52, 54, 77, 1);
        line-height: 33px;
      }

      .level {
        margin-top: 10px;
        height: 24px;
        font-size: 16px;
        font-weight: 400;
        color: rgba(52, 54, 77, 1);
        line-height: 24px;

        .lg-icon {
          width: 64px;
          height: 24px;

          &.icon-trial {
            bg-image('../../../assets/theme-default/images/index/icon-trial');
          }

          &.icon-group {
            bg-image('../../../assets/theme-default/images/index/icon-group');
          }
        }
      }
    }

    .right {
      flex: 0 350px;
      position: relative;

      &.a1 {
        .flag1 {
          width: 200px;
          height: 100px;
          position: absolute;
          top: -30px;
          right: 20px;

          // bg-image('../../../../assets/theme-default/images/index/bg-tip');
          .time-title {
            width: 165px;
            height: 22px;
            font-size: 16px;
            color: rgba(250, 225, 171, 1);
            line-height: 19px;
            margin: 16px auto 0px auto;
          }

          .time {
            width: 145px;
            height: 26px;
            font-size: 22px;
            color: rgba(250, 225, 171, 1);
            line-height: 26px;
            margin: 0 auto;
          }
        }

        .flag2 {
          width: 140px;
          height: 56px;
          position: absolute;
          top: 0px;
          right: -30px;
          bg-image('../../../assets/theme-default/images/index/icon-reserve');
        }
      }

      &.a2 .flag {
        width: 140px;
        height: 56px;
        position: absolute;
        top: 0px;
        right: -30px;
        bg-image('../../../assets/theme-default/images/index/icon-reserve');
      }

      .btn-warpper {
        position: absolute;
        bottom: 0px;
        right: 0px;
      }
    }
  }

  .icon-no-upcoming {
    text-align: center;

    .lg-icon {
      width: 247px;
      height: 240px;
      bg-image('../../../assets/theme-default/images/home/icon-upcoming-no');
    }

    .tip {
      height: 22px;
      font-size: 18px;
      font-weight: 400;
      color: rgba(178, 178, 178, 1);
      line-height: 22px;
      margin-top: 4px;
    }

    button {
      margin-top: 30px;
      width: 300px;
    }
  }

  .reserve {
    position: absolute;
    top: 24px;
    right: 0;
    width: 140px;
    height: 56px;
    background-size: 100%;
    bg-image('../../../assets/theme-default/images/common/reserve');
  }

  .btn-wrapper {
    position: absolute;
    right: 30px;
    bottom: 33px;
    .video-prev {
      background-color: #efa83e;
      color: #ffffff;
      border: #efa83e;
      &:hover {
        background-color: #4e4f69;
      }
    }
  }
}
</style>