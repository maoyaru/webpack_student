<template>
  <el-card>
    <div class="container">
      <div class="left">
        <div class="title">{{$t('Cashier')}}</div>
        <div class="order-no">{{$t('Order number')}}: {{orderInfo.orderNo}}</div>
        <OrderCountItem :orderId="orderInfo.id" :overTime="orderInfo.overTime" page="detail" />
      </div>
      <div class="right">
        <div>{{$t('Top-uped points')}}: {{orderInfo.rechargeAmount}}</div>
        <div>{{$t('Awarded points')}}: {{orderInfo.incentiveAmount + orderInfo.referrerIncentiveAmount}}</div>
        <div>{{$t('Discounted price')}}:
          {{orderInfo.savePrice | filterInterge}}.{{orderInfo.savePrice | filterDollarDecimal}} {{orderInfo.currency}}
        </div>
        <div>
          <div>{{$t('Paid price')}}:</div>
          <div class="pay-price">
            {{orderInfo.totalPrice | filterInterge}}.{{orderInfo.totalPrice | filterDollarDecimal}} {{orderInfo.currency}}
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>
<script>
import OrderCountItem from '@/auto-components/Order/OrderCountItem'
export default {
  props: {
    orderInfo: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {}
  },
  components: {
    OrderCountItem,
  },
}

</script>
<style lang='stylus' scoped>
.container {
  display: flex;
  height: 130px;
  font-size: 16px;
  padding: 20px 40px;
  color: #34364d;

  .left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;

    .title {
      font-size: 24px;
      font-weight: bold;
      color: #d78f25;
    }

    .order-no {
      font-weight: bold;
      font-size: 18px;
    }
  }

  .right {
    width: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .pay-price {
      margin-top: 10px;
      font-size: 24px;
      color: #efa83e;
    }
  }
}

</style>
