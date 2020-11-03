<template>
  <el-card class="container">
    <div class="top">
      <img class="icon-pay" :src="imageType['icon'][type]"/>
      <span class="desc" v-if="type === 'wechat'">{{$t('Please use weChat')}}</span>
      <span class="desc" v-else>{{$t('Please use Alipay')}}</span>
    </div>
    <div class="center">
      <div class="qrcode" id="qrcode-dom"></div>
      <!-- <img class="scan" :src="imageType['scan'][type]"/> -->
    </div>
    <div class="bottom">{{$t('Scan payment QR code, Valid for 1 hour')}}</div>
    <div class="mt20 change" @click="choicePayMethod">&lt; {{$t('Change payment method')}}</div>
  </el-card>
</template>

<script>
export default {
  props: {
    url: {
      default: '',
      type: String
    },
    payMethod: {
      default: 1,
      type: Number
    }
  },
  data () {
    return {
      imageType: {
        icon: {
          alipay: require('../../assets/theme-default/images/pay/alipay.png'),
          wechat: require('../../assets/theme-default/images/pay/wechat.png')
        },
        // scan: {
        //   alipay: require('../../assets/theme-default/images/pay/scan-zh-alipay.png'),
        //   wechat: require('../../assets/theme-default/images/pay/scan-zh-wechat.png')
        // }
      },
      type: 'alipay',
    }
  },
  watch:{
    url(val) {
      this.$nextTick(function() {
        document.getElementById("qrcode-dom").innerHTML = "";
        let qrcode = new QRCode(document.getElementById("qrcode-dom"), {
          width : 200,
          height : 200,
          correctLevel: QRCode.CorrectLevel.H
        });
        qrcode.makeCode(val)
      })
    },
    payMethod(val) {
      if (val === 1) {
        this.type = 'alipay'
      } else {
        this.type = 'wechat'
      }
    }
  },
  created () {

  },
  methods: {
    choicePayMethod () {
      this.$emit('choicePayMethod')
    },
  },
}
</script>

<style lang='stylus' scoped>
.container {
  margin: 20px 0;

  .top {
    display: flex;
    align-items: center;

    .icon-pay {
      width: 27px;
      height: 27px;
      margin-right: 20px;
    }

    .desc {
      font-size: 16px;
      color: #666666;
    }
  }
  
  .center {
    height: 200px;
    margin: 20px 0;

    .qrcode {
      width: 200px;
      height: 200px;
      background: #f0f0f0;
      margin: 0 auto;
    }
  }

  .bottom {
    text-align: center;
    font-size: 16px;
    color: #666666;
  }
}
</style>