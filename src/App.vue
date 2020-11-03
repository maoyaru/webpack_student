<template>
  <div id="app">
    <div style="min-height:100%">
      <index></index>
    </div>
    <div class="copyright">Copyright © 2017-2020 LingoAce</div>
    <NavigatorTip/>
  </div>
</template>
<script>
import index from '@/components/index/index'
import NavigatorTip from '@/components/common/NavigatorTip'

export default {
  name: "App",
  components: {
    index,
    NavigatorTip
  }
};

</script>
<style>
/*homework*/
.submit-dialog .el-dialog__header,
.result-dialog .el-dialog__header {
  padding: 0;
}

.hw-no-work {
  color: #EB532F;
}

.refer-input .el-input__inner {
  width: 260px;
}

/* 学习菜单 转场动画 animation*/
.slide-fade-enter-active {
  transition: all .3s ease;
}

.slide-fade-leave-active {
  /*transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);*/
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

</style>
