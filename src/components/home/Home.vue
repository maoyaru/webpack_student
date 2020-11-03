<template>
  <div class="home">
    <router-link to="/goodCourse">
      <div class="id-banner" v-if="currentCountryName == 'Indonesia'">
        <img src="@/images/banner/id_banner.jpg">
      </div>
    </router-link>
    <Header></Header>
    <ToDoList v-if="showTodoList" :step="step" :didITTest="didITTest" :upcomingClassList="upcomingClassesList" />
    <UpcomingClasses :classesList="upcomingClassesList" />
    <Advert :showAdvert="showAdvert" @close="showAdvert=false" @open="showAdvert=true"></Advert>
    <a :href="adverUrl" target="_blank" class="c-show-advert"></a>
  </div>
</template>
<script>
import Advert from '@/components/common/Advert.vue';
import ToDoList from "./components/ToDoList";
import UpcomingClasses from "./components/UpcomingClasses";
import Header from "../common/Header"
import { mapGetters, mapActions } from 'vuex'
export default {
  components: { ToDoList, UpcomingClasses, Header, Advert },
  data() {
    return {
      upcomingClassesList: [],
      currentCountryName: null,
      // students: [],
      isInit: true,
      step: 0,
      classNotStart: 0,
      firstCourse: 1, //首次课
      didITTest: false,
      showAdvert: false,
      adverUrl: 'https://wj.qq.com/s2/5537860/96d0'
    };
  },
  async created() {
    const result = await this.$api.finance.getCountryInfo()
    if (result.data.code === 200 && result.data.data) {
      this.currentCountryName = result.data.data.enName
    }
  },
  computed: {
    ...mapGetters({
      parentUserInfo: "user/getParentInfo",
      currentStudent: "student/getCurrentStudent",
      students: "student/students"
    }),
    currentStudent() {
      return this.$store.state.student.currentStudent
    },
    showTodoList() {
      if ((this.students !== null && this.students.length == 0) || (this.currentStudent.firstCourse == this.firstCourse)) {
        return true
      } else {
        return false
      }
    },
  },
  watch: {
    // students(o) {
    //   this.step = o.length > 0 ? 2 : 1;
    // },
    currentStudent(oldVal, newVal) {
      this.$api.schedule.getVirtualclass(
        this.currentStudent.id,
        this.classNotStart,
        1,
        this.Constants.scheduleClassRecordPageNum
      ).then(data => this.upcomingClassesList = data.data.data.list)
      this.getBriefClassInfo({
        parentUserId: this.parentUserInfo.id,
        studentUserId: this.currentStudent.id
      });
    }
  },
  methods: {
    ...mapActions({
      getBriefClassInfo: "user/getBriefClassInfoAction"
    })
  },
  mounted() {
    if (this.$store.state.student.currentStudent.id) {
      this.$api.schedule.getVirtualclass(
          this.$store.state.student.currentStudent.id,
          this.classNotStart,
          this.ApiConstants.virtualclassStatusNotStart,
          this.Constants.scheduleClassRecordPageNum
        )
        // .then(data => (console.log(data.data.data.list)));
        .then(data => (this.upcomingClassesList = data.data.data.list));
      this.getBriefClassInfo({
        parentUserId: this.parentUserInfo.id,
        studentUserId: this.currentStudent.id
      });
    }

  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name == "classroom") {
        vm.didITTest = true
      }
    })
  },
}

</script>
<style lang='stylus'>
.id-banner {
  margin-bottom: 15px;

  img {
    width: 100%;
  }
}

.home {
  margin-bottom: 100px;

  .todolist {
    margin-top: 20px;
  }

  .upcoming-classes {
    margin-top: 20px;
  }
}

.c-show-advert {
  display: none;
  width: 70px;
  height: 70px;
  background: url('~@/assets/theme-default/images/common/advert-fix.png') no-repeat 0 0/100%;
  position: fixed;
  top: 360px;
  right: 0;
  z-index: 100;
}

</style>
