<template>
  <div class="upcoming-classes">
    <Courseware :showCourseware="showPreview" @closePreviewDialog="closePreviewDialog" :classInfo="classInfo"></Courseware>
    <div class="title comfortaa" v-show="currentStudent.courseLevel">{{$t('Upcoming classes')}}</div>
    <el-card v-show="classesList.length > 0" :body-style="{display:'flex',padding:'30px'}" v-for="(item,key) in classesList_data" :key="key">
      <div class="info">
        <div class="time">{{time(item)}}</div>
        <div class="level">
          <i class="lg-icon icon-trial" v-if="item.firstCourse == ApiConstants.scheduleCourseFirstcourse"></i>
          <i class="lg-icon icon-group" v-if="item.classTypeId == ApiConstants.classTypeSmallclass"></i>
          <!-- Level{{item.courseLevel | courseLevelShowFilter}} Lesson{{item.lessonNo}} -->
          {{ item.lessonDescription }}
        </div>
        <div class="teacher">
          <div class="name">{{item.tutorRealName}}</div>
          <div class="c-color-999 f16" v-if="item.classroomClassMemberInfoList != null">
            <!-- <i class="leaderIcon"></i> -->
            <span v-if="item.classTypeId == ApiConstants.classTypeBigclass">{{$i18n.locale == 'zh' ? item.classNameZh : item.className}}</span>
            <span v-for="(ite, i) in item.classroomClassMemberInfoList" :key="i" v-else>
              {{ite.realName}}
              <b v-if="i != item.classroomClassMemberInfoList.length-1">|</b>
            </span>
          </div>
          <!-- <div class="students" v-if="true">ownername | studentb | studentc | studentcs…</div> -->
          <el-avatar class="c-teacher" :size="60" :src="item.tutorAvatar" fit="cover"></el-avatar>
        </div>
      </div>
      <div class="right a1">
        <div class="flag1 lg-icon tc" v-show="item.isShowTime">
          <!-- <div class="flag1 lg-icon" v-show="true"> -->
          <div class="time-title f16">{{$t("Time away from class:")}}</div>
          <div class="time f22">{{item.timer && item.timer.hours}}{{$t("h")}} {{ item.timer && item.timer.minutes}}{{$t("min")}} {{item.timer && item.timer.seconds}}{{$t("s")}}</div>
        </div>
        <div class="flag2 lg-icon" v-show="item.status==ApiConstants.scheduleStatusSubscribe"></div>
        <div class="btn-warpper">
          <el-button plain round class="video-prev" v-if="item.courseVideoId" @click="goVideoDetail(item)">{{$t('Video Preview')}}</el-button>
          <el-button class="ppt-prev" type="primary" round @click="showCourseware(item)">{{$t("PREVIEW")}}</el-button>
          <!-- :disabled="!ifShowEnterbtn(item)" -->
          <!-- <el-button
            type="warning"
            round
            @click="showClassroom(item)"
            :disabled="!ifShowEnterbtn(item)"
          >{{$t("ENTER CLASSROOM")}}</el-button>-->
          <a @click="preventJump($event, item)">
            <el-button type="warning" round :disabled="!ifShowEnterbtn(item)">{{$t("ENTER CLASSROOM")}}</el-button>
          </a>
        </div>
      </div>
    </el-card>
    <el-card v-show="classesList.length == 0 && currentStudent.courseLevel" class="icon-no-upcoming">
      <div class="lg-icon"></div>
      <div class="tip">{{$t("No upcoming class, book now ~")}}</div>
      <el-button type="primary" @click="jump">{{$t("BOOKING")}}</el-button>
    </el-card>
  </div>
</template>
<script>
import Courseware from "../../common/Courseware";
import api from "@/api";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { lgLocalStorage } from "@/common/js/store";

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    Courseware
  },
  data() {
    //这里存放数据
    return {
      list: [{ flag: 1 }, { flag: 2 }, { flag: 3 }],
      pageNum: 1,
      showPreview: false,
      classesList_data: [],
      timer: null,
      classInfo: {},
      classRoom: [],
      tkUrl: "/api/classroom/open/tkClassroom/",
      token: "",
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
    };
  },
  props: {
    classesList: {
      default: [],
      type: Array
    }
  },
  //监听属性 类似于data概念
  computed: {
    ...mapGetters({
      currentStudent: "student/getCurrentStudent"
    }),
    ...mapState("enterclassroom", {
      classroomInfo: state => state.classroomInfo
    })
  },
  //监控data中的数据变化
  watch: {
    //props里的classesList有数据时将会执行
    classesList(val) {
      this.classesList_data = val;
      this.classesList_data &&
        this.classesList_data.map(item => {
          let _isShowTime = this.isShowTime(item.startTime);
          if (_isShowTime) {
            let waitTime =
              new Date(new Date(item.startTime)).getTime() -
              new Date().getTime();
            this.setTimer(waitTime, item);
            // setInterval(() => {
            //   waitTime -= 1000
            //   this.$set(item, "timer" ,this.cacuTime(waitTime))
            // },1000)
          }
          item.isShowTime = _isShowTime;
        });
    }
  },
  //方法集合
  methods: {
    preventJump($event, item) {
      const origin = window.origin
      const url = this.tkUrl+item.virtualclassId+'/'+this.ApiConstants.userRoleStudent+'/'+this.$store.state.student.currentStudent.id +'?jwtToken='+this.token
      if (!this.ifShowEnterbtn(item)) {
        $event.preventDefault();
      } else {
        this.classInfo = item;
        this.classroomAction({
          virtualclassId: this.classInfo.virtualclassId,
          studentUserId: this.currentStudent.id
        }).then(res => {
          if (res.code === 200) {
            window.open(origin + url)
          } else {
            this.$message({
              message: res.message
            })
          }
        });
      }
    },
    jump() {
      this.$router.push("booking");
    },
    ...mapActions({
      classroomAction: "enterclassroom/classroomAction"
    }),
    //是否显示倒计时
    isShowTime(startTime) {
      let timeTo12hours =
        new Date(new Date(startTime)).getTime() -
        (new Date().getTime() + 12 * 60 * 60 * 1000);
      let timeToNow =
        new Date(new Date(startTime)).getTime() - new Date().getTime();
      if (timeTo12hours < 0 && timeToNow > 0) {
        return true;
      } else {
        return false;
      }
    },
    //计算倒计时
    cacuTime(waitTime) {
      let hours = parseInt(
        (waitTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let minutes = parseInt((waitTime % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = parseInt((waitTime % (1000 * 60)) / 1000);
      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      return { hours, minutes, seconds };
    },
    //倒计时
    setTimer(waitTime, item) {
      if (waitTime > 0) {
        // console.log('item', item)
        waitTime -= 1000;
        this.$set(item, "timer", this.cacuTime(waitTime));
        setTimeout(() => this.setTimer(waitTime, item), 1000);
      }
    },
    time(item) {
      let { DateTimeUtils } = this;
      let tempStartTime = new Date(item.startTime)
      let ymd = DateTimeUtils.formartDateFromUTC(
          item.startTime,
          "yyyy.MM.dd(w)"
        ),
        hmStartTime = DateTimeUtils.formartDateFromUTC(item.startTime, "hh:mm"),
        hmEndTime = DateTimeUtils.formartDateFromUTC(
          item.classTypeId === 3 ? tempStartTime.setMinutes(tempStartTime.getMinutes() + 30) : item.endTime,
          "hh:mm"
        );
      return ymd + " " + hmStartTime + "-" + hmEndTime;
    },
    ifShowEnterbtn(item) {
      return (
        new Date(item.startTime).setMinutes(
          new Date(item.startTime).getMinutes() - 15
        ) < new Date() &&
        new Date(item.startTime).setHours(
          new Date(item.startTime).getHours() + 2
        ) > new Date()
      );
    },
    closePreviewDialog() {
      this.showPreview = false;
    },
    showCourseware(classItem) {
      this.classInfo = classItem;
      this.showPreview = true;
    },
    goVideoDetail(item) {
      this.$router.push({
        path: '/videoDetail',
        query: {
          courseVideoId: item.courseVideoId
        }
      })
    }
    // async showClassroom(classItem) {
    //   this.classInfo = classItem;
    //   let result = await this.classroomAction({
    //     virtualclassId: this.classInfo.virtualclassId,
    //     studentUserId: this.currentStudent.id
    //   });
    //   // if (result.code == 200) {
    //   //   window.open(result.data.tkUrl, "_blank");
    //   // }
    // }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    let user = lgLocalStorage("__lgzy__s__");
    if (user) {
      this.token = user.login_token.jwtToken;
    }
  }
};

</script>
<style lang='stylus' scoped>
.leaderIcon {
  display: inline-block;
  width: 18px;
  height: 18px;
  transform: translateY(4px);
  margin-right: 2px;
  bg-image('../../../assets/theme-default/images/group/class_leader');
}

.upcoming-classes {
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

      .teacher {
        padding-top: 10px;
        padding-left: 70px;
        position: relative;
        height: 60px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        .el-avatar {
          position: absolute;
          left: 0px;
          top: 10px;
        }

        .name {
          margin-top: 8px;
          height: 22px;
          font-size: 18px;
          font-weight: 400;
          color: rgba(52, 54, 77, 1);
          line-height: 22px;
        }

        .students {
          margin-top: 6px;
          height: 19px;
          font-size: 16px;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          line-height: 19px;
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
          right: 6px;
          color: #fae1ab;
          bg-image('../../../assets/theme-default/images/index/bg-tip');

          .time-title {
            height: 22px;
            line-height: 19px;
            margin: 16px auto 0px auto;
          }

          .time {
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
        width: 440px;
        display: flex;
        justify-content: flex-end;
        .ppt-prev {
          margin: 0 10px;
        }
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
  }

  .icon-no-upcoming {
    padding: 20px 0;
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
}

</style>
