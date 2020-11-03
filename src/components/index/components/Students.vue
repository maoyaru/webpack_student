<template>
  <el-card @mouseenter.native="ifShowAllStudent" @mouseleave.native="isShowAll = false" shadow="always"
    class="m-students-lists"
    :style="{'width':isShowAll ? 200 + $store.state.student.students.length * 130 + 'px' :'200px' }">
    <ul class="students">
      <li class="item" v-for="(item,key) in allStudents" :key="key" @click="changeCurrentStudent(key, item)">
        <el-avatar class="c-student" :size="80" :src="item.avatar" fit="fill"></el-avatar>
        <div class="name">{{item.realName}}</div>
      </li>
      <li class="item" @click="openStudent()" v-if="isShowAll && allStudents.length < 5 || allStudents.length === 0">
        <el-avatar :size="80" :src="avatarUrl" class="c-avatar-plus"></el-avatar>
        <div class="name">Add</div>
      </li>
      <div class="arrow"></div>
    </ul>
    <i class="icon-left" @click="showOrCloseStuList()" v-if="isShowMoreStudentBtn" :class="{right:isShowAll}"></i>
    <AddStudent :open="isShow" :type="2" @close="closeStudent" />
  </el-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import AddStudent from "../../plugin/AddStudent";
import { saveToLocal, loadFromLocal } from "@/common/js/store";
export default {
  components: { AddStudent, mapActions },
  data() {
    return {
      isShow: false,
      studentSidth: "200px",
      isShowAll: false,
      avatarUrl: require("../../../assets/theme-default/images/index/icon_add_child@2x.png")
    };
  },
  computed: {
    ...mapGetters({
      currentStudent: "student/getCurrentStudent",
      allStudents: "student/students",
      user: "user/getUserInfo",
      parentUserInfo: "user/getParentInfo"
    }),
    isShowMoreStudentBtn() {
      return (
        JSON.parse(localStorage.__lgzy__s__).login_info.user.userParentInfo
          .role == this.ApiConstants.userRoleParent 
      );
    }
  },
  watch: {
    //当前孩子改变，则改变allStudents中孩子的顺序,重新获取当前孩子上课简要信息
    currentStudent(val) {
      if (val) {
        let currentStudent = this.allStudents.filter(
          item => item.id == this.currentStudent.id
        );
        this.allStudents.unshift(
          this.allStudents.splice(
            this.allStudents.findIndex(item => item.id == currentStudent[0].id),
            1
          )[0]
        );
      }
    }
  },
  methods: {
    ...mapMutations({
      setCurrentStudent: "student/setCurrentStudent"
    }),
    openStudent() {
      this.isShow = true;
    },
    showOrCloseStuList() {
      this.isShowAll = !this.isShowAll;
    },
    addSutdent(form) {
      this.$store.state.student.students.push(form);
      this.isShow = false;
    },
    closeStudent(isOpen) {
      this.isShow = false;
    },
    changeCurrentStudent(key, item) {
      // 还没有添加孩子，设置孩子(打开添加孩子弹窗)
      this.isShowAll = false;
      this.setCurrentStudent(key);
      if (!this.currentStudent.realName) {
        this.openStudent();
        return false;
      }
      // 没做问卷跳问卷
      if (this.currentStudent.courseEditionId === null && this.currentStudent.courseLevel === null) {
        let pathname = location.pathname;
        location.href = `${pathname}questionnaire.html?uid=${this.$store.state.user.user.userParentInfo.id}&id=${this.$store.state.student.currentStudent.id}&from=pc`;
        return false;
      }
      this.$router.push("/home");
    },
    ifShowAllStudent() {
      this.isShowAll = this.isShowMoreStudentBtn;
    }
  },
  mounted() {}
};
</script>
<style lang='stylus' scoped>

</style>
