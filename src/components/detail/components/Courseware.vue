<template>
  <div class="courseware">
    <div class="header">
      <!-- <span
        class="f16"
        v-if="classInfo"
      >{{$t(courseEdition(classInfo.courseEditionId))}} Level{{classInfo.courseLevel | courseLevelShowFilter}} Lesson{{classInfo.lessonNo}}</span> -->
      <span class="f20">{{pptTitle}}</span>
      <span
        class="printIcon"
        v-if="label === 'Courseware' && printCourseUrl !== ''"
        @click="clickToPrintCourse"
      ></span>
      <span
        class="printIcon"
        v-if="label === 'ExpandingCourseware' && printExcUrl !== ''"
        @click="clickToprintExc"
      ></span>
    </div>
    <div class="body" v-if="label === 'Courseware' && cpptUrl !== ''">
      <iframe class="courseware" :src="cpptUrl" frameborder="0"></iframe>
    </div>
    <div class="noCourse" v-if="label === 'Courseware' && cpptUrl === ''">
      {{$t('No courseware')}}
    </div>

    <div class="body" v-if="label === 'ExpandingCourseware' && excpptUrl !== ''">
      <iframe class="courseware" :src="excpptUrl" frameborder="0"></iframe>
      <iframe class="courseware" :src="excpptUrl" frameborder="0"></iframe>
    </div>
    <div
      class="noCourse"
      v-if="label === 'ExpandingCourseware' && excpptUrl === ''"
    >
      <div class="noCourseIcon"></div>
      {{$t('No ExpandingCourseware')}}
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import request from '../../../api/index'
import Courseware from '../../common/Courseware'
import { mapState } from 'vuex'
export default {
  props: ['classInfo', 'label'],
  data() {
    return {
      pptBaseUrl: 'https://view.officeapps.live.com/op/view.aspx?src=',
      cpptUrl: '',
      excpptUrl: '',
      pptTitle: '',
      CoursewareState: null,
      courseType: 1,
      excType: 1,
      printCourseUrl: '',
      printExcUrl: ''
    }
  },
  created() {
    if (this.label === 'Courseware') {
      if (this.classInfo) {
        let { virtualclassId } = this.classInfo
        // 正常的课件
        request.history.getCoursewareInfo(virtualclassId).then(res => {
          if (res.data.code === 200) {
            if (
              res.data.data.courseCoursewareList.length === 0 ||
              res.data.data.courseCoursewareList === null
            )
              return
            this.pptTitle = res.data.data.courseCoursewareList[0].cwName
            this.courseType = res.data.data.courseCoursewareList[0].cwType
            if (this.courseType === this.ApiConstants.pptCode) {
              this.cpptUrl = res.data.data.courseCoursewareList[0].tkFileUrl
              this.printCourseUrl = res.data.data.courseCoursewareList[1]
                ? res.data.data.courseCoursewareList[1].cwUrl
                : ''
            } else {
              this.cpptUrl = res.data.data.courseCoursewareList[0].cwUrl
            }
          } else {
            //错误处理
          }
        })
      }
    } else if (this.label === 'ExpandingCourseware') {
      setTimeout(() => {
        if (this.classInfo) {
          let { virtualclassId } = this.classInfo
          request.history.getCoursewareInfo(virtualclassId).then(res => {
            if (res.data.code === 200) {
              if (
                res.data.data.courseExtcoursewareList === null ||
                res.data.data.courseExtcoursewareList.length === 0
              )
                return

              this.pptTitle = res.data.data.courseExtcoursewareList[0].ecwName
              this.excType = res.data.data.courseExtcoursewareList[0].ecwType
              // 校验类型 ppt 或者 pdt
              if (this.excType === this.ApiConstants.pptCode) {
                this.excpptUrl =
                  res.data.data.courseExtcoursewareList[0].tkFileUrl
                this.printExcUrl = res.data.data.courseExtcoursewareList[1]
                  ? res.data.data.courseExtcoursewareList[1].ecwUrl
                  : ''
              } else {
                this.excpptUrl = res.data.data.courseExtcoursewareList[0].ecwUrl
              }
            } else {
              //错误处理
            }
          })
        }
      }, 500)
      //扩展课件
    }
  },
  methods: {
    clickToPrintCourse() {
      window.open(this.printCourseUrl)
    },
    clickToprintExc() {
      window.open(this.printExcUrl)
    },
    fullScreen() {
      this.$emit('func', 1)
    },
    courseEdition(number) {
      let filter = Vue.filter('levelTitle')
      return filter(number)
    }
  },
  watch: {
    label() {
      // console.log(123);
    }
  },
  components: {
    Courseware
  }
}
</script>

<style scoped lang="stylus">
.printIcon {
  display: inline-block;
  width: 40px;
  height: 40px;
  bg-image('../../../assets/theme-default/images/index/print');
}

.printIcon:hover {
  bg-image('../../../assets/theme-default/images/index/print_active');
}

.courseware {
  padding-top: 24px;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .handle_icon {
      .fullscreen, .print {
        display: inline-block;
        width: 48px;
        height: 48px;
        background-size: 100% 100%;
      }

      .fullscreen {
        right: 68px;
        top: -48px;
        bg-image('../../../assets/theme-default/images/index/quanping');
      }

      .print {
        right: 10px;
        top: -48px;
        bg-image('../../../assets/theme-default/images/index/print');
      }
    }

    >span, >div {
      // flex: 1;
    }

    >div {
      text-align: right;
    }
  }

  .noCourse {
    width: 100%;
    text-align: center;
    color: #ccc;
    .noCourseIcon {
      width:240px;
      height:240px;
      background-image: url('../../../assets/theme-default/images/history/noCourseIcon.png');
      background-size: 100% 100%;
      margin: 20px auto 25px;
    }
  }

  .body {
    height: 660px;
    width: 100%;
    position: relative;
    overflow: hidden;
    margin-top: 10px;

    .courseware {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
    }

    .last_page, .next_page {
      position: absolute;
      width: 32px;
      height: 42px;
      top: 0;
      bottom: 0;
      margin: auto;
      background-size: 100% 100%;
    }

    .last_page {
      left: 0;
      bg-image('../../../assets/theme-default/images/index/last_page_active');
    }

    .next_page {
      right: 0;
      bg-image('../../../assets/theme-default/images/index/next_page');
    }
  }
}
</style>
