<template>
  <div class="login-warpper">
    <!-- <TopBar to="/register"/> -->
    <div class="topbar-warpper shadow">
      <img class="c-logo" :src="logoUrl" alt />
      <a class="cur" @click="showLogin = !showLogin">{{text}}</a>
    </div>
    <Login v-show="showLogin" :currentLocation="currentLocation" />
    <Register v-show="!showLogin" :currentLocation="currentLocation" />
  </div>
</template>
<script>
import Login from "./components/LoginForm";
import Register from "./components/RegisterForm";
import { urlParse } from "@/common/js/util";
export default {
  data() {
    return {
      showLogin: true,
      logoUrl: require("../../assets/theme-default/images/login/logo@2x.png"),
      currentLocation: ''
    };
  },
  computed: {
    text() {
      let t = "";
      if (this.showLogin) {
        t = this.$t("No account, Sign up now");
      } else {
        t = this.$t("Have an account, Login now");
      }
      return t;
    }
  },
  components: {
    Login,
    Register
  },
  async created() {
    const result = await this.$api.finance.getLocation()
    if (result.data && result.data.code === 200 && result.data.data) {
      this.currentLocation = result.data.data
    }
  },
  mounted() {
    let querys = urlParse();
    if (querys && querys.type == "register") {
      this.showLogin = false;
    }
  }
};

</script>
<style lang="stylus" scoped>
.cur {
  cursor: pointer;
}

</style>
