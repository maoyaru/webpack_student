<template>
  <div class="detail-container" v-if="currentVideoInfo">
    <div class="detail-video" @contextmenu.prevent="menuPlayer">
      <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions"></video-player>
    </div>
    <div class="detail-title">{{ lang === 'en' ? currentVideoInfo.titleEn : currentVideoInfo.title }}</div>
    <div class="detail-intro">
      <!-- <div class="detail-intro-title">{{$t('Video introduction copywriting')}}</div> -->
      <div class="detail-intro-desc">{{ lang === 'en' ? currentVideoInfo.introductionEn : currentVideoInfo.introduction }}</div>
    </div>
    <div class="small-video-content" v-if="recommendVideoList.length > 0">
      <div class="small-video-title">{{$t('More videos')}}</div>
      <div class="small-video-box">
        <template v-for="(item, index) in recommendVideoList">
          <div class="small-video-item" :key="index">
            <div class="top" @click="playVideo(index)">
              <img class="small-poster" :src="item.poster" />
              <div class="small-play"></div>
              <div class="small-timer">{{item.duration | videoTime}}</div>
            </div>
            <div class="bottom">{{ lang === 'en' ? item.titleEn : item.title }}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      playerOptions: {},
      currentVideoInfo: null,
      recommendVideoList: [],
      isRequestRecommendVideo: false,
      courseVideoId: 0,
    }
  },
  computed: {
    lang() {
      return this.$i18n.locale
    },
    ...mapGetters({
      user: 'user/getUserInfo',
    })
  },
  created() {
    const { courseVideoId, status } = this.$route.query
    this.courseVideoId = courseVideoId
    this.isRequestRecommendVideo = status == 1 || false
    this.getVideoDetail()
    this.isRequestRecommendVideo ? this.getRecommendVideoList() : ''
  },
  methods: {
    setPlayerOptions(item) {
      const currentLang = this.$i18n.locale
      this.currentVideoInfo = item
      const notSupportedMessage = currentLang === 'en' ?
        'Sorry, the video is temporarily unavailable. If you have any questions, please contact your head teacher' :
        '抱歉，该视频暂时无法访问。如有问题可联系学管老师'
      const playerOptions = {
        // playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: true, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: currentLang === 'en' ? 'en' : 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: "video/mp4", //这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
          src: item.url //url地址
        }],
        poster: item.poster, //你的封面地址
        // width: document.documentElement.clientWidth, //播放器宽度
        notSupportedMessage, //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true //全屏按钮
        }
      }
      this.playerOptions = playerOptions
    },
    playVideo(index) {
      this.setPlayerOptions(this.recommendVideoList[index])
    },
    menuPlayer() {
      return false
    },
    getRecommendVideoList() {
      const apiName = this.$route.query.isActivity ? 'getRecommendActivityList' : 'getRecommendList'
      this.$api.video[apiName]({
        parentUserId: this.user.userParentInfo.id,
        courseVideoId: this.courseVideoId
      }).then(res => {
        if (res && res.data && res.data.code === 200) {
          this.recommendVideoList = res.data.data
        }
      })
    },
    getVideoDetail() {
      const paramsId = this.courseVideoId
      this.$api.video.getVideoDetail(paramsId).then(res => {
        if (res && res.data && res.data.code === 200) {
          const result = res.data.data
          this.currentVideoInfo = result
          this.setPlayerOptions(result)
        }
      })
    },
  },
}

</script>
<style lang="stylus" scoped>
.detail-container {
  padding: 30px 30px 0;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 4px 8px 4px rgba(182, 182, 182, 0.08);

  .detail-title {
    height: 80px;
    background-color: #f4f4f4;
    line-height: 80px;
    color: #34364d;
    padding-left: 20px;
    font-size: 28px;
    margin-bottom: 25px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  .detail-intro {
    padding-bottom: 25px;

    .detail-intro-title {
      color: #34364d;
      font-size: 20px;
      margin-bottom: 10px;
    }

    .detail-intro-desc {
      color: #34364d;
      font-size: 14px;
      line-height: 22px;
    }
  }

  .small-video-content {
    .small-video-title {
      font-size: 20px;
      color: #34364d;
      margin-bottom: 12px;
    }

    .small-video-box {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;

      .small-video-item {
        width: 208px;
        border-radius: 4px;
        margin-bottom: 30px;
        margin-right: 19px;
        box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.04);
        overflow: hidden;

        &:nth-child(4n) {
          margin-right: 0;
        }

        .top {
          position: relative;
          height: 117px;
          cursor: pointer;

          .small-poster {
            width: 100%;
            height: 100%;
          }

          .small-play {
            position: absolute;
            width: 24px;
            height: 24px;
            top: 50%;
            left: 50%;
            z-index: 10;
            -webkit-transform: translate(-50%, -50%);
            -moz-transform: translate(-50%, -50%);
            -ms-transform: translate(-50%, -50%);
            -o-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            cursor: pointer;
            background-image: url('~@/assets/theme-default/images/goodcourse/icon-video-play.png');
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;
          }

          .small-timer {
            position: absolute;
            right: 10px;
            bottom: 10px;
            height: 18px;
            border-radius: 20px;
            background-color: rgba(0, 0, 0, 0.5);
            line-height: 18px;
            font-size: 12px;
            color: #ffffff;
            padding: 0 8px;
          }
        }

        .bottom {
          width: 100%;
          height: 50px;
          line-height: 16px;
          padding: 10px;
          box-sizing: border-box;
          color: #34364d;
          font-size: 12px;
          text-align: left;
        }
      }
    }
  }
}

</style>
