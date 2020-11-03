<template>
  <div class="homework">
    <div class="header">
      <span
        class="f16"
        v-if="coursewareInfo"
      >{{$t(coursewareInfo.classType)}} Level{{classInfo.courseLevel | courseLevelShowFilter}} Lesson{{classInfo.lessonNo}}</span>
      <span class="f20" v-if="coursewareInfo">{{coursewareInfo.title}}</span>
      <div class="handle_icon">
        <!-- <i class="print"></i> -->
      </div>
    </div>
    <div class="body" v-if="propsPdfUrl != ''">
      <iframe class="pdfWrapper" :src="propsPdfUrl" width="800" height="600"></iframe>
    </div>
    <div class="not" v-else>{{$i18n.t('Not have original homework')}}</div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["classInfo", "propsPdfUrl"],
  data() {
    return {}
  },
  mounted() {
    //获取 pdf
    // let { lessonId } = this.classInfo;
    // this.$api.history.getHomeworkInfo(lessonId).then(res => {
    //   if (res.data.code === 200) {
    //     if (res.data.data.length === 0) return;
    //     this.pdfUrl = res.data.data[0].hwContent;
    //   } else {
    //     //错误处理
    //     // console.log(res.data.code);
    //   }
    // });
  },
  computed: {
    ...mapState("history", {
      coursewareInfo: state => state.coursewareInfo
    })
  }
};
</script>

<style scoped lang="stylus">
.homework {
  padding-top: 24px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .handle_icon {
      .print {
        display: inline-block;
        width: 48px;
        height: 48px;
        background-size: 100% 100%;
      }

      .print {
        right: 10px;
        top: -48px;
        bg-image('../../../assets/theme-default/images/index/print');
      }
    }

    >div, >span {
      flex: 1;
    }

    >div {
      text-align: right;
    }
  }

  .body {
    height: 1100px;
    background: rgba(235, 83, 47, 1);
    position: relative;
  }

  .not {
    width: 100%;
    text-align: center;
    color: #ccc;
  }

  .pdfWrapper {
    width: 100%;
    height: 100%;
  }
}
</style>
