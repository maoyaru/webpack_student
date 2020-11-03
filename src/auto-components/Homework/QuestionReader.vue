<!-- question-reader -->
<template>
  <div class="question-reader-container">
    <div v-html="content"></div>
    <div class="hw-item-box" v-for="i in modelList" :key="i.id">
      <!-- 题型 -->
      <question-stem :stem="i.remark" :itemType="i.title" :isReaderChildren="i.isReaderChildren"></question-stem>
      <!-- 选择题 -->
      <div v-if="i.type == 1">
        <div v-for="(j,index) in i.childList">
          <div class="sub-title">{{index + 1}}、 {{j.questionText}}</div>
          <question-single-choice :options="j.contentJson" :stemImg="j.questionImage" :isFinished="pageStatus"></question-single-choice>
        </div>
      </div>
      <!-- 填空题 -->
      <div v-if="i.type == 2">
        <div class="fill-box">
          <div v-for="(j,jIndex) in i.childList">
            <question-fill :content="j.contentJson.options" :jIndex="jIndex" :isFinished="pageStatus"></question-fill>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {

  name: 'question-reader',

  props: {
    modelList: null,
    content: null
  },

  data() {
    return {}
  },

  created() {

  },

  mounted() {
    console.log(this.modelList);
    console.log();
  },

  methods: {

  }

}

</script>
<style scoped lang="stylus">
.question-reader-container {
  padding: 30px 40px 40px;
  font-size: 16px;
  line-height: 22px;
  color: #34364D;
}

</style>
