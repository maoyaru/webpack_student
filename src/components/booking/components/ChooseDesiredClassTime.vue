<template>
  <dl class="panel-choose-time shadow" v-loading="loading" element-loading-spinner="custom-loading">
    <dt class="c-week-name">
      <span
        class="item"
        v-for="(item, key) in days"
        :key="key"
        @click="checkDay(key)"
        :class="{
          'sun-sat':(item.getDay() == 0 || item.getDay() == 6),
          'active':chooseDay == item.getDate(),
          'today': key == 0
        }"
      >
        <template v-if="key == 0">
          Today
        </template>
        <template v-else>
          {{weeks[item.getDay()]}}
        </template>
        <br />
        <span class="day">{{item.getDate() * 1 > 9 ? item.getDate() : '0' + item.getDate()}}</span>
      </span>
    </dt>
    <dd>
      <span
        class="time"
        v-for="(item,key) in times"
        :key="key"
        :class="{'active':item.time == chooseTime,'disable':item.disable}"
        @click="checkTime(item.time, item.disable)"
      >{{item.time}}</span>
    </dd>
  </dl>
</template>

<script>
import { mapGetters } from 'vuex';
import { getCurrentChild } from '@/common/js/store'
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  props:{
    classType:{
      default: ''
    }
  },
  data() {
    //这里存放数据
    return {
      days: [],
      weeks: this.$i18n.locale=='zh'?this.DateTimeUtils._weekdayNameZh2:this.DateTimeUtils._weekdayNameEn2,
      chooseDay: 0,
      chooseTime: "",
      times: [
        {time: "07:00", disable: true},
        {time: "07:30", disable: true},
        {time: "08:00", disable: true},
        {time: "08:30", disable: true},
        {time: "09:00", disable: true},
        {time: "09:30", disable: true},
        {time: "10:00", disable: true},
        {time: "10:30", disable: true},
        {time: "11:00", disable: true},
        {time: "11:30", disable: true},
        {time: "12:00", disable: true},
        {time: "12:30", disable: true},
        {time: "13:00", disable: true},
        {time: "13:30", disable: true},
        {time: "14:00", disable: true},
        {time: "14:30", disable: true},
        {time: "15:00", disable: true},
        {time: "15:30", disable: true},
        {time: "16:00", disable: true},
        {time: "16:30", disable: true},
        {time: "17:00", disable: true},
        {time: "17:30", disable: true},
        {time: "18:00", disable: true},
        {time: "18:30", disable: true},
        {time: "19:00", disable: true},
        {time: "19:30", disable: true},
        {time: "20:00", disable: true},
        {time: "20:30", disable: true},
        {time: "21:00", disable: true},
        {time: "21:30", disable: true},
        {time: "22:00", disable: true},
        {time: "22:30", disable: true},
        {time: "23:00", disable: true}
      ],
      loading: false,
      ajaxTimes:[],
      currentTime:null
    };
  },
  //监听属性 类似于data概念
  computed: {
    ...mapGetters({
      currentStudent: 'student/getCurrentStudent'
    }),
  },
  watch: {
    currentStudent(val) {
      if(val) {
        this.checkDay(0);
      }
    }
  },
  //方法集合
  methods: {
    resetTime() {
      for(let i=0;i<this.times.length;i++){
        this.times[i].disable = true;
      }
    },
    lookforTime() {
      this.resetTime();
      let nowAfter12 = Date.now() + this.Constants.bookTimeLimit * 3600 * 1000;
      let date = new Date(this.currentTime);
      for(let key=0;key<this.times.length;key++){
        let times = this.times[key].time.split(':')
        date.setDate(this.chooseDay);
        date.setHours(parseInt(times[0]));
        date.setMinutes(times[1]);
        let minSeconds = date.getTime();
        if(minSeconds > nowAfter12) {
          let find = this.ajaxTimes.indexOf(date.toISOString());
          // console.log(find)
          if(find>-1){
            // console.log(key)
            this.times[key].disable = false;
          }else{
            this.times[key].disable = true;
          }
        }else {
          this.times[key].disable = true;
        }
      }
    },
    checkDay(key) {
      let date = this.days[key];
      this.chooseDay = date.getDate();
      this.currentTime = new Date(date);
      this.chooseTime = '';
      this.getFreeTimes();
      // 没有选择具体时间点，day不作为筛选条件
      this.$emit('passCurrentUtcTime', '');
    },
    checkTime(time, disable) {
      if(disable) {
        return false;
      }
      // 如果时间没有改变那么不执行
      if(time == this.chooseTime) return false;
      this.chooseTime = time;
      let times = time.split(':')
      if(!this.chooseDay){
        this.chooseDay = this.days[0].getDate();
        this.currentTime = new Date(this.days[0]);
      }else{
        this.currentTime = new Date(this.currentTime);
      }
      this.currentTime.setHours(times[0]);
      this.currentTime.setMinutes(times[1])
      this.$emit('passCurrentUtcTime', this.currentTime.toISOString());
    },
    getFreeTimes() {
      this.loading = true;
      let {userId, classTypeId, startTime, endTime} = {
        userId: this.currentStudent.id || getCurrentChild(),
        classTypeId: this.classType,
        startTime: '',
        endTime: '',
      }
      startTime = new Date(this.currentTime);
      endTime = new Date(this.currentTime);
      startTime.setHours(0);
      endTime.setHours(23);
      startTime.setMinutes(0);
      endTime.setMinutes(59);
      this.$api.booking.getTutorFreeTime(userId, classTypeId, startTime.toISOString(), endTime.toISOString()).then(({status, data})=>{
        if(data.code == 200){
          this.ajaxTimes = data.data;
          this.lookforTime();
          this.loading = false;
        }
      }, () => {
        this.loading = false;
      })
    }
  },
  mounted() {
    let now = new Date();
    now.setSeconds(0);
    now.setMilliseconds(0);
    for (let i = 0; i < 15; i++) {
      this.days.push(this.DateTimeUtils.addDay(now, i));
    }
    this.chooseDay = this.days[0].getDate();
    this.currentTime = new Date(this.days[0]);
    this.checkDay(0);
  }
};
</script>
<style lang='stylus' scoped>
.panel-choose-time {
  background: #fff;
  border: 2px solid #6e70a0;
  border-radius: 8px;
  overflow: hidden;

  .c-week-name {
    display: flex;
    .item {
      flex: 1;
      background: rgba(244, 244, 244, 1);
      font-size: 16px;
      font-family: Roboto Condensed Regular;
      font-weight: 500;
      color: rgba(178, 178, 178, 1);
      line-height: 28px;
      display: inline-block;
      text-align: center;
      padding: 5px 0;
      .day{
        font-size: 24px;
        font-family: Rubik-Medium, Rubik
      }

      &.today{
        color: #6E70A0;
      }

      &.sun-sat {
        color: #EB532F;
      }

      &.active {
        position: relative;
        background-color: #56BECD;
        color: #fff;

        &:after {
          position: absolute;
          bottom: 0;
          width: 0;
          height: 0;
          left: 50%;
          transform: translateX(-50%);
          content: '';
          display: block;
          border: 6px solid #fff;
          border-left-color: transparent;
          border-top-color: transparent;
          border-right-color: transparent;
        }
      }
    }
  }

  dd {
    padding: 15px 10px 5px;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;

    .time {
      display: block;
      float: left;
      width: 90px;
      height: 30px;
      background: rgba(255, 255, 255, 1);
      border-radius: 8px;
      border: 1px solid rgba(78, 79, 105, 1);
      font-size: 16px;
      font-family: Rubik-Medium, Rubik;
      font-weight: 500;
      color: rgba(78, 79, 105, 1);
      line-height: 30px;
      margin: 0 5px 10px;
      text-align: center;
      cursor:pointer;

      &.active {
        background-color: #56BECD;
        color: #fff;
      }

      &.disable {
        opacity: 0.3;
        cursor: not-allowed;
      }
    }
  }
}
</style>