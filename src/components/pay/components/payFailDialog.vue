<template>
  <el-dialog
    :visible.sync="isShowCopy"
    @close="close"
    :show-close="false"
    :center="true"
    width="400px"
    class="m-alert-dialog"
    :destroy-on-close="false"
    append-to-body
  >
    <div class="c-tips f18">{{msg ? $t(msg) : ''}}</div>
    <span slot="footer" class="dialog-footer">
      <el-button class="w160" @click="rePay">{{$t('PAY')}}</el-button>
      <el-button class="w160" @click="close" type="primary">{{$t('CLOSE')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    isShow: {
      default: false,
      type: Boolean
    },
    msg: {
      default: '',
      type: String
    }
  },
  computed: {
    isShowCopy: {
      get() {
        return this.isShow;
      },
      set() {

      }
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    rePay() {
      this.$emit('close');
      this.$emit('rePay');
    }
  }
};
</script>

<style lang='stylus' scoped>
.weixin-pay .el-dialog__body{
  width:500px;
  height:300px;
}
#qrcode{
  width 100px
  height 100px
  margin: 0 auto;
  img{
    margin: 0 auto;
  }
}
</style>