<template>
  <el-card>
    <div class="container">
      <h2 class="title">{{$t('Cashier')}}</h2>
      <div class="order-no">{{$t('Order number')}}: {{orderInfo.orderNo}}</div>
      <OrderCountItem :orderId="orderInfo.id" :overTime="orderInfo.overTime" page="detail"/>
      <div>{{$t('Top-uped points')}}: {{orderInfo.rechargeAmount}}</div>
      <div>{{$t('Awarded points')}}: {{orderInfo.incentiveAmount + orderInfo.referrerIncentiveAmount}}</div>
      <div>{{$t('Discounted price')}}:
        {{orderInfo.savePrice | filterInterge}}.{{orderInfo.savePrice | filterDollarDecimal}} {{orderInfo.currency}}
      </div>
      <div>{{$t('Paid price')}}: 
        {{orderInfo.totalPrice | filterInterge}}.{{orderInfo.totalPrice | filterDollarDecimal}} {{orderInfo.currency}}
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
  components: {
    OrderCountItem,
  },
  data() {
    return {}
  },
}
</script>

<style lang='stylus' scoped>
.container {
  .title {
    font-size: 24px;
    font-weight: bold;
    color: #d78f25;
  }

  .order-no {
    font-size: 18px;
  }

  & div {
    padding: 5px 0;
  }
}
</style>