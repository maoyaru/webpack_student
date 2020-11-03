<template>
  <div class="container"> 
    <template v-if="type === 'success' && orderInfo.originTotalPrice">
      <div class="succ-top">
        <img class="succ-img" src="../../../assets/theme-default/images/pay/pay-succ-icon.png"/>
        <span class="succ-desc">{{$t('Successful payment')}}</span>
      </div>
      <div class="succ-center">
        <p>{{$t('Top-uped points')}}: <span class="succ-value">{{orderInfo.rechargeAmount}}</span></p>
        <p>{{$t('Awarded points')}}: <span class="succ-value">{{orderInfo.incentiveAmount + orderInfo.referrerIncentiveAmount}}</span></p>
        <p>{{$t('Order number')}}: <span class="succ-value">{{orderInfo.orderNo}}</span></p>
        <p>{{$t('Order time')}}: <span class="succ-value">{{DateTimeUtils.formartDateFromUTC(orderInfo.createTime,'yyyy.MM.dd hh:mm:ss')}}</span></p>
        <p>{{$t('Payment time')}}: <span class="succ-value">{{DateTimeUtils.formartDateFromUTC(orderInfo.payTime,'yyyy.MM.dd hh:mm:ss')}}</span></p>
        <p>{{$t('Payment Mode')}}: <span class="succ-value">{{orderInfo.payType}}</span></p>
        <p>{{$t('Original price')}}:
          <span class="succ-value">
            {{orderInfo.originTotalPrice | filterInterge}}.{{orderInfo.originTotalPrice | filterDollarDecimal}} {{orderInfo.currency}}
          </span>
        </p>
        <p>{{$t('Discounted price')}}:
          <span class="succ-value">
            {{orderInfo.savePrice | filterInterge}}.{{orderInfo.savePrice | filterDollarDecimal}} {{orderInfo.currency}}
          </span>
        </p>
        <p>{{$t('Paid price')}}:
          <span class="succ-value">
            {{orderInfo.totalPrice | filterInterge}}.{{orderInfo.totalPrice | filterDollarDecimal}} {{orderInfo.currency}}
          </span>
        </p>
      </div>
      <div class="succ-bottom">
        <el-button class="succ-btn" @click="applayReceive">{{$t('View Receipt')}}</el-button>
        <el-button class="succ-btn" @click="viewOrder">{{$t('View order')}}</el-button>
      </div>
    </template> 
    <template v-if="type === 'faill'">
      <div class="fail-top">
        <div class="fail-content">
          <span class="fail-title">{{$t(faillMsg)}}</span>
          <span class="fail-desc">
            {{ faillMsg === 'Order closed' ? $t('The order has been closed and the payment will be returned within 24 hours') : orderInfo.mark}}
          </span>
        </div>
      </div>
      <div class="fail-center">
        <template v-if="contactPersonInfo">
          <p class="fail-text">{{$t('Please contact your course consultant')}} {{contactPersonInfo.nameEn}} {{$t('for help')}}</p>
          <div class="fail-warper">
            <img class="fail-qrcode" v-if="contactPersonInfo.wechatQrcode" :src="contactPersonInfo.wechatQrcode"/>
            <div class="fail-contact">
              <div class="fail-item" v-if="contactPersonInfo.wechat">
                <img class="fail-icon" src="../../../assets/theme-default/images/pay/contact-wechat.png">
                <div class="fail-contact-method">
                  <span>{{$t('Wechat')}}</span>
                  <span>{{contactPersonInfo.wechat}}</span>
                </div>
              </div>
              <div class="fail-item" v-if="contactPersonInfo.phone">
                <img class="fail-icon" src="../../../assets/theme-default/images/pay/contact-tel.png">
                <div class="fail-contact-method">
                  <span>{{$t('Mobile')}}</span>
                  <span>{{contactPersonInfo.phone}}</span>
                </div>
              </div>
              <div class="fail-item" v-if="contactPersonInfo.whatsapp">
                <img class="fail-icon" src="../../../assets/theme-default/images/pay/contact-whatsapp.png">
                <div class="fail-contact-method">
                  <span>WhatsApp</span>
                  <span>{{contactPersonInfo.whatsapp}}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div v-else class="fail-no-adviser">
          <p class="help">{{$t('Payment problem, please call below for help')}}</p>
          <div class="phone">{{$t('Beijing office')}}: +86 010 62538271</div>
          <div class="phone">{{$t('Singapore office')}}: +65 86183670</div>
        </div>
      </div>
      <div class="fail-bottom">
        <el-button class="fail-btn" @click="close">{{$t('CLOSE')}}</el-button>
        <el-button class="fail-btn" @click="repay">{{$t('Pay again')}}</el-button>
      </div>
    </template>
    <el-dialog
      :title="$t('Request for reciept')"
      center
      :visible.sync="isShowDialog"
      :show-close="false"
      width="40%">
      <el-input :placeholder="$t('Email')" v-model="email">
        <el-button class="apply-btn" type="primary" :loading="loading" slot="append">{{$t('Apply')}}</el-button>
      </el-input>
      <div class="receipt-desc"></div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data () {
    return {
      payMethodText: '',
      isShowDialog: false,
      email: '',
      innerType: 'success',
      loading: false,
    }
  },
  props: {
    type: {
      type: String,
      default: 'succ',
    },
    payMethod: {
      type: Number,
      default: 3
    },
    orderInfo: {
      type: Object,
      default: {},
    },
    faillMsg: {
      type: String,
      default: ''
    },
    orderId: {
      type: Number,
      default: 0
    },
    contactPersonInfo: {
      type: Object,
      default: {}
    },
  },
  created () {
    switch (this.payMethod) {
      case 1:
        this.payMethodText = '支付宝'
        break
      case 2:
        this.payMethodText = '微信'
        break
      case 3:
        this.payMethodText = '银行卡'
        break
      default:
        this.payMethodText = ''
    }
  },
  methods: {
    applayReceive () {
      const orderId = this.orderId
      this.$api.finance.applayOrderReceive({ orderId }).then(res => {
        if (res && res.data && res.data.code === 200) {
          if (res.data.data) {
            window.open(res.data.data, '_blank')
          } else {
            this.$message({
              message: this.$t('Only show receipts after 2020-01-01')
            })
          }
        }
      }, err => {
        console.log('err', 申请收据接口出错)
      })
    },
    close () {
      this.$emit('close')
    },
    repay () {
      this.$emit('repay')
    },
    viewOrder () {
      this.$emit('viewOrder')
    },
  },
}
</script>

<style lang='stylus' scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 800px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(182, 182, 182, 0.12);
  background: #ffffff;

  .succ-top {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 102px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    background: #595e9b;

    .succ-img {
      width: 50px;
      height: 50px;
      margin-right: 20px;
    }

    .succ-desc {
      font-size: 20px;
      font-weight: bold;
      color: #ffffff;
    }
  }

  .succ-center {
    padding: 20px 0;
    font-size: 16px;
    color: #34364d;

    & p {
      padding: 10px;

      .value {
        margin-left: 20px;
      }
    }
  }

  .succ-bottom {
    margin-bottom: 20px;

    .succ-btn {
      border-width: 1px;
      width: 200px;
    }
  }

  .fail-top {
    display: flex;
    align-items: center;
    width: 100%;
    height: 128px;
    box-sizing: border-box;
    padding: 20px 40px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    background-image: url('../../../assets/theme-default/images/pay/pay-faill-banner.png')
    background-size: 100%;
    background-repeat: no-repeat;

    .fail-content {
      display: flex;
      flex-direction: column;
      padding-left: 100px;
      color: #ffffff;

      .fail-title {
        margin-bottom: 15px;
        font-size: 20px;
        font-weight: bold;
      }

      .fail-desc {
        line-height: 20px;
      }
    }
  }

  .fail-center {
    display: flex;
    flex-direction: column;

    .fail-text {
      padding: 20px 0;
      font-size: 16px;
      color: #34364d;
    }

    .fail-warper {
      padding: 20px 0 40px 0;
      display: flex;
      align-items: center;
      justify-content: center;

      .fail-qrcode {
        width: 150px;
        height: 150px;
        margin-right: 20px;
      }

      .fail-contact {
        height: 150px;
        display: flex;
        justify-content: space-around;
        flex-direction: column;

        .fail-item {
          display: flex;

          .fail-icon {
            width: 32px;
            height: 32px;
            margin-right: 20px;
          }

          .fail-contact-method {
            display: flex;
            flex-direction: column;
            font-size: 16px;
            color: #34364d;
          }
        }
      }
    }

    .fail-no-adviser {
      margin: 20px 0;
      color: #34364d;

      .help {
        margin-bottom: 10px;
      }

      .phone {
        padding: 10px 0;
      }
    }
  }

  .fail-bottom {
    margin-bottom: 20px;

    .fail-btn {
      border-width: 1px;
      width: 200px;
    }
  }

  .receipt-desc {
    margin-top: 20px;
    font-size: 16px;
    color: #34364d;
    line-height: 20px;
  }

  .apply-btn {
    background: #6e70a0;
    color: #ffffff;
  }
}
</style>