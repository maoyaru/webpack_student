<template>
  <div class="m-exam" @click="close" v-show="showAdvert">
    <div :class="'box '+lang" @click.stop="">
      <a target="_blank" :href="url" class="btn" @click.stop="close"></a>
    </div>
  </div>
</template>
<script>
  import { lgLocalStorage } from '@/common/js/store';
  import { getTokenExpire } from '@/common/js/token';
  export default {
    props: ["showAdvert"],
    data() {
      return {
        url: 'https://wj.qq.com/s2/5537860/96d0'
      }
    },
    computed: {
      lang() {
        return this.$i18n.locale
      }
    },
    methods: {
      close() {
        this.$emit('close');
      },
      open() {
        this.$emit('open');
      },
      showTime() {
        let start = "2020-03-01T00:00:00.000Z";
        let end = "2020-03-08T00:00:00.000Z";
        let startDate = (new Date(start)).getTime();
        let endDate = (new Date(end)).getTime();
        let now = Date.now();
        if(now > startDate && now < endDate && getTokenExpire()) {
          return true;
        }
        return false;
      }
    },
    mounted() {
      this.$nextTick(() => {
        const body = document.querySelector("body");
        if (body.append) {
          body.append(this.$el);
        } else {
          body.appendChild(this.$el);
        }
      });
      let advert = lgLocalStorage('advert');
      if(this.showTime()) {
        if(advert && advert.exam){
          this.$emit('close');
        }else {
          this.$emit('open');
          lgLocalStorage('advert', {exam: '1'});
        }
      }
    }
  }
</script>
<style scoped lang="stylus">
  .m-exam{
    .box{
      width:800px;
      height:600px;
      position: fixed;
      top: 50%;
      left: 50%;
      margin-top: -300px;
      margin-left: -400px;
      z-index: 10;
      // transform: scale(0);
      // transform-origin: 100% 335px;
      // transition: transform 0.5s;
      background: url('~@/assets/theme-default/images/common/adverts-en.png') no-repeat 0 0;
      // &.scalein{
      //   transform: scale(1);
      // }
      &.zh{
        background: url('~@/assets/theme-default/images/common/adverts-zh.png') no-repeat 0 0;
      }
      .btn{
        display: block;
        position: absolute;
        width: 410px;
        height: 56px;
        left: 50%;
        margin-left: -205px;
        top: 512px;
      }
    }
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1200;
    background: rgba(0,0,0,0.6);
    width: 100%;
    height: 100%;
  }
</style>