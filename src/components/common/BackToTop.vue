<template>
  <transition name="fade" >
    <div v-show="showBack" class="c-back-to-top" @click="back">
      <span></span>
    </div>
  </transition>
</template>
<script>
  export default{
    data() {
      return {
        showBack: false
      }
    },
    methods: {
      back() {
        let app = document.getElementById('app');
        let scrollTop = app.scrollTop;
        // 假设要求300ms回到顶部，求出每10ms的滚动距离
        let unitTop = scrollTop / 300 * 10;
        this.scrollUnit(app, 10, unitTop);
      },
      scrollUnit(app, time, unitTop) {
        setTimeout(() => {
          if(app.scrollTop >= unitTop) {
            app.scrollTop -= unitTop;
            this.scrollUnit(app, time, unitTop);
          }else {
            app.scrollTop = 0;
          }
        }, time);
      }
    },
    mounted(){
      let app = document.getElementById('app');
      let self = this;
      app.addEventListener('scroll', function(){
        if(this.scrollTop > 200) {
          self.showBack = true;
        }else {
          self.showBack = false;
        }
      })
    }
  }
</script>
<style lang="stylus">
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .fade-enter-to, .fade-leave{
    opacity: 1;
  }
  .c-back-to-top{
    width: 60px;
    height: 60px;
    position: fixed;
    right: 30px;
    bottom: 50px;
    span{
      display: block;
      width: 100%;
      height: 100%;
      background: url('~@/assets/theme-default/images/common/back-to-top.png') no-repeat 0 0/100%;
      opacity: 0.6;
      cursor: pointer;
      &:hover{
        opacity: 1;
      }
    }
  }
</style>