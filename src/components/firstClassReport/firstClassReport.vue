<template>
  <div class="firstClassReportWrapper">
    <div class="firstClassHeader">
      <div class="firstClassHeaderLogo"></div>
      <div v-if="$i18n.locale === 'zh'" class="firstClassHeaderText"></div>
      <div v-else class="firstClassHeaderTextEn"></div>
      <div class="firstClassHeaderImg"></div>
      <div class="firstTeacherInfo" :style="$i18n.locale === 'zh'?'':'top:390px'">
        <el-avatar
          :size="60"
          class="c-teacher avatar"
          :src="teacherAvatarUrl"
        ></el-avatar>
        <div class="teacherNameText"><span>{{teacherName}}</span></div>
      </div>
    </div>
    <div class="firstClassContentWrapper">
      <div class="firstClassContentContainer">
        <div class="contentTop">
          <div class="bottomBg"></div>
          <div class="contentHeader">
              <div class="leftBorder"></div>
              <div class="titleBg">
                <div class="titleBgInner">
                  <span v-if="$i18n.locale === 'zh'">一、本次课文</span>
                  <span v-else style="font-size:18px">Lesson/Readings for Today</span>
                </div>
              </div>
              <div class="rightBorder"></div>
          </div>
          <div class="contentTopText">
            <h2>{{$t(courseEdition(courseEditionId))}} Level{{currentStudentLevel}} Lesson{{lessonNo}}</h2>
            <p class="timer">{{classTime}}</p>
            <p class="word" v-if="$i18n.locale === 'zh'">祝贺 <span class="fontColor">{{currentStudentName}}</span> 小朋友在LingoAce完成了第一节课！我们根据孩子上课表现，提供本次课的学习报告，帮助您对孩子的中文水平有更多了解。</p>
            <p class="word" style="font-size:20px" v-else>Congratulations <span class="fontColor">{{currentStudentName}}</span> ! You have successfully finished the first class with LingoAce ! Based on <span class="fontColor">{{currentStudentName}}</span>’s in-class performance, we provide you with this feedback report to help you understand more about your child’s Chinese proficiency. </p>
          </div>
          <div class="doorHandImgleft"></div>
          <div class="doorHandImgRight"></div>
        </div>

        <div class="contentItem">
          <div class="bottomBg"></div>

          <div class="contentHeader">
              <div class="leftBorder"></div>
              <div class="titleBg">
                <div class="titleBgInner">
                  <span v-if="$i18n.locale === 'zh'">二、核心知识点与课堂要求</span>
                  <span v-else style="font-size:18px">Key learning points & Class Objectives</span>
                </div>
              </div>
              <div class="rightBorder"></div>
          </div>
            <div class="contentText" v-html="feedbackData.coreKnowledgeZh" v-if="$i18n.locale === 'zh'"></div>
            <div class="contentText" v-html="feedbackData.coreKnowledgeEn" v-if="$i18n.locale === 'en'"></div>
          <div class="doorHandImgleft"></div>
          <div class="doorHandImgRight"></div>
        </div>
        <div class="contentItem">
          <div class="bottomBg"></div>

          <div class="contentHeader">
              <div class="leftBorder"></div>
              <div class="titleBg">
                <div class="titleBgInner">
                  <span v-if="$i18n.locale === 'zh'">三、补充知识点</span>
                  <span v-else style="font-size:18px">Supplementary Learning Points</span>
                </div>
              </div>
              <div class="rightBorder"></div>
          </div>
            <div class="contentText" v-html="feedbackData.addKnowledgeZh" v-if="$i18n.locale === 'zh'"></div>
            <div class="contentText" v-html="feedbackData.addKnowledgeEn" v-if="$i18n.locale === 'en'"></div>
          <div class="doorHandImgleft"></div>
          <div class="doorHandImgRight"></div>
        </div>
        <div class="contentItem">
          <div class="bottomBg"></div>
          <div class="contentHeader">
              <div class="leftBorder"></div>
              <div class="titleBg">
                <div class="titleBgInner">
                  
                  <span v-if="$i18n.locale === 'zh'">四、本次课堂反馈</span>
                  <span v-else style="font-size:18px">Feedback for this class</span>
                </div>
              </div>
              <div class="rightBorder"></div>
          </div>
            <div class="contentText" v-html="feedbackData.classroomFeedbackZh" v-if="$i18n.locale === 'zh'"></div>
            <div class="contentText" v-html="feedbackData.classroomFeedbackEn" v-if="$i18n.locale === 'en'"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import datetimeUtils from "../../utils/datetime_utils";
export default {
components: {},
data() {
  return {
    teacherAvatarUrl: '',
    teacherName: '',
    feedbackData: {},
    currentStudentName: '',
    currentStudentLevel: '',
    courseEditionId: '',
    lessonNo: '',
    classTime: ''
  };
},
methods: {
  courseEdition(number) {
    let filter = Vue.filter('levelTitle')
    return filter(number);
  },
  replaceBr(str) {
    if(str != null) {
      return str.replace(/\n|\r\n/g,"<br>")
    }else {
      return ''
    }
  }
},
created() {
  let {feedback, teacherurl, teachername, startTime, endTime, courseEditionId, lessonNo, courseLevel } = this.$route.query
  let ymd = datetimeUtils.formartDateFromUTC(
    startTime,
    "yyyy.MM.dd(w)"
  ),
  hmStartTime = datetimeUtils.formartDateFromUTC(
    startTime,
    "hh:mm"
  ),
  hmEndTime = datetimeUtils.formartDateFromUTC(
    endTime,
    "hh:mm"
  );
  this.classTime = ymd + " " + hmStartTime + "-" + hmEndTime;
  this.teacherAvatarUrl = teacherurl
  this.teacherName = teachername
  this.$api.history.getFirstClassFeedbackDetailData(feedback)
  .then(res => {
    this.feedbackData = res.data.data
    this.feedbackData.classroomFeedbackZh = this.replaceBr(this.feedbackData.classroomFeedbackZh)
    this.feedbackData.classroomFeedbackEn = this.replaceBr(this.feedbackData.classroomFeedbackEn)
    this.feedbackData.addKnowledgeZh = this.replaceBr(this.feedbackData.addKnowledgeZh)
    this.feedbackData.addKnowledgeEn = this.replaceBr(this.feedbackData.addKnowledgeEn)
    this.feedbackData.coreKnowledgeZh = this.replaceBr(this.feedbackData.coreKnowledgeZh)
    this.feedbackData.coreKnowledgeEn = this.replaceBr(this.feedbackData.coreKnowledgeEn)

    this.currentStudentName = JSON.parse(window.localStorage.getItem('__lgzy__s__')).currentStudentInfo.studentInfo.realName
    this.currentStudentLevel = courseLevel;
    this.courseEditionId = courseEditionId * 1;
    this.lessonNo = lessonNo;
  })
},
mounted() {

},
}
</script>
<style lang='stylus' scoped>
.bottomBg {
  width 100%
  height 88px
  position absolute
  left 0
  bottom 0
  bg-image('../../assets/theme-default/images/unitreport/bottom');
}
.contentFooter {
  width 90%
  font-size:24px;
  font-family:PingFang SC;
  font-weight:400;
  color:rgba(52,54,77,1);
  line-height:36px;
  position relative
  top -60px
  .contentFooterTimer {
    position absolute
    right 0
    bottom -100px
    display flex;
    flex-direction column
    align-items center
    justify-content center 
  }
}
.firstClassReportWrapper {
  display flex;
  flex-direction column;
  background-color rgb(218, 234, 254);
  .firstClassHeader {
    width 100%
    height:625px;
    background:linear-gradient(90deg,rgba(110,112,160,1),rgba(86,190,205,1));
    position relative
    .firstClassHeaderLogo {
      width:280px;
      height:96px;
      bg-image('../../assets/theme-default/images/unitreport/headerLogo');
      position absolute
      top 78px
      left 60px
    }
    .firstClassHeaderText {
      width 337px
      height 66px
      position absolute
      top 209px
      left 60px
      bg-image('../../assets/theme-default/images/unitreport/firstHeaderText');
    }
    .firstClassHeaderTextEn {
      width 371px
      height 170px
      position absolute
      top 200px
      left 60px
      bg-image('../../assets/theme-default/images/unitreport/firstFeedEn');
    }
    .firstClassHeaderImg {
      width 475px
      height 435px
      position absolute
      top 76px
      right 24px
      bg-image('../../assets/theme-default/images/unitreport/firstHeaderImg');
    }
    .firstTeacherInfo {
      position absolute;
      display flex;
      align-items center;
      left 60px;
      top 311px;
      .teacherNameText {
        margin-left 10px;
        font-size:34px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(255,255,255,1);
      }
    }
  }
  .firstClassContentWrapper {
    width 100%;
    background-color rgb(218, 234, 254);
    .firstClassContentContainer {
      margin 0 auto;
      display flex
      flex-direction column
      align-items center
      width 95%;
      position relative
      top -80px;
      left 0
      .contentTop {
        width 100%;
        height 475px;
        position relative
        border-radius:13px;
        // bg-image('../../assets/theme-default/images/unitreport/bol');
        background-color #fff
        margin-bottom 20px
      }
      .contentItem {
        width 100%;
        height auto;
        position relative
        border-radius:13px;
        top -20px
        background-color #fff
        margin-top 20px
        padding-bottom 70px
        // bg-image('../../assets/theme-default/images/unitreport/bol');

      }
    }
  }
  .contentHeader {
    width 100%;
    display flex;
    align-items center;
    justify-content space-between
    padding 0 102px;
    box-sizing border-box
    margin-top 30px;
    .titleBg {
      width:377px;
      height:63px;
      background:linear-gradient(90deg,rgba(26,36,68,1) 0%,rgba(88,183,201,1) 0%,rgba(140,144,225,1) 99%);
      border-radius:31px 0px 31px 0px;
      position relative
      .titleBgInner {
        font-size:26px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(255,255,255,1);
        width:377px;
        height:63px;
        background:rgba(110,112,160,1);
        border-radius:31px 0px 31px 0px;
        color #ffffff;
        display flex;
        align-items center;
        justify-content center;
        position absolute
        top -10px;
      }
    }
    .leftBorder {
      width:98px;
      height:38px; 
      bg-image('../../assets/theme-default/images/unitreport/left');
    }
    .rightBorder {
      width:98px;
      height:38px; 
      bg-image('../../assets/theme-default/images/unitreport/right');
    }
  }
  .contentText {
    font-size:20px;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(52,54,77,1);
    position relative
    z-index 99
    line-height:30px;
    padding 0 80px;
    margin-top 20px
  }
  .contentTopText {
    display flex
    flex-direction column
    align-items center
    h2 {
      font-size:38px;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(52,54,77,1);
      margin-top 49px;
      margin-bottom 14px
    }
    .timer {
      font-size:24px;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(153,153,153,1);
      line-height:36px;
      margin-bottom 22px
    }
    .word {
      box-sizing border-box;
      padding 0 80px;
      font-size:24px;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(52,54,77,1);
      line-height:36px;
    }
  }
  .fontColor {
    color #58B7C9
  }
  .doorHandImgleft {
    width 23px;
    height 123px
    bg-image('../../assets/theme-default/images/unitreport/doorHand');
    position absolute
    z-index 9
    bottom -70px
    left 80px
  }
  .doorHandImgRight {
    width 23px;
    height 123px
    bg-image('../../assets/theme-default/images/unitreport/doorHand');
    position absolute
    z-index 9
    bottom -70px
    right 80px
  }
}
</style>