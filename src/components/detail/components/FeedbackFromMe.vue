<template>
  <div class="feedback">
    <div class="feedbackItem" v-for="(item, index) in feedbackItems" :key="index">
      <span class="f18">{{$t(index)}}</span>
      <div class="star">
        <i v-for="count in item" :key="index+count" class="lighten-star"></i>
        <i v-for="count in 5-item" :key="index+(5-count+1)" class="grey-star"></i>
      </div>
    </div>
    <div class="comment">
      <span class="f16">{{studentComment.commentZh}}</span>
      <i class="little-arrow"></i>
    </div>
    <p class="comment-time f16">{{new Date(studentComment.createTime).toLocaleString()}}</p>
    <div class="btns">
      <p class="f18">{{$t('My feedback to teacher')}}</p>
      <el-button
        :disabled="true"
        round
        plain
        v-for="(item,index) in btnsList"
        :key="index"
        :class="{'active':ind === index}"
      >{{$t(item.text)}}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["studentComment"],
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
      ind: 0
    };
  },
  mounted() {
    this.feedbackItems["Professional Knowledge"] = this.studentComment.ratingPk;
    this.feedbackItems["Professional Knowledge"] = this.studentComment.ratingPk;
    this.feedbackItems["Instructional Delivery"] = this.studentComment.ratingId;
    this.feedbackItems["Learning Environment"] = this.studentComment.ratingLe;
    this.ind = this.studentComment.difficultLevel - 1;
  }
};
</script>

<style scoped lang="stylus">
.feedback {
  margin-top: 10px;

  .feedbackItem {
    padding: 0 500px 0 30px;
    line-height: 40px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    color: rgba(178, 178, 178, 1);
  }

  .star {
    display: flex;
    justify-content: space-between;

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

  .comment {
    padding: 20px 30px 70px;
    color: rgba(51, 51, 51, 1);
    position: relative;
    border: 1px solid rgba(229, 229, 229, 1);
    border-radius: 12px;
    color: rgba(51, 51, 51, 1);
    margin-bottom: 24px;
    margin-top: 30px;

    span {
      line-height: 24px;
    }

    .little-arrow {
      position: absolute;
      width: 10px;
      height: 15px;
      right: 30px;
      bottom: -13px;
      background-size: 100% 100%;
      transform: rotateZ(180deg);
      bg-image('../../../assets/theme-default/images/history/little_arrow');
    }
  }

  .comment-time {
    text-align: right;
    color: rgba(189, 189, 189, 1);
    margin-bottom: 40px;
  }

  .btns {
    p {
      margin-bottom: 10px;
      margin-top: 0;
    }

    .btn-item {
      display: inline-block;
      padding: 12px 45px;
      border-radius: 44px;
      border: 2px solid rgba(78, 79, 105, 1);
      color: rgba(78, 79, 105, 1);
    }

    .active {
      border: 2px solid rgba(239, 168, 62, 1);
      background: rgba(239, 168, 62, 1);
      color: white;
    }
  }
}
</style>
