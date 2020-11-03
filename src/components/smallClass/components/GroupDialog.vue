<template>
  <el-dialog
    :title="$t(this.title)"
    :visible.sync="showDialog"
    width="400px"
    :center="true"
    :show-close="false"
    :before-close="closeDialog"
    append-to-body
    class="m-alert-dialog-with-title"
  >
    <div class="c-tips tl f18">{{detail}}</div>
    <div slot="footer" class="dialog-footer">
      <el-button class="w160" @click="closeDialog">{{$t('CANCEL')}}</el-button>
      <el-button :loading="sureLoading" class="w160" type="primary" @click="sure">{{$t('SURE')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ["sureLoading","title", "detail", "showDialog", "closeGroupDialog","sureSubmitResult"],
  data() {
    return {

    };
  },
  methods: {
    closeDialog() {
      this.$emit("closeGroupDialog",false)
    },
    async sure() {
      await this.$emit("sureSubmitResult")
    }
  },
};
</script>
