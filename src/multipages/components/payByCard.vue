<template>
  <div class="container">
    <el-card class="card-pay">
      <div class="bank">
        <span class="title">{{$t('Card payment')}}</span>
        <i class="pay-icon pay-icon-01"></i>
        <i class="pay-icon pay-icon-02"></i>
        <i class="pay-icon pay-icon-03"></i>
        <i class="pay-icon pay-icon-04"></i>
        <i class="pay-icon pay-icon-05"></i>
        <i class="pay-icon pay-icon-06"></i>
      </div>
      <form id="payment-form">
        <div id="card-element">
          <!-- Elements will create input elements here -->
        </div>
        <!-- We'll put the error messages in this element -->
        <div id="card-errors" role="alert"></div>
        <div class="btn-content">
          <button class="btn" @click.prevent="launchStripePay">{{$t('Pay now')}}</button>
        </div>
      </form>
      <div class="mt20 change" v-if="currencyId === 1" @click="choicePayMethod">&lt; {{$t('Change payment method')}}</div>
    </el-card>
    <!-- 需求改动，此处去掉支付宝、微信支付
    <el-card v-if="isShowMobilePay && !isMobile">
      <div class="other">
        <div class="left">{{$t('Change payment method')}}: </div>
        <div class="right">
          <div class="item" @click="choosePayMethod('alipay')">
            <img class="icon" src="../../assets/theme-default/images/pay/alipay.png"/>
            <span class="title">{{$t('Alipay')}}</span>
          </div>
          <div class="division"></div>
          <div class="item" @click="choosePayMethod('wechat')">
            <img class="icon" src="../../assets/theme-default/images/pay/wechat.png"/>
            <span class="title">{{$t('Wechat')}}</span>
          </div>
        </div>
      </div>
    </el-card>
    -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data () {
    return {
      isMobile: navigator.userAgent.indexOf('Mobile') > -1, 
    }
  },
  props: {
    currencyId: {
      type: Number,
      default: 3
    }
  },
  computed: {
    ...mapGetters({
      confirmRecharge: 'finance/getConfirmRecharge',
    }),
    isShowMobilePay () {
      let flag = false
      if (this.currencyId === 1) {
        flag = true
      }
      return flag
    }
  },
  methods: {
    choosePayMethod (type) {
      this.$emit('changePayMethod', type)
    },
    launchStripePay () {
      this.$emit('launchStripePay')
    },
    choicePayMethod () {
      this.$emit('choicePayMethod')
    },
  }
}
</script>

<style lang='stylus' scoped>
.container {
  .card-pay {
    margin: 20px 0;

    .bank {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .title {
        font-size: 16px;
        font-weight: 600;
        color: #666666;
        margin-right: 10px;
      }

      .pay-icon {
        display: inline-block;
        width: 32px;
        height: 20px;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        margin-right: 8px;
      }

      .pay-icon-01 {
        background-image: url('../../assets/theme-default/images/pay/pay-icon-01.png')
      }
      .pay-icon-02 {
        background-image: url('../../assets/theme-default/images/pay/pay-icon-02.png')
      }
      .pay-icon-03 {
        background-image: url('../../assets/theme-default/images/pay/pay-icon-03.png')
      }
      .pay-icon-04 {
        background-image: url('../../assets/theme-default/images/pay/pay-icon-04.png')
      }
      .pay-icon-05 {
        background-image: url('../../assets/theme-default/images/pay/pay-icon-05.png')
      }
      .pay-icon-06 {
        background-image: url('../../assets/theme-default/images/pay/pay-icon-06.png')
      }
    }

    .btn-content {
      display: flex;
      width: 100%;

      .btn {
        display: inline-block;
        border: none;
        background: #efa83e;
        color: #ffffff;
        height: 40px;
        width: 200px;
        border-radius: 5px;
        padding: 0;
        margin: 10px auto 0;

        &:hover {
          background: #4e4f69;
          cursor: pointer;
        }
      }
    }
  }
  .other {
    display: flex;
    align-items: center;

    .right {
      display: flex;
      justify-content: space-between;
      width: 200px;
      margin-left: 20px;

      .division {
        width: 2px;
        background: #d8d8d8;
      }

      .item {
        display: flex;
        align-items: center;
        cursor: pointer;

        .icon {
          width: 27px;
          height: 27px;
        }

        .title {
          margin-left: 10px;
          font-size: 16px;
          color: #34364d;
        }
      }
    }
  }
}
</style>