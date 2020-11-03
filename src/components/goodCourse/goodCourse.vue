<template>
  <div>
    <div class="tab-box" v-if="currentCountryName == 'Indonesia'">
      <div class="tab-box-item tab-box-item-l" :class="{ 'tab-box-tiem-active': currentTabIndex == 0 }" @click="changeCurrentTabIndex(0)" style="font-size: 14px;">Kelas Bahasa Mandarin Gratis Untuk Semua</div>
      <div class="tab-box-item tab-box-item-r" :class="{ 'tab-box-tiem-active': currentTabIndex == 1 }" @click="changeCurrentTabIndex(1)">{{$t('Discover')}}</div>
    </div>
    <div class="g-container" v-loading="isLoading">
      <div class="g-item" v-for="(item, index) in videoList" :key="index" @click="jumpPlayerPage(item)">
        <div class="top">
          <img class="g-poster" :src="item.poster" />
          <div class="g-play"></div>
          <div class="g-timer">{{item.duration | videoTime}}</div>
        </div>
        <div class="g-desc">{{ lang === 'en' ? item.titleEn : item.title }}</div>
        <template v-if="item.available !== 1">
          <div class="g-box-locking"></div>
          <img class="g-icon-locking" src="../../assets/theme-default/images/goodcourse/icon-locking.png" />
        </template>
      </div>
      <Video v-if="isShowVideo" :videoInfo="currentVideoInfo" @closeVideo="closeVideo" :isShow="isShowVideo" />
      <LockingDialog :isShow="isShowDialog" @closeDialog="closeDialog" />
    </div>
  </div>
</template>
<script>
import Video from '../../components/common/Video'
import LockingDialog from './components/lockingDialog'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      currentTabIndex: 1,
      currentCountryName: null,
      currentVideoInfo: {},
      isShowVideo: false,
      isShowDialog: false,
      isLoading: false,
      lockingIcon: {
        en: require('../../assets/theme-default/images/goodcourse/icon-locking-en.png'),
        zh: require('../../assets/theme-default/images/goodcourse/icon-locking-zh.png')
      },
      videoList: []
    }
  },
  components: {
    Video,
    LockingDialog,
  },
  computed: {
    lang() {
      return this.$i18n.locale
    },
    ...mapGetters({
      user: 'user/getUserInfo',
    })
  },
  async created() {
    const result = await this.$api.finance.getCountryInfo()
    if (result.data.code === 200 && result.data.data) {
      this.currentCountryName = result.data.data.enName
      console.log(this.currentCountryName)
      this.currentTabIndex = this.currentCountryName == 'Indonesia' ? 0 : 1
      this.getVideoList()
    } else {
      this.getVideoList()
    }
  },
  methods: {
    // 获取video列表
    getVideoList() {
      const apiName = this.currentTabIndex == 0 ? 'getVideoActivityList' : 'getVideoList'
      this.isLoading = true
      this.$api.video[apiName]({
        parentUserId: this.user.userParentInfo.id,
        pageNum: 1,
        pageSize: 100
      }).then(res => {
        if (res && res.data && res.data.code === 200) {
          this.videoList = res.data.data.list
          this.isLoading = false
        }
      })
    },
    // 切换当前tab
    changeCurrentTabIndex(index) {
      this.currentTabIndex = index
      this.getVideoList()
    },
    // 跳转至播放页面
    jumpPlayerPage(item) {
      if (item.available !== 1) {
        this.isShowDialog = true
        return
      }
      this.$router.push({
        path: '/videoDetail',
        query: {
          status: 1, // 页面使用参数，1表示详情页面需要请求推荐视频
          courseVideoId: item.id,
          isActivity: this.currentTabIndex == 0 ? 1 : 0 // 是否为印尼活动的视频连接，1 是 、0 不是
        }
      })
      // this.isShowVideo = true  // 放弃弹窗播放方式
      // this.currentVideoInfo = item
    },
    closeDialog(flag) {
      this.isShowDialog = flag
    },
    closeVideo(flag) {
      this.isShowVideo = flag
    },
  },
}

</script>
<style lang="stylus" scoped>
.tab-box {
  display: flex;
  width: 100%;
  height: 48px;
  margin: 10px 0 20px 0;

  .tab-box-item {
    width: 300px;
    height: 48px;
    line-height: 48px;
    border: 1px solid #6e70a0;
    text-align: center;
    color: #6e70a0;
    font-size: 22px;
    cursor: pointer;
    background: #fff;

    &.tab-box-item-l {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }

    &.tab-box-item-r {
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
    }

    &.tab-box-tiem-active {
      background: #6e70a0;
      color: #fff;
    }
  }
}

.g-container {
  display: flex;
  flex-wrap: wrap;
  padding: 30px 30px 0;
  border-radius: 8px;
  justify-content: flex-start;
  background-color: #ffffff;
  min-height: 640px;
  box-shadow: 0px 4px 8px 4px rgba(182, 182, 182, 0.08);

  .g-item {
    position: relative;
    width: 430px;
    border-radius: 8px;
    margin-bottom: 30px;
    box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.04);
    overflow: hidden;

    &:nth-child(odd) {
      margin-right: 30px;
    }

    .top {
      position: relative;
      width: 100%;
      height: 220px;
      cursor: pointer;

      .g-play {
        position: absolute;
        width: 50px;
        height: 50px;
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

      .g-timer {
        position: absolute;
        right: 10px;
        bottom: 10px;
        height: 20px;
        border-radius: 20px;
        background-color: rgba(0, 0, 0, 0.5);
        line-height: 20px;
        font-size: 12px;
        color: #ffffff;
        padding: 2px 10px;
      }

      .g-poster {
        width: 100%;
        height: 220px;
      }

      .g-disable {
        opacity: 0.4;
      }
    }

    .g-desc {
      width: 100%;
      height: 70px;
      line-height: 20px;
      padding: 15px 18px;
      box-sizing: border-box;
      color: #333333;
      font-size: 14px;
      text-align: left;
    }

    .g-box-locking {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #000000;
      opacity: 0.3;
    }

    .g-icon-locking {
      position: absolute;
      top: 20px;
      right: 20px;
    }
  }
}

</style>
