<template>
  <div>
    <RegisterPC v-if="isPc"/>
    <RegisterMobile v-else/>
  </div>
</template>

<script>
import RegisterPC from './components/RegisterPc'
import RegisterMobile from './components/RegisterMobile'
export default {
  data () {
    return {
      isPc: false,
      screenWidth: 1280
    }
  },
  components: {
    RegisterPC,
    RegisterMobile
  },
  mounted() {
    this.screenWidth = document.body.clientWidth || document.documentElement.clientWidth
    this.isPc = this.screenWidth > 1200
    window.onresize = this.debounce(() => {
      this.screenWidth = document.body.clientWidth
      this.isPc = this.screenWidth > 1200
    }, 200)
  },
  methods: {
    debounce(fn, delay) {
      let timer = null
      return () => {
        if (timer) clearTimeout(timer)
        timer = setTimeout(fn, delay)
      }
    }
  },
  beforeDestroy() {
    window.onresize = null
  }
}
</script>

<style lang="stylus" scoped>

</style>