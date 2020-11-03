<template>
  <div>
    <div class="notGroup" v-if="classroomClassInfo.courseEditionId == undefined">
      <h3>{{$t("You haven't joined any group yet.")}}</h3>
      <el-button class="exitBtn" @click="toGroupPage">{{$t('FIND GROUP')}}</el-button>
    </div>
    <div class="haveGroup" v-if="classroomClassInfo.courseEditionId != undefined">
      <TransferToOther
        :classOrdinaryStudents="classOrdinaryStudents"
        :classroomClassInfo="classroomClassInfo"
        :classLeaderStudent="classLeaderStudent"
        :showTransfer="showTransfer"
        :getStudentsInClassGroup="getStudentsInClassGroup"
        @dataInfo="getStudentsInClassGroup"
        @closeTransfer="closeTransferDialog"
      ></TransferToOther>
      <div class="classInfo-card">
        <div class="profile">
          <div class="title">
            <span
              class="f30"
              v-if="classroomClassInfo"
            >{{$t(courseEdition(classroomClassInfo.courseEditionId))}} {{$t("Level")}}{{classroomClassInfo.courseLevel | courseLevelShowFilter}} {{$t("Lesson")}}{{classroomClassInfo.lessonNo}}</span>
            <div class="save" @click="saveEditText" v-if="isEditText">{{$t('SAVE')}}</div>
          </div>
          <div v-if="!isEditText">
            <el-tooltip
              :disabled="studentId != classLeaderStudent.studentUserId"
              class="item"
              effect="dark"
              content="Click Edit"
              placement="top"
            >
              <div class="time" @click="showTextEdit">{{textValue}}</div>
            </el-tooltip>
          </div>
          <textarea v-if="isEditText" v-model="textValue" name id cols="30" rows="5"></textarea>
        </div>
        <div class="c-bg-white p30 fix borbl10 borbr10">
          <div class="fl fix">
            <el-avatar class="fl mr10 c-teacher" :size="60" :src="classLeaderStudent.avatar"></el-avatar>
            <div class="fix fl f18 lhx30">
              <div class="c-color-purple">
                <span>{{$t('owner')}}: {{classLeaderStudent.realName}}</span>
                <span
                  v-if="!!classLeaderStudent.countryOfResidence"
                >（from {{classLeaderStudent.countryOfResidence}}）</span>
              </div>
              <div class="c-color-999 f16">
                <span v-for="(item, index) in classOrdinaryStudents" :key="index">
                  {{item.realName}}
                  <b v-if="index != classOrdinaryStudents.length-1">|</b>
                </span>
                <span
                  class="c-color-999 f16"
                  v-if="classOrdinaryStudents.length == 0"
                >{{$t('no classmates yet')}}</span>
              </div>
            </div>
          </div>
          <el-button
            class="fr mt10"
            @click="showTransferDialog"
            round
            v-if="studentId == classLeaderStudent.studentUserId && classOrdinaryStudents.length != 0"
          >{{$t('TRANSFER TO OTHERS')}}</el-button>
          <el-button
            class="fr mt10"
            @click="showCloseDialog"
            round
            v-if="studentId == classLeaderStudent.studentUserId && classOrdinaryStudents.length == 0"
          >{{$t('CLOSE GROUP')}}</el-button>
          <el-button
            class="fr mt10"
            @click="showExitDialog"
            v-if="studentId != classLeaderStudent.studentUserId && classOrdinaryStudents.length != 0"
            round
          >{{$t('EXIT GROUP')}}</el-button>
        </div>
      </div>
    </div>
    <CloseGroup
      :showClose="showClose"
      :classroomClassInfo="classroomClassInfo"
      @closeCloseDialog="closeCloseDialog"
      @clear="clear"
    ></CloseGroup>
    <ExitGroup
      :showClose="showExit"
      :classroomClassInfo="classroomClassInfo"
      @closeCloseDialog="closeExitDialog"
      @clear="clear"
    ></ExitGroup>
  </div>
</template>

<script>
import Vue from 'vue';
import TransferToOther from "@/components/plugin/TransferToOther";
import CloseGroup from "./CloseGroup";
import ExitGroup from "./ExitGroup";
import { mapState } from "vuex";
export default {
  data() {
    return {
      showTransfer: false,
      showClose: false,
      showExit: false,
      isEditText: false,
      textValue: "",
      classroomClassMemberInfoList: [], //班级成员
      classroomClassInfo: {}, //班级信息
      classLeaderStudent: {}, //班长
      classOrdinaryStudents: [],
      studentId:
        this.$store.state.student.currentStudent.id ||
        window.localStorage.getItem("currentChild")
    };
  },
  mounted() {
    this.getStudentsInClassGroup();
  },
  computed: {
    ...mapState("student", {
      currentStudent: state => state.currentStudent
    })
  },
  methods: {
    toGroupPage() {
      this.$router.push("/smallclass");
    },
    getStudentsInClassGroup() {
      this.$api.grouppurchase
        .getStudentsInClassGroup(this.studentId)
        .then(res => {
          if (res.status === 200 && res.data.code === 200) {
            if (res.data.data.length === 0) return;
            this.classroomClassInfo = res.data.data[0].classroomClassInfo;
            //设置文本框信息
            this.textValue = res.data.data[0].classroomClassInfo.remark;
            //成员信息
            this.classroomClassMemberInfoList =
              res.data.data[0].classroomClassMemberInfoList;
            //班长信息
            this.classLeaderStudent = this.classroomClassMemberInfoList.filter(
              item => item.role === 1
            )[0];
            //其他成员列表
            this.classOrdinaryStudents = this.classroomClassMemberInfoList.filter(
              item => item.role === 2
            );
            //把班长信息存进 vuex
            this.$store.commit({
              type: "group/setClassLeaderStudent",
              params: this.classLeaderStudent
            });
            //把小组内成员列表存进 vuex
            this.$store.commit({
              type: "group/setClassOrdinaryStudents",
              params: this.classOrdinaryStudents
            });
          }
        });
    },
    courseEdition(number) {
      let filter = Vue.filter('levelTitle')
      return filter(number);
    },
    showTransferDialog() {
      this.showTransfer = true;
    },
    showCloseDialog() {
      this.showClose = true;
    },
    closeCloseDialog() {
      this.showClose = false;
    },
    showExitDialog() {
      this.showExit = true;
    },
    closeExitDialog() {
      this.showExit = false;
    },
    clear() {
      this.classroomClassInfo = {};
    },
    closeTransferDialog() {
      this.showTransfer = false;
    },
    showTextEdit() {
      //判断是班长的话才可以编辑
      if (this.studentId == this.classLeaderStudent.studentUserId) {
        this.isEditText = true;
      } else {
        return;
      }
    },
    //保存更改的班级信息
    saveEditText() {
      let { id, className } = this.classroomClassInfo;
      this.isEditText = false;
      let params = {
        classId: id,
        className: className,
        remark: this.textValue,
        userId: this.classLeaderStudent.studentUserId
      };
      this.$api.grouppurchase.updateClassInfo(params).then(res => {
        if (res.data.code === 200) {
          this.$message({
            message: this.$i18n.t("Update success"),
            center: true,
            iconClass: "none"
          });
        } else {
          this.$message({
            message: this.$i18n.t("Update failed"),
            center: true,
            iconClass: "none"
          });
        }
      });
    }
  },
  components: {
    TransferToOther,
    CloseGroup,
    ExitGroup
  }
};
</script>

<style scoped lang="stylus">
.notGroup {
  width: 940px;
  height: 200px;
  background: linear-gradient(203deg, rgba(118, 203, 201, 1) 0%, rgba(86, 190, 205, 1) 100%);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    height: 35px;
    font-size: 28px;
    font-family: Comfortaa-Regular, Comfortaa;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 35px;
  }

  .exitBtn {
    width: 200px;
    height: 40px;
    background: rgba(255, 255, 255, 1);
    border-radius: 44px;
    font-size: 14px;
    font-family: Rubik-Medium, Rubik;
    font-weight: 500;
    color: rgba(86, 190, 205, 1);
    line-height: 17px;
    border: 1px solid rgba(255, 255, 255, 1);
  }
}

.classInfo-card {
  box-shadow: 0px 4px 8px 4px rgba(182, 182, 182, 0.08);
  margin-bottom: 30px;

  textarea {
    width: 100%;
    padding: 20px 30px;
    box-sizing: border-box;
    resize: none;
    border: 1px solid rgba(229, 229, 229, 1);
    outline: none;
    color: #FFFFFF;
    background: linear-gradient(209deg, rgba(118, 203, 201, 1) 0%, rgba(86, 190, 205, 1) 100%);
  }

  .profile {
    padding: 24px 30px 10px;
    background: linear-gradient(209deg, rgba(118, 203, 201, 1) 0%, rgba(86, 190, 205, 1) 100%);
    color: white;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;

    .title {
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;

      span {
        font-weight: 500;
      }

      .save {
        padding: 12px 56px;
        cursor: pointer;
      }
    }

    .time {
      padding: 10px 5px 12px;
      cursor: pointer;
      line-height: 24px;
    }
  }
}
</style>
