<template>
  <div class="upcoming">
    <Courseware :classInfo="virtualClassInfo" :showCourseware="showCourseware" @closePreviewDialog="closeCourseware">
    </Courseware>
    <div v-for="(item, index) in classList" :key="index">
      <Class :classInfo="item">
        <template v-slot:reserve>
          <div class="reserve"></div>
        </template>
        <template v-slot:btn-warpper>
          <div class="btns">
            <el-button :disabled="item.status === 3" type="primary" round class="f14" @click="showPreview(item)">
              {{$t("PREVIEW")}}</el-button>
            <el-button v-if="item.showCancelFlag" type="primary" round class="f14" @click="cancelAppointment(item)">
              {{$t("Cancel")}}</el-button>
          </div>
        </template>
        <template v-slot:students-name>
          <div class="studentsName">
            <span class="f16" v-for="(item, index) in allClassStudent" :key="index">
              <i v-if="item.role === 1"></i>
              {{item.realName}}
              <b v-if="index != allClassStudent.length-1">|</b>
            </span>
          </div>
        </template>
      </Class>
    </div>
    <NoData v-if="classList.length === 0"></NoData>
    <CancelAppointment :classInfo="cancelClassInfo" :showCancelAppoint="showCancelClass" :loading="loadingCancel"
      @closeCancelDialog="closeCancelAppoint" @cancelClass="cancelClass"></CancelAppointment>
    <div class="seeMoreWrapper">
      <el-button :loading="seeMoreLoadingFlag" class="seeMore" @click="seeMore" v-if="showSeeMore()">{{$t('SEE MORE')}}
      </el-button>
    </div>
  </div>
</template>

<script>
import CancelAppointment from "../../schedule/components/CancelAppointment";
import Class from "../../common/Class";
import Courseware from "../../common/Courseware";
import NoData from "./NoData";
import { mapState } from "vuex";
export default {
  data() {
    return {
      seeMoreLoadingFlag: false,
      showCourseware: false,
      showCancelClass: false,
      classList: [],
      pageNum: 1,
      cancelClassInfo: {},
      virtualClassInfo: {},
      loadingCancel: false
    };
  },
  computed: {
    ...mapState("group", {
      classLeaderStudent: state => state.classLeaderStudent,
      classOrdinaryStudents: state => state.classOrdinaryStudents
    }),
    allClassStudent() {
      return [this.classLeaderStudent, ...this.classOrdinaryStudents];
    }
  },
  mounted() {
    this.getUpcommingClass();
  },
  methods: {
    cancelAppointment(item) {
      this.cancelClassInfo = item;
      this.showCancelClass = true;
    },
    closeCancelAppoint() {
      this.showCancelClass = false;
    },
    cancelClass() {
      let params = {
        classId:
          this.cancelClassInfo.classTypeId == this.ApiConstants.classType1v1
            ? null
            : this.cancelClassInfo.classId,
        classTypeId: this.cancelClassInfo.classTypeId,
        endRecurringTime: this.DateTimeUtils.dayLast(
          new Date(this.cancelClassInfo.startTime)
        ).toISOString(),
        endTime: this.cancelClassInfo.endTime,
        opType: this.ApiConstants.scheduleStudentCancel,
        startTime: this.cancelClassInfo.startTime,
        studentUserId: this.$store.state.student.currentStudent.id,
        tutorUserId: this.cancelClassInfo.tutorUserId
      };
      this.loadingCancel = true;
      this.$api.booking.subscribeClass(params).then(
        res => {
          if (res.data.code == 200) {
            this.$message({
              showClose: true,
              message: "取消课程成功"
            });
            this.showCancelClass = false;
            this.classList = [];
            this.getUpcommingClass();
          }
          this.loadingCancel = false;
        },
        res => {
          this.loadingCancel = false;
        }
      );
    },
    getUpcommingClass() {
      let studentId =
        this.$store.state.student.currentStudent.id ||
        window.localStorage.getItem("currentChild");
      this.$api.grouppurchase
        .getBeforeSmallCalssList(
          studentId,
          this.pageNum,
          this.Constants.smallGroupPageSize
        )
        .then(res => {
          if (res.data.code === 200) {
            if (res.data.data.list) {
              if (res.data.data.list.length === 0) {
                this.seeMoreLoadingFlag = false;
              } else {
                res.data.data.list.forEach(st => {
                  let flag = st.classroomClassMemberInfoList.find(
                    ite => ite.studentUserId == studentId && ite.role === 1
                  );
                  if (flag === undefined) {
                    st.showCancelFlag = false;
                  } else {
                    st.showCancelFlag = true;
                  }
                });
                // console.log(res.data.data.list)
                let arr = [...this.classList, ...res.data.data.list];
                this.classList = arr;
                this.seeMoreLoadingFlag = false;
              }
            }
          } else {
            return;
          }
        });
    },
    showPreview(info) {
      this.virtualClassInfo = info;
      this.showCourseware = true;
    },
    closeCourseware() {
      this.showCourseware = false;
    },
    showSeeMore() {
      if (this.classList.length <= this.Constants.smallGroupPageSize - 1) {
        return false;
      } else {
        return true;
      }
    },
    seeMore() {
      this.seeMoreLoadingFlag = true;
      this.pageNum += 1;
      this.getUpcommingClass();
    }
  },
  components: {
    Class,
    NoData,
    Courseware,
    CancelAppointment
  }
};
</script>
<style scoped lang="stylus">
.seeMoreWrapper {
  width: 150px;
  height: 30px;
  margin: 10px auto;

  .seeMore {
    background-color: rgba(255, 255, 255, 1);
    border-radius: 8px;
    border: 2px solid rgba(215, 143, 37, 1);
    color: #D78F25;
    cursor: pointer;
  }
}

.studentsName {
  margin-top: 13px;
  color: #999999;

  b {
    margin: 0 4px;
  }

  i {
    display: inline-block;
    width: 18px;
    height: 18px;
    transform: translateY(4px);
    margin-right: 2px;
    bg-image('../../../assets/theme-default/images/group/class_leader');
  }
}

.upcoming {
  .reserve {
    position: absolute;
    top: 24px;
    right: 0;
    width: 140px;
    height: 56px;
    background-size: 100%;
    bg-image('../../../assets/theme-default/images/common/reserve');
  }

  .btns {
    position: absolute;
    bottom: 33px;
    right: 30px;
  }
}
</style>
