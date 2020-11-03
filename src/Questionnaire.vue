<template>
  <div class="question-zone">
    <Investigation></Investigation>
  </div>
</template>
<script>
import Investigation from './components/investigation/Investigation'
export default {
  name: "Questionnaire",
  components: {
    Investigation
  }
};

</script>
<style lang="stylus">
@import './assets/theme-default/common/stylus/base.styl';
.question-zone {
  height: 100%; 
}

</style>
