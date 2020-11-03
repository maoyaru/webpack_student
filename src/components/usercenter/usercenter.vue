<template>
  <div class="index-warpper">
    <div class="l-header">
      <TopBar />
      <TopMenu @selectMenu="selectMenu" />
    </div>
    <div class="tip-warpper">
      <ToUpTip v-if="user.userParentInfo.balance < 5 && !isNewUser" />
    </div>
    <div class="main-warpper">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import TopBar from "@/components/index/components/Top";
import TopMenu from "@/components/index/components/TopMenu";
import ToUpTip from "@/components/index/components/ToUpTip";
import { mapGetters } from 'vuex';
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    TopMenu,
    TopBar,
    ToUpTip
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      user: "user/getUserInfo",
      classIds: "student/getClassIds",
      currentStudent: 'student/getCurrentStudent',
      isNewUser: 'student/getIsNewUser'
    })
  },
  methods: {
    selectMenu(path) {
      if(path!='/home') {
        if(!this.currentStudent.realName) {
          // 打开添加孩子弹窗
          this.isOpen = true;
        }else if(this.currentStudent.courseEditionId === null && this.currentStudent.courseLevel === null) {
          let pathname = location.pathname
            location.href= `${pathname}questionnaire.html?uid=${this.$store.state.user.user.userParentInfo.id}&id=${this.$store.state.student.currentStudent.id}&from=pc`;
          return false;
        }else {
          this.$router.push(path);
        }
      }else {
        this.$router.push(path);
      }
    }
  }
};
</script>