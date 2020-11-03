<template>
  <div class="NotDataWrapper">
    <div class="NotDataBgc"></div>
    <p>{{$t("No class record yet, book now")}} </p>
    <el-button plain round class="c-custom-btn" @click="goBookking">{{$t("BOOKING")}}</el-button>
  </div>
</template>

<script>

export default {
  components: {},
  data() {
    return {
      
    };
  },
  methods: {
    goBookking() {
      this.$router.push('/booking')
    }
  }
}
</script>
<style lang='stylus' scoped>
.NotDataWrapper {
  margin-top 20px
  width 940px
  height 500px
  display flex
  align-items center
  justify-content center
  background-color rgba(255,255,255,1)
  flex-direction column
  box-shadow 0px 4px 8px 4px rgba(182,182,182,0.08)
  border-radius 8px
  position relative
  p {
    color #B2B2B2
    font-size 18px
    font-weight 400
    line-height 22px
    font-family Rubik-Regular,Rubik
    position absolute
    top 340px
  }
}
.NotDataBgc {
  position absolute
  top 80px
  width 303px
  height 240px
  bg-image('../../../assets/theme-default/images/history/workNotWord')    
}
.c-custom-btn {
  width 300px
  height 44px
  background-color rgba(255,255,255,1)
  border-radius 6px
  border 2px solid rgba(55,56,76,1)
  font-size 14px
  font-weight 500
  color rgba(55,56,76,1)
  line-height 17px
  font-family Rubik-Medium,Rubik
  position absolute
  bottom 40px
}
</style>