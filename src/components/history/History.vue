<template>
  <div class="history">
    <!-- <Header></Header> -->
    <div class="change_tabs mb20">
      <div class="completed f24 comfortaa" :class="completedClass" @click="changeActiveItem(true)">{{$t('Completed classes')}}</div>
      <div class="cancelled f24 comfortaa" :class="cancelledClass" @click="changeActiveItem(false)">{{$t('Incomplete classes')}}</div>
    </div>
      <CompletedClass v-show="isShowCompletedClass"></CompletedClass>
      <AbnormalClass v-show="!isShowCompletedClass"></AbnormalClass>
  </div>
</template>

<script>
import Header from "../common/Header";
import CompletedClass from "./components/CompletedClass"
import AbnormalClass from "./components/AbnormalClass"
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {Header, CompletedClass, AbnormalClass},
  data() {
    //这里存放数据
    return {
      isShowCompletedClass: true,
    };
  },
  //监听属性 类似于data概念
  computed: {
    completedClass() {
      if (this.isShowCompletedClass) {
        return "active"
      }
    },
    cancelledClass() {
      if (!this.isShowCompletedClass) {
        return "active"
      }
    }
  },
  //监控data中的数据变化
  watch: {
  },
  //方法集合
  methods: {
    changeActiveItem(val) {
      this.isShowCompletedClass = val
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {}
};
</script>
<style lang='stylus' scoped>
.change_tabs {
  margin-top: 28px;
  width: 600px;
  display: flex;
  border-radius: 8px;
  border: 1.2px solid rgba(110,112,160,1);
  cursor: pointer;
  .completed, 
  .cancelled {
    flex: 1;
    height: 48px;
    line-height: 48px;
    text-align: center;
    background: rgba(255,255,255,1);
    color: rgba(110,112,160,1);
  }
  .completed {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }
  .cancelled {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  .active {
    background: rgba(110,112,160,1);
    color: white;
  }
}
</style>