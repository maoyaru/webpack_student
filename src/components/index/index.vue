<template>
  <div class="index-warpper">
    <div class="l-header">
      <TopBar />
      <TopMenu @selectMenu="selectMenu" />
    </div>
    <div class="content">
      <div class="tip-warpper">
        <ToUpTip v-if="user.userParentInfo.balance < 5 && !isNewUser" />
      </div>
      <div class="main-warpper">
        <router-view></router-view>
      </div>
      <AddStudent @close="isOpen = false" :open="isOpen" :canClose="!!this.currentStudent.realName"></AddStudent>
    </div>
    <BackToTop></BackToTop>
  </div>
</template>

<script>
import TopBar from "./components/Top";
import TopMenu from "./components/TopMenu";
import ToUpTip from "./components/ToUpTip";
import LeftMenu from "./components/LeftMenu";
import Main from "./components/Main";
import AddStudent from "@/components/plugin/AddStudent";
import BackToTop from "@/components/common/BackToTop";
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      isOpen: false,
      pageIsLoaded: false
    };
  },
  components: {
    TopMenu,
    TopBar,
    ToUpTip,
    LeftMenu,
    Main,
    AddStudent,
    BackToTop
  },
  computed: {
    ...mapGetters({
      user: "user/getUserInfo",
      currentStudent: "student/getCurrentStudent",
      isNewUser: "student/getIsNewUser",
      students: "student/students"
    }),
    storeCurrentStudentId: function() {
      return this.$store.state.student.currentStudent.id;
    }
  },
  watch: {
    storeCurrentStudentId: function(newId, oldId) {
      this.setStudentRole(newId);
      this.getJoinedClass(newId);
    }
  },
  methods: {
    ...mapActions({
      getParentInfoAction: "user/getParentInfoAction",
      getChildren: "student/getChildren",
      setStudentRole: "student/setStudentRole",
      getJoinedClass: "student/getJoinedClass"
    }),
    selectMenu(path) {
      if (!this.pageIsLoaded) {
        return
      }
      if (path != "/home") {
        if (!this.currentStudent.realName) {
          // 打开添加孩子弹窗
          this.isOpen = true;
        } else if (this.currentStudent.courseEditionId === null && this.currentStudent.courseLevel === null) {
          let pathname = location.pathname;
          location.href = `${pathname}questionnaire.html?uid=${this.$store.state.user.user.userParentInfo.id}&id=${this.$store.state.student.currentStudent.id}&from=pc`;
          return false;
        } else {
          this.$router.push(path);
        }
      } else {
        this.$router.push(path);
      }
    }
  },
  mounted() {
    // 初始化需要的数据
    //获取家庭孩子信息
    this.getChildren({
      parentId: this.$store.state.user.user.userParentInfo.id,
      isAdd: 0
    }).then(
      data => {
        this.pageIsLoaded = true
        console.log(this.students, this.currentStudent.realName)
        if (this.students != null && !this.currentStudent.realName) {
          // 打开添加孩子弹窗
          this.isOpen = true;
        }
      },
      () => {
        this.$message({
          message: "Failed to get children's data"
        });
      }
    );
    // 重新拉取家长信息
    this.getParentInfoAction(this.$store.state.user.user.userParentInfo.id).then(data=>{

    });
  }
};
</script>