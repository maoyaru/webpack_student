<template>
  <div>
    <el-card class="lg-card" :body-style="{ padding: '24px 0' }">
      <div
        slot="header"
        class="title comfortaa"
      >{{currentStudent.realName || ''}}</div>
      <div class="body">
        <div class="item">
          <div class="title">{{$t("With LingoAce")}}</div>
          <div class="info">
            <span class="val">{{onLingoDays}}</span>
            <span class="unit">{{$t("days")}}</span>
          </div>
        </div>
        <div class="item">
          <div class="title">{{$t(levelTitle)}}</div>
          <div class="info">
            <span class="unit">Level</span>
            <span class="val">{{currentStudent.courseLevel | courseLevelShowFilter}}</span>
          </div>
        </div>
        <div class="item">
          <div class="title">{{$t('Completed')}}</div>
          <div class="info">
            <span class="val">{{studentBriefInfo.completedClassNum}}</span>
            <span class="unit">{{$t('classes')}}</span>
          </div>
        </div>
        <div class="item">
          <div class="title">{{$t('Upcoming')}}</div>
          <div class="info">
            <span class="val">{{studentBriefInfo.upcomingClassNum}}</span>
            <span class="unit">{{$t('classes')}}</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Vue from 'vue';
export default {
  props: {

  },
  computed: {
    ...mapGetters({
      currentStudent: 'student/getCurrentStudent',
      studentBriefInfo: 'user/getStudentBriefInfo'
    }),
    levelTitle() {
      let filter = Vue.filter('levelTitle')
      return filter(this.currentStudent.courseEditionId);
    },
    onLingoDays() {
      if(this.studentBriefInfo && this.studentBriefInfo.createTime) {
        return parseInt(
          (new Date() -
            new Date(this.studentBriefInfo.createTime)) /
            (1000 * 60 * 60 * 24)
        )
      }
    }
  }
};
</script>

<style scoped lang="stylus">
.lg-card {
    color: #fff;
    background: rgba(110, 112, 160, 1);

    .el-card__header {
      border-bottom-color: #FAE1AB;

      .title {
        font-size: 28px;
        font-weight: 400;
        color: rgba(250, 225, 171, 1);
      }
    }

    .body {
      display: flex;

      .item {
        flex: 1;
        text-align: center;

        .title {
          min-height: 24px;
          font-size: 20px;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          line-height: 24px;
        }

        .val {
          height: 36px;
          font-size: 30px;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          line-height: 36px;
        }

        .unit {
          font: 14px;
        }
      }
    }
  }
</style>
