<template>
  <el-card class="container">
    <el-radio-group v-model="payMethod">
      <el-radio class="mb20" :label="'3'">
        {{$t('Card payment')}}
        <i class="lg-icon card-pay pay-icon-01"></i>
        <i class="lg-icon card-pay pay-icon-02"></i>
        <i class="lg-icon card-pay pay-icon-03"></i>
        <i class="lg-icon card-pay pay-icon-04"></i>
        <i class="lg-icon card-pay pay-icon-05"></i>
        <i class="lg-icon card-pay pay-icon-06"></i>
      </el-radio>
      <br />
      <el-radio class="mb20" :label="'1'" v-if="isShowMobilePay">
        <i class="lg-icon mobile-pay icon-alipay"></i>{{$t('Alipay')}}
      </el-radio>
      <br />
      <el-radio class="mb20" :label="'2'" v-if="isShowMobilePay">
        <i class="lg-icon mobile-pay icon-wechat"></i>{{$t('WeChat')}}
      </el-radio>
    </el-radio-group>
    <div class="btn-outer">
      <el-button class="btn" @click="confirmPayMethod">{{$t('CONTINUE')}}</el-button>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    currencyId: {
      type: Number,
      default: 1
    },
  },
  computed: {
    isShowMobilePay () {
      let flag = false
      if ( this.currencyId === 1) {
        flag = true
      }
      return flag
    }
  },
  data () {
    return {
      payMethod: '3',
    }
  },
  methods: {
    confirmPayMethod () {
      this.$emit('changePayMethod', this.payMethod)
    },
  },
}
</script>

<style lang="stylus" scoped>
.container {
  margin-top: 20px;
}
.mobile-pay {
  width: 27px;
  height: 27px;
  margin-right: 10px;
}
.card-pay {
  width: 32px;
  height: 20px;
  margin-right: 8px;
}
.icon-alipay {
  background-image: url('../../../assets/theme-default/images/pay/alipay.png');
}
.icon-wechat {
  background-image: url('../../../assets/theme-default/images/pay/wechat.png');
}
.pay-icon-01 {
  background-image: url('../../../assets/theme-default/images/pay/pay-icon-01.png')
}
.pay-icon-02 {
  background-image: url('../../../assets/theme-default/images/pay/pay-icon-02.png')
}
.pay-icon-03 {
  background-image: url('../../../assets/theme-default/images/pay/pay-icon-03.png')
}
.pay-icon-04 {
  background-image: url('../../../assets/theme-default/images/pay/pay-icon-04.png')
}
.pay-icon-05 {
  background-image: url('../../../assets/theme-default/images/pay/pay-icon-05.png')
}
.pay-icon-06 {
  background-image: url('../../../assets/theme-default/images/pay/pay-icon-06.png')
}
.btn-outer {
  .btn {
    border: none;
    background: #efa83e;
    color: #ffffff;
    height: 40px;
    width: 300px;
    border-radius: 5px;
    margin: 40px 0 0 230px;
    padding: 0;

    &:hover {
      background: #4e4f69;
      cursor: pointer;
    }
  }
}
</style>