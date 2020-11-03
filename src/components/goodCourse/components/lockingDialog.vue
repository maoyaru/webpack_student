<template>
  <div>
    <el-dialog
      :visible.sync="isShow"
      :show-close="false"
      :close-on-click-modal="false"
      width="400px">
      <div class="desc">{{$t('To unlock videos, please kindly contact with learning advisors.')}}</div>
      <span class="dialog-footer">
        <div class="btns">
          <!-- <el-button class="btn" @click="closeDialog">{{$t('CANCEL')}}</el-button> -->
          <el-button class="btn" type="primary" @click="closeDialog">{{$t('CONFIRM')}}</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: true,
    }
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog', false)
    },
  },
}
</script>

<style lang="stylus">
.g-container .el-dialog__header {
  display: none;
}
.desc {
  font-size: 16px;
  color: #333333;
  line-height: 26px;
  word-break: keep-all;
  text-align: center;
  margin-bottom: 20px;
}
.btns {
  display: flex;
  justify-content: center;
  width: 100%;
  .btn {
    width: 35%;
    margin: 0 10px;
  }
}
</style>