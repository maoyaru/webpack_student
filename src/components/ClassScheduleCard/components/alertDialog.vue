<template>
  <el-dialog
    title
    :visible.sync="isShow"
    width="400px"
    @close="close"
    :show-close="false"
    :center="true"
    class="m-alert-dialog"
    :destroy-on-close="false"
    append-to-body
  >
    <div
      class="c-tips f18"
    >{{$t('RESERVE CLASS TIPS')}}</div>

    <span slot="footer" class="dialog-footer">
      <el-button class="w160" @click="cancel">{{$t('CANCEL')}}</el-button>
      <el-button class="w160" @click="ok" type="primary">{{$t('OK')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      isShow: this.isOpen
    };
  },
  props: {
    isOpen: {
      default: false,
      type: Boolean
    }
  },
  watch: {
    isOpen(val) {
      this.isShow = val;
    }
  },
  methods: {
    ok() {
      this.$emit("close");
    },
    cancel() {
      this.$emit("book", {
        active: 'first', //和预约课程切换标签的name保持一致
        optype: this.ApiConstants.scheduleStudentCancel,
      });
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>