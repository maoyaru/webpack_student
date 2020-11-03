<template>
  <div class="wp-container">
    <div class="header">
      <img class="logo" src="@/assets/theme-default/images/index/logo.png" />
    </div>
    <div class="banner" :class="{'banner-yn': isIndonesia}">
      <div class="form-content">
        <RegisterForm class="pc-form" @setIndonesia="setIndonesia">
          <div class="bottom" slot="bottom-icons">
            <div class="item">
              <img class="icon" src="@/assets/theme-default/images/refer/icon_01.png"/>
              <span class="num">1次</span>
              <div class="describe">中文能力测评</div>
            </div>
            <div class="item">
              <img class="icon" src="@/assets/theme-default/images/refer/icon_02.png"/>
              <span class="num">1节</span>
              <div class="describe">55分钟直播课</div>
            </div>
            <div class="item">
              <img class="icon" src="@/assets/theme-default/images/refer/icon_03.png"/>
              <span class="num">1份</span>
              <div class="describe">中文成长计划</div>
            </div>
            <div class="item">
              <img class="icon" src="@/assets/theme-default/images/refer/icon_04.png"/>
              <span class="num">1位</span>
              <div class="describe">资深教师答疑</div>
            </div>
          </div>
        </RegisterForm>
      </div>
    </div>
    <!--
    <div class="section">
      <img src="@/assets/theme-default/images/refer/bg_01.png"/>
    </div>
    <div class="section">
      <img src="@/assets/theme-default/images/refer/bg_02.png"/>
    </div>
    <div class="section">
      <img src="@/assets/theme-default/images/refer/bg_03.png"/>
    </div>
    <div class="section">
      <img src="@/assets/theme-default/images/refer/bg_04.png"/>
    </div>
    -->
    <div class="footer">*本活动解释权归LingoAce所有</div>
  </div>
</template>

<script>
import RegisterForm from './RegisterForm'
export default {
  data() {
    return {
      isIndonesia: false
    }
  },
  components: {
    RegisterForm,
  },
  methods: {
    setIndonesia(val) {
      this.isIndonesia = val
    }
  },
}
</script>

<style lang="stylus" scoped>
.wp-container {
  padding: 0;
  .header {
    height: 70px;
    width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
  }
  .banner {
    position: relative;
    min-width: 1280px;
    background-image: url('~@/assets/theme-default/images/refer/banner.png');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    height: 581px;
    .form-content {
      position: relative;
      margin: 0 auto;
      width: 1224px;
      height: 581px;
      .pc-form {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translate(0, -50%);
        background: #ffffff;
        z-index: 100;
        .bottom {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          .item {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex-grow: 0;
            flex-shrink: 0;
            margin: 0 2px;
            .icon {
              width: 30px;
              height: 30px;
            }
            .num {
              font-size: 16px;
              color: #333333;
              margin: 10px 0;
            }
            .describe {
              font-size: 12px;
              line-height: 16px;
              color: #666666;
              text-align: center;
            }
          }
        }
      }
    }
  }
  .banner-yn {
    background-image: url('~@/assets/theme-default/images/refer/banner_yn.jpg');
  }
  .section {
    text-align: center;
  }
  .footer {
    padding: 20px 0;
    font-size: 12px;
    color: #999999;
    text-align: center;
  }
}
</style>