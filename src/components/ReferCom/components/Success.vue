<template>
  <div class="page-detail-container">
    <div class="section-top">
      <img src="@/assets/theme-default/images/refer/succ/top-bg.png">
    </div>
    <div class="section-paper">
      <div class="section-paper-inner">
        <div class="success-img">
          <img src="@/assets/theme-default/images/refer/succ/success.png">
        </div>
        <div class="success-text" v-text="getShowDesc('Succ')"></div>
        <!-- <div class="tips">恭喜您成功领取试听课！<br />接下来您的专属课程顾问将与您联系，请留意您的电话或邮件~</div> -->
        <div class="concat">
          <img class="concat-img" src="@/assets/theme-default/images/refer/succ/android-parent.png" />
          <p class="concat-desc" v-text="getShowDesc('Scan QR')"></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import allDesc from '../js/lang'
export default {
  name: 'Success',
  props: ['isIndonesia'],
  data() {
    return {

    }
  },
  created() {

  },
  mounted() {
  
  },
  methods: {
    getShowDesc(key) {
      const temp = this.isIndonesia 
        ? allDesc['indonesia'][key]
        : allDesc['zh'][key]
      return temp
    },
  }
}

</script>
<style scoped lang="stylus">
.page-detail-container {
  background: #f5f5f5;
  min-height: 100vh;

  .section-top {
    img {
      width: 100%;
    }
  }

  .section-paper {
    padding: 0 20px;
    margin-bottom: 30px;
    position: relative;
    z-index: 2;

    .section-paper-inner {
      background: #fff;
      box-shadow: 0px 3px 5px 0px rgba(164, 164, 164, 0.06);
      border-radius: 4px;
      margin-top: -135px;
      padding: 30px 20px 30px 20px;
      font-size: 12px;
      line-height: 18px;
      color: #333;

      span {
        color: #EA4B2C;
      }

      .success-img {
        width: 60px;
        height: 60px;
        margin: 0 auto 15px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .success-text {
        text-align: center;
        color: #333;
        font-size: 20px;
        line-height: 20px;
        margin-bottom: 20px;
      }

      .tips {
        font-size: 12px;
        margin: 0 auto;
        max-width: 290px;
      }
      .concat {
        text-align: center;
        .concat-img {
          margin-bottom: 10px;
          width: 150px;
          height: 150px;
        }
      }
    }
  }
}

</style>
