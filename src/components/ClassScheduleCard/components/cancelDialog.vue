<template>
  <el-dialog :title="$t('Cancel Appointment')" :visible.sync="isOpenCancel" width="400px" :before-close="close"
    :show-close="false" :center="true" class="m-dialog-with-tabs" append-to-body>
    <el-tabs v-model="activeName" :stretch="true">
      <el-tab-pane :label="$t('Cancel This Appointment')" name="first">
        <span class="label">{{$t("Class Time")}}:</span>
        <span class="classtime">{{ confirmTips }}</span>
      </el-tab-pane>
      <el-tab-pane :label="$t('Cancel Regular Appointement')" name="end" :disabled="only">
        <el-form label-position="left" label-width="90px" :model="moreForm">
          <el-form-item :label="$t('From')">
            <el-input v-model="moreForm.from" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item :label="$t('To')">
            <el-date-picker :picker-options="pickerOption" v-model="moreForm.to" type="date"
              :placeholder="$t('select a date')"></el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('Class Time:')">
            {{moreForm.classtime}}
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer">
      <el-button v-show="activeName === 'first'" class="w160" plain @click="close">{{$t('CLOSE')}}</el-button>
      <el-button v-show="activeName === 'end'" class="w140" plain @click="close">{{$t('CLOSE')}}</el-button>
      <el-button v-show="activeName === 'first'" class="w160" type="primary" @click="cancel" :loading="loading">
        {{$t("Cancel Class")}}</el-button>
      <el-button v-show="activeName === 'end'" class="w180" type="primary" @click="cancel" :loading="loading">
        {{$t("Cancel Regular Classes")}}</el-button>
    </span>
    <TipDialog :isOpen="tipShow" tip="Successful Booking" @close="tipBack"></TipDialog>
  </el-dialog>
</template>

<script>
import TipDialog from "./tipDialog";
import { mapGetters, mapMutations } from "vuex";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: { TipDialog },
  data() {
    //这里存放数据
    let self = this;
    return {
      weeks: [],
      months: [],
      tipShow: false,
      activeName: "first",
      confirmTips: "",
      moreForm: {
        from: "",
        to: "",
        classtime: ""
      },
      pickerOption: {
        disabledDate(time) {
          let maxTime = new Date(self.time.startTime);
          maxTime.setMonth(maxTime.getMonth() * 1 + 3);
          // console.log(maxTime)
          // time.getTime() >= self.time.startTime.getTime() &&
          return (
            time.getTime() < self.time.startTime.getTime() ||
            time.getTime() > maxTime.getTime()
          );
        }
      }
    };
  },
  props: {
    isOpenCancel: {
      default: false,
      type: Boolean
    },
    time: {
      default() {
        return {
          startTime: ""
        };
      },
      type: Object
    },
    only: {
      default: false,
      type: Boolean
    },
    loading: {
      default: false,
      type: Boolean
    }
  },
  //监听属性 类似于data概念
  computed: {
    ...mapGetters({
      group: "booking/getGroup"
    })
  },
  //监控data中的数据变化
  watch: {
    isOpenCancel: {
      handler: function(val) {
        if (val) {
          this.formatTime();
        }
      },
      immediate: true
    },
    activeName(val) {

    }
  },
  //方法集合
  methods: {
    close() {
      this.$emit("close");
    },
    tipBack() {
      this.tipShow = false;
      this.$emit("close");
    },
    cancel() {
      if (this.activeName == "first") {
        this.$emit("book", {
          active: this.activeName,
          optype: this.ApiConstants.scheduleStudentCancel
        });
      } else {
        // 预约多节课
        let endTime = new Date(this.moreForm.to);
        endTime.setDate(endTime.getDate() * 1 + 1);
        endTime.setMinutes(0);
        endTime.setSeconds(0);
        endTime.setMilliseconds(0);
        this.$emit("book", {
          active: this.activeName,
          optype: this.ApiConstants.scheduleStudentCancel,
          endTime: endTime.toISOString()
        });
      }
    },
    formatTime() {
      let val = this.time,
        w = this.DateTimeUtils.week[this.$i18n.locale][val.startTime.getDay()];
      this.confirmTips = this.DateTimeUtils.getClasstime({
        value: this.time.startTime + "$$" + this.time.endTime,
        lang: this.$i18n.locale
      });
      this.moreForm.from = this.DateTimeUtils.formartDate(
        this.time.startTime,
        "yyyy-MM-dd"
      );
      let end = new Date(this.time.startTime);
      end.setMonth(end.getMonth() * 1 + 1);
      this.moreForm.to = this.DateTimeUtils.formartDate(end, "yyyy-MM-dd");
      this.moreForm.classtime = this.DateTimeUtils.getClasstimeMore(
        this.time.startTime,
        this.time.endTime
      );
      if (this.$i18n.locale == "en") {
        this.moreForm.classtime += " " + this.$t("every") + " " + w;
      } else {
        this.moreForm.classtime =
          this.$t("every") + " " + w + " " + this.moreForm.classtime;
      }
    }
  },
  mounted() {
    if (this.$i18n.locale == "en") {
      this.weeks = this.DateTimeUtils._weekdayNameEn2;
      this.months = this.DateTimeUtils._monthNameEn;
    } else {
      this.weeks = this.DateTimeUtils._weekdayNameZh2;
      this.months = this.DateTimeUtils._monthNameZh;
    }
  }
};
</script>
<style lang='stylus' scoped>
.booking-dialog {
  .label {
    display: inline-block;
    width: 100px;
  }

  .el-date-editor {
    width: 100%;
  }

  .con {
    margin-top: 80px;
    font-size: 18px;
    color: #333;
    text-align: center;
    line-height: 30px;
  }
}
</style>