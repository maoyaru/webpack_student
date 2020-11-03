<template>
  <div class="top-up-tip lg-container">
    {{$t("Your account balance is less than")}}
    <span class="red">5</span>
    {{$t("points. In order to learn Chinese in succession, please")}}
    <span
      class="red"
    >{{$t("Top-up")}}</span>
    {{$t("in time ~")}}
    <el-button type="danger" @click="jump">{{$t("TOP-UP")}}</el-button>
  </div>
</template>

<script>
export default {
  props: {
    isShow: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    jump(){
      this.$router.push('/pay')
    }
  }
};
</script>