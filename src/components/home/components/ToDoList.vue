<template>
  <div class="to-do-list-wrap">
    <div>
      <div class="step-1" v-if="activeStep == 1">
        <div class="pic">
          <img src="@/images/home/step-1.png" style="width: 427px;">
        </div>
        <div class="text">
          <div>{{$t('Welcome')}} {{$store.state.student.currentStudent.realName}} , {{$t('tell us a little about')}}{{currentStudentGender}}{{$t('Chinese learning, so that we can arrange the most suitable courses and teachers for')}}{{currentStudentGender}}~</div>
          <div class="action-btn" @click="editProfile">{{$t('NOW ANSWER')}}</div>
        </div>
      </div>
      <div class="step-2" v-if="activeStep == 2">
        <div class="pic">
          <img src="@/images/home/step-2.png" style="width: 325px;">
        </div>
        <div class="text">
          <div><span v-if="$i18n.locale == 'zh'">为{{$store.state.student.currentStudent.realName}}</span>{{$t('Make an appointment for a trial class for')}}<span v-if="$i18n.locale != 'zh'"> {{$store.state.student.currentStudent.realName}}</span></div>
          <div class="action-btn" @click="jumpToBooking">{{$t('BOOKING')}}</div>
        </div>
      </div>
      <div class="step-3" v-if="activeStep == 3">
        <div class="l-s">
          {{$t('LingoAce teacher suggests that you complete the equipment test before class to ensure the best class experience')}}
        </div>
        <div class="r-s">
          <a class="block auto" target="_blank" :href="tkUrl()">
            <div class="it-text-btn">{{$t('IT TEST')}}</div>
          </a>
        </div>
      </div>
    </div>
<!--     <el-card class="todolist">
      <div class="c-tab-title f28 comfortaa">{{$t('TO DO LIST')}}</div>
      <div class="m-steps-wrap">
        <div class="list">
          <el-steps class="lg-steps" direction="vertical" :align-center="true" :active="activeStep" ref="toDoList">
            <el-step :description="$t('Edit student profille')"></el-step>
            <el-step :description="$t('Book a FREE trial class')"></el-step>
            <el-step :description="$t('Prepare equipment and IT test')" :status="ifError"></el-step>
            <el-step :description="$t('Take Chinese assessment')"></el-step>
          </el-steps>
        </div>
        <div class="card card1" v-show="activeFlag == 2">
          <div class="icon-student"></div>
          <div class="pt10 c-color-999">{{$t('Add a student and get a $30 trial class for free')}}</div>
          <el-button type="primary" @click="openStudent()">{{$t('EDIT STUDENT PROFILE')}}</el-button>
        </div>
        <div class="card card2" v-show="activeFlag == 1">
          <div class="lhx22 f18 mt60">
            {{$t('Tell us a bit about the student, and we will')}}
            <br />
            {{$t('arrange the most suitable course and teacher')}}
            <br />
            {{$t('for the student.')}}
          </div>
          <el-button type="primary" @click="editProfile">GO</el-button>
        </div>
        <div class="card card3" v-show="activeFlag == 3">
          <div class="lhx22 f18 pt5">{{$t('Successful added')}} {{$store.state.student.currentStudent.realName}} {{$t('as a student')}}</div>
          <div class="icon-student pt60">
            <div class="tip2 f20">{{$t(courseEdition())}}</div>
            <div class="tip3">Level{{$store.state.student.currentStudent.courseLevel | courseLevelShowFilter}}</div>
          </div>
          <div class="lhx22 f18 c-color-999 pt5">
            *{{$t('The level here is for reference only , specific')}}
            <br />
            {{$t('rating is determined by your teacher.')}}
          </div>
        </div>
        <div class="card card4" v-show="activeFlag == 4">
          <div class="icon-student"></div>
          <div class="lhx22 f18">{{$t('Book a FREE trial class for')}} {{$store.state.student.currentStudent.realName}}</div>
          <el-button type="primary" @click="jumpToBooking">{{$t('BOOKING')}}</el-button>
        </div>
        <div class="card card5" v-show="activeFlag == 5">
          <div class="lhx22 f18">{{$t('Attend class by one of the following two methods')}}</div>
          <div class="group1">
            <div class="tip-warpper">
              <div class="tip f14 tc lhx24">
                {{$t("Computer + Camera")}} +
                <br />
                {{$t('Headset + Microphone')}}
                <br />
                <a class="block auto" target="_blank" :href="tkUrl()">
                  <el-button class="w120" size="mini" type="success">{{$t('IT Test')}}</el-button>
                </a>
              </div>
              <div class="tip f14 tc lhx24">
                {{$t("Install Google Chrome")}}
                <br />
                {{$t('on your computer')}}
                <br />
              </div>
            </div>
          </div>
          <div class="group2">
            <div class="tip-warpper">
              <div class="tip f14 tc lhx24">iPad</div>
              <div class="tip f14 tc lhx24">
                <i class="lg-icon icon-apple-store"></i>
                {{$t('Install LingoAce APP in your iPad')}}
              </div>
            </div>
          </div>
        </div>
        <div class="card card6" v-show="activeFlag == 6">
          <div class="lg-title">{{$t('Successful Booking')}}</div>
          <div class="group1">
            <el-form :model="bookingForm" ref="dynamicValidateForm" label-position="left" label-width="100px">
              <el-form-item prop="time" label="Class Time:">{{bookingForm.time}}</el-form-item>
              <el-form-item prop="tearcher" label="Tearcher:">{{bookingForm.tearcher}}</el-form-item>
              <el-form-item prop="student" label="Student:">{{bookingForm.student}}</el-form-item>
            </el-form>
          </div>
        </div>
        <div class="card card7" v-show="activeFlag == 7">
          <div class="icon-student"></div>
          <div class="tip">{{$t('Take Chinese assessment before the Trial Class for free')}}</div>
          <el-button type="primary">{{$t('TAKE ASSESSMENT')}}</el-button>
        </div>
      </div>
      <AddStudent :open="isShow" :info="info" @close="closeStudent" @add="addSutdent" />
    </el-card> -->
  </div>
</template>
<script>
import Vue from 'vue';
import AddStudent from "@/components/plugin/AddStudent";
import MD5 from "crypto-js/md5";
export default {
  components: { AddStudent },
  props: ["didITTest", "upcomingClassList"],
  data() {
    //这里存放数据
    return {
      gender: null,
      clickFlag: null,
      isShow: false,
      ifError: null,
      info: {
        parentId: this.$store.state.user.user.userParentInfo.id
      },
      noNeedAssess: 0, //未做过不需要做水平测试
      didntAssess: 1, //没有做过水平测试
      didAssess: 2, //做过水平测试
      didEquipmentTest: this.didITTest
    };
  },
  //监听属性 类似于data概念
  computed: {
    // 当前学生性别
    currentStudentGender() {
      return this.$i18n.locale == 'zh' ? (this.$store.state.student.currentStudent.gender == 1 ? '他' : '她') : (this.$store.state.student.currentStudent.gender == 1 ? ' him ' : ' her ')
    },

    bookingForm: function() {
      if (this.upcomingClassList.length > 0) {
        return {
          time: `${new Date(this.upcomingClassList[0].startTime).getFullYear()}.${this.DateTimeUtils.getTwoDigit(new Date(this.upcomingClassList[0].startTime).getMonth()+1)}.${new Date(this.upcomingClassList[0].startTime).getDate()}`,
          tearcher: this.upcomingClassList[0].tutorUsername,
          student: this.currentStudent.realName
        }
      } else {
        return {
          time: '',
          tearcher: '',
          student: ''
        }
      }
    },

    currentStudent: function() {
      this.clickFlag = null;
      return this.$store.state.student.currentStudent;
    },
    //step步骤 1 2 3 4
    activeStep: function() {
      let _step;
      // console.log(this.currentStudent.realName, this.currentStudent.courseLevel)
      if (!this.currentStudent.realName) {
        _step = 1;
      } else if (this.currentStudent.courseEditionId === null && this.currentStudent.courseLevel === null) {
        _step = 1;
      } else {
        _step = 2;
      }
      if (this.$store.state.user.studentBriefInfo.upcomingClassNum && this.$store.state.user.studentBriefInfo.upcomingClassNum > 0) {
        _step = 3;
      }

      // if (this.didITTest) {
      //   _step = 3;
      // } else if (this.currentStudent.assessed == this.didAssess) {
      //   _step = 4;
      // }
      return _step;
    },
    //内容显示, 必须完成1才能点开2，必须完成1和2才能点开4
    activeFlag: function(a, b) {
      //根据clickFlag改变显示内容
      if (this.clickFlag) {
        if (this.clickFlag == 3) {
          //点击3，随时可以点开设备检测
          this.ifError = null;
          return 5;
        } else if (this.clickFlag == 1) {
          //点击1
          if (!this.currentStudent.realName) {
            return 2; // add a student
          } else if (this.currentStudent.courseEditionId === null && this.currentStudent.courseLevel === null) {
            return 1; //tell us
          } else {
            return 3; //success add
          }
        } else if (this.clickFlag == 2) {
          //点击2
          if (this.activeStep !== 1) {
            if (this.$store.state.user.studentBriefInfo.upcomingClassNum == 0) {
              return 4; //book a
            } else {
              return 6; //successful booking
            }
          } else {
            if (!this.currentStudent.realName) {
              return 2; // add a student
            } else if (this.currentStudent.courseEditionId === null && this.currentStudent.courseLevel === null) {
              return 1; //tell us
            } else {
              return 3; //success add
            }
          }
        } else if (this.clickFlag == 4) {
          //点击4
          if (this.activeStep > 2) {
            if (!this.didITTest) this.ifError = "error";
            return 7; //take chinese
          } else if (this.activeStep == 2) {
            if (this.$store.state.user.studentBriefInfo.upcomingClassNum == 0) {
              return 4; //book a
            } else {
              return 6; //successful booking
            }
          } else if (this.activeStep == 1) {
            if (!this.currentStudent.realName) {
              _step = 2; // add a student
            } else if (this.currentStudent.courseEditionId === null && this.currentStudent.courseLevel === null) {
              _step = 1; //tell us
            } else {
              return 3; //success add
            }
          } else if (this.activeStep == 3) {
            return 5;
          }
        }
        // if (this.clickFlag == 1) {
        //   return 3
        // }
      } else {
        //初始显示内容
        let _step;
        if (!this.currentStudent.realName) {
          _step = 2; // add a student
        } else if (this.currentStudent.courseEditionId === null && this.currentStudent.courseLevel === null) {
          _step = 1; //tell us
        } else if (!(this.$store.state.user.studentBriefInfo.upcomingClassNum) || this.$store.state.user.studentBriefInfo.upcomingClassNum == 0) {
          _step = 4; //book a
        } else if (this.$store.state.user.studentBriefInfo.upcomingClassNum > 0) {
          _step = 5; //设备检测
        }

        // if (this.didITTest) {
        //   _step = 7; //take a assessment
        // } else if (this.currentStudent.testLevel) {
        //   _step = 4;
        // }
        return _step;
      }
    }
  },
  //方法集合
  methods: {
    courseEdition() {
      let etidId = this.$store.state.user.studentBriefInfo.courseEditionId;
      let filter = Vue.filter('levelTitle')
      return filter(etidId);
    },
    openStudent() {
      this.isShow = true;
    },
    addSutdent(form) {
      this.$store.state.student.students.push(form);
      this.isShow = false;
    },
    closeStudent(isOpen) {
      this.isShow = false;
    },
    jumpToBooking() {
      this.$router.push("/booking");
    },
    jumpToITTest() {
      var isChrome = navigator.userAgent.indexOf("Chrome") > -1; // 是否是谷歌
      if (isChrome) {
        this.$router.push({
          name: "classroom"
        });
      } else {
        alert("请使用谷歌浏览器打开！");
      }
    },
    jumpToDownload() {
      this.$router.push({
        name: "download"
      });
    },
    editProfile() {
      let pathname = location.pathname;
      location.href = `${pathname}questionnaire.html?uid=${this.$store.state.user.user.userParentInfo.id}&id=${this.$store.state.student.currentStudent.id}&from=pc`;
    },
    tkUrl() {
      var key = "ex5lZksGvEmoeC1m";
      var ts = Date.parse(new Date());
      var serial = 1419683487;
      var usertype = 2;
      var auth = MD5(key + ts + serial + usertype);
      var domain = "oks";
      var username = this.currentStudent.realName;
      var url = `https://global.talk-cloud.net/WebAPI/entry?serial=${serial}&username=${username}&usertype=2&ts=${ts}&auth=${auth}&domain=${domain}`;
      return url;
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.courseEdition();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    // this.$refs.toDoList.$el
    //   .querySelectorAll(".el-step__icon")
    //   .forEach((obj, index) => {
    //     let _index = index;
    //     obj.onclick = () => {
    //       this.clickFlag = index + 1;
    //     };
    //   });
  }
};

</script>
<style lang='stylus'>
.todolist {
  height: 420px;
}

.m-steps-wrap {
  display: flex;

  .list {
    flex: 1;
    height: 360px;
    padding-top: 6px;
    box-sizing: border-box;
  }

  .card {
    flex: 0 580px;
    text-align: center;
    position: relative;
    height: auto;

    .icon-student {
      width: 325px;
      height: 236px;
      padding-top: 88px;
      margin: 0 auto;
      background: url('~@/assets/theme-default/images/home/icon-result.png') no-repeat 0 0 / 100% auto;
      box-sizing: border-box;
    }

    >.el-button {
      width: 300px;
      position: absolute;
      bottom: 20px;
      left: 50%;
      margin-left: -150px;
    }

    &.card1 {
      .icon-student {
        width: 325px;
        height: 260px;
        margin: 0 auto;
        bg-image('~@/assets/theme-default/images/index/add-student');
      }
    }

    &.card3 {
      .tip2 {
        font-family: Comfortaa;
        color: #595e9b;
        line-height: 25px;
      }

      .tip3 {
        font-size: 48px;
        font-family: Roboto;
        color: #595e9b;
        line-height: 64px;
      }
    }

    &.card4,
    &.card7 {
      .icon-student {
        width: 325px;
        height: 261px;
        bg-image('~@/assets/theme-default/images/home/icon-booking');
      }
    }

    &.card5 {
      margin-top: -20px;

      .group1,
      .group2 {
        margin: 0 auto;
        position: relative;
      }

      .group1,
      .group2 {
        margin-top: 10px;
        width: 520px;
        height: 186px;
        bg-image('~@/assets/theme-default/images/home/icon-group1');
      }

      .group2 {
        width: 520px;
        height: 132px;
        margin-top: 12px;
        bg-image('~@/assets/theme-default/images/home/icon-group2');

        .icon-apple-store {
          position: absolute;
          width: 127px;
          height: 39px;
          top: -50px;
          left: 50%;
          margin-left: -63px;
          bg-image('~@/assets/theme-default/images/home/icon-apple-store');
        }
      }

      .tip-warpper {
        width: 100%;
        position: absolute;
        bottom: 20px;
        left: 0;
        display: flex;

        .tip {
          position: relative;
          flex: 1;
        }
      }
    }

    &.card6 {
      .lg-title {
        margin-top: 60px;
        margin-bottom: 80px;
      }

      .group1 {
        width: 200px;
        margin: 0 auto;
        text-align: left;
      }
    }

    &.card7 {
      .icon-student {
        bg-image('~@/assets/theme-default/images/home/icon-test');
      }
    }
  }
}

.to-do-list-wrap {
  padding-top: 20px;

  .step-1,
  .step-2,
  .step-3 {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 4px 8px 4px rgba(182, 182, 182, 0.08);
    border-radius: 8px;
    /*width: 950px;*/
    padding: 20px 30px;
  }

  .step-1,
  .step-2 {
    display: flex;
    justify-content: space-between;

    .text {
      padding-top: 60px;
      text-align: center;
      width: 450px;
      color: #34364D;
      font-size: 18px;
      line-height: 2;
    }

    .action-btn {
      width: 300px;
      height: 44px;
      line-height: 44px;
      font-size: 16px;
      border: 2px solid rgba(55, 56, 76, 1);
      border-radius: 6px;
      margin: 88px auto 0;
      cursor: pointer;

      &:hover {
        background: #4E4F69;
        transition: all .25s linear;
        color: #fff;
      }
    }
  }

  .step-3 {
    display: flex;
    justify-content: space-between;
    padding: 40px 30px;

    .l-s {
      width: 540px;
      line-height: 2;
      /*text-align: center;*/
    }

    .r-s {
      a {
        text-decoration: none;
        color: none;
      }
      .it-text-btn {
        width: 200px;
        height: 44px;
        line-height: 44px;
        font-size: 16px;
        border: 2px solid rgba(55, 56, 76, 1);
        border-radius: 6px;
        margin: 10px auto 0;
        cursor: pointer;
        text-align: center;
        color: #34364D;

        &:hover {
          background: #4E4F69;
          transition: all .25s linear;
          color: #fff;
        }
      }
    }
  }
}

</style>
