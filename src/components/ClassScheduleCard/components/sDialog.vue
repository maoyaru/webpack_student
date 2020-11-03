<template>
  <el-dialog
    :title="$t('Booking Confirmation')"
    :visible.sync="isOpen"
    width="400px"
    :before-close="close"
    :show-close="false"
    :center="true"
    class="m-dialog-with-tabs"
    append-to-body
  >
    <el-tabs v-model="activeName" :stretch="true">
      <el-tab-pane :label="$t('One-time Appointment')" name="first">
        <div
          class="c-tips f18"
          v-if="booked"
        >{{$t('You haven\'t finished the trial class, so you can\'t make an appointment for another class')}}</div>
        <template v-else>
          <span class="label">{{$t("Class Time")}}:</span>
          <span class="classtime">{{ confirmTips }}</span>
        </template>
      </el-tab-pane>
      <el-tab-pane :label="$t('Regular     Appointements')" name="end" :disabled="only">
        <el-form label-position="left" label-width="100px" :model="moreForm" v-if="gt">
          <el-form-item :label="$t('From')">
            <el-input v-model="moreForm.from" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item :label="$t('To')">
            <el-date-picker
              :picker-options="pickerOption"
              v-model="moreForm.to"
              type="date"
              :placeholder="$t('select a date')"
            ></el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('Class Time:')">
            <span class="classtime">{{moreForm.classTime}}</span>
            {{moreForm.classtime}}
          </el-form-item>
        </el-form>
        <div
          class="con"
          v-else
        >{{$t("Your account balance is insufficient, you can top-up for more lessons.")}}</div>
      </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer" v-show="activeName == 'first'">
      <el-button class="w160" @click="close">{{$t('CLOSE')}}</el-button>
      <el-button
        class="w160"
        :disabled="booked"
        type="primary"
        @click="book"
        :loading="loading"
      >{{$t("BOOKING")}}</el-button>
    </span>
    <span slot="footer" class="dialog-footer" v-show="activeName == 'end'">
      <el-button class="w160" @click="close">{{$t('CLOSE')}}</el-button>
      <el-button
        class="w160"
        :disabled="booked"
        type="primary"
        @click="book"
        v-if="gt || only"
        :loading="loading"
      >{{$t("BOOKING")}}</el-button>
      <el-button class="w160" type="primary" @click="topUp" v-else>{{$t("Top-up")}}</el-button>
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
    booked: {
      default: false,
      type: Boolean
    },
    isOpen: {
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
    gt: {
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
    isOpen: {
      handler: function(val) {
        if (val) {
          this.formatTime();
        }
      },
      immediate: true
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
    book() {
      if (this.activeName == "first") {
        this.$emit("book", {
          active: this.activeName,
          optype: this.ApiConstants.scheduleStudentSubscribe
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
          optype: this.ApiConstants.scheduleStudentSubscribe,
          endTime: endTime.toISOString()
        });
      }
    },
    topUp() {
      this.$router.push({ path: "/pay" });
    },
    formatTime() {
      let val = this.time;
      let week = new Date(this.time.startTime).getDay();
      let w = this.DateTimeUtils.week[this.$i18n.locale][week];
      this.confirmTips = this.DateTimeUtils.getClasstime({
        value: this.time.startTime + "$$" + this.time.endTime,
        lang: this.$i18n.locale
      });
      this.moreForm.from = this.DateTimeUtils.formartDate(
        this.time.startTime,
        "yyyy-MM-dd"
      );
      // console.log(this.time.startTime)
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