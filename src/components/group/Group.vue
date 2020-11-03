<template>
  <div class="group">
    <p
      class="f18 tip"
    >{{$t('Chat with your classmates about suitable class time on Connect APP , then the owner can book group classes for you all.')}}</p>
    <ClassinfoCard></ClassinfoCard>
    <div class="change-tabs">
      <div
        class="upcoming f24 comfortaa"
        :class="upcomingClass"
        @click="changeActiveItem(true)"
      >{{$t('Upcoming group classes')}}</div>
      <div
        class="completed f24 comfortaa"
        :class="completedClass"
        @click="changeActiveItem(false)"
      >{{$t('Completed group classes')}}</div>
    </div>
    <div class="classlist" v-if="isShowUpcomingClass">
      <UpcoimgClass></UpcoimgClass>
    </div>
    <div class="complete" v-else-if="!isShowUpcomingClass">
      <CompletedClass></CompletedClass>
    </div>
    <div class="no-students" v-else>
      <div class="image"></div>
      <p
        class="f18"
      >{{$t('When other students join in your group, you can book group class according to the agreed time with your classmates')}}</p>
      <div class="booking">{{$t('booking')}}</div>
    </div>
  </div>
</template>

<script>
import UpcoimgClass from "./components/UpcomingClass";
import CompletedClass from "./components/CompletedClass";
import ClassinfoCard from "./components/ClassInfoCard";
import '@/assets/theme-default/index/components/group.styl';
export default {
  data() {
    return {
      isShowUpcomingClass: true
    };
  },
  computed: {
    upcomingClass() {
      if (this.isShowUpcomingClass) {
        return "active";
      }
    },
    completedClass() {
      if (!this.isShowUpcomingClass) {
        return "active";
      }
    }
  },
  methods: {
    changeActiveItem(val) {
      this.isShowUpcomingClass = val;
    }
  },
  components: {
    UpcoimgClass,
    CompletedClass,
    ClassinfoCard
  }
};
</script>
<style lang='stylus' scoped>
.group {
  .tip {
    line-height: 28px;
    margin-bottom: 20px;
  }

  .change-tabs {
    margin-top: 28px;
    width: 612px;
    display: flex;
    border-radius: 8px;
    border: 1px solid rgba(110, 112, 160, 1);
    margin-bottom: 20px;
    cursor: pointer;

    .upcoming, .completed {
      flex: 1;
      height: 48px;
      line-height: 48px;
      text-align: center;
      background: rgba(255, 255, 255, 1);
      color: rgba(110, 112, 160, 1);
      font-size: 20px;
    }

    .upcoming {
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
    }

    .completed {
      width: 400px;
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
    }

    .active {
      background: rgba(110, 112, 160, 1);
      color: white;
    }
  }
}
</style>