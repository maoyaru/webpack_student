<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="40%"
    class="dialog-win">
    <span class="desc-text">
      <template v-if="userAgentType">
        {{$t('Your current browser is')}}&nbsp;{{userAgentType}}，
      </template>
      <template v-else>
        {{$t('Your current browser is not a')}}&nbsp;Chrome&nbsp;{{$t('browser')}}，
      </template>
      {{$t('Please switch to the')}}&nbsp;Chrome&nbsp;{{$t('browser')}}
    </span>
    <span slot="footer">
      <el-button type="primary" @click="dialogVisible = false">{{$t('Confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data (){
    return {
      isMobile: navigator.userAgent.indexOf('Mobile') > -1,
      dialogVisible: false,
      userAgentType: ''
    }
  },
  mounted () {
    this.userAgentType = this.userAgent()
    if (this.userAgentType === 'Chrome') {
      return
    }
    this.dialogVisible = true && !this.isMobile
  },
  methods: {
    userAgent(){
      if(navigator.userAgent.indexOf('Chrome') >- 1){
        return 'Chrome'
      } else if(navigator.userAgent.indexOf('Safari') >- 1){
        return "Safari"
      } else if(navigator.userAgent.indexOf('Firefox') >- 1){
        return "Firefox"
      } else if(!!window.ActiveXObject || "ActiveXObject" in window){
        return "IE"
      } else {
        return ''
      }
    },
  }
}
</script>

<style lang="stylus">
.dialog-win .el-dialog__footer {
  text-align : right;
}
.desc-text {
  word-break: keep-all;
  line-height: 24px;
}
</style>