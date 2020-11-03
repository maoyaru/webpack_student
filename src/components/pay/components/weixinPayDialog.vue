<template>
  <el-dialog
    :visible.sync="isShowCopy"
    @close="close"
    :show-close="false"
    width="400px"
    :center="true"
    class="m-alert-dialog"
    :destroy-on-close="false"
    append-to-body
  >
    <div class="c-tips f18 c-wechat">
      {{$t('Please scan the QR code below with WeChat APP to complete the payment')}}
    </div>
    <div class="mb20" id="qrcode"></div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    url: {
      default: '',
      type: String
    },
    isShow: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    isShowCopy: {
      get() {
        return this.isShow;
      },
      set() {
        
      }
    }
  },
  watch:{
    url(val) {
      // let func = () => {
      this.$nextTick(function() {
        document.getElementById("qrcode").innerHTML = "";
        let qrcode = new QRCode(document.getElementById("qrcode"), {
          width : 200,
          height : 200,
          correctLevel: QRCode.CorrectLevel.H
        });
        qrcode.makeCode(val);
      
      })
        // }
      // if(typeof window.onload != 'function') {
      //   window.onload = func;
      // }else {
      //   let oldonload = window.onload;
      //   window.onload = function() {
      //     oldonload();
          // func();//调用当前事件函数
        // }
      // }
    }
  },
  mounted() {
    // 生成分享二维码
    
  },
  methods: {
    close() {
      this.$emit('close');
    }
  }
};
</script>

<style lang='stylus' scoped>
#qrcode{
  width 200px
  height 200px
  margin: 0 auto;
  img{
    margin: 0 auto;
  }
}
</style>