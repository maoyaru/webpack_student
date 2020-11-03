<template>
  <el-dialog :title="$t('Add Student')" :visible.sync="isOpen" width="400px" @close="close" :show-close="false" :center="true" class="add-student" :destroy-on-close="true" append-to-body :close-on-click-modal="canClose">
    <!-- 3.6 取消账号合并
    <div class="change-tabs clearfix" v-show="type==2">
      <div :class="tabType==1?'active tab':'tab'" @click="tabType=1">{{$t('NEW STUDENT')}}</div>
      <div :class="tabType==2?'active tab':'tab'" @click="tabType=2">{{$t('EXISTING ACCOUNT')}}</div>
    </div>
    -->
    <el-form ref="studentForm" :model="student" :rules="rules" label-width="90px" v-show="tabType==1">
      <el-form-item class="avatar-warpper">
        <i class="lg-icon icon-avatar icon-avatar-img">
          <img v-show="student.avatar" :src="student.avatar" />
        </i>
        <i class="lg-icon icon-avatar icon-avatar-upload" @click="toggleIsShowUpload">
          <!-- <Upload @select-file-event="getFiles"></Upload> -->

          <div class="el-form-item__error" v-show="avatorError">please upload the file</div>
        </i>
      </el-form-item>
      <el-form-item prop="realName" :label="$t('Name')">
        <el-input style="width:250px" v-model="student.realName" :placeholder="$t('Pls enter student’s name')">
        </el-input>
      </el-form-item>
      <el-form-item prop="gender" :label="$t('Gender')">
        <Gender :gender="student.gender" @change="changeGender"></Gender>
        <!--<el-radio-group v-model="student.gender">
          <el-radio label="boy">BOY</el-radio>
          <el-radio label="gril">GRIL</el-radio>
        </el-radio-group>-->
      </el-form-item>
      <el-form-item prop="birthday" :label="$t('Age')">
        <el-date-picker :default-value="valueDefaultShow" style="width:250px" type="date" :picker-options="pickerOptions" :placeholder="$t('Pls choose sudent’s birthday')" v-model="student.birthday"></el-date-picker>
      </el-form-item>
      <span class="dialog-footer">
        <!-- <el-button @click="close()">取 消</el-button> -->
        <el-button class="wp100 mb30 mt30" type="primary" @click="addNewChild('studentForm')" :loading="loading">
          {{$t('ADD STUDENT')}}</el-button>
      </span>
    </el-form>
    <el-form ref="studentForm2" :model="linkAccount" :rules="rulesLinkAccount" label-width="100px" v-show="tabType==2">
      <el-form-item prop="identify" :label="$t('Account')">
        <el-input style="width:248px" v-model="linkAccount.identify" :placeholder="$t('Enter existing account')">
        </el-input>
      </el-form-item>
      <el-form-item prop="password" :label="$t('Password')">
        <el-input type="password" style="width:248px" v-model="linkAccount.password" :placeholder="$t('Pls enter student’s password')"></el-input>
      </el-form-item>
      <span class="dialog-footer">
        <!-- <el-button @click="close()">取 消</el-button> -->
        <el-button class="wp100 mb30 mt30" type="primary" @click="addLinkAccount('studentForm2')" :loading="loading2">
          {{$t('ADD STUDENT')}}</el-button>
      </span>
    </el-form>
    <Upload 
      v-model="isShowUpload"
      @crop-success="getFiles"
    ></Upload>
  </el-dialog>
</template>
<script>
import Gender from "./Gender";
// import Upload from "@/components/plugin/Upload";
import Upload from "@/components/plugin/Upload2";
import MD5 from "crypto-js/md5";
import data2blob from '../../utils/data2blob.js';
import {
  saveCurrentChild,
  upgradeChildInfo,
  saveToLocal
} from "@/common/js/store";
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    Gender,
    Upload
  },
  data() {
    return {
      valueDefaultShow: new Date('2010-01-01'),
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        }
      },
      tabType: 1,
      isOpen: this.open,
      avatorError: false,
      student: {
        avatar: "",
        birthday: "",
        gender: 1,
        realName: "",
        parentUserId: 0
        // userId: 0
      },
      linkAccount: {
        identify: "",
        password: ""
      },
      rulesLinkAccount: {
        identify: [{
          required: true,
          message: this.$t("please fill the account"),
          trigger: "blur"
        }],
        password: [{
          required: true,
          message: this.$t("please fill the password"),
          trigger: "blur"
        }]
      },
      rules: {
        birthday: [{
          required: true,
          message: this.$t("please fill the birthday"),
          trigger: "blur"
        }],
        gender: [{
          required: true,
          message: this.$t("please fill the gender"),
          trigger: "blur"
        }],
        realName: [{
          required: true,
          message: this.$t("please fill the realName"),
          trigger: "blur"
        }]
      },
      loading: false,
      loading2: false,
      isShowUpload: false
    };
  },
  props: {
    open: {
      default: false,
      type: Boolean
    },
    type: {
      default: 1,
      type: Number
    },
    canClose: {
      default: true,
      type: Boolean
    }
  },
  computed: {
    ...mapGetters({
      parentInfo: "user/getParentInfo",
      currentStudent: "student/getCurrentStudent"
    })
  },
  watch: {
    open(o) {
      this.isOpen = o;
    }
  },
  methods: {
    ...mapActions({
      getChildren: "student/getChildren",
      getParentInfoAction: "user/getParentInfoAction"
    }),
    toggleIsShowUpload() {
      this.isShowUpload = true
    },
    close() {
      this.$emit("close");
      this.$refs["studentForm"].resetFields();
    },
    /**
     * @Author   Yaodongxin
     * @DateTime 2019-12-06
     * @method   addNewChild [添加一个新的学生]
     */
    addNewChild(formName) {
      if (this.student.realName.trim().length == 0) {
        this.$message({
          message: this.$i18n.t("Child name cannot be blank")
        });
        this.student.realName = this.student.realName.trim();
        return;
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          let info = { ...this.student };
          info.birthday = info.birthday.toISOString();
          info.parentUserId = this.parentInfo.id;
          let infoStorageRealName = ''
          const currentStudentInfo = JSON.parse(window.localStorage.getItem("__lgzy__s__")).currentStudentInfo
          if (currentStudentInfo && currentStudentInfo.studentInfo) {
            infoStorageRealName = currentStudentInfo.studentInfo.realName
          }
          //如果当前孩子的realname存在，则添加孩子，否则应该更新当前孩子信息
          if (this.currentStudent.realName || infoStorageRealName) {
            this.$api.supplementuser.addStudentInfo(info).then(res => {
              this.loading = false;
              if (res.data.code == 200) {
                this.$message({
                  message: "Congratulations on the addition！"
                });
                this.$refs["studentForm"].resetFields();
                this.student.avatar = ""; //手动清除头像
                this.$emit("close", info);
                this.getChildren({
                  parentId: this.parentInfo.id,
                  isAdd: 1
                }).then(data => {
                  if (data.code === 200) {
                    let pathname = window.location.pathname;
                    window.location.href = `${pathname}questionnaire.html?uid=${this.$store.state.user.user.userParentInfo.id}&id=${this.$store.state.student.currentStudent.id}&from=pc`;
                  }
                  this.loading = false;
                }, data => {
                  console.error('添加孩子失败');
                  this.loading = false;
                });
              } else {
                console.error("error");
              }
            }, res => {
              this.loading = false;
            });
          } else {
            this.$api.supplementuser.upgradeChildInfo({
              ...info,
              userId: this.$store.state.student.currentStudent.id
            }).then(res => {
              this.loading = false;
              if (res.data.code == 200) {
                this.$message({
                  message: "Congratulations on the addition！"
                });
                this.$refs["studentForm"].resetFields();
                this.student.avatar = ""; //手动清除头像
                this.$emit("close", info);
                console.log("add");
                this.getChildren({
                  parentId: this.parentInfo.id,
                  isAdd: 1
                }).then(data => {
                  if (data.code === 200) {
                    let pathname = window.location.pathname;
                    window.location.href = `${pathname}questionnaire.html?uid=${this.$store.state.user.user.userParentInfo.id}&id=${this.$store.state.student.currentStudent.id}&from=pc`;
                  }
                });
              }
            }, res => {
              this.loading = false;
            });
          }
        } else {
          return false;
        }
      });
    },
    addLinkAccount(formName) {
      let self = this;
      self.loading2 = true;
      self.$refs[formName].validate(valid => {
        if (valid) {
          let info = {
            identify: self.linkAccount.identify,
            password: MD5(self.linkAccount.password).toString(),
            plainPassword: self.linkAccount.password
          };
          self.$api.supplementuser.linkAccountAjax(info).then(({ status, data }) => {
            self.loading2 = false;
            if (status == 200) {
              if (data.code == 200) {
                self.$message({
                  message: "Successfully associated account"
                });
                self.jumpToHome();
              } else {
                self.$message({
                  message: "Failed to associate account"
                });
              }
            }
          }, res => {
            self.loading2 = false;
          });
        } else {
          return false;
        }
      });
    },
    jumpToHome() {
      let self = this;
      // 后期需要优化
      setTimeout(() => {
        if (self.$route.path == "/home") {
          window.location.reload();
        } else {
          self.$route.path == "/home";
        }
      }, 1000);
    },
    changeGender(g) {
      this.student.gender = g;
    },
    getFiles(files) {
      this.isShowUpload = false;
      
      var formdata = new FormData();
      formdata.append("category", "avator");
      formdata.append("file", data2blob(files));
      this.$api.upload.uploadFile(formdata).then(({ status, data }) => {
        if (status == 200) {
          if (data.code == 200) {
            this.student.avatar = data.data;
            this.$message({
              message: "Upload success"
            });
            this.avatorError = false;
          } else {
            this.$message({
              message: "Upload failure"
            });
          }
        }
      });
    }
  }
};

</script>
<style lang='stylus' scoped>
.add-student {
  .change-tabs {
    margin: -20px 0 20px;

    .tab {
      width: 168px;
      height: 44px;
      line-height: 44px;
      text-align: center;
      background: #fff;
      border: 1px solid #6E70A0;
      color: #34364D;
      font-family: Rubik Medium;
      float: left;
      cursor: pointer;
    }

    .active {
      background: #6E70A0;
      color: #fff;
    }

    .tab:nth-child(1) {
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
    }

    .tab:nth-child(2) {
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
    }
  }

  .icon-avatar {
    width: 80px;
    height: 80px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .icon-avatar-img {
    background: url('../../assets/theme-default/images/common/icon_add_touxiang@2x.png') no-repeat 0 0 / cover;
  }

  .icon-avatar-upload {
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -40px;
  }

  .avatar-warpper {
    margin-right: 80px;
    text-align: center;
  }
}

</style>
