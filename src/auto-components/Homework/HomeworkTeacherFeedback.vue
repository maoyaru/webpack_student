<template>
  <div>
    <div v-if="feedback && (feedback.comment_zh || feedback.comment_en)">
      <div class="line-1">{{$t('Teachers feedback')}}</div>
      <div class="line-2">{{DateTimeUtils.dateClockTime(feedback.createTime)}}</div>
      <div class="feedback">
        <div class="feedback-content">
          <div v-if="language == 'Chinese'">{{feedback.comment_zh}}</div>
          <div v-if="language == 'English'">{{feedback.comment_en}}</div>
        </div>
        <div class="btn-group">
          <div class="btn-group-l">
            <div class="item" :class="{'item-active': language == 'English'}" @click="language = 'English'">English</div>
            <div class="item" :class="{'item-active': language == 'Chinese'}" @click="language = 'Chinese'">中文</div>
          </div>
          <div class="btn-group-r">
            <div class="logo">
              <img src="@/images/homework/google-translate.png">
            </div>
            <div class="text">{{$t('Translated by Google translation')}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="result">
      <div class="result-item" v-for="i in result">
        <div class="title">
          <span>{{i.title}}：</span>
        </div>
        <div class="question-result">
          <div class="flex-class">
            <div class="question-result-item" v-for="(j,jIndex) in i.childList">
              <span>{{jIndex + 1}}</span>
              <img src="@/images/homework/right.png" v-if="j == 1">
              <img src="@/images/homework/wrong.png" v-else>
            </div>
          </div>
          <div class="flex-class" v-if="i.type == 5">
            <div class="question-result-item" v-for="(j,jIndex) in i.childList2">
              <span>{{jIndex + 1}}</span>
              <img src="@/images/homework/right.png" v-if="j == 1">
              <img src="@/images/homework/wrong.png" v-else>
            </div>
          </div>
        </div>
        <div class="question-result">

        </div>
      </div>
      <!--       <div class="result-item">
        <div class="title">填空题：</div>
        <div class="question-result">
          <div class="question-result-item" v-for="i in [1,2,3,4]">
            <span>{{i}}</span>
            <img src="@/images/homework/wrong.png">
          </div>
        </div>
      </div>
      <div class="result-item">
        <div class="title">连线题：</div>
        <div class="question-result">
          <div class="question-result-item" v-for="i in [1,2,3,4]">
            <span>{{i}}</span>
            <img src="@/images/homework/right.png">
          </div>
        </div>
      </div>
      <div class="result-item">
        <div class="title">阅读题：</div>
        <div class="question-result">
          <div class="question-result-item" v-for="i in [1,2,3,4]">
            <span>{{i}}</span>
            <img src="@/images/homework/wrong.png">
          </div>
        </div>
      </div> -->
      <div class="summary" v-if="feedback">
        <div><img src="@/images/homework/countAplus.png" v-if="feedback.score == 5"></div>
        <div><img src="@/images/homework/countA.png" v-if="feedback.score == 4"></div>
        <div><img src="@/images/homework/countB.png" v-if="feedback.score == 3"></div>
        <div><img src="@/images/homework/countC.png" v-if="feedback.score == 2"></div>
        <div><img src="@/images/homework/countF.png" v-if="feedback.score == 1"></div>
        <div class="text">共{{questionRightCount + questionWrongCount}}题，错{{questionWrongCount}}题</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {

  name: 'teacher-feedback',

  data() {
    return {
      language: 'Chinese',
      questionRightCount: 0,
      questionWrongCount: 0
    }
  },

  props: {
    result: null,
    feedback: null
  },

  created() {

  },

  mounted() {
    this.result.forEach(i => {
      i.childList.forEach(j => {
        if (j == 1) {
          this.questionRightCount++;
        } else {
          this.questionWrongCount++;
        }
      });
      if (i.type == 5) {
        i.childList2.forEach(j => {
          if (j == 1) {
            this.questionRightCount++;
          } else {
            this.questionWrongCount++;
          }
        });
      }
    });
  },

  methods: {

  }

}

</script>
<style scoped lang="stylus">
.line-1 {
  font-size: 18px;
  line-height: 22px;
  color: #34364D;
  margin-bottom: 6px;
}

.line-2 {
  color: #BDBDBD;
  font-size: 16px;
  line-height: 19px;
  margin-bottom: 24px;
}

/*反馈*/
.feedback {
  padding: 20px 30px;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  margin-bottom: 60px;

  .feedback-content {
    font-size: 16px;
    line-height: 24px;
    color: #333;
  }
}

/*反馈按钮*/
.btn-group {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  text-align: center;
  line-height: 36px;
  cursor: pointer;

  .btn-group-l {
    display: flex;

    .item {
      height: 36px;
      width: 120px;
      background: #F4F4F4;
      color: #999;
      font-size: 18px;
      border-radius: 24px;
      margin-right: 20px;
    }

    .item-active {
      background: #676BA8;
      color: #fff;
    }
  }

  .btn-group-r {
    display: flex;

    img {
      width: 39px;
      height: 36px;
      margin-right: 20px;
    }

    .text {
      font-size: 16px;
      color: #999990;
    }
  }
}

.result {
  /*height: 200px;*/
  padding-left: 150px;
  position: relative;
  margin-bottom: 40px;

  .result-item {
    display: flex;

    .title {
      width: 84px;
      color: #34364d;
      font-size: 16px;
      line-height: 22px;
      flex-shrink: 0;
      margin-top: 3px;
    }

    .question-result {
      display: flex;
      flex-wrap: wrap;
      cursor: pointer;

      span {
        display: inline-block;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: #f4f4f4;
        line-height: 28px;
        text-align: center;
        color: #34364D;
      }

      img {
        width: 28px;
        height: 28px;
        margin-bottom: -8px;
        margin-left: 10px;
      }
    }

    .question-result-item {
      flex-shrink: 0;
      margin-bottom: 20px;
      margin-right: 30px;
    }
  }

  .summary {
    position: absolute;
    top: 0;
    left: 0;
    width: 150px;

    img {
      width: 144px;
      height: 100px;
      display: inline-block;
      margin-left: -25px;
    }

    .text {
      text-align: left;
      color: #34364D;
      font-size: 16px;
      margin-top: 11px;
    }
  }
}

.flex-class {
  display: flex;
  flex-wrap: wrap;
}

</style>

今日工作：
1. 题库模块学生用户中心bug修复
2. 中文官网分辨率兼容问题优化

明日工作：
1. 3.6前端个模块跟进及开发
2. cocos项目跟进及H5小游戏开发
