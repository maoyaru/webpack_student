<template>
  <div>
    <el-dialog
      :visible.sync="showFullScreen"
      :before-close="closeDialog"
      :modal-append-to-body="false"
      center
      :show-close="true"
    ></el-dialog>
  </div>
</template>

<script>
export default {
  props: ["showFullScreen"],
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    }
  }
};
</script>

<style scoped lang="stylus">
.el-dialog {
  width: 80%;
  height: 800px;
}
</style>
