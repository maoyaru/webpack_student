<template>
  <div class="notData">
    <i class="notDataImg"></i>
    <div class="text">
      <p>{{$i18n.t("No upcoming group class yet")}}</p>
    </div>
    <div
      v-if="classLeaderStudent.studentUserId != stId"
      class="you"
    >{{$t('You can ask the owner to book group class')}}</div>
    <el-button
      v-if="classLeaderStudent.studentUserId == stId"
      type="primary"
      class="c-custom-btn"
      @click="goBookking"
    >{{$t("BOOKING")}}</el-button>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      show: false,
      stId: window.localStorage.getItem("currentChild")
    };
  },
  //方法集合
  methods: {
    goBookking() {
      this.$router.push("/booking");
    }
  },
  computed: {
    ...mapState("group", {
      classLeaderStudent: state => state.classLeaderStudent
    })
  }
};
</script>
<style lang='stylus' scoped>
.notData {
  background-color: #fff;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-shadow: 0px 4px 8px 4px rgba(182, 182, 182, 0.08);
  border-radius: 8px;
  background: rgba(255, 255, 255, 1);
  position: relative;
  margin-top: 20px;
}

.notDataImg {
  bg-image('../../../assets/theme-default/images/group/no_classmate');
  width: 285px;
  height: 240px;
  display: block;
  margin-bottom: 20px;
  position: absolute;
  top: 60px;
}

.text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: Rubik-Regular, Rubik;
  font-weight: 400;
  color: rgba(178, 178, 178, 1);
  line-height: 28px;
  position: absolute;
  top: 320px;
}

.you {
  position: absolute;
  top: 370px;
  color: rgba(178, 178, 178, 1);
}

.c-custom-btn {
  width: 300px;
  height: 44px;
  font-size: 14px;
  font-weight: 500;
  font-family: Rubik-Medium, Rubik;
  position: absolute;
  bottom: 40px;
}
</style>