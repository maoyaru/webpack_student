<template>
  <div class="feedback">
    <div class="feedbackItem" v-for="(item, index) in feedbackItems" :key="index">
      <span class="f18">{{$t(index)}}</span>
      <div class="star">
        <i
          v-for="count in item"
          :key="index+count"
          class="lighten-star"
          @click="reduceScore(count, index)"
        ></i>
        <i
          v-for="count in 5-item"
          :key="index+(5-count+1)"
          class="grey-star"
          @click="addScore(count, index)"
        ></i>
      </div>
    </div>
    <textarea
      name
      id
      cols="30"
      rows="5"
      :placeholder="$i18n.t('Say something to your teacher …')"
      v-model="textareaVal"
    ></textarea>
    <p>{{$t('My feedback to teacher')}}</p>
    <div class="btns">
      <el-button
        round
        plain
        v-for="(item,index) in btnsList"
        :key="index"
        @click="changeDifficultLevel(index)"
        :class="{'active':ind===index}"
      >{{$t(item.text)}}</el-button>
    </div>
    <div class="submit">
      <el-button round plain @click="submitMyFeedBack">{{$t('SUBMIT MY FEEDBACK')}}</el-button>
    </div>
  </div>
</template>

<script>
import request from "../../../api/index";
export default {
  props: ["classinfo", "getCommentInfo"],
  data() {
    return {
      btnsList: [
        { text: "Too easy" },
        { text: "Moderate" },
        { text: "Too hard" }
      ],
      feedbackItems: {
        "Professional Knowledge": 5,
        "Instructional Delivery": 5,
        "Learning Environment": 5
      },
      textareaVal: "",
      difficultLevel: 0,
      ind:0
    };
  },
  mounted() {},
  methods: {
    changeDifficultLevel(index) {
      this.difficultLevel = index + 1;
      console.log(index,'index')
      this.ind=index;
    },
    reduceScore(count, index) {
      this.feedbackItems[index] = count;
    },
    addScore(count, index) {
      this.feedbackItems[index] += count;
    },
    submitMyFeedBack() {
      let userId =
          this.$store.state.student.currentStudent.id ||
          window.localStorage.getItem("currentChild"),
        virtualclassId = this.classinfo.virtualclassId,
        tutorUserId = this.classinfo.tutorUserId,
        params = {
          commentEn: null,
          commentZh: this.textareaVal,
          difficultLevel: this.difficultLevel,
          evaluatedUserId: tutorUserId,
          ratingId: this.feedbackItems["Instructional Delivery"],
          ratingLe: this.feedbackItems["Learning Environment"],
          ratingPk: this.feedbackItems["Professional Knowledge"],
          suggestion: null
        };
      if (this.textareaVal && this.difficultLevel && this.feedbackItems) {
        request.history
          .studentsToTeacherComment(params, userId, virtualclassId)
          .then(res => {
            if (res.data.code === 200) {
              this.$message({
                message: "评论成功",
                center: true
              });
              this.getCommentInfo();
            } else {
              this.$message({
                message: "评论失败",
                center: true
              });
            }
          });
      } else {
        this.$message({
          message: "Please evaluate first",
          center: true
        });
      }
    }
  }
};
</script>

<style scoped lang="stylus">
.feedback {
  .active {
    background:rgba(239,168,62,1);
    color:rgba(255,255,255,1);
    border: 2px solid rgba(255,255,255,1);
  }

  .feedbackItem {
    width: 360px;
    height: 60px;
    display: flex;
    justify-content: space-between;
    color: rgba(178, 178, 178, 1);
    align-items: center;
    padding: 0 30px;

    .star {
      display: flex;
      margin-bottom: 20px;

      .lighten-star, .grey-star {
        display: block;
        width: 24px;
        height: 24px;
        background-size: 100% 100%;
      }

      .lighten-star {
        bg-image('../../../assets/theme-default/images/history/xingxing');
      }

      .grey-star {
        bg-image('../../../assets/theme-default/images/history/greystar');
      }
    }
  }

  textarea {
    width: 100%;
    padding: 18px 30px 24px;
    box-sizing: border-box;
    resize: none;
    border-radius: 12px;
    border: 1px solid rgba(229, 229, 229, 1);
    outline: none;
    color: #34364d;
    margin-bottom: 30px;
  }

  p {
    margin: 0;
    margin-bottom: 10px;
  }

  .btns {
    margin-bottom: 40px;

    .el-button.is-round {
      padding: 12px 45px;
    }
  }

  .submit {
    text-align: center;

    .el-button.is-round {
      border-radius: 6px;
    }
  }
}
</style>
