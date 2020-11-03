<!-- ✅ -->
<template>
  <div class="order-center">
    <div class="l-section">
      <div class="tab-item" :class="{'tab-item-active': currentTab == 'myOrder'}" @click="currentTab = 'myOrder'">
        <img src="@/images/order/order.png" v-if="currentTab == 'classDetail'">
        <img src="@/images/order/order_active.png" v-else>
        {{$t('My Order')}}
      </div>
      <div class="tab-item" :class="{'tab-item-active': currentTab == 'classDetail'}" @click="currentTab = 'classDetail'">
        <img src="@/images/order/money.png" v-if="currentTab == 'myOrder'">
        <img src="@/images/order/money_active.png" v-else>
        {{$t('Transactions')}}
        
      </div>
    </div>
    <div class="r-section">
      <order-list v-if="currentTab == 'myOrder'"></order-list>
      <class-detail v-if="currentTab == 'classDetail'"></class-detail>
    </div>
  </div>
</template>
<script>
export default {

  name: 'orderCenter',

  data() {
    return {
      currentTab: 'myOrder',
    }
  },

  created() {
    this.currentTab = this.$route.query.tab == 'points' ? 'classDetail' : 'myOrder'
  },

  mounted() {},

  methods: {}

}

</script>
<style scoped lang="stylus">
.order-center {
  width: 1200px;
  margin: 0 auto;
  min-height: 715px;
  display: flex;
  justify-content: space-between;

  .l-section {
    width: 200px;
    height: 715px;
    background: #fff;
    box-shadow: 0px 4px 8px 4px rgba(182, 182, 182, 0.08);
    border-radius: 8px;
    padding-top: 12px;

    .tab-item {
      height: 60px;
      /*text-align: center;*/
      padding-left: 30px;
      color: #34364D;
      cursor: pointer;
      padding-top: 6px;

      &.tab-item-active {
        color: #56BECD;
        background: #F4F4F4;
      }

      img {
        height: 48px;
        width: 48px;
        vertical-align: middle;
      }
    }
  }

  .r-section {
    width: 940px;
  }
}

</style>
