<template>
  <div>
    <GroupDialog
      :showDialog="showDialog"
      @closeGroupDialog="closeGroupDialog"
      @sureSubmitResult="sureSubmitResult"
      :title="title"
      :detail="profile"
      :sureLoading="sureLoading"
    ></GroupDialog>

    <TransferToOther
      :showTransfer="showTransfer"
      @closeTransfer="closeTransfer"
      :classOrdinaryStudents="classOrdinaryStudents"
      :classroomClassInfo="classroomClassInfo"
      :classLeaderStudent="classLeaderStudent"
      @dataInfo="dataInfo"
    ></TransferToOther>

    <GroupClass v-for="(item, index) in ClassesJoined" :key="index" :classInfo="item">
      <template v-slot:btn>
        <el-button
          class="btn"
          :class="{'changeLeader':isClassLeader}"
          v-if="classOrdinaryStudents.length != 0 && showButton(item)"
          @click="showGroupDialog(item)"
          v-show="isClassLeader"
        >{{$t('TRANSFER TO OTHERS')}}</el-button>
        <el-button
          class="btn w160"
          round
          type="primary"
          v-if="classOrdinaryStudents.length == 0 && showButton(item)"
          @click="showGroupDialog(item)"
        >{{$t('CLOSE GROUP')}}</el-button>
        <el-button
          class="w160 btn"
          round
          type="primary"
          v-if="showButton(item)"
          @click="showGroupDialog(item)"
          v-show="!isClassLeader"
        >{{$t('EXIT GROUP')}}</el-button>
        <el-button
          class="w120 btn"
          round
          :disabled="studentIsInClass || item.max"
          v-if="!showButton(item)"
          @click="showGroupDialog(item)"
        >{{$t('JOIN')}}</el-button>
      </template>
    </GroupClass>
    <div class="seeMoreWrapper">
      <el-button :loading="seeMoreLoadingFlag" class="seeMore" @click="seeMore">{{$t('SEE MORE')}}
      </el-button>
    </div>
  </div>
</template>

<script>
import GroupClass from "./GroupClass";
import GroupDialog from "./GroupDialog";
import TransferToOther from "@/components/plugin/TransferToOther";
import { mapState } from "vuex";
export default {
  props: {
    changeNotGroupFlag: {
      type: Function
    },
    allCount: {
      type: Number
    }
  },
  computed: {
    ...mapState("user", {
      user: state => state.user
    })
  },
  data() {
    return {
      showDialog: false,
      seeMoreLoadingFlag: false,
      title: null,
      profile: null,
      ClassesJoined: [],
      pageNum: 1,
      isClassLeader: null,
      studentIsInClass: false,
      showTransfer: false,
      studentId: parseInt(window.localStorage.getItem("currentChild")),
      classroomClassInfo: {},
      classOrdinaryStudents: [],
      classLeaderStudent: {},
      currentStisClassLeader: true,
      activeClassInfo: {}, //被点击的班级信息
      closeFLag: false,
      joinedFlag: true,
      sureLoading: false
    };
  },
  created() {
    this.dataInfo();
  },
  methods: {
    async seeMore() {
      await (this.seeMoreLoadingFlag = true)
      await (this.pageNum += 1);
      await this.getStudentsCanJoinClass()
      await (this.seeMoreLoadingFlag = false)

    },
    async dataInfo() {
      await (this.ClassesJoined = []);
      //当前学生在的班级
      await this.getStudentsInClassGroup();
      //当前学生可加入的班级
      await this.getStudentsCanJoinClass();
      await (this.joinedFlag = true);
      await this.$forceUpdate();
    },
    //获取当前学生加入的所有班级
    getStudentsInClassGroup() {
      this.$api.grouppurchase
        .getStudentsInClassGroup(this.studentId)
        .then(res => {
          if (res.data.code === 200) {
            //判断学生是否已经在班级中了
            if (res.data.data.length != 0) {
              // console.log(res.data, "111");
              this.ClassesJoined = res.data.data;
              this.studentIsInClass = true;
              //班级信息
              this.classroomClassInfo = res.data.data[0].classroomClassInfo;
              //班级成员
              this.classOrdinaryStudents = res.data.data[0].classroomClassMemberInfoList.filter(
                item => item.role === this.ApiConstants.classMemberRoleFollow
              );
              //班级班长
              this.classLeaderStudent = res.data.data[0].classroomClassMemberInfoList.filter(
                item => item.role === this.ApiConstants.classMemberRoleLeader
              )[0];

              let currentStisClassLeader = res.data.data[0].classroomClassMemberInfoList.find(
                ite => {
                  if (ite.studentUserId == this.studentId && ite.role == 1) {
                    return true;
                  } else {
                    return false;
                  }
                }
              );
              // console.log(currentStisClassLeader);
              currentStisClassLeader
                ? (this.isClassLeader = true)
                : (this.isClassLeader = false);
            } else {
              return;
            }
          } else {
            return;
          }
        });
    },
    //获取学生可以加入的所有班级
    getStudentsCanJoinClass() {
      this.$api.grouppurchase
        .getStudentsCanJoinClass(
          this.pageNum,
          this.Constants.smallGroupPageSize,
          this.studentId
        )
        .then(res => {
          if (res.data.code === 200) {
            res.data.data.list.forEach(item => {
              if (
                item.classroomClassMemberInfoList != null &&
                item.classroomClassMemberInfoList.length === 5
              ) {
                item.max = true;
              }
              item.noJoin = true;
            });
            this.ClassesJoined = this.ClassesJoined.concat(res.data.data.list);
            if (this.ClassesJoined.length != 0) {
              this.$emit("changeNotGroupFlag");
            }
          }
        });
    },
    //展示弹框
    showGroupDialog(item) {
      // let count =
      //   this.user.userParentInfo.balance * 1 +
      //   this.user.userParentInfo.bonusBalance * 1;
      // if (count <= 0) {
      //   this.sureLoading = false;
      //   this.showDialog = false;
      //   this.$message({
      //     message: this.$t("Insufficient class balance, please go to recharge"),
      //     onClose: () => {
      //       this.$router.push({
      //         name: "pay"
      //       });
      //     }
      //   });
      //   return;
      // }
      this.activeClassInfo = item.classroomClassInfo;
      let isClassLeader = item.classroomClassMemberInfoList.find(ite => {
        if (
          ite.studentUserId == this.studentId &&
          ite.role == this.ApiConstants.classLeaderStudentStutes
        ) {
          return true;
        } else {
          return false;
        }
      });
      this.isClassLeader = isClassLeader;
      if (item.noJoin) {
        this.showDialog = true;
        //学生加入
        this.title = "JOIN GROUP";
        let str = this.$i18n.t("Are you sure you want to join this group?");
        this.profile = str;
      } else {
        if (isClassLeader && item.classroomClassMemberInfoList.length != 1) {
          //班长重新授权
          this.showTransfer = true;
        } else if (
          isClassLeader &&
          item.classroomClassMemberInfoList.length === 1
        ) {
          this.showDialog = true;
          this.title = "CLOSE GROUP";
          let str = this.$i18n.t(
            "Once the group is closed, other students can't join your group, and you can't book group class. Sure to close the group?"
          );
          this.profile = str;
        } else {
          this.showDialog = true;
          //学生退出
          this.title = "Exit from group";
          let str = this.$i18n.t(
            "Once you exit from the group, you can't take group class with your classmates. Sure to exit?"
          );
          this.profile = str;
        }
      }
    },
    //加入小班
    joinGroup() {
      if (this.joinedFlag) {
        this.joinedFlag = false;
        let { id } = this.activeClassInfo;
        this.$api.grouppurchase
          .newStudentJoinClass({
            classId: id,
            userId: this.studentId
          })
          .then(res => {
            if (res.data.code === 200) {
              this.$message({
                message: this.$i18n.t("Join in success")
              });
              this.dataInfo();
            } else if (res.data.code === 20002) {
              this.$message({
                message: this.$i18n.t("Users have joined the class")
              });
            }
            this.sureLoading = false;
            this.showDialog = false;
          });
      }
    },
    //退出小班
    exitGroup() {
      let { id } = this.activeClassInfo;
      this.$api.grouppurchase
        .studentSignoutClass(id, this.studentId)
        .then(res => {
          if (res.data.code === 200) {
            this.dataInfo();
            this.studentIsInClass = false;
            this.$message({
              message: this.$i18n.t("Exit successfully")
            });
          }
          this.sureLoading = false;
          this.showDialog = false;
        });
    },
    //关闭小班
    closeGroup() {
      // console.log(this.classroomClassInfo.id, this.studentId);
      this.$api.grouppurchase
        .studentSignoutClass(this.classroomClassInfo.id, this.studentId)
        .then(res => {
          // console.log(res, "关闭小班");
          if (res.data.code === 200) {
            this.dataInfo();
            this.studentIsInClass = false;
            this.$message({
              message: this.$i18n.t("Close successfully"),
              center: true
            });
          }
          this.sureLoading = false;
          this.showDialog = false;
        });
    },
    sureSubmitResult() {
      this.sureLoading = true;
      if (this.title === "JOIN GROUP") {
        //加入小班
        // if (this.allCount <= 0) {
        //   this.$message({
        //     message: this.$i18n.t(
        //       "Insufficient class balance, please go to recharge"
        //     )
        //   });
        //   return;
        // }
        this.joinGroup();
      } else if (this.title === "CLOSE GROUP") {
        //关闭小班
        this.closeGroup();
      } else if (this.title === "Exit from group") {
        //退出小班
        this.exitGroup();
      }
    },
    closeGroupDialog() {
      this.showDialog = false;
    },
    showButton(item) {
      if (item.classroomClassMemberInfoList != null) {
        let flag = item.classroomClassMemberInfoList.find(
          ite => ite.studentUserId == this.studentId
        );
        if (flag) {
          return true;
        } else {
          return false;
        }
      }
    },
    closeTransfer() {
      this.showTransfer = false;
    }
  },
  components: {
    GroupClass,
    GroupDialog,
    TransferToOther
  }
};
</script>

<style scoped lang="stylus">
.btn {
  position: absolute;
  right: 30px;
  bottom: 30px;
}

.border {
  border: 2px solid rgba(52, 54, 77, 1);
}

.changeLeader {
  width: 200px;
}

.seeMoreWrapper {
  width: 150px;
  height: 30px;
  margin: 10px auto;
}

.seeMore {
  background-color: rgba(255, 255, 255, 1);
  border-radius: 8px;
  border: 2px solid rgba(215, 143, 37, 1);
  color: #D78F25;
  cursor: pointer;
}
</style>
