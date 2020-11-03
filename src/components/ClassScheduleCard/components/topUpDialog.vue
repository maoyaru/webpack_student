<template>
  <el-dialog
    title=""
    :visible.sync="isShow"
    width="400px"
    @close="close"
    :show-close="false"
    :center="true"
    class="m-dialog-with-icon"
    :destroy-on-close="false"
    append-to-body
  >
    <div class="c-header">
      <div class="c-zero-icon"></div>
    </div>
    <div class="c-tips f18">
      {{$t('Your Class Point has been used up')}}
      <br>
      {{$t('Top-up now')}} ~
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button class="wp100" @click="topUp">{{$t('Top-up')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import TipDialog from "./tipDialog";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: { TipDialog },
  data() {
    //这里存放数据
    return {
      activeName: 'first',
      isShow: this.isOpen
    };
  },
  props: {
    isOpen: {
      default: false
    }
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {
    isOpen(val){
      this.isShow = val;
    }
  },
  //方法集合
  methods: {
    close(){
      this.$emit('closeTopUp')
    },
    topUp() {
      this.$router.push({
        name: 'pay'
      });
    }
  },
  mounted() {

  }
};
</script>