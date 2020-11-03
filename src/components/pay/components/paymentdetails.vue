<template>
  <div class="m-pay-details w1200 auto wby">
    <h1 class="lg-title">{{$t('Transaction Details')}}</h1>
    <el-card :body-style="{'padding':'30px'}">
      <el-tabs v-model="activeName">
        <el-tab-pane class="courseware" :label="$t('Consume')" name="first">
          <table class="lg-list f16">
            <thead>
              <th width="25%">{{$t('Class Time')}}</th>
              <th width="30%">{{$t('Lesson')}}</th>
              <th width="15%">{{$t('Student')}}</th>
              <th width="15%">{{$t('Teacher')}}</th>
              <th class="15">{{$t('Consume point')}}</th>
            </thead>
            <tbody>
              <tr v-for="(item,key) in consume.list" :key="key">
                <td>{{DateTimeUtils.formartDateFromUTC(item.startTime, 'yyyy-MM-dd(w) hh:mm:ss')}}</td>
                <td>
                  <template>{{$t(courseEdition(item.courseEditionId))}}</template>
                  &nbsp;&nbsp;
                  Level{{item.courseLevel | courseLevelShowFilter}}
                  &nbsp;&nbsp;
                  {{$t('Lesson')+item.lessonNo}}
                </td>
                <td>{{item.studentUsername}}</td>
                <td>{{item.tutorUsername}}</td>
                <td>{{item.amount}}</td>
              </tr>
            </tbody>
          </table>
          <footer>
            <el-pagination
              background
              @current-change="consumeAction(user.userParentInfo.id)"
              :current-page.sync="consume.pageNum"
              :page-size="consume.pageSize"
              layout="prev, pager, next"
              :total="consume.total"
            ></el-pagination>
          </footer>
        </el-tab-pane>
        <el-tab-pane class="top-up" :label="$t('TOP-UP')" name="second">
          <table class="lg-list">
            <thead>
              <th width="25%">{{$t('Payment time')}}</th>
              <th width="23%">{{$t('Payment amount')}}</th>
              <th width="10%">{{$t('Points')}}</th>
              <th width="10%">{{$t('Bonus points')}}</th>
              <th width="32%">{{$t('Transaction number')}}</th>
            </thead>
            <tbody>
              <tr v-for="(item,key) in topup.list" :key="key">
                <td>{{DateTimeUtils.formartDateFromUTC(item.createTime, 'yyyy-MM-dd(w) hh:mm:ss')}}</td>
                <td>{{item.currency}}&nbsp;&nbsp;{{item.totalPrice.toFixed(2)}}</td>
                <td>{{item.rechargeAmount}}</td>
                <td>
                  <span :class="{'detail-asterisk': item.grantAward == 0}">
                    {{item.incentiveAmount}}
                  </span>
                </td>
                <td>{{item.orderNo}}</td>
              </tr>
            </tbody>
          </table>
          <footer>
            <el-pagination
              background
              @current-change="topupAction(user.userParentInfo.id)"
              :current-page.sync="topup.pageNum"
              :page-size="topup.pageSize"
              layout="prev, pager, next"
              :total="topup.total"
            ></el-pagination>
          </footer>

          <div>
            <span class="remarkes">{{$t('After successful Groupon')}}</span>
          </div>

        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapActions, mapGetters } from "vuex";
export default {
  components: {},
  data() {
    return {
      activeName: "first",
      currentPage1: 1
    };
  },
  computed: {
    ...mapGetters({
      user: "user/getUserInfo",
      consume: "finance/getConsume",
      topup: "finance/getTopup"
    })
  },
  methods: {
    ...mapActions({
      consumeAction: "finance/consumeAction",
      topupAction: "finance/topupAction"
    }),
    courseEdition(num) {
      let filter = Vue.filter('levelTitle')
      return filter(num);
    }
  },
  mounted() {
    this.consumeAction(this.user.userParentInfo.id);
    this.topupAction(this.user.userParentInfo.id);
  }
};
</script>
<style lang='stylus'>
.m-pay-details {
  .el-tabs {
    .el-tabs__active-bar {
      bottom: 5px;
      height: 4px;
      border-radius: 4px;
      overflow: hidden;
      background: rgba(86, 190, 205, 1);
    }

    .el-tabs__item {
      font-size: 18px;
      font-family: Comfortaa-Regular, Comfortaa;
      font-weight: 400;
      color: rgba(52, 54, 77, 1);

      &.is-active {
        color: rgba(86, 190, 205, 1);
      }
    }

    .lg-list {
      width: 100%;
      background: #F4F4F4;
      font-family: Rubik-Regular, Rubik;
      font-weight: 400;
      color: #34364D;
      line-height: 1.2;
      padding: 10px 0;

      th {
        text-align: left;
        height: 60px;
        font-size: 18px;
        padding: 0 10px;
        box-sizing: border-box;
        border-bottom: 2px solid #fff;
      }

      td {
        font-size: 16px;
        padding: 10px;
        box-sizing: border-box;
      }
    }

    footer {
      text-align: right;
      margin: 20px 0;
    }
  }
}

.detail-asterisk::after  {
  content: '*';
  display: inline-block;
  color: red;
  margin-left: 5px;
}

.remarkes::before  {
  content: '*';
  display: inline-block;
  color: red;
  margin-right: 5px;
}
</style>