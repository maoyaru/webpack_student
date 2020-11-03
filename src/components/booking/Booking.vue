<template>
  <div class="booking">
    <div v-show="false">{{groupCopy}}</div>
    <div class="tool-bar">
      <a href="javascript:;" class="btn-choose-time">
        <i class="el-icon-time"></i>
        {{selectTime || $t("Choose Desired Class Time")}}
        <i class="el-icon-arrow-down"></i>
        <ChooseDesiredClassTime :classType="group" @passCurrentUtcTime="passCurrentUtcTime"></ChooseDesiredClassTime>
      </a>
      <!-- <span v-show="memberRole == ApiConstants.classMemberRoleLeader">
        <a href="###" class="btn-group" round v-if="group == ApiConstants.classType1v1" @click="groupOrOnetoOne()">
          <i class="el-icon-refresh"></i>
          {{$t("one-on-one class")}}
        </a>
        <a href="###" class="btn-one-one" round v-if="group == ApiConstants.classTypeSmallclass"
          @click="groupOrOnetoOne()">
          <i class="el-icon-refresh"></i>
          {{$t("Group Class")}}
        </a>
      </span> -->
    </div>
    <div class="booking-lists" v-loading="loadFrequently || loadRecommended" element-loading-spinner="custom-loading">
      <h1 class="lg-title" v-if="list && list.length > 0">{{$t("My Teachers")}}</h1>
        <Teacher v-if="list && list.length > 0" v-for="(item,$key) in list" :teacher="item" :index="$key" :key="item.id"
          :studentid="storeCurrentStudentId" :group="group" type="used"></Teacher>
      <h1 class="lg-title" v-if="otherList && otherList.length > 0">{{$t("All Teachers")}}</h1>
      <Teacher v-for="(item,$key) in otherList" :teacher="item" :index="$key" :key="item.id" :studentid="storeCurrentStudentId" :group="group"></Teacher>
    </div>
  </div>
</template>

<script>
import Teacher from "./components/Teacher";
import ChooseDesiredClassTime from "./components/ChooseDesiredClassTime";
import { mapGetters, mapMutations } from "vuex";

export default {
  components: { Teacher, ChooseDesiredClassTime },
  data() {
    return {
      isShowChooseTimePanel: false,
      list: [],
      otherList: [],
      userEligibleTutorParam: {
        preferTime: ""
      },
      page: 1,
      pageSize: this.Constants.pageSize,
      loadModel: "booking",
      loading: false,
      noMore: false,
      group: this.ApiConstants.classType1v1,
      loadFrequently: false,
      loadRecommended: false,
      copyFlag: true,
      selectTime: "",
      selectTimeUTC: ""
    };
  },
  computed: {
    storeCurrentStudentId: function() {
      return this.$store.state.student.currentStudent.id;
    },
    ...mapGetters({
      memberRole: "student/getMemberRole"
    }),
    groupCopy() {
      if (this.memberRole && this.copyFlag) {
        if (this.memberRole == this.ApiConstants.classMemberRoleLeader) {
          this.group = this.ApiConstants.classTypeSmallclass;
        } else {
          this.group = this.ApiConstants.classType1v1;
        }
        this.copyFlag = false;
      }
      return this.group;
    }
  },
  watch: {
    /**
     * @Author   Yaodongxin
     * @DateTime 2019-12-09
     * @method   storeCurrentStudentId studentid是异步获取的，所以要在这里监听
     */
    storeCurrentStudentId: function(a, b) {
      this.initTeacherData();
      this.$store.dispatch("student/setStudentRole", a);
    },
    "$i18n.locale": function(val) {
      if (this.selectTimeUTC) {
        this.selectTime = this.DateTimeUtils.formartDateFromUTC(
          this.selectTimeUTC,
          "yyyy.MM.dd (w) hh:mm"
        );
      }
    }
  },
  methods: {
    groupMutation(group) {
      this.group = group;
    },
    /**
     * @Author   Yaodongxin
     * @DateTime 2019-12-09
     * @method   initTeacherData  初始化教师列表
     */
    async initTeacherData() {
      // this.loadRecommended = true;
      this.loadFrequently = true;
      // 清空原有数据
      this.list = [];
      this.otherList = [];
      this.noMore = false;
      this.page = 1;
      let self = this;
      let results = await Promise.all([
        this.frequentlyTeacher(),
        this.recommendTeacher()
      ]);
      if (results[0].data.code == 200) {
        this.list = results[0].data.data.list || [];
      } else {
        // this.$message({
        //   message: 'fail'
        // })
      }
      if (results[1].data.code == 200) {
        this.otherList = results[1].data.data.list || [];
      } else {
        // this.$message({
        //   message: 'fail'
        // })
      }
      // this.loadRecommended = false;
      this.loadFrequently = false;
      setTimeout(function() {
        self.loading = false;
        self.loadMore();
      }, 10);
    },
    /**
     * @Author   Yaodongxin
     * @DateTime 2019-12-09
     * @method   loadMoreRecommendTeacher 触底加载更多教师信息
     */
    async loadMoreRecommendTeacher() {
      if (this.noMore || this.loading) {
        return false;
      }
      this.page = this.page + 1;
      let result = await this.recommendTeacher();
      this.loading = false;
      if (result.data.data.pageNum >= result.data.data.totalPage) {
        this.noMore = true;
      }
      if (result.data.data.list) {
        this.otherList = [...this.otherList, ...result.data.data.list];
        this.loading = false;
      }
    },
    /**
     * @Author   Yaodongxin
     * @DateTime 2019-12-09
     * @method   frequentlyTeacher  最近使用的教师
     * @return   {Promise}   Promise
     */
    frequentlyTeacher() {
      return this.$api.schedule.frequentlyUsedTeachers(
        this.storeCurrentStudentId,
        this.group,
        this.userEligibleTutorParam.preferTime
      );
    },
    /**
     * @Author   Yaodongxin
     * @DateTime 2019-12-09
     * @method   recommendTeacher  推荐的教师
     * @return   {Promise}   Promise
     */
    recommendTeacher() {
      this.loading = true;
      return this.$api.schedule.otherRecommendedTeachers(
        this.storeCurrentStudentId,
        this.group,
        this.userEligibleTutorParam.preferTime,
        this.page,
        this.pageSize
      );
    },
    groupOrOnetoOne() {
      if (this.group == this.ApiConstants.classTypeSmallclass) {
        this.groupMutation(this.ApiConstants.classType1v1);
      } else {
        this.groupMutation(this.ApiConstants.classTypeSmallclass);
      }
      // 筛选
      this.initTeacherData();
    },
    passCurrentUtcTime(utc) {
      if (utc) {
        this.selectTime = this.DateTimeUtils.formartDateFromUTC(
          utc,
          "yyyy.MM.dd (w) hh:mm"
        );
        this.selectTimeUTC = utc;
      }
      if (!utc) return false;
      // 筛选时间改变，重新请求
      this.userEligibleTutorParam.preferTime = utc;
      this.page = 1;
      this.initTeacherData();
    },
    /**
     * @Author   Yaodongxin
     * @DateTime 2019-12-09
     * @method   loadMore  触底加载更多事件实现
     */
    loadMore() {
      let self = this,
        indexWarpper = document.getElementById("app"),
        innerDiv = indexWarpper.childNodes[0],
        // windowHeight = document.documentElement.clientHeight,
        containerHeight = indexWarpper.clientHeight * 1,
        scrollTop;
      indexWarpper.addEventListener(
        "scroll",
        function() {
          let innerHeight = innerDiv.offsetHeight;
          if (self.loadModel == "booking") {
            var scrollTop = indexWarpper.scrollTop * 1;
            if (scrollTop + containerHeight + 10 >= innerHeight) {
              self.loadMoreRecommendTeacher();
            }
          }
        },
        false
      );
    }
  },
  mounted() {
    if (this.storeCurrentStudentId) {
      this.initTeacherData();
    }
  },
  destroyed() {
    this.loadModel = "";
  }
};
</script>

<style lang='stylus' scoped>
.booking {
  .booking-lists {
    min-height: 500px;
  }

  .tool-bar {
    a {
      border-radius: 30px;
      text-align: center;
      line-height: 60px;
      color: #fff;
      display: inline-block;
      height: 60px;
      text-decoration: none;
    }

    .btn-group, .btn-one-one {
      width: 220px;
      height: 60px;
      background: rgba(86, 190, 205, 1);
      border-radius: 30px;
      text-align: center;
      line-height: 60px;
      margin-left: 20px;
    }

    .btn-one-one {
      background: rgba(239, 168, 62, 1);
    }

    .btn-choose-time {
      position: relative;
      width: 360px;
      background: rgba(110, 112, 160, 1);

      .panel-choose-time {
        box-sizing: border-box;
        position: absolute;
        left: 0;
        top: 60px;
        width: 950px;
        z-index: 100;
        opacity: 0;
        height: 0;
        transition: all 0.5s;
      }

      .el-icon-arrow-down {
        margin-left: 10px;
      }

      .el-icon-time {
        margin-right: 10px;
      }

      &:hover {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;

        .panel-choose-time {
          opacity: 1;
          height: 262px;
          border-top-left-radius: 0;
        }

        .el-icon-arrow-down:before {
          content: '\E6E1';
        }
      }
    }
  }
  .el-card {
    margin-bottom: 20px;
  }

  .lg-title {
    height: 35px;
    font-size: 28px;
    font-family: Comfortaa-Regular, Comfortaa;
    font-weight: 400;
    color: rgba(215, 143, 37, 1);
    line-height: 35px;
  }
}
</style>