<template>
    <div class="dialog">
      <el-dialog
        :visible.sync="showTransfer"
        :center="true"
        :title="$t('Transfer to others')"
        :before-close="closeTransfer"
        append-to-body
        width='400px'
      >
        <p class="c-tips tl f18">{{$t('Please choose which of the following students you wish to transfer the group to')}}:</p>
        <div class="tl pl100 pb10 w150 thidden" v-for="(item, index) in classOrdinaryStudents">
          <el-radio 
            :title="item.realName"
            v-model="selectIndex"
            :label="index"
          >{{item.realName}}</el-radio>
        </div>
        <div slot="footer"  class="dialog-footer">
          <el-button class="w160" @click="closeTransfer">{{$t('CANCEL')}}</el-button>
          <el-button class="w160" type="primary" @click="confirmChecked">{{$t('CONFIRM')}}</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
export default {
  components: {},
  props:[
    "showTransfer",
    "classOrdinaryStudents",
    "classroomClassInfo",
    "classLeaderStudent"
  ],
  data() {
    return {
      selectIndex: 0
    };
  },
  methods: {
    closeTransfer() {
      this.$emit("closeTransfer");
    },
    confirmChecked() {
      let classId = this.classroomClassInfo.id,
          leaderStudentId = this.classLeaderStudent.studentUserId,
          ordinaryStudentId = this.classOrdinaryStudents[this.selectIndex].studentUserId;
      this.$api.grouppurchase.leaderChange(classId, leaderStudentId, ordinaryStudentId)
      .then( res => {
        if(res.data.code === 200) {
          this.closeTransfer()
          this.$store.dispatch("student/setStudentRole", window.localStorage.getItem("currentChild"))
          this.$emit("dataInfo")
        }else if(res.data.code === 20006) {
          this.$message({
            message: this.$i18n.t('The time before and after class is too short to change the monitor')
          });
        }
      })
    }
  }
}
</script>