<!-- ✅ -->
<template>
  <div class="page-order-list" v-loading="pageLoading" element-loading-spinner="custom-loading">
    <div>
      <div class="single-item" v-for="(i, index) in listData" :key="index">
        <div class="line-1">
          <div class="line-1-l">{{i.createTime | orderCreateDateToFilter}}</div>
          <div class="line-1-r">{{$t('Order number')}}：{{i.orderNo}}</div>
        </div>
        <div class="line-2">
          <div class="item item-1">
            <div class="item-1-1">
              <div>
                {{i.rechargeAmount}} {{$t('Points')}}
                <span v-if="$i18n.locale == 'en'">
                  <img src="@/images/order/tag-sg-zh.png" v-if="i.sgClassId">
                  <img src="@/images/order/tag-zh.png" v-else>
                </span>
               <span v-else>
                  <img src="@/images/order/tag-sg.png" v-if="i.sgClassId">
                  <img src="@/images/order/tag.png" v-else>
                </span>
              </div>
            </div>
            <div class="item-1-2" v-if="i.referrerIncentiveAmount || i.incentiveAmount">
              +{{i.referrerIncentiveAmount + i.incentiveAmount}}{{$t('Bonus points')}}
              &nbsp;
              <span v-if="i.groupId">({{$t('After successful Groupon')}})</span>
            </div>
          </div>
          <div class="item item-2">
            <div class="item-2-1">{{i.currency}} {{i.totalPrice | dollarInteger}}.{{i.totalPrice | dollarDecimal}}</div>
            <div class="item-2-2" v-if="i.savePrice != 0">{{i.currency}} {{i.originTotalPrice | dollarInteger}}.{{i.originTotalPrice | dollarDecimal}}</div>
          </div>
          <div class="item item-3">
            <div class="item-3-1">
              <span v-if="i.status == 0 || i.status == 2">{{$t('Pending')}}</span>
              <span v-if="i.status == 1 || i.status == 4">{{$t('Paid')}}</span>
              <span v-if="i.status == 5 || i.status == 6">{{$t('Cancelled')}}</span>
              <span v-if="i.status == 3">{{$t('Refunded')}}</span>
            </div>
            <div class="item-3-2" v-if="i.status == 0 || i.status == 2">
              <order-count-item :orderId="i.id" @refreshList="loadData" :overTime="i.overTime" page="list"></order-count-item>
            </div>
          </div>
          <div class="item item-4">
            <div class="view" @click="jumpToDetail(i.id)">{{$t('View details')}}</div>
            <div class="pay" v-if="i.status == 0 || i.status == 2" @click="jumpToPayPage(i)">{{$t('Pay now')}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/api/index"
import { mapGetters } from 'vuex'

export default {

  name: 'orderList',

  data() {
    return {
      pageLoading: true,
      listData: [],
    }
  },

  created() {},

  mounted() {
    this.loadData()
  },

  computed: {
    ...mapGetters({
      parentInfo: 'user/getParentInfo'
    }),
  },

  methods: {

    loadData() {
      api.order.getOrderList(1, 500, this.parentInfo.id).then(res => {
        this.pageLoading = false
        if (res.status === 200 && res.data.code === 200) {
          this.listData = res.data.data.list
        } else {
          this.$message(res.data.message)
        }
      })
    },

    jumpToDetail(orderId) {
      this.$router.push(`/order/orderDetail?orderId=${orderId}`)
    },

    jumpToPayPage(item) {
      if (item.sgClassId || item.groupId || item.packageid) {
        const origin = window.origin
        window.location.replace(`${origin}/billList.html?orderId=${item.id}`)
      } else {
        this.$router.push(`/pay/billing?orderId=${item.id}`)
      }
    },
  }

}

</script>
<style scoped lang="stylus">
.page-order-list {
  height: 100%;

  .single-item {
    height: 126px;
    background: #fff;
    box-shadow: 0px 4px 8px 4px rgba(182, 182, 182, 0.08);
    border-radius: 8px;
    margin-bottom: 20px;
    padding: 0 30px;

    .line-1 {
      display: flex;
      justify-content: space-between;
      line-height: 42px;
      border-bottom: 2px solid #DEDEDE;
      color: #999;

      .line-1-l {
        color: #666;
      }
    }

    .line-2 {
      display: flex;

      .item {
        width: 25%;
        padding-top: 18px;

        &.item-1 {
          .item-1-1 {
            font-size: 18px;
            color: #34364D;

            img {
              width: 60px;
              vertical-align: top;
              margin-top: -3px;
            }
          }

          .item-1-2 {
            font-size: 14px;
            color: #666;
            margin-top: 6px;
          }
        }

        &.item-2 {
          text-align: center;

          .item-2-1 {
            color: #34364D;
            margin-bottom: 10px;
            font-size: 18px;
          }

          .item-2-2 {
            color: #999;
            font-size: 14px;
            text-decoration: line-through;
          }
        }

        &.item-3 {
          text-align: center;

          .item-3-1 {
            color: #34364D;
            font-size: 18px;
            margin-bottom: 10px;
          }

          .item-3-2 {
            color: #999;
            font-size: 14px;
          }
        }

        &.item-4 {
          display: flex;
          justify-content: flex-end;

          /*align-items: right;*/
          .view {
            font-size: 14px;
            color: #6E70A0;
            margin-right: 10px;
            line-height: 40px;
            cursor: pointer;
          }

          .pay {
            height: 40px;
            width: 100px;
            background: #EFA83E;
            border-radius: 44px;
            line-height: 40px;
            text-align: center;
            font-size: 14px;
            color: #fff;
            cursor: pointer;
          }
        }
      }
    }
  }
}

</style>
