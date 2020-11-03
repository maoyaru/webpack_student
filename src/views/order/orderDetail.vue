<template>
  <div class="page-order-detail" v-if="orderDetail">
    <el-dialog :title="adviserOrXgTitile" :visible.sync="xgDialogVisible" center :show-close="false" width="600px" v-if="adviserOrXgInfo">
      <div class="dialog-text">
        <div class="img" v-if="adviserOrXgInfo.wechatQrcode">
          <img :src="adviserOrXgInfo.wechatQrcode">
        </div>
        <div v-if="adviserOrXgInfo.wechat">{{$t('Wechat')}}：{{adviserOrXgInfo.wechat}}</div>
        <div v-if="adviserOrXgInfo.phone">{{$t('Mobile')}}：{{adviserOrXgInfo.phone}}</div>
        <div v-if="adviserOrXgInfo.whatsapp">WhatApp：{{adviserOrXgInfo.whatsapp}}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="xgDialogVisible = false">{{$t('Comfirm')}}</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="$t('Call the number below to get more services')" :visible.sync="tipDialogVisible" center :show-close="false" width="600px">
      <div class="dialog-text">
        <div>{{$t('Beijing office')}}：+86 010 62538271</div>
        <div>{{$t('Singapore office')}}：+65 86183670</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="tipDialogVisible = false">{{$t('Comfirm')}}</el-button>
      </span>
    </el-dialog>
    <div class="title">{{$t('Order details')}}</div>
    <div class="page-order-detail-box">
      <div class="line-1">{{$t('Status')}}：
        <span v-if="orderDetail.status == 0 || orderDetail.status == 2">{{$t('Pending')}}</span>
        <span v-if="orderDetail.status == 1 || orderDetail.status == 4">{{$t('Paid')}}</span>
        <span v-if="orderDetail.status == 3">{{$t('Refunded')}}</span>
        <span v-if="orderDetail.status == 5 || orderDetail.status == 6">{{$t('Cancelled')}}</span>
      </div>
      <div class="line-2" v-if="orderDetail.status == 0 || orderDetail.status == 2">
        <order-count-item :overTime="orderDetail.overTime" page="detail"></order-count-item>
      </div>
      <div class="line-3" v-if="orderDetail.status != 3">
        <div>{{$t('Top-uped points')}}：{{orderDetail.rechargeAmount}}{{$t('Points')}}</div>
        <div v-if="orderDetail.incentiveAmount + orderDetail.referrerIncentiveAmount">{{$t('Awarded points')}}：{{orderDetail.incentiveAmount + orderDetail.referrerIncentiveAmount}}{{$t('Points')}}</div>
        <div>{{$t('Points type')}}：<span v-if="orderDetail.sgClassId">{{$t('sg Points')}}</span><span v-else>{{$t('Normal Points')}}</span></div>
        <div v-if="(orderDetail.status == 0 || orderDetail.status == 1 || orderDetail.status == 2 || orderDetail.status == 4) && orderDetail.originTotalPrice">{{$t('Original price')}}：{{orderDetail.currency}} {{orderDetail.originTotalPrice | dollarInteger}}.{{orderDetail.originTotalPrice | dollarDecimal}}</div>
        <div v-if="(orderDetail.status == 0 || orderDetail.status == 1 || orderDetail.status == 2 || orderDetail.status == 4) && orderDetail.originTotalPrice">{{$t('Discounted price')}}：{{orderDetail.currency}} {{orderDetail.savePrice | dollarInteger}}.{{orderDetail.savePrice | dollarDecimal}}</div>
        <div v-if="orderDetail.status == 1 || orderDetail.status == 4">{{$t('Paid price')}}：{{orderDetail.currency}} {{orderDetail.totalPrice | dollarInteger}}.{{orderDetail.totalPrice | dollarDecimal}}</div>
        <div v-if="(orderDetail.status == 0 || orderDetail.status == 1 || orderDetail.status == 2 || orderDetail.status == 4) && orderDetail.code">{{$t('Coupon code')}}：{{orderDetail.code}}</div>
        <div>{{$t('Order number')}}：{{orderDetail.orderNo}}</div>
        <div>{{$t('Order time')}}：{{DateTimeUtils.dateClockTime(orderDetail.createTime)}}</div>
        <div v-if="orderDetail.status == 5 || orderDetail.status == 6">{{$t('Cancellation time')}}：{{DateTimeUtils.dateClockTime(orderDetail.updateTime)}}</div>
        <div v-if="orderDetail.status == 1 || orderDetail.status == 4">{{$t('Payment time')}}：{{DateTimeUtils.dateClockTime(orderDetail.updateTime)}}</div>
        <div v-if="orderDetail.status == 1 || orderDetail.status == 4">{{$t('Payment Mode')}}：<span v-if="orderDetail.payType == 'card'">{{$t('Card payment')}}</span><span v-if="orderDetail.payType == 'alipay'">{{$t('Alipay')}}</span><span v-if="orderDetail.payType == 'wechat'">{{$t('Wechat')}}</span></div>
        <div v-if="orderDetail.status == 1 || orderDetail.status == 4">
          <div class="receipt" v-if="receiptUrl">
            <span @click="openApplicationReceipt" v-if="openApplicationReceipt">{{$t('View reciept')}}</span>
            <span class="tips" v-else>{{$t('Only show receipts after 2020-01-01')}}</span>
            <!--             <img src="@/images/order/arrow_down_91.png" v-if="!receiptInputShow" @click="receiptInputShow = true">
            <img src="@/images/order/arrow_up_91.png" v-else @click="receiptInputShow = false">
            <div>
              <div class="receipt-input-box" v-if="receiptInputShow">
                <input type="text" placeholder="请输入接收发票的邮箱" v-model="email">
                <div class="btn" @click="openApplicationReceipt">申请</div>
              </div>
            </div> -->
          </div>
          <!-- <div class="receipt-result" v-if="orderDetail.sendSatus == 1 || orderDetail.sendSatus == 2"> -->
          <!--           <div class="receipt-result" v-else>
            <div class="receipt-result-title">
              <div>订单收据</div>
              <div class="resend" @click="reApplicationReceipt">重新申请</div>
            </div>
            <div class="receipt-result-detail">发送状态：{{orderDetail.sendSatus == 1 ? '发送成功' : '发送失败'}}</div>
            <div class="receipt-result-detail">接收邮箱：{{orderDetail.sendEmail}}</div>
            <div class="receipt-result-detail">发送时间：{{DateTimeUtils.dateClockTime(orderDetail.sendTime)}}</div>
          </div> -->
        </div>
        <div class="action-0" v-if="orderDetail.status == 0">
          <div class="cancel" @click="cancelOrder">{{$t('Cancel Order')}}</div>
          <div class="pay">
            <div class="amount">{{$t('Paid price')}}<span style="color: #EFA83E;">{{orderDetail.currency}} {{orderDetail.totalPrice | dollarInteger}}.{{orderDetail.totalPrice | dollarDecimal}}</span></div>
            <div class="pay-btn" @click="jumpToPayPage(orderDetail)">{{$t('Pay now')}}</div>
          </div>
        </div>
        <div class="action-1" v-if="orderDetail.status == 1 || orderDetail.status == 4">
          <div class="aftermarket" @click="getAdviserOrXgInfo">{{$t('Enquiries')}}</div>
        </div>
      </div>
      <div v-else>
        <div class="line-3">
          <div>{{$t('Amount Refunded')}}：{{orderDetail.refundMoney || '无'}}</div>
          <div>{{$t('Refund time')}}：{{DateTimeUtils.dateClockTime(orderDetail.refundTime)}}</div>
          <div>{{$t('Point used')}}：{{orderDetail.consumeLessonNum || '无'}}</div>
          <div>{{$t('Point retrieved')}}：{{orderDetail.collectionLessonNum || '无'}}</div>
          <div class="line-3-inner-box">
            <div class="line-3">
              <div style="color: #333;">{{$t('Order details')}}</div>
              <div>{{$t('Top-uped points')}}：{{orderDetail.rechargeAmount}}{{$t('Points')}}</div>
              <div v-if="orderDetail.incentiveAmount + orderDetail.referrerIncentiveAmount">{{$t('Awarded points')}}：{{orderDetail.incentiveAmount + orderDetail.referrerIncentiveAmount}}{{$t('Points')}}</div>
              <div>{{$t('Points type')}}：<span v-if="orderDetail.sgClassId">{{$t('sgPoints')}}</span><span v-else>{{$t('Normal Points')}}</span></div>
              <div v-if="orderDetail.originTotalPrice">{{$t('Original price')}}：{{orderDetail.currency}} {{orderDetail.originTotalPrice | dollarInteger}}.{{orderDetail.originTotalPrice | dollarDecimal}}</div>
              <div v-if="orderDetail.originTotalPrice">{{$t('Discounted price')}}：{{orderDetail.currency}} {{orderDetail.savePrice | dollarInteger}}.{{orderDetail.savePrice | dollarDecimal}}</div>
              <div>{{$t('Paid price')}}：{{orderDetail.currency}} {{orderDetail.totalPrice | dollarInteger}}.{{orderDetail.totalPrice | dollarDecimal}}</div>
              <div>{{$t('Order number')}}：{{orderDetail.orderNo}}</div>
              <div>{{$t('Order time')}}：{{DateTimeUtils.dateClockTime(orderDetail.createTime)}}</div>
              <div>{{$t('Payment time')}}：{{DateTimeUtils.dateClockTime(orderDetail.updateTime)}}</div>
              <div>{{$t('Payment Mode')}}：<span v-if="orderDetail.payType == 'card'">{{$t('Card payment')}}</span><span v-if="orderDetail.payType == 'alipay'">{{$t('Alipay')}}</span><span v-if="orderDetail.payType == 'wechat'">{{$t('Wechat')}}</span></div>
            </div>
          </div>
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

  name: 'orderDetail',

  data() {
    return {
      orderDetail: null,
      adviserOrXgInfo: null,
      adviserOrXgTitile: null,
      xgDialogVisible: false,
      tipDialogVisible: false,
      receiptInputShow: false,
      email: null,
      receiptUrl: null
    }
  },

  created() {
    this.getOrder()
  },

  computed: {
    ...mapGetters({
      parentInfo: 'user/getParentInfo'
    }),
  },

  mounted() {},

  methods: {
    // 获取订单
    getOrder() {
      let orderId = this.$route.query.orderId
      api.order.getOrderDetail(orderId).then(res => {
        if (res.status === 200 && res.data.code === 200) {
          this.orderDetail = res.data.data
          if (this.orderDetail.status == 1 || this.orderDetail.status == 4) {
            this.getApplicationReceipt()
          }
        } else {
          this.$message(res.data.message)
        }
      })
    },
    // 取消订单
    cancelOrder() {
      let orderId = this.$route.query.orderId
      this.$confirm(this.$i18n.t('Confirm to cancel this order?'), this.$i18n.t('Prompt'), {
        confirmButtonText: this.$i18n.t('Later'),
        cancelButtonText: this.$i18n.t('Cancel Order')
      }).then(() => {
        console.log('用户点击了我再想想')
      }).catch(() => {
        console.log('用户点击了取消订单')
        api.order.cancelOrder(orderId).then(res => {
          this.refreshPendingOrderCount()
          if (res.status === 200 && res.data.code === 200) {
            this.$message.success(this.$i18n.t('Cancel Order Success'))
            this.getOrder()
          } else {
            this.$message(res.data.message)
          }
        })
      });
    },
    // 跳转至支付页面
    jumpToPayPage(item) {
      if (item.sgClassId || item.groupId || item.packageid) {
        const origin = window.origin
        window.location.replace(`${origin}/billList.html?orderId=${item.id}`)
      } else {
        this.$router.push(`/pay/billing?orderId=${item.id}`)
      }
    },
    // 申请售后
    getAdviserOrXgInfo() {
      api.order.getAdviserOrXgInfo(this.parentInfo.id).then(res => {
        if (res.status === 200 && res.data.code === 200) {
          let info = res.data.data
          this.adviserOrXgInfo = info.xgInfo ? info.xgInfo : info.adviserInfo
          let name = null
          if (this.adviserOrXgInfo) {
            name = this.adviserOrXgInfo.nameEn ? this.adviserOrXgInfo.nameEn : this.adviserOrXgInfo.realName
          }
          if (this.adviserOrXgInfo) {
            this.adviserOrXgTitile = this.$i18n.locale == 'en' ? `For enquiries, please contact your course consultant${name}` : `售后问题请联系您的专属课程顾问${name}老师提供帮助`
            this.xgDialogVisible = true
          } else {
            this.tipDialogVisible = true            
          }
        } else {
          this.$message(res.data.message)
        }
      })
    },
    getApplicationReceipt() {
      let orderId = this.$route.query.orderId
      api.order.applyToSendOrderInfo(orderId).then(res => {
        if (res.status === 200 && res.data.code === 200) {
          this.receiptUrl = res.data.data
        } else {
          this.$message(res.data.message)
        }
      })
    },
    // 申请收据
    openApplicationReceipt() {
      window.open(this.receiptUrl)
    },
    // 重新发送
    reApplicationReceipt() {
      this.orderDetail.sendSatus = 0
      this.receiptInputShow = true
    },
    // 刷新统计未支付订单
    refreshPendingOrderCount() {
      this.$EventBus.$emit("onRefreshPendingOrderCount");
    },
  }

}

</script>
<style scoped lang="stylus">
* {
  box-sizing: border-box;
}

.page-order-detail {
  width: 800px;
  margin: 0 auto;

  .dialog-text {
    text-align: center;

    >div {
      margin-bottom: 20px;

      img {
        width: 150px;
        height: 150px;
        /*background: red;*/
      }
    }
  }

  .title {
    color: #34364D;
    font-size: 28px;
    margin-bottom: 8px;
  }

  .page-order-detail-box {
    width: 100%;
    position: relative;
    background: #fff;
    box-shadow: 0px 4px 8px 4px rgba(182, 182, 182, 0.08);
    border-radius: 12px;
    padding: 25px 28px;

    .line-1 {
      color: #34364D;
      font-size: 20px;
      margin-bottom: 10px;
    }

    .line-2 {
      color: #666;
      font-size: 14px;
      margin-bottom: 10px;
    }

    .line-3 {
      color: #666;
      font-size: 14px;
      line-height: 22px;

      .line-3-inner-box {
        background: #f8f8f8;
        padding: 15px 20px;
        margin-top: 10px;
      }

      .receipt {
        color: #6E70A0;
        font-size: 16px;
        margin-top: 10px;
        cursor: pointer;

        .tips {
          font-size: 12px;
          color: #999;
          float: right;
        }

        img {
          width: 20px;
          vertical-align: middle;
          cursor: pointer;
        }

        .receipt-input-box {
          position: relative;
          margin-top: 10px;
          width: 440px;

          input {
            width: 440px;
            height: 40px;
            border-radius: 6px;
            border: 1px solid rgba(178, 178, 178, 1);
            padding: 0 90px 0 10px;
            font-size: 16px;
          }

          input::-webkit-input-placeholder {
            font-size: 16px;
          }

          .btn {
            position: absolute;
            top: 0;
            right: 0;
            width: 88px;
            height: 40px;
            background: #EFA83E;
            color: #fff;
            text-align: center;
            line-height: 40px;
            border-top-right-radius: 6px;
            border-bottom-right-radius: 6px;
            cursor: pointer;
            font-size: 14px;
          }
        }
      }

      .receipt-result {
        margin-top: 10px;

        .receipt-result-title {
          font-size: 16px;
          display: flex;
          color: #34364D;
          margin-bottom: 10px;
          justify-content: space-between;

          .resend {
            color: #6E70A0;
            cursor: pointer;
          }
        }
      }
    }

    .action-0 {
      .cancel {
        position: absolute;
        right: 30px;
        top: 38px;
        color: #6E70A0;
        font-size: 16px;
        cursor: pointer;
      }

      .pay {
        display: flex;
        position: absolute;
        right: 30px;
        bottom: 30px;
        font-size: 14px;
        line-height: 40px;

        .pay-btn {
          width: 100px;
          height: 40px;
          background: #EFA83E;
          border-radius: 44px;
          color: #fff;
          text-align: center;
          margin-left: 10px;
          cursor: pointer;
        }
      }
    }

    .action-1 {
      .aftermarket {
        position: absolute;
        top: 30px;
        right: 20px;
        width: 100px;
        height: 40px;
        border-radius: 44px;
        border: 2px solid rgba(52, 54, 77, 1);
        color: #34364D;
        text-align: center;
        line-height: 40px;
        cursor: pointer;
      }
    }
  }
}

</style>
