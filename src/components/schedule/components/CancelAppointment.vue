<template>
  <el-dialog
    :title="$t('Cancel Appointment')"
    :visible.sync="showCancelAppoint"
    width="400px"
    :before-close="closeDialog"
    :show-close="false"
    :center="true"
    class="m-alert-dialog-with-title"
    append-to-body
  >
  <div class="f16 lhx30">
    <div class="item">{{$t('Class Time')}}:</div>
    <div>{{classtime}}</div>
  </div>
  <div class="dialog-footer" slot="footer">
    <el-button class="w160" @click="closeDialog">{{$t('CLOSE')}}</el-button>
    <el-button class="w160" :loading="loading" type="primary" @click="cancelClass">{{$t('Cancel Class')}}</el-button>
  </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    classInfo: {
      default: {},
      type: Object
    },
    showCancelAppoint: {
      default: false,
      type: Boolean
    },
    loading: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      classtime: ''
    };
  },
  watch: {
    showCancelAppoint(val) {
      if(val) {
        this.classtime = this.DateTimeUtils.getClasstime({value: this.classInfo.startTime + '$$' + this.classInfo.endTime, lang: this.$i18n.locale});
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit("closeCancelDialog")
    },
    cancelClass() {
      this.$emit("cancelClass")
    }
  }
};
</script>

<style scoped lang="stylus">
.body {
  padding-top 40px;
  padding-left 30px
  padding-right 30px
  height 100%
  display flex
  flex-direction column 
  box-sizing border-box
  .classtime {
    // margin-bottom 225px
    flex 1
    .item {
      margin-right 28px
    }
  }
  .btns {
    display flex
    justify-content space-between
    margin-bottom 31px
  }
}
</style>
