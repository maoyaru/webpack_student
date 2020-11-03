<template>
  <div class="complete">
    <div v-for="(item, index) in classList" :key="index">
      <Class :classInfo="item">
        <template v-slot:homework-status>
          <div class="homework-status" :class="homework_status(item)"></div>
        </template>
        <template v-slot:btn-warpper>
          <div class="btns">
            <el-button
              type="primary"
              round
              class="f14"
              @click.stop="selectClass(item,'fifth')"
            >{{$t("COMMENT")}}</el-button>
            <el-button
              type="primary"
              round
              class="f14"
              @click.stop="selectClass(item,'first')"
            >{{$t("REVIEW")}}</el-button>
            <el-button
              type="primary"
              round
              class="f14"
              @click="lookBeforeVideo(item)"
            >{{$t("PLAYBACK")}}</el-button>
            <el-button
              type="primary"
              round
              class="f14"
              :disabled="item.homeworkStatus===0"
              @click.stop="selectClass(item,'third')"
            >{{$t("HOMEWORK")}}</el-button>
          </div>
        </template>
      </Class>
    </div>

    <el-dialog
      :title="$t('Playback List')"
      :center="true"
      :show-close="false"
      :visible.sync="isOpen"
      width="400px"
      append-to-body
      class="m-alert-dialog-with-title"
    >
      <div class="c-tips">
        <ul>
          <li v-for="(item, index) in playbackList" :key="index">
            <a :href="item" target="__blank">{{$t('PLAYBACK')}} {{index+1}}</a>
          </li>
        </ul>
      </div>
    </el-dialog>

    <NoData v-if="classList.length === 0"></NoData>
    <div class="seeMoreWrapper">
      <el-button
        :loading="seeMoreLoadingFlag"
        class="seeMore"
        @click="seeMore"
        v-if="showSeeMore()"
      >{{$t('SEE MORE')}}</el-button>
    </div>
  </div>
</template>
                              
<script>
import Class from "../../common/Class";
import NoData from "./NoData";
export default {
  data() {
    return {
      activeName: "first",
      classList: [],
      pageNum: 1,
      seeMoreLoadingFlag: false,
      isOpen: false,
      playbackList: [],
      playbackLoading: false
    };
  },
  mounted() {
    this.getCompletedClassAjax();
  },
  methods: {
    //已上小班课列表请求
    getCompletedClassAjax() {
      let studentId =
        this.$store.state.student.currentStudent.id ||
        window.localStorage.getItem("currentChild");
      this.$api.grouppurchase
        .getAfterSmallClassList(
          studentId,
          this.pageNum,
          this.Constants.smallGroupPageSize
        )
        .then(res => {
          if (res.data.code === 200) {
            // console.log(res);
            if (res.data.data.list) {
              if (res.data.data.list.length === 0) {
                // this.$message({
                //   message: 'no more data',
                //   center: true
                // });
                this.seeMoreLoadingFlag = false;
              } else {
                let arr = [...this.classList, ...res.data.data.list];
                this.classList = arr;
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
        if (item.score === 3) {
          return "score3";
        } else if (item.score === 4) {
          return "score4";
        } else if (item.score === 5) {
          return "score5";
        }
      }
    },
    selectClass(item, path) {
      //跳转详情
      this.$router.push({
        name: "detail",
        params: {
          classInfo: item,
          activeName: path
        }
      });
    },
    showSeeMore() {
      if (this.classList.length <= this.Constants.smallGroupPageSize - 1) {
        return false;
      } else {
        return true;
      }
    },
    seeMore() {
      this.seeMoreLoadingFlag = true;
      this.pageNum += 1;
      this.getCompletedClassAjax();
    },
    lookBeforeVideo(item) {
      this.playbackLoading = true;
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
    }
  },
  components: {
    Class,
    NoData
  }
};
</script>

<style scoped lang="stylus">
.seeMoreWrapper {
  width: 150px;
  height: 30px;
  margin: 10px auto;

  .seeMore {
    background-color: rgba(255, 255, 255, 1);
    border-radius: 8px;
    border: 2px solid rgba(215, 143, 37, 1);
    color: #D78F25;
    cursor: pointer;
  }
}

.complete {
  .homework-status {
    position: absolute;
    width: 144px;
    height: 100px;
    top: 30px;
    right: 0;
    background-size: 100%;
  }

  .btns {
    position: absolute;
    right: 30px;
    bottom: 30px;
  }

  .score3 {
    bg-image('../../../assets/theme-default/images/common/score3');
  }

  .score4 {
    bg-image('../../../assets/theme-default/images/common/score4');
  }

  .score5 {
    bg-image('../../../assets/theme-default/images/common/score5');
  }

  .not-corrected {
    bg-image('../../../assets/theme-default/images/common/tobe_corrected');
  }

  .not-submitted {
    bg-image('../../../assets/theme-default/images/common/not_submitted');
  }
}
</style>
