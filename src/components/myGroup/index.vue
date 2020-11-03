<template>
  <div v-loading="loading" element-loading-spinner="custom-loading">
    <div v-if="studentId">
      <div class="m-group-list" v-for="i in list">
        <div class="m-group-desc rubik">
          <div class="arrow">
            <img src="@/images/arrow-up.png" v-if="i.collapsed" @click="i.collapsed = !i.collapsed">
            <img src="@/images/arrow-down.png" v-else @click="i.collapsed = !i.collapsed">
          </div>
          <div class="c-title f30 rubik-m">
            <!-- {{i.classroomClassInfo.classNo}}- -->
            {{$t(levelTitle(i.classroomClassInfo.courseEditionId))}}&nbsp;
            Level{{i.classroomClassInfo.courseLevel | courseLevelShowFilter}}&nbsp;
            <!-- Lesson{{i.classroomClassInfo.lessonNo}} -->
          </div>
          <div class="c-info-cell f16">
            <span>{{$t('Total Lesson')}}</span>
            <span>{{i.classroomSmallClassCourseInfoList.length}}{{$t('Lessons')}}</span>
          </div>
          <div class="c-info-cell f16" v-if="i.classroomClassInfo.classTypeId == ApiConstants.classTypeSmallclass || i.classroomClassInfo.classTypeId == ApiConstants.classTypeBigclass">
            <span>{{$t('Class Name')}}</span>
            <span>{{$i18n.locale == 'zh' ? i.classroomClassInfo.classNameZh : i.classroomClassInfo.className}}</span>
          </div>
          <div class="c-info-cell f16" v-if="i.classroomClassInfo.classTypeId != ApiConstants.classTypeBigclass">
            <span>{{$t('Class member')}}</span>
            <span>
              <template v-for="(item, index) in i.classroomClassMemberInfoList">
                {{item.realName}}
                <template v-if="index < i.classroomClassMemberInfoList.length-1">&nbsp;&nbsp;| &nbsp;&nbsp;</template>
              </template>
            </span>
          </div>
        </div>
        <div class="c-detail-wrap shadow" v-if="i.collapsed">
          <!-- {{i.userTutorInfoList}} -->
          <div class="c-teachers">
            <el-carousel height="274px" :autoplay="false">
              <el-carousel-item v-for="item in i.userTutorInfoList" :key="item.id">
                <div class="c-slide-item">
                  <el-avatar class="mr20 c-teacher" :size="144" :src="item.avatar"></el-avatar>
                  <div class="c-right">
                    <div class="c-top">
                      <span class="f28 rubik mr20">{{item.realName}}</span>
                      <span class="c-years f16 mr20">{{item.teachingStartTime|setExperience(this)}}</span>
                      <el-rate class="mt5" v-model="item.rating" disabled>
                      </el-rate>
                    </div>
                    <div class="c-desc f16">
                      {{$i18n.locale == 'zh' ? item.descriptionZh : item.descriptionEn}}
                    </div>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
          <div class="c-lesson-list">
            <div class="c-title f24">
              {{$t('lessons remaining', {num: i.endNumber})}} /<span class="f16">{{$t('lesson total',{num: i.classroomSmallClassCourseInfoList.length})}} </span>
            </div>
            <ul class="c-list-ul f16 rubik">
              <li>
                <span class="span1">{{$t('No.')}}</span>
                <span class="span2">{{$t('Class Time')}}</span>
                <span class="span3">{{$t('Lesson')}}</span>
                <span class="span4">
                  <!-- Heaven and earth and peop… --></span>
                <span class="span5">{{$t('Teacher')}}</span>
                <span class="span6"></span>
              </li>
              <li :class="{'c-end': item.isEnd}" v-for="(item, index) in i.classroomSmallClassCourseInfoList">
                <span class="span1">{{index + 1}}</span>
                <span class="span2">{{DateTimeUtils.formartDateFromUTC(item.startTime, 'yyyy.MM.dd (w) hh:mm')}}</span>
                <!-- <span class="span3">lesson{{item.lessonNo}}</span> -->
                <span class="span3">{{ item.lessonDescription }}</span>
                <span class="span4">
                  <!-- Heaven and earth and peop… --></span>
                <span class="span5">{{item.tutorRealName}}</span>
                <span class="span6" v-show="item.isEnd">Ended</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!--     <div class="no-students" v-else>
      <div class="image"></div>
      <p class="f18">{{$t('You haven’t joined any group yet')}}</p>
    </div> -->
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import '@/assets/theme-default/index/components/group.styl';
import GetData from '@/utils/axios.js';
const { $get, $post } = new GetData();
export default {
  data() {
    return {
      list: [],
    }
  },
  mounted() {

  },
  computed: {
    ...mapGetters({
      classIds: 'student/getClassIds',
      studentId: 'student/getCurrentStudent',
      smallclassInfo: 'group/smallclassInfo',
      loading: 'group/loading'
    })
  },
  watch: {
    studentId: {
      deep: true,
      immediate: true,
      handler(newVal) {
        if (newVal.id) {
          this.loadData(newVal.id);
        } else {
          // this.$message({
          //   message: this.$t('You haven’t joined any group yet')
          // });
          this.$store.commit('group/setLoadingMutation', false);
        }
      }
    },
    classIds: {
      deep: true,
      immediate: true,
      handler(newVal) {
        if (newVal.ids) {
          this.getSmallClass(newVal.ids);
        } else {
          // this.$message({
          //   message: this.$t('You haven’t joined any group yet')
          // });
          this.$store.commit('group/setLoadingMutation', false);
        }
      }
    }
  },
  methods: {
    ...mapActions({
      'getSmallClass': 'group/getSmallClassAction'
    }),
    levelTitle(courseEditionId) {
      let filter = Vue.filter('levelTitle')
      return filter(courseEditionId);
    },
    loadData(id) {
      $get(`/api/schedule/student/allclass/${id}`).then(res => {
        this.list = res.data.data;
        this.list.map(i => {
          this.$set(i, 'collapsed', true);
          i.endNumber = 0;
          if (!i.classroomClassMemberInfoList) {
            i.classroomClassMemberInfoList = [];
          }
          if (!i.userTutorInfoList) {
            i.userTutorInfoList =[];
          }
          if (!i.classroomSmallClassCourseInfoList) {
            i.classroomSmallClassCourseInfoList = [];
          } else {
            i.classroomSmallClassCourseInfoList.forEach(item => {
              let date = Date.parse(item.startTime);
              let now = Date.now();
              if (date < now) {
                item.isEnd = true;
              } else {
                item.isEnd = false;
                i.endNumber++;
              }
            });
          }
        });
      });
    },
  }
}

</script>
<style lang='stylus' scoped>
.m-group-list {
  padding-bottom: 40px;
}

.m-group-desc {
  position: relative;
  width: 940px;
  min-height: 120px;
  box-sizing: border-box;
  padding: 20px 30px;
  background: linear-gradient(209deg, #76CBC9 0%, #56BECD 100%);
  color: #fff;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;

  .arrow {
    position: absolute;
    top: 20px;
    right: 30px;
    width: 40px;
    height: 40px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .c-title {
    font-weight: bold;
    line-height: 36px;
  }

  .c-info-cell {
    line-height: 32px;
    display: flex;

    span:nth-child(1) {
      width: 110px;
    }
  }
}

.c-detail-wrap {
  width: 940px;
  background: #fff;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;

  .c-slide-item {
    padding: 30px;
    box-sizing: border-box;
    display: flex;
  }

  .c-years {
    color: #b6b6b6;
  }

  .c-desc {
    color: #999;
    line-height: 24px;
    padding-top: 38px;
    height: 182px;
    overflow: hidden;
  }

  .c-top {
    display: flex;
    line-height: 32px;
  }

  .c-right {
    width: 710px;
  }
}

.c-lesson-list {
  margin: 0 30px;
  padding-top: 30px;
  border-top: 1px solid #b2b2b2;

  .c-title {
    line-height: 30px;
    padding-bottom: 10px;
  }

  .c-list-ul {
    padding-bottom: 20px;

    li {
      width: 100%;
      overflow: hidden;
      line-height: 40px;
    }

    .c-end {
      color: #999;
    }

    span {
      float: left;
      height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .span1 {
    width: 5%;
    padding-right: 2%;
  }

  .span2 {
    width: 24%;
    padding-right: 2%;
  }

  .span3 {
    width: 36%;
    padding-right: 2%;
  }

  .span4 {
    width: 0%;
    padding-right: 2%;
  }

  .span5 {
    width: 15%;
    padding-right: 2%;
  }

  .span6 {
    width: 10%;
  }
}
.c-teachers {
  div.el-carousel {
    z-index: 1;
  }
}
</style>
