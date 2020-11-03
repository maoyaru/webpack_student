<template>
  <el-dialog 
    :visible.sync="showCourseware"
    :before-close="closeDialog"
    :modal-append-to-body="false"
    center
    :show-close="false"
    class="courseware-preview"
    width="800px"
    >
    <div class="dialog-title">{{$t('Courseware Title')}}</div>
    <!-- <div class="zoom" @click="getFullCreeen"></div> -->
    <div class="courseware_box">
      <div class="tabs">
        <div :class="courseware" @click="changeActiveTab(0)">{{$t('Courseware')}}</div>
        <div :class="expanding" @click="changeActiveTab(1)">{{$t("Expanding")}}</div>
        <div class="hidden"></div>
        <iframe :src="pptUrl" frameborder="0"></iframe>
        <div class="courseNodata" v-if="coursewareIndex === showClassCourseware && pptUrl === ''">
          {{$t('No courseware')}}
        </div>
        <div class="extcNoData" v-if="coursewareIndex === showExpandingCourse && pptUrl === ''">
          <div class="noCourseIcon"></div>
          {{$t('No ExpandingCourseware')}}
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ["showCourseware", "classInfo"],
  data() {
    return {
      courseware: ["courseware", "f20", "active"],
      expanding: ["expanding", "f20"],
      coursewareIndex: 0,
      pptUrl: "",
      coursewareList: [],
      expandingCoursewareList: [],
      showClassCourseware: 0, //展示课件
      showExpandingCourse: 1 //展示扩展课件
    };
  },
  computed: {},
  mounted() {},
  watch: {
    showCourseware() {
      if (this.showCourseware) {
        this.getCourseWare();
      }
    },
    coursewareIndex() {
      if (this.coursewareIndex == this.showClassCourseware) {
        if (this.coursewareList[0] === undefined) {
          this.pptUrl = "";
        } else {
          if (this.coursewareList[0].cwType === this.ApiConstants.pptCode) {
            this.pptUrl = this.coursewareList[0].tkFileUrl;
          } else {
            this.pptUrl = this.coursewareList[0].cwUrl;
          }
        }
      } else {
        if (this.expandingCoursewareList[0] === undefined) {
          this.pptUrl = "";
        } else {
          if (
            this.expandingCoursewareList[0].ecwType ===
            this.ApiConstants.pptCode
          ) {
            this.pptUrl = this.expandingCoursewareList[0].tkFileUrl;
          } else {
            this.pptUrl = this.expandingCoursewareList[0].ecwUrl;
          }
        }
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit("closePreviewDialog");
    },
    changeActiveTab(index) {
      if (index == 0) {
        this.courseware = ["courseware", "f20", "active"];
        this.expanding = ["expanding", "f20"];
        this.coursewareIndex = this.showClassCourseware;
      } else {
        this.courseware = ["courseware", "f20"];
        this.expanding = ["expanding", "f20", "active"];
        this.coursewareIndex = this.showExpandingCourse;
      }
    },
    getCourseWare() {
      this.$api.history
        .getCoursewareInfo(this.classInfo.virtualclassId)
        .then(res => {
          if (res.status === 200 && res.data.code === 200) {
            if (
              res.data.data.courseCoursewareList != null &&
              res.data.data.courseCoursewareList.length != 0
            ) {
              this.coursewareList = res.data.data.courseCoursewareList;
              if (this.coursewareList[0].cwType === this.ApiConstants.pptCode) {
                this.pptUrl = this.coursewareList[0].tkFileUrl;
              } else {
                this.pptUrl = this.coursewareList[0].cwUrl;
              }
            }
            if (
              res.data.data.courseExtcoursewareList != null &&
              res.data.data.courseExtcoursewareList.length != 0
            ) {
              this.expandingCoursewareList =
                res.data.data.courseExtcoursewareList;
            }
          }
        });
    }
  },
  components: {}
};
</script>

<style lang="stylus" scoped>
.schedule_classes {
  .el-dialog {
    border-radius: 16px;

    .el-dialog__header {
      padding: 20px 20px 10px;
    }

    .el-dialog__body {
      padding: 0;
    }
    .el-dialog__title {
    }
  }
}
.courseware-preview{
  .el-dialog__body {
    padding: 0;
  }
  .dialog-title {
    width:200px; 
    margin:0 auto; 
    font-size:20px;
    font-weight:400;
    color:rgba(52,54,77,1);
    text-align: center;
  }
  .zoom {
    width:48px;
    height:48px;
    background: url('../../assets/theme-default/images/common/zoom.png');
    background-size: 100% 100%;
    margin-left:700px;     
  }

  .courseware_box {
    padding-bottom: 20px;
    position: relative;
    z-index: 100;

    .tabs {
      height: 500px;
      overflow: hidden;
      background: #fff;

      .courseNodata {
        width: 100%;
        text-align: center;
        position: relative;
        top: -400px;
        color: #ccc;
      }

      .noCourseIcon {
          width:240px;
          height:240px;
          background-image: url('../../assets/theme-default/images/history/noCourseIcon.png');
          background-size: 100% 100%;
          margin: 20px auto 25px;
      }

      .extcNoData {
        width: 100%;
        text-align: center;
        position: relative;
        top: -400px;
        color: #ccc;
      }

      .courseware, .expanding {
        width: 120px;
        height: 50px;
        position: absolute;
        color: white;
        line-height: 55px;
        text-align: center;
        z-index: -1;
        background: 100% 100% no-repeat;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
      }

      iframe {
        width: 100%;
        height: 490px;
      }

      .courseware {
        left: 10px;
        bg-image: ('../../assets/theme-default/images/index/courseware');
        top: -30px;
        cursor: pointer;
      }

      .expanding {
        left: 132px;
        bg-image: ('../../assets/theme-default/images/index/expanding');
        top: -30px;
        cursor: pointer;
      }

      .active {
        top: -50px;
      }
    }

    .fullscreen, .print {
      position: absolute;
      width: 48px;
      height: 48px;
      background-size: 100% 100%;
    }

    .fullscreen {
      right: 68px;
      top: -48px;
      cursor: pointer;
      bg-image: ('../../assets/theme-default/images/index/quanping');

      &:hover {
        bg-image: ('../../assets/theme-default/images/index/quanping_active');
      }
    }

    .print {
      right: 10px;
      top: -48px;
      cursor: pointer;
      bg-image('../../assets/theme-default/images/index/print');

      &:hover {
        bg-image('../../assets/theme-default/images/index/print_active');
      }
    }

    .profile {
      height: 600px;
      background: rgba(255, 117, 117, 1);
    }

    .last_page, .next_page {
      width: 32px;
      height: 42px;
      position: absolute;
      top: 0;
      bottom: 0;
      background-size: 100%;
      margin: auto;
    }

    .last_page {
      left: 0px;
      cursor: pointer;
      bg-image('../../assets/theme-default/images/index/last_page_active');
    }

    .next_page {
      right: 0;
      cursor: pointer;
      bg-image('../../assets/theme-default/images/index/next_page');
    }
  }
}
</style>
<style>
