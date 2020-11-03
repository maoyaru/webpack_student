<template>
  <div class="messageItem">
    <!-- 充值成功 -->
    <div class="rechargeSuccess" v-if="item.subCategory === MessageCenterCode.rechargeSuccessCode">
      <h4>
        <b>{{subCategoryMapTitle()}}</b>
        <span>{{DateTimeUtils.dateClockTime(item.createTime)}}</span>
      </h4>
      <div class="con">
        <span>{{$t('Top-up points')}}</span>：
        <span>{{item.detailObj.rechargeAmount}}</span>
      </div>
      <div class="con">
        <span>{{$t('Bonus points')}}</span>：
        <span>{{item.detailObj.incentiveAmount}}</span>
      </div>
      <div class="con">
        <span>{{$t('Payment amount')}}</span>：
        <span>{{item.detailObj.currency}} {{item.detailObj.totalPrice}}</span>
      </div>
    </div>
    <!-- 余额不足 -->
    <div class="moneyLittle" v-if="item.subCategory === MessageCenterCode.moneyLittleCode">
      <h4>
        <b>{{subCategoryMapTitle()}}</b>
        <span>{{DateTimeUtils.dateClockTime(item.createTime)}}</span>
      </h4>
      <div class="msg">
        <span>{{subCategoryMapMsg()}}</span>
      </div>
    </div>
    <!-- 上课提醒 -->
    <div class="classRemind" v-if="item.subCategory === MessageCenterCode.classRemindCode">
      <h4>
        <b>{{subCategoryMapTitle()}}</b>
        <span>{{DateTimeUtils.dateClockTime(item.createTime)}}</span>
      </h4>
      <div class="con">
        <span>{{$i18n.t('Class Time')}}</span>：
        <span>{{DateTimeUtils.dateClockTime(item.detailObj.startTime)}}</span>
      </div>
      <div class="con">
        <span>{{$i18n.t('Lesson')}}</span>：
        <span>{{item.detailObj.lessonNo}}</span>
      </div>
      <div class="con">
        <span>{{$i18n.t('Teacher')}}</span>：
        <span>{{item.detailObj.tutorRealName}}</span>
      </div>
      <div class="msg">
        <span>{{subCategoryMapMsg()}}</span>
      </div>
    </div>
    <!-- 首次课反馈 -->
    <div class="firstClassFeedback" v-if="item.subCategory === MessageCenterCode.firstClassFeedbackCode">
      <h4>
        <b v-if="$i18n.locale === 'zh'">[{{item.detailObj.studentRealName}}] 请查收首课反馈</b>
        <b v-else>The First Lesson Feedback of {{item.detailObj.studentRealName}} has been sent！</b>
        <span>{{DateTimeUtils.dateClockTime(item.createTime)}}</span>
      </h4>
      <div class="con">
        <span>{{$i18n.t('Class Time')}}</span>：
        <span>{{DateTimeUtils.dateClockTime(item.detailObj.startTime)}}</span>
      </div>
      <div class="con">
        <span>{{$i18n.t('Lesson')}}</span>：
        <span>{{$t(courseEdition(item.detailObj.courseEditionId))}} {{$t("Level")}}{{item.detailObj.courseLevel | courseLevelShowFilter}} {{$t('leeson')}}{{item.detailObj.lessonNo}}</span>
      </div>
      <div class="con">
        <span>{{$i18n.t('Teacher')}}</span>：
        <span>{{item.detailObj.tutorRealName}}</span>
      </div>
      <div class="msg">
        <span>{{subCategoryMapMsg()}}</span>
      </div>
    </div>
    <!-- 单元报告 -->
    <div class="unitReport" v-if="item.subCategory === MessageCenterCode.unitReportCode">
      <h4>
        <b v-if="$i18n.locale === 'zh'">[{{item.detailObj.studentRealName}}] 请查收单元报告</b>
        <b v-else>The Progress Report of {{item.detailObj.studentRealName}} has been sent！</b>
        <span>{{DateTimeUtils.dateClockTime(item.createTime)}}</span>
      </h4>
      <div class="con">
        <span>{{$i18n.t('Class Time')}}</span>：
        <span>{{DateTimeUtils.dateClockTime(item.detailObj.startTime)}}</span>
      </div>
      <div class="con">
        <span>{{$i18n.t('Lesson')}}</span>：
        <span>{{$t(courseEdition(item.detailObj.courseEditionId))}} {{$t("Level")}}{{item.detailObj.courseLevel | courseLevelShowFilter}} {{$t('unit')}}{{item.detailObj.unitNo}}</span>
      </div>
      <div class="con">
        <span>{{$i18n.t('Teacher')}}</span>：
        <span>{{item.detailObj.tutorRealName}}</span>
      </div>
      <div class="msg">
        <span>{{subCategoryMapMsg()}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
export default {
  props: {
    item: Object
  },
  data() {
    return {};
  },
  methods: {
    subCategoryMapTitle() {
      let { MessageCenterCode } = this;

      switch (this.item.subCategory) {
        // 充值成功
        case MessageCenterCode.rechargeSuccessCode:
          return this.$i18n.t("Successful top-up");
          break;
        // 余额不足
        case MessageCenterCode.moneyLittleCode:
          return this.$i18n.t("Your account balance is less than ")
          break;
        // 首课反馈
        case MessageCenterCode.firstClassFeedbackCode:
          return this.$i18n.t("The First Lesson Feedback of studentname has been sent！");
          break;
        // 单元报告
        case MessageCenterCode.unitReportCode:
          return this.$i18n.t("The Progress Report of studentname has been sent！");
          break;
        // 上课提醒
        case MessageCenterCode.classRemindCode:
          let time = this.item.detailObj.minutes;
          if (time % 60 != 0) {
            return (
              "[" +
              this.item.detailObj.studentRealName +
              "] " +
              time +
              this.$i18n.t(" minutes before class")
            );
          } else {
            return (
              "[" +
              this.item.detailObj.studentRealName +
              "] " +
              time / 60 +
              this.$i18n.t(" hours before class")
            );
          }
          return "";
          break;
        default:
          break;
      }
    },
    subCategoryMapMsg() {
      let { MessageCenterCode } = this;

      switch (this.item.subCategory) {
        // 充值成功
        case MessageCenterCode.rechargeSuccessCode:
          return "";
          break;
        // 余额不足
        case MessageCenterCode.moneyLittleCode:
          return (
            this.$i18n.t("Your account balance is less than ") +
            this.item.detailObj.minAmount +
            this.$i18n.t(" points, you can top-up for more classes.")
          );
        // 上课提醒
        case MessageCenterCode.classRemindCode:
          return this.$i18n.t("Pls enter the classroom 5 minutes before class");
        // 首课反馈
        case MessageCenterCode.firstClassFeedbackCode:
          return '';
        // 单元报告
        case MessageCenterCode.unitReportCode:
          return '';
        default:
          break;
      }
    },
    courseEdition(num) {
      let filter = Vue.filter('levelTitle')
      return filter(num);
    }
  }
};
</script>
<style lang='stylus' scoped>
.messageItem {
  width: 100%;
  background: rgba(244, 244, 244, 1);
  border-radius: 12px;
  margin-top: 20px;
  box-sizing: border-box;
  padding: 10px 30px 20px 30px;

  h4 {
    width: 100%;
    position: relative;
    margin: 10px 0;

    b {
      font-size: 20px;
      font-weight: 400;
      color: rgba(52, 54, 77, 1);
      line-height: 24px;
    }

    span {
      position: absolute;
      right: -22px;
      font-size: 16px;
      font-weight: 400;
      color: rgba(178, 178, 178, 1);
      line-height: 19px;

      i {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(235, 83, 47, 1);
        border-radius: 50%;
        position: relative;
        left: 20px;
      }
    }
  }

  .con {
    font-size: 16px;
    font-weight: 400;
    color: rgba(52, 54, 77, 1);
    line-height: 24px;
  }

  .msg {
    font-size: 16px;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: 19px;
    margin-top: 9px;
  }
}
</style>