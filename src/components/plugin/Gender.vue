<template>
  <span class="lg-gender">
    <i class="boy" v-show="show==3 || show==1" @click="choose(1)" :class="{'active':1 == gender}">{{$t("BOY")}}</i>
    <i class="girl" v-show="show==3 || show==2" @click="choose(2)" :class="{'active':2 == gender}">{{$t("GIRL")}}</i>
  </span>
</template>

<script>
export default {
  components: {},
  data() {
    return {

    };
  },
  props: {
    gender: {
      default: 1,
      type: [String, Number]
    },
    readyonly: {
      default: false,
      type: Boolean
    },
    show: {
      default: 3,
      type: [String, Number]
    }
  },
  methods: {
    choose(flag) {
      if (!this.readyonly) {
        this.$emit("change", flag);
      }
    }
  }
};
</script>
<style lang='stylus' scoped>
.lg-gender {
  display: inline-block;

  i {
    display: inline-block;
    width: 60px;
    height: 28px;
    cursor: pointer;
    opacity: 1;

    &.boy,
    &.girl {
      color:#fff;
      border-radius:15px;
      font-style: normal;
      text-align:center;
      line-height:30px;
    }
    &.boy{
      background: #dff2f5;
      border: 1px solid #dff2f5;
    }
    &.girl {
      background: #fbddd7;
      border: 1px solid #fbddd7;
    }

    &.active.boy {
      background: #5bbecc;
      border: 1px solid #5bbecc;
      color:#fff;
      opacity: 1;
    }
    &.active.girl {
      background: #e95438;
      border: 1px solid #e95438;
      color:#fff;
      opacity: 1;
    }
    &:nth-child(2){
      margin-left: 20px;
    }
  }
}
</style>