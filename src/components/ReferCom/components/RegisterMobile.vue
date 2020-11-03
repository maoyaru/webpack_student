<template>
  <div class="mb-container">
    <template v-if="!isShowSucc">
      <div class="header">
        <img src="@/assets/theme-default/images/refer/mobile/header.png" v-if="!isIndonesia">
        <img src="@/assets/theme-default/images/refer/mobile/header_yn.jpg" v-else>
      </div>
      <div class="main">
        <div class="mobile-form">
          <div class="form-content">
            <RegisterForm :isPc="false" @setShowSucc="setShowSucc" @setIndonesia="setIndonesia">
              <div class="item-wp" slot="top-icons">
                <div class="item">
                  <img class="icon" src="@/assets/theme-default/images/refer/mobile/icon_01.png"/>
                  <span class="num">1次</span>
                  <div class="describe">中文能力测评</div>
                </div>
                <div class="item">
                  <img class="icon" src="@/assets/theme-default/images/refer/mobile/icon_02.png"/>
                  <span class="num">1节</span>
                  <div class="describe">55分钟直播课</div>
                </div>
                <div class="item">
                  <img class="icon" src="@/assets/theme-default/images/refer/mobile/icon_03.png"/>
                  <span class="num">1份</span>
                  <div class="describe">中文成长计划</div>
                </div>
                <div class="item">
                  <img class="icon" src="@/assets/theme-default/images/refer/mobile/icon_04.png"/>
                  <span class="num">1位</span>
                  <div class="describe">资深教师答疑</div>
                </div>
              </div>
            </RegisterForm>
          </div>
        </div>
        <!--
        <div class="section">
          <img src="@/assets/theme-default/images/refer/mobile/bg_01.png"/>
        </div>
        <div class="section">
          <img src="@/assets/theme-default/images/refer/mobile/bg_02.png"/>
        </div>
        <div class="section">
          <img src="@/assets/theme-default/images/refer/mobile/bg_03.png"/>
        </div>
        <div class="section">
          <img src="@/assets/theme-default/images/refer/mobile/bg_04.png"/>
        </div>
        -->
        <div class="footer">*本活动解释权归LingoAce所有</div>
      </div>
    </template>
    <Success :isIndonesia="isIndonesia" v-else/>
  </div>
</template>

<script>
import RegisterForm from './RegisterForm'
import Success from './Success'
export default {
  data () {
    return {
      isShowSucc: false,
      isIndonesia: false,
    }
  },
  components: {
    RegisterForm,
    Success
  },
  methods: {
    setShowSucc(val) {
      this.isShowSucc = val
    },
    setIndonesia(val) {
      this.isIndonesia = val
    }
  }
}
</script>

<style lang="stylus" scoped>
textStyle($color, $fontSize) {
  color: $color;
  text-align: center;
  font-size: $fontSize;
}
.mb-container {
  .header, .section {
    img {
      width: 100%;
    }
  }
  .main {
    position: relative;
    margin-top: -32px;
  }
  .mobile-form {
    padding: 0 10px 20px;
    .form-content {
      border-radius: 10px;
      box-shadow: 0 2px 9px 0 rgba(0, 0, 0, 0.08);
      background: #ffffff;
      .item-wp {
        display: flex;
        justify-content: space-between;
        margin: 20px 0;
        .item {
          display: flex;
          flex-direction: column;
          align-items: center;
          img {
            width: 30px;
            height: 30px;
          }
          .num {
            margin: 10px 0;
            textStyle(#333333, 16px)
          }
          .describe {
            textStyle(#666666, 12px)
          }
        }
      }
    }
  }
  .footer {
    padding: 20px 0;
    font-size: 12px;
    color: #999999;
    text-align: center;
  }
}
</style>