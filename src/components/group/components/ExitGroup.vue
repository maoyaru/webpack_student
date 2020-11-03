<template>
  <el-dialog
    :title="$t('EXIT GROUP')"
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
    >{{$t("Once you exit from the group, you can't take group class with your classmates. Sure to exit?")}}</div>
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
      let { id } = this.classroomClassInfo;
      let studentId = window.localStorage.getItem("currentChild") * 1;
      this.$api.grouppurchase.studentSignoutClass(id, studentId).then(res => {
        if (res.data.code === 200) {
          console.log(res);
          this.studentIsInClass = false;
          this.$message({
            message: this.$i18n.t("Exit successfully"),
            center: true
          });
          this.$emit("clear");
        }
        this.$emit("closeCloseDialog");
      });
    }
  }
};
</script>