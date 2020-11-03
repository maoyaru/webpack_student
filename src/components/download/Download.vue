<template>
  <div class="downWrapper">
    <h3>{{$t("Software Download Center")}}</h3>
    <div class="equipmentItem">
      <h4>{{$t("If you want to attend class via computer")}}</h4>
      <ul>
        <li>• {{$t("make sure your camera, speaker and microphone is working, you can test them by clicking the 'IT Test' in the APP before class")}}</li>
        <li>• {{$t("download and install Google Chrome in your computer")}}</li>
      </ul>
      <div class="pic">
        <div class="computer">
          <a href="https://www.google.cn/chrome/" target="__blank">
            <el-button class="macbtn"></el-button>
          </a>
          <a href="https://www.google.cn/chrome/" target="__blank">
            <el-button class="winbtn"></el-button>
          </a>
        </div>
      </div>
    </div>
    <div class="equipmentItem" @click="toIpad">
      <h4>{{$t("If you want to attend class via iPad")}}</h4>
      <ul>
        <li>• {{$t("download and install LingoAce APP in your iPad")}}</li>
        <li>• {{$t("make sure your camera, speaker and microphone is working, you can test them by clicking the 'IT Test' in the APP before class")}}</li>
      </ul>
      <div class="pic">
        <div class="ipad"></div>
      </div>
    </div>
    <div class="equipmentItem" @click="toPhone">
      <h4>{{$t("Book classes anytime anywhere via phone")}}</h4>
      <ul>
        <li>• {{$t("download and install LingoAce Connect APP in your phone")}}</li>
      </ul>
      <div class="pic">
        <div class="phone"></div>
      </div>
    </div>
    <div class="equipmentItem">
      <h4>{{$t("In case of IT issues, LingoAce IT staff can help you with the situation remotely")}}</h4>
      <ul>
        <li>• {{$t("download and install TeamViewer in your computer")}}</li>
      </ul>
      <div class="pic">
        <div class="other">
          <a href="https://www.teamviewer.cn/cn/download/mac-os/" target="__blank">
            <el-button class="macbtn"></el-button>
          </a>
          <a href="https://www.teamviewer.cn/cn/download/windows/" target="__blank">
            <el-button class="winbtn"></el-button>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  methods: {
    toIpad() {
      window.open(
        "https://apps.apple.com/cn/app/lingoace-student/id1155911183",
        "_blank"
      );
    },
    toPhone() {
      window.open(
        "https://apps.apple.com/cn/app/lingoace-parent/id1281981146",
        "_blank"
      );
    }
  }
};
</script>
<style lang='stylus' scoped>
.downWrapper {
  width: 940px;
  height: auto;
  margin: 0 auto;
  background-color: #fff;

  h3 {
    font-size: 28px;
    font-family: Comfortaa-Regular, Comfortaa;
    font-weight: 400;
    color: rgba(215, 143, 37, 1);
    line-height: 35px;
  }

  .equipmentItem {
    width: 100%;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 4px 8px 4px rgba(182, 182, 182, 0.08);
    border-radius: 8px;
    box-sizing: border-box;
    padding: 30px;

    h4 {
      font-size: 24px;
      font-family: Comfortaa-Regular, Comfortaa;
      font-weight: 400;
      color: rgba(52, 54, 77, 1);
      line-height: 30px;
      margin-bottom: 10px;
      margin-top: 0;
    }

    ul {
      li {
        font-size: 18px;
        font-family: Rubik-Regular, Rubik;
        font-weight: 400;
        color: rgba(178, 178, 178, 1);
        line-height: 36px;
      }
    }

    .pic {
      margin-top: 20px;
    }

    .computer {
      width: 100%;
      height: 220px;
      bg-image('../../assets/theme-default/images/download/pic_download_1');
      position: relative;
    }

    .ipad {
      width: 100%;
      height: 200px;
      bg-image('../../assets/theme-default/images/download/pic_download_2');
    }

    .phone {
      width: 100%;
      height: 200px;
      bg-image('../../assets/theme-default/images/download/pic_download_4');
    }

    .other {
      width: 100%;
      height: 128px;
      bg-image('../../assets/theme-default/images/download/pic_download_3');
      position: relative;
    }

    .macbtn {
      width: 200px;
      height: 30px;
      bg-image('../../assets/theme-default/images/download/btn_dowmac_nor');
      border: none;
      position: absolute;
      bottom: 38px;
      right: 330px;
    }

    .winbtn {
      width: 230px;
      height: 30px;
      bg-image('../../assets/theme-default/images/download/btn_dowwin_nor');
      border: none;
      position: absolute;
      bottom: 38px;
      right: 60px;
    }
  }
}
</style>