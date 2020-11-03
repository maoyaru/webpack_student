<template>
  <el-dialog
    :title="$t('CLOSE GROUP')"
    :visible.sync="showClose"
    width="400px"
    :center="true"
    :show-close="false"
    :before-close="closeDialog"
    append-to-body
    class="m-alert-dialog-with-title"
  >
    <div
      class="c-tips tl f18"
    >{{$t("Once the group is closed, other students can't join your group, and you can't book group class. Sure to close the group?")}}</div>
    <div slot="footer" class="dialog-footer">
      <el-button class="w160" @click="closeDialog">{{$t('CANCEL')}}</el-button>
      <el-button class="w160" type="primary" @click="sure">{{$t('SURE')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ["showClose", "closeCloseDialog", "classroomClassInfo", "clear"],
  methods: {
    closeDialog() {
      this.$emit("closeCloseDialog");
    },
    sure() {
      let { id, leaderUserId } = this.classroomClassInfo;
      this.$api.grouppurchase
        .studentSignoutClass(id, leaderUserId)
        .then(res => {
          if (res.data.code === 200) {
            this.studentIsInClass = false;
            this.$message({
              message: this.$i18n.t("Close successfully"),
              center: true
            });
          }
          this.$emit("clear");
          this.$emit("closeCloseDialog");
        });
    }
  }
};
</script>
<style lang='stylus' scoped></style>