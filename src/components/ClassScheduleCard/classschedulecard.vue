<template>
  <div class="page-container">
    <div class="info fix">
      <el-avatar class="c-teacher fl" :size="48" :src="teacherInfo.avatar"></el-avatar>
      <div class="c-teacher-label f20 fl">{{$t("Book classes of Teacher")}}：</div>
      <div class="c-teacher-name f28 thidden fl" :title="teacherName">{{teacherName}}</div>
      <!-- <div class="class-type fr" v-show="memberRole == ApiConstants.classMemberRoleLeader">
        <span v-if="group == ApiConstants.classType1v1">{{$t("one-on-one class")}}</span>
        <span v-else>{{$t("Group Class")}}</span>
      </div> -->
    </div>
    <el-card>
      <WeekCtl :teacherId="teacherId" :studentId="studentId" :classTime="classTime"></WeekCtl>
    </el-card>
  </div>
</template>
<script>
import WeekCtl from "./components/classcard";
import { mapGetters, mapActions } from "vuex";

export default {
  components: { WeekCtl },
  data() {
    return {
      circleUrl: require("../../../static/images/timg.jpeg"),
      teacherName: "",
      currentDate: new Date(),
      classTime: "",
      teacherId: "",
      studentId: "",
      group: this.$route.query.group
    };
  },
  computed: {
    ...mapGetters({
      memberRole: "student/getMemberRole",
      teacherInfo: "user/getTeacherInfo",
    })
  },
  methods: {
    ...mapActions({
      getTeacherInfoAction: "user/getTeacherInfoAction"
    })
  },
  created() {
    this.teacherId = this.$route.query.uid;
    this.studentId = this.$route.query.stid;
    this.teacherName = this.$route.query.teacher;
    this.getTeacherInfoAction(this.teacherId);
  }
};

</script>
<style lang='stylus' scoped>
.page-container {

}

.info {
  background: rgba(244, 244, 244, 1);
  border-radius: 60px;
  padding: 8px;
  box-sizing: border-box;
  line-height: 48px;
  margin-bottom: 20px;

  .class-type {
    width: 180px;
    border-radius: 24px;
    border: 1px solid rgba(215, 143, 37, 1);
    text-align: center;
    color: rgba(215, 143, 37, 1);
    box-sizing: border-box;
  }

  .c-teacher-label {
    padding: 0 0 0 20px;
    font-family: Rubik-Regular, Rubik;
    font-weight: 400;
    color: rgba(52, 54, 77, 1);
  }

  .c-teacher-name {
    max-width: 300px;
    height: 48px;
    font-family: Comfortaa-Regular, Comfortaa;
    color: rgba(52, 54, 77, 1);
  }
}

</style>
