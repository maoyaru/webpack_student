<template>
  <div class="payment-method lg-pay" v-loading="loading" element-loading-spinner="custom-loading">
    <div v-show="!isShowResult">
      <OrderDetail :orderInfo="orderInfo"/>
      <PayByQrcode
        v-show="payMethod !== 3 && isConfirmPayMethod"
        :payMethod="payMethod"
        :url="payurl"
        @choicePayMethod="choicePayMethod"
      />
      <PayByCard
        v-show="payMethod === 3 && isConfirmPayMethod"
        :currencyId="orderInfo.currencyId"
        @launchStripePay="launchStripePay"
        @choicePayMethod="choicePayMethod"
      />
    </div>
    <ChoosePayMethod 
      @changePayMethod="changePayMethod" 
      v-if="!isConfirmPayMethod"
      :currencyId="orderInfo.currencyId"
    />
    <PaymentResult
      v-show="isShowResult"
      :type="type" 
      :payMethod="payMethod" 
      :orderInfo="paymentResultInfo"
      :orderId="orderInfo.id"
      :faillMsg ="faillMsg"
      :contactPersonInfo="contactPersonInfo"
      @close="closeResult"
      @repay="rePayResult"
      @viewOrder="viewOrder"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { lgLocalStorage } from '../../common/js/store'
import OrderDetail from '../components/orderDetail'
import PayByQrcode from '../components/payByQrcode'
import PayByCard from '../components/payByCard'
import PaymentResult from '../components/paymentResult'
import ChoosePayMethod from '../components/choosePayMethod'
export default {
  data() {
    return {
      payMethod: 3,
      payMethodDesc: 'card',
      type: '',
      faillMsg: '',
      payurl: '',
      loading: false,
      isShowResult: false,
      stripeSecret: {},
      timer: null,
      times: 0,
      paymentResultInfo: {},
      contactPersonInfo: null,
      isMobile: navigator.userAgent.indexOf('Mobile') > -1,
      paymentId: '',
      isConfirmPayMethod: false,
    };
  },
  props: {
    payInfo: {
      default() {
        return {}
      },
      type: Object
    },
    orderInfo: {
      default() {
        return {}
      },
      type: Object
    }
  },
  components: {
    OrderDetail,
    PayByQrcode,
    PayByCard,
    PaymentResult,
    ChoosePayMethod,
  },
  computed: {
    ...mapGetters({
      parentInfo: 'user/getParentInfo',
      confirmRecharge: 'finance/getConfirmRecharge',
      getBill: 'finance/getBill'
    }),
    message() {
      return {
        unpay: this.$t('Please complete the payment within the validity period'),
        payFail: 'Payment failed',
        payTimeout: 'Payment timeout',
        payCancel: 'Payment cancellation',
        refundComplete: 'Refund complete',
        orderClose: 'Order closed',
      }
    }
  },
  methods: {
    ...mapMutations({
      updateBlance: 'user/updateBlance'
    }),
    ...mapActions({
      getParentInfoAction: 'user/getParentInfoAction'
    }),
    changePayMethod (type) {
      this.type = type
      this.isConfirmPayMethod = true
      switch (type) {
        case '1':
          this.payMethod = 1
          this.payMethodDesc = 'alipay'
          this.getSecretByQrcode('alipay')
          break
        case '2':
          this.payMethod = 2
          this.payMethodDesc = 'wechat'
          this.getSecretByQrcode('wechat')
          break
        default:
          this.payMethod = 3
          this.payMethodDesc = 'card'
          this.getSecretByCard()
      }
    },
    getSecretByCard () {
      this.loading = true
      const orderId = this.orderInfo.id
      this.$api.finance.clientSecret({
        channel: 'stripe',
        orderId,
        type: 'card'
      }).then(res => {
        this.loading = false
        if (res && res.data && res.data.code === 200) {
          this.stripeSecret = res.data.data
          this.paymentId = res.data.data.paymentId
          this.mountedStripeEle(res.data.data.key, res.data.data.clientSecret)
        } else {
          this.$message({
            message: res.data.message,
            center: true
          });
        }
      }, err => {
        console.log('err: ', err)
      })
    },
    getSecretByQrcode (type) {
      this.loading = true
      const { id, orderNo } = this.orderInfo
      this.$api.finance.clientSecret({
        channel: 'stripe',
        orderId: id,
        type
      }).then(res => {
        this.loading = false
        if (res && res.data && res.data.code === 200) {
          const { sourceId, authorizeUrl, paymentId } = res.data.data
          this.payurl = authorizeUrl
          this.paymentId = paymentId
          this.observePay(paymentId)
        } else {
          this.$message({
            message: res.data.message,
            center: true
          });
        }
      }, err => {
        console.log('err: ', err)
      })
    },
    mountedStripeEle (key, clientSecret) {
      const self = this
			var stripe = Stripe(key)
			var elements = stripe.elements()
			var style = {
			  base: {
			    color: "#32325d",
				  fontSize: "16px",
			  }
			}
			var card = elements.create("card", { style: style })
			card.mount("#card-element")
			card.addEventListener('change', ({error}) => {
			  const displayError = document.getElementById('card-errors')
			  if (error) {
			    displayError.textContent = error.message
			  } else {
			    displayError.textContent = ''
			  }
      })
      this.stripeInfo = {
        key,
        clientSecret,
        card,
        stripe
      }
    },
    launchStripePay () {
      const { clientSecret, card, stripe } = this.stripeInfo
      const self = this
      self.loading = true
      stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
        }
      }).then(function(result) {
        if (result.error) {
          self.loading = false
          self.$message({
            message: result.error.message,
            center: true
          })
        } else {
          if (result.paymentIntent.status === 'succeeded') {
            const { paymentId } = self.stripeSecret
            self.observePay(paymentId)
          }
        }
      })
    },
    closeResult () {
      this.isShowResult = false
      window.history.go(-1)
    },
    rePayResult () {
      this.isShowResult = false
      this.isConfirmPayMethod = false
      // this.payMethod = 3
      // console.log(this.stripeSecret)
      // const { key, clientSecret } = this.stripeSecret
      // this.mountedStripeEle(key, clientSecret)
    },
    choicePayMethod () {
      this.isConfirmPayMethod = false
      clearInterval(this.timer)
    },
    viewOrder() {
      const origin = window.origin
      window.location.replace(`${origin}/#/order/orderCenter`)
    },
    observePay(paymentId) {
      let self = this;
      self.times++;
      self.timer = setInterval(function() {
        self.$api.finance.getPayResult({ paymentId }).then((data) => {
          if(data.data.code == 200) {
            self.times = self.times + 1;
            if(data.data.data == self.ApiConstants.payMentStatusNot || data.data.data == self.ApiConstants.payMentStatusPaying) {
              // 未支付
              if(self.times > self.Constants.payTimesTimeout) {
                self.$message({
                  message: self.message.unpay,
                  onClose: () => {
                    self.viewOrder()
                  }
                })
                clearInterval(self.timer)
              }
            }else if(data.data.data == self.ApiConstants.payMentStatusSuccess) {
              // 支付成功
              clearInterval(self.timer);
              this.payurl = '';
              let bonusBalance = self.getBill.incentiveAmount*1 + self.getBill.referrerIncentiveAmount*1;
              // self.updateBlance({bonusBalance, balance: self.getBill.rechargeAmount});
              self.getParentInfoAction(self.parentInfo.id);
              // 支付成功跳转至H5落地页
              if (self.payInfo.isFromLand == '1') {
                let tempUserName = ''
                const userInfo = lgLocalStorage('__lgzy__s__');
                if (userInfo && userInfo.login_info.user.jwtToken) {
                  tempUserName = userInfo.login_info.user.userParentInfo.username
                }
                window.location.replace(`${self.payInfo.landPageHost}?userName=${tempUserName}&groupId=${self.payInfo.groupId}`)
              }
              self.successPayCallback()
              fbq('track', 'Purchase');
            } else {
              self.errorPayCallback(data.data.data);
            }
          } else if (data.data.code == 41010) {
            const status = self.Constants.orderStatusClose
            self.errorPayCallback(status);
          } else {
            self.$message({
              message: data.data.message
            })
            clearInterval(self.timer)
            self.loading = false
            self.payurl = ''
            self.times = 0
          }
        }, (err) => {
          console.log('err', err)
        })
      }, 3000)
    },
    getOrderDetail (status) {
      const paymentId = this.paymentId
      this.$api.finance.getOrderPayResultDetail({
        paymentId,
        status
      }).then (res => {
        if (res && res.data && res.data.code === 200) {
          this.paymentResultInfo = res.data.data
        } else {
          this.$message({
            message: res.data.message
          })
        }
      }, err => {
        console.log('err', err)
      })
    },
    getAdviserInfo () {
      const userId = this.parentInfo.id
      this.$api.finance.getAdviserInfo({userId}).then(res => {
        if (res && res.data && res.data.code === 200) {
          if (res.data.data.xgInfo) {
            this.contactPersonInfo = res.data.data.xgInfo
          } else if (res.data.data.adviserInfo) {
            this.contactPersonInfo = res.data.data.adviserInfo
          }
        } else {
          this.$message({
            message: res.data.message
          })
        }
      }, err => {
        console.log('err', err)
      })
    },
    determineFailMsg (data) {
      let tempMsg = ''
      switch (data) {
        case this.ApiConstants.payMentStatusFail:
          tempMsg = this.message.payFail
          break
        case this.ApiConstants.payMentStatusOverTime:
          tempMsg = this.message.payTimeout
          break
        case this.ApiConstants.payMentStatusRefund:
          tempMsg = this.message.refundComplete
          break
        case this.ApiConstants.payMentStatusCancel:
          tempMsg = this.message.payCancel
          break
        case this.Constants.orderStatusClose:
          tempMsg = this.message.orderClose
          break
      }
      return tempMsg
    },
    errorPayCallback(data) {
      const self = this;
      self.times = 0;
      self.payurl = '';
      self.isShowResult = true
      self.type = 'faill'
      self.faillMsg = self.determineFailMsg(data)
      self.loading = false
      clearInterval(self.timer);
      data !== self.Constants.orderStatusClose ? self.getOrderDetail(2): ''
      self.getAdviserInfo()
    },
    successPayCallback() {
      const self = this
      self.times = 0;
      self.payurl = '';
      self.isShowResult = true
      self.type = 'success'
      self.loading = false
      self.getOrderDetail(1)
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  destroyed(){
    clearInterval(this.timer);
  }
};
</script>
<style lang='stylus'>
.lg-pay{
  iframe{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 13;
  }
}
#card-errors{
  padding-top: 40px;
}
.payment-method{position: relative;}
.payment-method-btn button{background: transparent;border:none;color:#fff;width:100%;height:100%;font-size: 32px;cursor:pointer;}
.payment-method #card-element iframe{
  height: 26px!important;
}
</style>