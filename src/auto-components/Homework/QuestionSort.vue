<!-- question-sort -->
<template>
  <div class="question-sort-container">
    <!-- 题目 -->
    <div v-if="!isFinished">
      <div class="item">
        <div class="icon-container">
          <img src="@/images/homework/reset-icon.png" v-if="optionsSelected == 'no'">
          <img src="@/images/homework/reset-active-icon.png" @click="resetTags" v-else>
        </div>
        <div class="start">{{jIndex + 1}}、{{content.pre}}</div>
        <div class="sort">
          <input :style="{'width': inputWidthStyle}" type="text" name="" v-model="value" disabled="true">
        </div>
        <div class="end">{{content.post}}</div>
      </div>
      <!-- 选项 -->
      <div class="tag">
        <div v-for="(t,tIndex) in content.options">
          <div class="tag-item" :class="{'tag-item-active': t.selected}" @click="onClickTag(t, tIndex)">
            {{t.word}}
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="item">
        <div class="icon-container">
          <img src="@/images/homework/right.png" v-if="status == 1">
          <img src="@/images/homework/wrong.png" v-if="status == 2">
        </div>
        <div class="start">{{jIndex + 1}}、{{content.pre}}</div>
        <div class="sort">
          <input :style="{'width': inputWidthStyle}" :class="{'wrong-input': status == 2}" class="right-input" type="text" name="" v-model="rightAnswerStr" disabled="true" v-if="status == 0">
          <input :style="{'width': inputWidthStyle}" :class="{'wrong-input': status == 2}" class="right-input" type="text" name="" v-model="studentAnswerStr" disabled="true" v-else>
        </div>
        <div class="end">{{content.post}}</div>
        <div class="hw-no-work" v-if="status == 0">[未做]</div>
      </div>
      <div class="item" v-if="status == 2">
        <div class="icon-container"></div>
        <div class="start">{{jIndex + 1}}、{{content.pre}}</div>
        <div class="sort">
          <input :style="{'width': inputWidthStyle}" class="right-input" type="text" name="" v-model="rightAnswerStr" disabled="true">
        </div>
        <div class="end">{{content.post}}</div>
        <div class="hw-no-work" v-if="status == 0">[未做]</div>
      </div>
      <!-- 选项 -->
      <div class="tag">
        <div v-for="(t,tIndex) in content.options">
          <div class="tag-item" :class="{'tag-item-active': t.selected}">
            {{t.word}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {

  name: 'question-sort',

  data() {
    return {
      value: '',
      valueArray: [],
      optionsSelected: 'no',
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

    inputWidthStyle() {
      let value = '';
      this.content.options.map(i => {
        value += i.word;
      });
      return (value.length + 1) * 16 + 'px';
    },

    studentAnswerStr() {
      let str = '';
      this.studentAnswer.forEach(i => {
        str += i;
      });
      return str;
    },

    rightAnswerStr() {
      let str = '';
      this.rightAnswer.forEach(i => {
        str += i;
      });
      return str;
    }

  },

  created() {

  },

  mounted() {
    let count = 0;
    if (this.studentAnswer) {
      this.content.options.map(i => {
        this.studentAnswer.forEach(j => {
          if (i.word == j) {
            i.selected = true;
            count++;
          } else {
            // i.selected = false;
          }
        });
      });
      this.studentAnswer.forEach(j => {
        this.valueArray.push(j);        
      });
      if (count == 0) {
        this.optionsSelected = 'no'
      } else if (count == this.content.options.length) {
        this.optionsSelected = 'all'
      } else {
        this.optionsSelected = 'any'
      }
      this.studentAnswer.forEach(i => {
        this.value += i;
      });
    }
  },

  methods: {

    // 点击tag
    onClickTag(item, index) {
      if (this.optionsSelected != 'all') {
        if (!this.content.options[index].selected) {
          this.content.options[index].selected = true;
          this.value += item.word;
          this.valueArray.push(item.word);
        }
      } else {
        this.resetTags();
        this.content.options[index].selected = true;
        this.value += item.word;
        this.valueArray.push(item.word);
      }
      this.optionsSelected = this.optionsSelectedComputed();
    },

    // 重置tag
    resetTags() {
      this.content.options.map(i => {
        i.selected = false;
      });
      this.value = '';
      this.valueArray = [];
      this.optionsSelected = 'no';
    },

    optionsSelectedComputed() {
      let count = 0;
      this.content.options.map(i => {
        if (i.selected) {
          count++;
        }
      });
      if (count == 0) {
        return 'no'
      } else {
        if (count == this.content.options.length) {
          return 'all';
        } else {
          return 'any';
        }
      }
    }

  }

}

</script>
<style scoped lang="stylus">
.question-sort-container {
  box-sizing: border-box;
  padding-bottom: 20px;

  .item {
    position: relative;
    padding-left: 40px;
    color: #34364d;
    font-size: 16px;
    display: flex;
    line-height: 22px;
    margin-bottom: 40px;

    input {
      border: none;
      border-bottom: 1px solid #34364d;
      padding: 0 5px;
      width: 50px;
      font-size: 16px;
      line-height: 22px;
      color: #34364d;
      text-align: center;

      &.right-input {
        color: #56BECD;
      }

      &.wrong-input {
        color: #EB532F;
      }
    }

    .sort {
      margin: 0 8px;
    }

    .icon-container {
      cursor: pointer;
      position: absolute;
      top: 0;
      left: 0;
      width: 24px;
      height: 24px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.tag {
  display: flex;
  width: 800px;
  margin-left: 40px;
  flex-wrap: wrap;

  .tag-item {
    flex-shrink: 0;
    box-sizing: border-box;
    width: 120px;
    height: 30px;
    line-height: 30px !important;
    margin-bottom: 20px;
    background: #f4f4f4;
    color: #fff;
    line-height: 40px;
    text-align: center;
    margin-right: 80px;
    /*border-radius: 6px;*/
    cursor: pointer;
    color: #34364D;
    border-radius: 15px;
    font-size: 16px;
    text-align: center;
  }

  .tag-item-active {
    background: #6E70A0;
    color: #fff;
  }
}

</style>
