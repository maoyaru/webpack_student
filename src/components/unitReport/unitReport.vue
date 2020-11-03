<template>
  <div class="unitReportWrapper">
    <div class="unitHeader">
      <div class="unitHeaderImg"></div>
      <div class="unitHeaderLogo"></div>
      <div v-if="$i18n.locale === 'zh'" class="unitHeaderText"></div>
      <div v-else class="unitHeaderTextEn"></div>
      <div class="unitHeaderTeacherInfo" :style="$i18n.locale === 'zh'?'':'top:390px'">
        <el-avatar
          :size="60"
          class="c-student avatar"
          :src="teacherAvatar"
        ></el-avatar>
        <div class="teacherNameText"><span>{{teacherName}}</span></div>
      </div>
    </div>
    <div class="unitContentWrapper">
        <div class="unitContentConatiner">
          <div class="contentTop">
            <div class="contentHeader">
              <div class="leftBorder"></div>
              <div class="titleBg">
                <div class="titleBgInner">
                  {{new Date(unitReportData.firstStartTime).toLocaleDateString().replace('/','.').replace('/','.')}}
                  ~ 
                  {{new Date(unitReportData.lastStartTime).toLocaleDateString().replace('/','.').replace('/','.')}}
                </div>
              </div>
              <div class="rightBorder"></div>
            </div>
            <div class="contentText">
              <!-- <h2>{{$t(courseEdition(currentStudentEdtion))}} Level{{currentStudentLevel}} Unit{{unitReportData.unitNo}} Lesson{{unitReportData.firstLessonNo}}~{{unitReportData.lastLessonNo}}</h2> -->
              <h2>{{$t(courseEdition(currentStudentEdtion))}} Level{{currentStudentLevel}} {{unitReportData.unitName}}</h2>
              <p v-if="$i18n.locale === 'zh'">祝贺<span class="fontColor">{{currentStudentName}}</span>小朋友学完了
              <!-- <span class="fontColor">Level{{currentStudentLevel}} Unit{{unitReportData.unitNo}}</span> -->
              <span class="fontColor">Level{{currentStudentLevel}} {{ unitReportData.unitName }}</span>
              <!-- 的<span class="fontColor">{{(unitReportData.lastLessonNo - unitReportData.firstLessonNo)+1}}</span>节课！ -->
              单元的课程，我们根据 孩子这段时间的上课表现和进步情况，提供本单元的学习报告，希望可以让您对孩子的学习情况有更多了解</p>
              <p style="font-size:20px" v-else>Congratulations <span class="fontColor">{{currentStudentName}}</span> ! You have successfully finished the classes of
              <!-- <span class="fontColor">{{(unitReportData.lastLessonNo - unitReportData.firstLessonNo)+1}}</span> -->
              <!-- classes of <span class="fontColor">Level{{currentStudentLevel}} Unit{{unitReportData.unitNo}}</span> -->
              <span class="fontColor">Level{{currentStudentLevel}} {{ unitReportData.unitName }}</span>
              .Based on <span class="fontColor">{{currentStudentName}}</span>’s in-class performance and progression, we provide you with this unit learning report to help you keep track of your child’s learning progress.</p>
            </div>
            <div class="doorHandImgleft"></div>
            <div class="doorHandImgRight"></div>
          </div>
          <div class="contentCenter">
            <div class="contentHeader">
              <div class="leftBorder"></div>
              <div class="titleBg">
                <div class="titleBgInner">
                  {{$t('Unit Assessment Results')}}
                </div>
              </div>
              <div class="rightBorder"></div>
            </div>
            <div class="contentTable">
              <ul class="flex6">
                <li class="rightWhite bgColor">{{$i18n.locale === 'zh'?'单元技能':'Unit Skills'}}</li>
                <li :class="{'justRight': index === unitSkillList.length - 1, 'rightAndBottom': index !== unitSkillList.length - 1}" v-for="(item,index) in unitSkillList" :key="index">{{item.skill}}</li>
              </ul>
              <ul class="flex2">
                <li class="rightWhite bgColor">{{$i18n.locale === 'zh'?'单元学习前':'Before Learning'}}</li>
                <li :class="{'rightAndBottom': index !== unitSkillList.length - 1, 'justRight': index === unitSkillList.length - 1}" v-for="(item,index) in unitSkillList" :key="index">
                  <el-rate v-model="item.before" disabled></el-rate>
                </li>
              </ul>
              <ul class="flex2">
                <li class="bgColor">{{$i18n.locale === 'zh'?'单元学习后':'After Learning'}}</li>
                <li :class="{'justBottom': index !== unitSkillList.length - 1}" v-for="(item, index) in unitSkillList" :key="index">
                  <el-rate v-model="item.after" disabled></el-rate>
                </li>
              </ul>
            </div>
            <div class="doorHandImgleft"></div>
            <div class="doorHandImgRight"></div>
          </div>
          <div class="contentBottom">
            <div class="contentHeader">
              <div class="leftBorder"></div>
              <div class="titleBg">
                <div class="titleBgInner">
                  <span v-if="$i18n.locale === 'zh'">二、授课老师点评</span>
                  <span v-else style="font-size:22px">Teacher’s Comments/Feedback</span>
                </div>
              </div>
              <div class="rightBorder"></div>
            </div>
            <div class="contentItem">
              <div class="contentItemTitle">
                <span v-if="$i18n.locale === 'zh'">课堂表现</span>
                <span v-else style="font-size:14px">Course Performance</span>
              </div>
              <div class="contentItemText">
                <div class="contentItemText" v-html="unitReportData.classroomPerformanceZh" v-if="$i18n.locale === 'zh'"></div>
                <div class="contentItemText" v-html="unitReportData.classroomPerformanceEn" v-if="$i18n.locale === 'en'"></div>
              </div>
            </div>
            <div class="contentItem">
              <div class="contentItemTitle">
                <span v-if="$i18n.locale === 'zh'">提升空间</span>
                <span v-else style="font-size:14px">Areas for Improvement</span>
              </div>
              <div class="contentItemText">
                <div class="contentItemText" v-html="unitReportData.improvementPointZh" v-if="$i18n.locale === 'zh'"></div>
                <div class="contentItemText" v-html="unitReportData.improvementPointEn" v-if="$i18n.locale === 'en'"></div>
              </div>
            </div>
            <div class="contentItem">
              <div class="contentItemTitle">
                <span v-if="$i18n.locale === 'zh'">学习建议</span>
                <span v-else style="font-size:14px">Learning Suggestions</span>
              </div>
              <div class="contentItemText">
                <div class="contentItemText" v-html="unitReportData.learningSuggestionZh" v-if="$i18n.locale === 'zh'"></div>
                <div class="contentItemText" v-html="unitReportData.learningSuggestionEn" v-if="$i18n.locale === 'en'"></div>
              </div>
            </div>
          </div>
          <div class="contentFooter">
            <span v-if="$i18n.locale === 'zh'">以上是我们对您孩子这一单元的表现给出的一些评价和建议， 如果家长想更多了解孩子的学习情况，请咨询我们的学管老师。</span>
            <span v-else>The above contents are our feedback and suggestions for your child, if you would like to know more about your child’s learning journey, please consult with our supervisor. Thank you! </span>
            <div class="contentFooterTimer">
              <span v-if="$i18n.locale === 'zh'">LingoAce教师组</span>
              <span v-else>LingoAce Teaching Team</span>
              <span>{{new Date(unitReportData.updateTime).toLocaleDateString().replace('/','.').replace('/','.')}}</span>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
export default {
data() {
	return {
		value: 4,
		teacherAvatar: '',
		teacherName: '',
		currentStudentName: '',
		currentStudentLevel: 1,
		unitSkillList: [],
		unitReportData: {},
		currentStudentEdtion: '',
	};
},
methods: {
  courseEdition(number) {
    number *= 1
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
  let {unit, teacherurl, teachername, edit, level} = this.$route.query
  this.teacherAvatar = teacherurl
  this.teacherName = teachername
  this.$api.history.getUnitReportDetailData(unit)
  .then(res => {
    this.currentStudentName = JSON.parse(window.localStorage.getItem('__lgzy__s__')).currentStudentInfo.studentInfo.realName
    this.currentStudentLevel = level
    this.currentStudentEdtion = edit
    this.unitReportData = res.data.data

    this.unitReportData.learningSuggestionZh = this.replaceBr(this.unitReportData.learningSuggestionZh)
    this.unitReportData.learningSuggestionEn = this.replaceBr(this.unitReportData.learningSuggestionEn)
    this.unitReportData.classroomPerformanceZh = this.replaceBr(this.unitReportData.classroomPerformanceZh)
    this.unitReportData.classroomPerformanceEn = this.replaceBr(this.unitReportData.classroomPerformanceEn)
    this.unitReportData.improvementPointZh = this.replaceBr(this.unitReportData.improvementPointZh)
    this.unitReportData.improvementPointEn = this.replaceBr(this.unitReportData.improvementPointEn)

    this.unitSkillList = JSON.parse(res.data.data.skillAssessmentZh)
  })
},
mounted() {

},
}
</script>
<style lang='stylus'>
.unitReportWrapper {
  display flex;
  flex-direction column;
  background-color rgb(218, 234, 254);
  .el-rate__icon {
    font-size 26px;
  }
}
.unitHeader {
  height:522px;
  background:linear-gradient(60deg,rgba(110,112,160,1),rgba(86,190,205,1));
  position relativel;
  .unitHeaderImg {
    width 601px
    height 587px
    bg-image('../../assets/theme-default/images/unitreport/headerBg');
    position absolute;
    right 0;
    top 41px;
  }
  .unitHeaderLogo {
    width 280px;
    height 96px;
    bg-image('../../assets/theme-default/images/unitreport/headerLogo');
    position absolute;
    top 78px;
    left 60px;
  }
  .unitHeaderText {
    width 406px;
    height 66px;
    bg-image('../../assets/theme-default/images/unitreport/headerText');
    position absolute;
    left 59px;
    top 209px
  }
  .unitHeaderTextEn {
    width 345px;
    height 167px;
    bg-image('../../assets/theme-default/images/unitreport/reportEnHeader');
    position absolute;
    left 59px;
    top 209px
  }
  .unitHeaderTeacherInfo {
    position absolute;
    display flex;
    align-items center;
    left 60px;
    top 308px;
    .teacherNameText {
      margin-left 10px;
      font-size:34px;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(255,255,255,1);
    }
  }
}
.unitContentWrapper {
  width 100%;
  background-color rgb(218, 234, 254);
  .unitContentConatiner {
    margin 0 auto;
    display flex
    flex-direction column
    align-items center
    width 95%;
    position relative
    top -40px;
    left 0
    .contentTop {
      width 100%;
      height 475px;
      position relative
      border-radius:13px;
      bg-image('../../assets/theme-default/images/unitreport/bol');

      .contentText {
        width 100%
        display flex;
        flex-direction column
        align-items center
        h2 {
          font-size:38px;
          font-family:PingFang SC;
          font-weight:400;
          color:rgba(52,54,77,1);
        }
        p {
          font-size:24px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(52,54,77,1);
          box-sizing border-box;
          padding 0 80px;
          line-height 36px
        }
      }
    }
    .contentCenter {
      width 100%;
      padding-bottom: 120px;
      position relative
      border-radius:13px;
      bg-image('../../assets/theme-default/images/unitreport/bol');
      margin-top -20px
      .contentTable {
        margin 0 auto;
        margin-top 50px;
        width 80%;
        height 420px;
        border:2px solid rgba(168, 169, 198, 1);
        display flex;
        border-radius 8px;
        background-color #fff
        ul {
          display flex;
          flex-direction column
          li {
            flex: 1;
            display flex;
            align-items center;
            justify-content center
            padding: 10px;
            line-height 1.2
            max-height: 80px;
            overflow auto;
            box-sizing: border-box;
          }
        }
      }
    }
    .contentBottom {
      width 100%;
      height 1069px;
      position relative
      border-radius:13px;
      margin-top -20px;
      bg-image('../../assets/theme-default/images/unitreport/bol');
      .contentItem {
        width 80%;
        height 240px
        overflow auto
        border:2px solid rgba(168, 169, 198, 1);
        border-radius:7px;
        margin 0 auto
        margin-top 20px
        background #fff
        .contentItemTitle {
          width:155px;
          height:48px;
          background:rgba(110,112,160,1);
          border-radius:4px;
          font-size:24px;
          font-family:PingFang SC;
          font-weight:500;
          color:rgba(255,255,255,1);
          display flex;
          align-items center;
          justify-content center
        }
        .contentItemText {
          padding 23px 30px;
          font-size:20px;
          font-family:PingFang SC;
          font-weight:400;
          color:rgba(52,54,77,1);
          line-height:30px;
        }
      }
    }
    .contentFooter {
      width 90%
      font-size:24px;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(52,54,77,1);
      line-height:36px;
      position relative
      top -80px
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
}
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
.bolBg {
  width 100%
  height 100%
  position absolute
  left 0
  bottom 0
  bg-image('../../assets/theme-default/images/unitreport/bol');
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
.fontColor {
  color #58B7C9
}
.doorHandImgleft {
  width 23px;
  height 123px
  bg-image('../../assets/theme-default/images/unitreport/doorHand');
  position absolute
  z-index 9
  bottom -20px
  left 80px
}
.doorHandImgRight {
  width 23px;
  height 123px
  bg-image('../../assets/theme-default/images/unitreport/doorHand');
  position absolute
  z-index 9
  bottom -20px
  right 80px
}
.rightAndBottom {
  border-bottom 2px solid rgba(168,169,198,1)
  border-right 2px solid rgba(168,169,198,1)
}
.justBottom {
  border-bottom 2px solid rgba(168,169,198,1)
}
.justRight {
  border-right 2px solid rgba(168,169,198,1)
}
.rightWhite {
  border-right 2px solid #FFFFFF
}
// .w300 {
//   width 400px
// }
.flex6 {
  flex: 4
}
.flex2 {
  flex: 3
}
.bgColor {
  background-color #A8A9C6
  font-size:24px;
  font-family:PingFang SC;
  font-weight:500;
  color:rgba(255,255,255,1);
}
</style>