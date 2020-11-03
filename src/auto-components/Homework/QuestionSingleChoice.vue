<!-- question-single-choice -->
<template>
  <div>
    <div class="section-img" v-if="stemImg">
      <div class="row-box" v-if="imgShowType == 'row'">
        <img :src="stemImg">
      </div>
      <div class="column-box" v-if="imgShowType == 'column'">
        <img :src="stemImg">
      </div>
    </div>
    <div class="question-single-choice-container" v-if="!isFinished">
      <div class="item" :style="{'width': i.answer.length > 10 ? '100%' : '50%'}" v-if="!i.answerImage" v-for="(i,index) in options" :key="index" @click="changeItem(i, index)">
        <div class="s-letter" :class="{'s-letter-select': currentSelectitem == index}">{{i.letter}}</div>
        <div class="s-content">{{i.answer}}</div>
      </div>
      <div class="item item-img" v-else @click="changeItem(i, index)">
        <div class="s-letter" :class="{'s-letter-select': currentSelectitem == index}">{{i.letter}}</div>
        <div class="s-img">
          <img :src="i.answerImage">
          <span v-if="i.answer" class="item-img-content">{{i.answer}}</span>
        </div>
      </div>
    </div>
    <div class="question-single-choice-container" v-else>
      <div class="item" :style="{'width': i.answer.length > 10 ? '100%' : '50%'}" v-if="!i.answerImage" v-for="(i,iIndex) in options" :key="iIndex">
        <div class="right-icon" v-if="rightAnswer[0].answer == i.answer && rightAnswer[0].answerImage == i.answerImage">
          <img class="img" src="@/images/homework/right.png">
        </div>
        <div class="wrong-icon" v-if="status == 2 && studentAnswer[0].answer == i.answer && studentAnswer[0].answerImage == i.answerImage">
          <img class="img" src="@/images/homework/wrong.png">
        </div>
        <div class="s-letter" :class="{'s-letter-right': rightAnswer[0].answer == i.answer && rightAnswer[0].answerImage == i.answerImage, 's-letter-wrong': status == 2 && studentAnswer[0].answer == i.answer && studentAnswer[0].answerImage == i.answerImage}">{{i.letter}}</div>
        <div class="s-content">{{i.answer}}</div>
      </div>
      <!-- 选项带图片 -->
      <div class="item item-img" v-else>
        <div class="right-icon" v-if="rightAnswer[0].answer == i.answer && rightAnswer[0].answerImage == i.answerImage">
          <img class="img" src="@/images/homework/right.png">
        </div>
        <div class="wrong-icon" v-if="status == 2 && studentAnswer[0].answer == i.answer && studentAnswer[0].answerImage == i.answerImage">
          <img class="img" src="@/images/homework/wrong.png">
        </div>
        <div class="s-letter" :class="{'s-letter-right': rightAnswer[0].answer == i.answer && rightAnswer[0].answerImage == i.answerImage, 's-letter-wrong': status == 2 && studentAnswer[0].answer == i.answer && studentAnswer[0].answerImage == i.answerImage}">{{i.letter}}</div>
        <div class="s-img">
          <img :src="i.answerImage">
          <span v-if="i.answer" class="item-img-content">{{i.answer}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {

  name: 'question-single-choice',

  data() {
    return {
      optionsHasImg: false,
      imgInfo: {},
      imgShowType: null,
      currentSelectitem: null
    }
  },

  props: {
    options: {
      type: Array
    },
    stemImg: null,
    status: null,
    rightAnswer: null,
    studentAnswer: null,
    isFinished: null
  },

  created() {

  },

  mounted() {
    this.options.forEach((i,index) => {
      if (this.studentAnswer && this.studentAnswer.length) {
        if (this.studentAnswer[0].answer == i.answer && this.studentAnswer[0].answerImage == i.answerImage) {
          this.currentSelectitem = index;
        }
      }
      // 判断有没有图片
      if (i.answerImage) {
        this.optionsHasImg = true;
      }
    });
    this.getImgInfo();
  },

  methods: {

    // 改变选项
    changeItem(item, index) {
      this.currentSelectitem = this.currentSelectitem == index ? null : index;
    },

    // 获取图片信息
    getImgInfo() {
      let img = new Image();
      img.src = this.stemImg;
      const vm = this;
      img.onload = function() {
        vm.$set(vm.imgInfo, 'width', img.width);
        vm.$set(vm.imgInfo, 'height', img.height);
      }
      this.imgType();
    },

    // 判断图片横竖展示   
    // 竖着 column 横着 row
    imgType() {
      this.imgShowType = this.imgInfo.width / this.imgInfo.height >= 800 / 360 ? 'row' : 'column';
    }
  }

}

</script>
<style scoped lang="stylus">
* {
  box-sizing: border-box;
}

.question-single-choice-container {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;

  .item {
    min-height: 28px;
    width: 50%;
    flex-shrink: 0;
    margin-bottom: 20px;
    padding-left: 40px;
    display: flex;
    cursor: pointer;
    color: #34364D;
    position: relative;

    .s-letter {
      height: 28px;
      width: 28px;
      background: #f4f4f4;
      border-radius: 50%;
      text-align: center;
      line-height: 28px;
      margin-right: 10px;
      flex-shrink: 0;

      &.s-letter-select {
        background: #6E70A0;
        color: #fff;
      }

      &.s-letter-right {
        background: #56BECD;
        color: #fff;
      }

      &.s-letter-wrong {
        background: #EB532F;
        color: #fff;
      }
    }

    .s-content {
      font-size: 18px;
      line-height: 28px;
    }
  }

  .item-img {
    height: 120px;

    .item-img-content {
      position: absolute;
      top: 50px;
      left: 220px;
    }

    .s-letter {
      margin-top: 46px;
    }

    img {
      width: 120px;
      height: 120px;
      border: 1px solid #bababa;
    }

    .right-icon,
    .wrong-icon {
      position: absolute;
      top: 46px;
      left: 0;

      .img {
        width: 28px;
        height: 28px;
        border: 0px;
      }
    }
  }
}

/*顶部的题干图片*/
.section-img {
  margin-bottom: 20px;
  margin-left: 40px;

  /*横屏展示*/
  .row-box {
    width: 800px;

    img {
      width: 100%;
    }
  }

  /*纵屏展示*/
  .column-box {
    height: 360px;

    img {
      height: 100%;
    }
  }
}

.right-icon,
.wrong-icon {
  position: absolute;
  top: 0;
  left: 0;

  .img {
    width: 28px;
    height: 28px;
  }
}

</style>
