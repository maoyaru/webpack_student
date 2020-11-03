<template>
  <el-card :body-style="{padding:'30px'}" class="small-class-card">
    <p
      class="title f30"
    >{{$t(courseEdition(classInfo.classroomClassInfo.courseEditionId))}} {{$t('Level')}}{{classInfo.classroomClassInfo.courseLevel | courseLevelShowFilter}} {{$t('Lesson')}}{{classInfo.classroomClassInfo.lessonNo}}</p>
    <p class="profile f16">{{classInfo.classroomClassInfo.remark}}</p>
    <div class="teacher">
      <el-avatar
        v-if="classLeaderStudent"
        :size="60"
        :src="classLeaderStudent.avatar"
        class="c-student avatar"
      ></el-avatar>
      <div class="names">
        <span
          v-if="classLeaderStudent"
        >{{classLeaderStudent.realName}}（from {{classLeaderStudent.countryOfResidence}}）</span>
        <span
          class="c-color-999 f16"
          v-if="classOrdinaryStudent.length === 0"
        >{{$t('no classmates yet')}}</span>
        <p class="students f16">
          <span class="f16" v-for="(item, index) in classOrdinaryStudent" :key="index">
            <i v-if="item.role === 1" class="leaderBg"></i>
            {{item.realName}}
            <b v-if="index != classOrdinaryStudent.length-1">|</b>
          </span>
        </p>
      </div>
    </div>
    <slot name="btn"></slot>
  </el-card>
</template>

<script>
import Vue from 'vue'
export default {
  props: ["classInfo"],
  data() {
    return {
      pageNum: 1
    };
  },
  computed: {
    classLeaderStudent() {
      if (this.classInfo.classroomClassMemberInfoList) {
        return this.classInfo.classroomClassMemberInfoList.filter(
          item => item.role === this.ApiConstants.classLeaderStudentStutes
        )[0];
      }
    },
    classOrdinaryStudent() {
      if (this.classInfo.classroomClassMemberInfoList) {
        return this.classInfo.classroomClassMemberInfoList.filter(
          item => item.role === this.ApiConstants.classOrdinaryStudentSyutes
        );
      } else {
        return [];
      }
    }
  },
  methods: {
    courseEdition(number) {
      let filter = Vue.filter('levelTitle')
      return filter(number);
    }
  }
};
</script>

<style scoped lang="stylus">
.leaderBg {
  display: inline-block;
  width: 18px;
  height: 18px;
  transform: translateY(4px);
  margin-right: 2px;
  bg-image('../../../assets/theme-default/images/group/class_leader');
}

.small-class-card {
  margin-bottom: 20px;
  position: relative;

  .title {
    font-weight: 500;
    color: rgba(52, 54, 77, 1);
    margin-bottom: 10px;
  }

  .profile {
    margin-bottom: 34px;
  }

  .teacher {
    display: flex;
    align-items: center;
    height: 60px;

    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 60px;
      background: #eee;
      margin-right: 10px;
    }

    .names {
      height: 100%;
      padding-top: 6px;
      padding-bottom: 6px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .students {
        color: rgba(153, 153, 153, 1);
      }
    }
  }
}
</style>
