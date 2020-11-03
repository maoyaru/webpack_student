<!-- question-fill -->
<template>
  <div class="question-fill-container">
    <!-- 试卷状态 -->
    <div class="item" v-if="!isFinished">
      <div>{{jIndex + 1}}、</div>
      <div v-for="(i,index) in content">
        <div :key="index" v-if="!i.rightFlag">{{i.sentence}}</div>
        <div class="fill" v-else>
          <input :style="{'width': (i.sentence.length + 2) * 16 + 'px'}" type="text" name="" v-model="value[index - 1]">
        </div>
      </div>
    </div>
    <!-- 结果状态 -->
    <div v-else>
      <div class="item">
        <div class="judge">
          <div class="right-icon" v-if="status == 1">
            <img class="img" src="@/images/homework/right.png">
          </div>
          <div class="wrong-icon" v-if="status == 2">
            <img class="img" src="@/images/homework/wrong.png">
          </div>
        </div>
        <div class="start">{{jIndex + 1}}、</div>
        <div v-for="(i,index) in content">
          <div :key="index" v-if="!i.rightFlag">{{i.sentence}}</div>
          <div class="fill" v-else>
            <input :class="{'wrong-input': status == 2}" class="right-input" :style="{'width': (i.sentence.length + 2) * 16 + 'px'}" type="text" name="" v-model="rightAnswer[index - 1]" disabled="true" v-if="status == 0">
            <input :class="{'wrong-input': status == 2}" class="right-input" :style="{'width': (i.sentence.length + 2) * 16 + 'px'}" type="text" name="" v-model="studentAnswer[index - 1]" disabled="true" v-else>
          </div>
        </div>
        <div class="hw-no-work" v-if="status == 0">[未做]</div>
      </div>
      <!-- 做错的话多显示一行正确的答案 -->
      <div class="item" v-if="status == 2">
        <div class="judge"></div>
        <div class="start">{{jIndex + 1}}、</div>
        <div v-for="(i,index) in content">
          <div :key="index" v-if="!i.rightFlag">{{i.sentence}}</div>
          <div class="fill" v-else>
            <input class="right-input" :style="{'width': (i.sentence.length + 2) * 16 + 'px'}" type="text" name="" v-model="rightAnswer[index - 1]" disabled="true">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {

  name: 'question-fill',

  data() {
    return {
      value: [],
    }
  },

  props: {
    content: {},
    jIndex: null,
    status: null,
    rightAnswer: null,
    studentAnswer: null,
    isFinished: null
  },

  computed: {
    valueResult() {
      var arr = []
      this.value.forEach((i,index) => {
        if (index % 3 == 0) {
          arr.push(i);
        }
      });
      return arr;
    }
  },

  created() {},

  mounted() {
    if (this.studentAnswer) {
      this.value = this.studentAnswer;
    }
  },

  methods: {

  }

}

</script>
<style scoped lang="stylus">
.question-fill-container {
  .item {
    color: #34364d;
    font-size: 18px;
    display: flex;
    line-height: 25px;
    margin-bottom: 40px;

    .judge {
      width: 40px;
    }

    .hw-no-work {
      color: #EB532F;
    }

    .right-icon,
    .wrong-icon {
      img {
        width: 28px;
        height: 28px;
        margin: 0 auto;
      }
    }

    input {
      border: none;
      border-bottom: 1px solid #34364d;
      padding: 0 5px;
      width: 30px;
      font-size: 18px;
      line-height: 25px;
      color: #34364d;
      text-align: center;

      &.right-input {
        color: #56BECD;
      }

      &.wrong-input {
        color: #EB532F;
      }
    }

    .fill {
      margin: 0 8px;
    }
  }
}

</style>
