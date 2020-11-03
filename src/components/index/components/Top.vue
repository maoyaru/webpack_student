<template>
  <div class="top-warpper lg-container">
    <div class="left">
      <span class="icon-phone"></span>
      <span class="phone">{{tel}}</span>
    </div>
    <div class="right">
      <ul class="user">
        <!-- <li @click="setupLang()">本地化{{$t('hello')}},{{$t("word")}}</li> -->
        <li>
          <span class="local" @click="setupLang('en')" :class="{'active':isEng}">ENG</span>
          <span class="local" @click="setupLang('zh')" :class="{'active':!isEng}">中文</span>
        </li>
        <li class="areaTime">{{areaTime}}</li>
        <li>
          <Notice :count="1" />
        </li>
        <li>
          <Avatar :avatarUrl="avatarUrl" :username="user.username" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { setup } from "@/locales/index";
import Avatar from "./Avatar";
import Notice from "./Notice";
const jstz = require("@/utils/jstz");
export default {
  components: { Avatar, Notice },
  data() {
    return {
      tel: "(65) 86183670",
      avatarUrl: "",
      areaTime: this.DateTimeUtils.formartDate(new Date(), "hh:mm:ss"),
      user: {
        username: this.$store.state.user.user.username
      },
      isEng: this.$i18n.locale == "en" ? true : false,
      flag: this.$i18n.locale,
      timer: null
    };
  },
  created() {
    try {
      var timezone = jstz.jstz.determine();
      let timeAddress = timezone.name();
      this.timer = setInterval(() => {
        this.areaTime =
          timeAddress +
          " " +
          this.DateTimeUtils.formartDate(new Date(), "hh:mm:ss");
      }, 1000);
    } catch (error) {
      if (this.timer) {
        clearInterval(this.timer);
        this.areaTime = "";
      }
    }
  },
  methods: {
    setupLang(flag) {
      if (flag == this.flag) {
        return false;
      }
      this.flag = flag;
      setup(flag);
      this.$EventBus.$emit("onComputedDescDisplay")
      this.isEng = !this.isEng;
    },
    showSmallClass() {
      this.$router.push({
        name: "smallclass"
      });
    }
  }
};
</script>