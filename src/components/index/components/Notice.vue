<template>
  <div class="notice-warpper">
    <div @click="toDownload">
      <el-badge :value="0" :max="99" :hidden="true" class="item">
        <el-avatar :size="50" shape="square" :src="downloadUrl"></el-avatar>
        <i class="lg-icon icon-download"></i>
      </el-badge>
    </div>
    <div @click="toProblemPage">
      <el-badge :value="0" :max="99" :hidden="true" class="item">
        <el-avatar :size="50" shape="square" :src="helperUrl"></el-avatar>
        <i class="lg-icon icon-helper"></i>
      </el-badge>
    </div>
    <div @click="toMessageCenter">
      <el-badge :max="99" :hidden="!isShow" class="item">
        <el-avatar :size="50" shape="square" :src="noticeUrl"></el-avatar>
        <i class="lg-icon icon-notice"></i>
      </el-badge>
    </div>
  </div>
</template>

<script>
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    count: {
      default: 0,
      type: Number
    }
  },
  data() {
    //这里存放数据
    return {
      badge: false,
      noticeUrl: require("../../../assets/theme-default/images/index/icon_tongzhi@2x.png"),
      downloadUrl: require("../../../assets/theme-default/images/index/icon_xiazai@2x.png"),
      helperUrl: require("../../../assets/theme-default/images/index/icon_bangzhu@2x.png")
    };
  },
  //监听属性 类似于data概念
  computed: {
    isShow(a, c) {
      return this.count > 0 ? true : false;
    }
  },
  //方法集合
  methods: {
    toDownload() {
      this.$router.push({
        name: "download"
      });
    },
    toProblemPage() {
      if(this.$i18n.locale == 'zh') {
        window.open("https://pplingo.zendesk.com/hc/zh-cn", "__blank");
      }else {
        window.open("https://pplingo.zendesk.com/hc/en-us", "__blank");
      }
    },
    toMessageCenter() {
      this.$router.push("/messageCenter");
    }
  }
};
</script>