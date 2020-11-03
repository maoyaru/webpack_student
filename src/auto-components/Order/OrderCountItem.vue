<template>
  <div>
    <div>{{$t('Please pay within')}}：<span style="color: #EB532F;">{{countDown(endDate)}}</span><span v-if="page == 'detail'"> {{$t('or the order will be cancelled')}}</span></div>
  </div>
</template>
<script>
import api from "@/api/index"

export default {
  name: 'orderCountItem',
  data() {
    return {
      now: moment(),
      endDate: null,
      timer: null
    }
  },
  props: {
    overTime: null,
    orderId: null,
    page: null
  },
  created() {
    console.log(this.$i18n.locale)
  },
  mounted() {
    this.endDate = moment(this.overTime)
    //定时更新当前时间
    this.timer = setInterval(() => {
      this.now = moment()
    }, 1000)
  },
  computed: {
    //计算属性，返回剩余时间
    countDown() {
      return function(endDate) {
        let m1 = this.now
        let m2 = moment(endDate)
        var du = moment.duration(m2 - m1, 'ms'),
          hours = du.get('hours'),
          mins = du.get('minutes'),
          ss = du.get('seconds')
        if (hours <= 0 && mins <= 0 && ss <= 0) {
          clearInterval(this.timer)
          api.order.autoCancelOrder(this.orderId).then(res => {
            if (res.status === 200 && res.data.code === 200) {
              if (this.$route) {
                if (this.$route.path == '/pay/billing') {
                  this.$router.push('/order/orderCenter')
                } else if (this.$route.path == '/order/orderCenter') {
                  this.$emit('refreshList')
                }
              } else {
                const origin = window.origin
                window.location.replace(`${origin}/#/order/orderCenter`)
              }
            } else {
              this.$message(res.data.message)
            }
          })
          return this.$i18n.locale == 'en' ? 'Expired' : '已超时'
        } else {
          return this.PrefixInteger(hours, 2) + ':' + this.PrefixInteger(mins, 2) + ':' + this.PrefixInteger(ss, 2)
        }
      }
    }
  },
  methods: {
    // 数字前补 0
    // num传入的数字，n需要的字符长度
    PrefixInteger(num, n) {
      return (Array(n).join(0) + num).slice(-n)
    },
  }
}

</script>
<style scoped lang="stylus">
</style>
