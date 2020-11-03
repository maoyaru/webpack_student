<template>
  <el-row class="lg-container main">
    <el-col :span="3" class="left" :style="positionFixed">
      <div class="students-warpper" v-if="students !== null">
        <Students />
      </div>
      <div class="no-students-wrapper" v-else  v-loading>
      </div>
      <el-card :body-style="{ padding: '0px', width:'' }" class="left-menu-warpper">
        <LeftMenu @selectMenu="selectMenu" />
      </el-card>

      <el-card :body-style="{ padding: '5px 20px' }" class="it-test-warpper">
        <a :href="tkUrl" target="_blank">
          <i class="mg-icon icon-ittest"></i>
          <span class="title">{{$t("IT Test")}}</span>
        </a>
      </el-card>
      <el-card :body-style="{ padding: '13px 20px' }" class="friend-warpper">
        <a href="javascript:;" @click="changeRouteRef">
          <i class="mg-icon icon-friend"></i>
          <span class="title">{{$t("Refer friend")}}</span>
        </a>
      </el-card>
    </el-col>
    <!-- <el-col :span="19"> -->
    <el-col :span="19" class="right">
      <!-- <transition :name="transitionName"> -->
      <transition name="slide-fade">
        <router-view class="child-view" />
      </transition>
      <AddStudent
        @close="isOpen = false"
        :open="isOpen"
        :info="{parentId: getUserInfo.userParentInfo.id}"
      ></AddStudent>
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters } from "vuex";
import LeftMenu from "./LeftMenu";
import Students from "../components/Students";
import AddStudent from "@/components/plugin/AddStudent";
import MD5 from "crypto-js/md5";
export default {
  components: { LeftMenu, Students, AddStudent },
  data() {
    return {
      transitionName: "slide-left",
      isOpen: false,
      screenWidth: "",
      positionFixed: "",
      topfixed: "",
      isRouterAlive: true
    };
  },
  computed: {
    ...mapGetters({
      user: "user/getUserInfo",
      currentStudent: "student/getCurrentStudent",
      students: "student/students",
      getUserInfo: "user/getUserInfo",
      isNewUser: "student/getIsNewUser"
    }),
    tkUrl() {
      var key = "ex5lZksGvEmoeC1m";
      var ts = Date.parse(new Date());
      var serial = 1419683487;
      var usertype = 2;
      var auth = MD5(key + ts + serial + usertype);
      var domain = "oks";
      var username = this.currentStudent.realName;
      var url = `https://global.talk-cloud.net/WebAPI/entry?serial=${serial}&username=${username}&usertype=2&ts=${ts}&auth=${auth}&domain=${domain}`;
      return url;
    }
  },
  created() {
    // this.leftfixed = this.leftFixed;
    this.windowResizeEvent();
  },
  mounted() {
    if (this.user.userParentInfo.balance < 5 && !this.isNewUser) {
      this.topFixed = 220;
    }
  },
  watch: {
    $route(to, from) {
      if (to.meta.index > from.meta.index) {
        this.transitionName = "slide-left";
      } else {
        this.transitionName = "slide-right";
      }
    }
  },
  methods: {
    windowResizeEvent(callback) {
      this.topfixed = this.topFixed;
      let screenWidth = document.body.clientWidth;
      if (screenWidth > 1200) {
        this.positionFixed =
          "position:fixed;left:" +
          (screenWidth - 1200) / 2 +
          "px;top:" +
          this.topfixed +
          "px;z-index:2";
        // console.log(this.positionFixed);
      } else {
        this.positionFixed = "";
      }
      let that = this;
      window.onresize = function() {
        screenWidth = document.body.clientWidth;
        // console.log(2, this.screenWidth, that.topfixed);
        if (screenWidth > 1200) {
          that.positionFixed =
            "position:fixed;left:" +
            (screenWidth - 1200) / 2 +
            "px;top:" +
            that.topfixed +
            "px;z-index:2";
          // console.log(that.positionFixed);
        } else {
          that.positionFixed = "";
        }
      };
    },
    changeRouteRef() {
      this.$router.push({
        name: "referfriends"
      });
    },
    selectMenu(path) {
      if (path != "/home") {
        if (this.students !== null) {
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
        }
      } else {
        this.$router.push(path);
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.no-students-wrapper {
  width 200px
  height 150px
  box-shadow 0 2px 8px rgba(182,182,182,0.12)
}
</style>