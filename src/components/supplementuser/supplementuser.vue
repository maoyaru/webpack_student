<template>
  <div class="supplementuser">
    <el-card class="lg-container" :body-style="{'padding':'30px'}">
      <h1 class="lg-title">
        {{$t('Profile')}}
        <span class="save" @click="save()">{{$t('Save')}}</span>
      </h1>
      <el-form ref="form" :model="form" label-position="left" label-width="80px">
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item :label="$t('Email')">
              <el-input v-model="form.email" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Region')">
              <el-input v-model="form.countryOfResidence"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item :label="$t('Phone')">
              <el-input v-model="form.phone" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item :label="$t('WhatsApp')">
              <el-input v-model="form.whatsapp"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('WeChat')">
              <el-input v-model="form.wechat"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 暂时没有功能 -->
    <div class="lg-container lg-container2 mt20 clearfix" v-show="false">
      <a class="lg-icon el-icon-facebook" href>{{$t("LINK TO FACEBOOK")}}</a>
      <a class="lg-icon el-icon-google" href>{{$t('LINK TO GOOGLE')}}</a>
    </div>
    <div class="student lg-container">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card :body-style="{'padding':0,'height':'280px'}">
            <div v-for="(item,key) in list" :key="key" class="text item" :class="{'active':key == sindex, 'is-hide': isHideSetRefer && key === 1}"
              @click="sindex=key">{{$t(item)}}</div>
          </el-card>
        </el-col>
        <el-col :span="18">
          <div class="ydx-card" v-show="sindex == 0">
            <!-- 家庭学生信息列表 start -->
            <div class="student-profile shadow" v-for="(st, index) in childrenList" :key="index">
              <!-- <div class="editBtn" @click="editEvent(index)" v-if="!st.edit">{{$t('Edit')}}</div> -->
              <div class="editBtn" @click="sureEdit(index)" v-if="st.edit">{{$t('Save')}}</div>
              <el-avatar class="c-student" :size="144" :src="st.avatar" @click.native="toggleUpload(index)">
                <div class="el-avatar-img"></div>
              </el-avatar>


              <el-form ref="st" :model="st" label-position="left" label-width="120px">
                <el-form-item :label="$t('Student Name')">
                  <el-input v-model="st.realName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item :label="$t('Gender')">
                  <Gender @change="changeGender($event, index)" :gender="st.gender"></Gender>
                </el-form-item>
                <el-form-item :label="$t('Age')">
                  <!-- <span class="birthday">{{DateTimeUtils.scheduleTime(st.birthday)}}</span> -->
                  <el-date-picker style="width:260px" :disabled="!st.edit" type="date"
                    placeholder="Pls choose sudent’s birthday" v-model="st.birthday"></el-date-picker>
                </el-form-item>
              </el-form>
            </div>
            <!-- end -->
            <p class="tc">
              <el-button plain @click="showAddStudent = true"
                v-if="this.$store.state.user.user.userParentInfo.role == 1 && childrenList.length < 5">{{$t("ADD STUDENT")}}</el-button>
            </p>
          </div>
<!--           <el-card v-show="sindex == 1" class="upgrade-account" :body-style="{'padding':'40px 60px'}">
            <h3>{{$t('Instructions for upgrading account to Parent account')}}</h3>
            <p>*
              {{$t('The parent account is for families with multiple children studying with lingoAce. Parents with 1 child are not required to upgrade the account.')}}
            </p>
            <p>*
              {{$t('More than one student can be added to the parent account, and the points of parents can be used to allocate to all student.')}}
            </p>
            <p>*
              {{$t("You can toggle between different student accounts by clicking on student's avatar on the home page to use the different function such as class schedule, attend class, and homework submission for different student account.")}}
            </p>
            <p>*
              {{$t("After upgrading to a parent account, the original account information, class data, learning data and appointment records will not be affected.")}}
            </p>
            <p>*
              {{$t("Once upgraded to a parent account, you will not be able to revert back to the student account.")}}
            </p>
            <p class="btn">
              <span
                v-if="this.$store.state.user.user.userParentInfo.role == 1">{{$t("You have upgraded to parent account")}}</span>
              <el-button @click="upgradeParent" v-if="this.$store.state.user.user.userParentInfo.role == 2">
                {{$t("UPGRADE TO PARENT ACCOUNT")}}</el-button>
            </p>
          </el-card> -->
          <div v-show="sindex == 1" class="set-referrer shadow">
            <!-- <h1 class="lg-title f28">{{$t('bonus classes')}}</h1> -->
            <!-- <p class="f16">{{$t('SET-REFFER-TIPS')}}</p> -->
            <div class="referrer">
              <el-form v-if="!referrerDisable" :model="form" :rules="rules" ref="ruleForm" label-width="100px">
                <el-form-item :label="$t('Referrer')" prop="referrerUserIdentify">
                  <el-input :placeholder="$t('Referrer phone number or Email')" :disabled="referrerDisable"
                    v-model="form.referrerUserIdentify" style="width:400px">
                    <el-button :loading="setLoading" @click="changeReferrerUser" type="primary" slot="append"
                      v-if="!referrerDisable">{{$t('SET')}}</el-button>
                  </el-input>
                </el-form-item>
              </el-form>
              <div class="c-refer-setted f14" v-else>
                {{$t('Referrer')}} <span>{{referrerUserName || form.referrerUserIdentify}}</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <AddStudent :type="2" :info="{parentId: parentId}" :open="showAddStudent" @close="changeShowAddStudent">
    </AddStudent>
    <Upload 
      v-model="isShowUpload" 
      @crop-success="getFiles"
      :langType="localeLanguage"
    ></Upload>
  </div>
</template>

<script>
import Gender from "./../plugin/Gender";
import AddStudent from "./../plugin/AddStudent";
import TopBar from "@/components/index/components/Top";
import TopMenu from "@/components/index/components/TopMenu";
import ToUpTip from "@/components/index/components/ToUpTip";
// import Upload from "@/components/plugin/Upload";
import Upload from "@/components/plugin/Upload2";
import data2blob from '../../utils/data2blob.js';
import { mapActions, mapGetters } from "vuex";
export default {
  components: { Gender, AddStudent, TopBar, TopMenu, ToUpTip, Upload },
  created() {
    this.getParentInfo();
    this.getChildrenInfos();
  },
  data() {
    let self = this;
    return {
      showAddStudent: false,
      referrerDisable: true,
      setLoading: false,
      isHideSetRefer: false,
      form: {
        name: "",
        email: "",
        whatsapp: "",
        countryOfResidence: "",
        wechat: "",
        google: "",
        referrerUserIdentify: ""
      },
      childrenList: [],
      // list: ["Student profile", "Upgrade to parent account", "Set Referrer"],
      list: ["Student profile", "Set Referrer"],
      sindex: 0,
      rules: {
        referrerUserIdentify: {
          required: true,
          message: self.$t("required"),
          trigger: "blur"
        }
      },
      studentKey: -1,
      referrerUserName: "",
      isShowUpload: false,
      studentIndex: null,
    };
  },
  computed: {
    ...mapGetters({
      user: "user/getUserInfo",
      classIds: "student/getClassIds",
      currentStudent: "student/getCurrentStudent",
      isNewUser: "student/getIsNewUser"
    }),
    parentId() {
      return this.$store.state.user.user.userParentInfo.id;
    },
    userParentInfo() {
      return this.$store.state.user.user.userParentInfo;
    },
    localeLanguage() {
      return window.localStorage.getItem('localeLanguage');
    }
  },
  methods: {
    ...mapActions({
      logoutAction: "user/logoutAction",
      getParentInfoAction: "user/getParentInfoAction",
      putChildrenAction: "user/putChildrenAction"
    }),
    toggleUpload(index) {
      this.isShowUpload = true;
      this.studentIndex = index; 
    },
    getFiles(files) {
      this.isShowUpload = false;

      var formdata = new FormData();
      formdata.append("category", "avator");
      formdata.append("file", data2blob(files));
      this.$api.upload.uploadFile(formdata).then(({ status, data }) => {
        if (status == 200) {
          if (data.code == 200) {
            this.childrenList[this.studentIndex].avatar = data.data;
            this.$message({
              message: "Upload success"
            });
            this.$forceUpdate();
          } else {
            this.$message({
              message: "Upload failure"
            });
          }
        }
      });
    },
    selectMenu(path) {
      // if(!this.currentStudent.realName && path!='home') {
      //   // 打开添加孩子弹窗
      //   this.isOpen = true;
      // }else {
      this.$router.push(path);
      // }
    },
    editEvent(key) {
      this.studentKey = key;
      this.childrenList[this.studentKey].edit = true;
      this.$forceUpdate();
    },
    sureEdit(key) {
      this.studentKey = key;
      let st = this.childrenList[this.studentKey];
      if(typeof st.realName == 'string') {
        st.realName = st.realName.trim();
      }else {
        st.realName = '';
      }
      let params = {
        avatar: st.avatar,
        birthday: st.birthday.toISOString(),
        gender: st.gender,
        parentUserId: st.parentUserId,
        realName: st.realName,
        userId: st.id
      };
      if (!params.realName || !params.gender || !params.birthday) {
        this.$message({
          message: this.$t("please complete student's profile")
        });
        return false;
      }
      this.putChildrenAction(params);
      this.$forceUpdate();
      this.childrenList[this.studentKey].edit = false;
    },
    changeGender(g, k) {
      // if (this.studentKey > -1 && this.childrenList[k].edit) {
        this.childrenList[k].gender = g;
      // }
    },
    logout() {
      this.logoutAction(() => {
        // this.$router.push("/login");
        window.location.href = "/login.html";
      });
    },
    save() {
      this.$api.supplementuser
        .updataParentInfo({ ...this.form, id: this.userParentInfo.id })
        .then(res => {
          // console.log(res.message);
          this.$toaster(res.data.message, 1000);
        });
    },
    /**
     * @Author   Yaodongxin
     * @DateTime 2019-12-06
     * @method   getChildrenInfos 获取家庭学生信息列表
     */
    getChildrenInfos() {
      this.$api.supplementuser.getChildrenInfos(this.parentId).then(res => {
        if (res.data.code == 200) {
          this.childrenList = res.data.data;
          this.childrenList.forEach(item => {
            // item.edit = false;
            item.edit = true;//NOTE: 暂时放开
            item.birthday = new Date(item.birthday);
          });
        }
      });
    },
    /**
     * @Author   Yaodongxin
     * @DateTime 2019-12-06
     * @method   getParentInfo 获取家长用户信息
     */
    getParentInfo() {
      this.getParentInfoAction(this.parentId).then(
        data => {
          if (data) {
            this.form = {
              facebook: "", //暂时没有
              email: data.email,
              phone: data.phone,
              whatsapp: data.whatsapp,
              wechat: data.wechat,
              countryOfResidence: data.countryOfResidence,
              referrerUserIdentify: data.referrerUserIdentify,
              google: "" ////暂时没有
            };
            if (!data.referrerUserId) {
              this.referrerDisable = false;
              if (data.isPaied === 1) {
                this.isHideSetRefer = true
              }
            } else {
              this.referrerUserName = data.referrerUserName;
            }
          }
        },
        () => {
          // 失败
        }
      );
    },
    upgradeParent() {
      this.$api.supplementuser.upgradeParentAccount(this.parentId).then(res => {
        if (res.data.code == 200) {
          let localLang = '升级成功，请重新登录'
          if (this.$i18n && this.$i18n.locale == 'en') {
            localLang = 'Upgrade succeeded, please login again!!!'
          }
          this.$toaster(localLang, 1000);
          setTimeout(() => {
            this.logout();
          }, 800);
        } else {
        }
      });
    },
    /**
     * @Author   Yaodongxin
     * @DateTime 2019-12-06
     * @method   changeShowAddStudent 手动更新列表，添加一个child
     * @param    {object}   info 子组件返回的添加child信息
     */
    changeShowAddStudent(info) {
      this.showAddStudent = false;
      if (info) {
        this.childrenList.push(info);
      }
    },
    changeReferrerUser() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let identyfy = this.form.referrerUserIdentify;
          let params = {
            ...this.form,
            referrerUserIdentify: identyfy,
            id: this.userParentInfo.id
          };
          this.setLoading = true;
          this.$api.supplementuser.updataParentInfo(params).then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: this.$t('set referrer successfully')
              });
              // this.referrerUserName = res.data.data.referrerUserName;
              this.form.referrerUserIdentify = identyfy;
              this.referrerDisable = true;
            } else {
              this.referrerDisable = false;
            }
            this.setLoading = false;
          });
        }
      });
    }
  }
};
</script>
<style lang='stylus' scoped>
.lg-container2 {
  padding: 20px 0;
  margin: 0 auto;
  box-sizing: border-box;
}
.is-hide {
  display: none !important;
}
.c-refer-setted {
  color: #606266;
  span {
    display: inline-block;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    line-height: 40px;
    padding: 0 15px;
    margin-left: 10px;
    width: 280px;
    box-sizing: border-box;
    color: #999;
  }
}
.birthday {
  width: 100%;
  background-color: #F5F7FA;
  border-color: #E4E7ED;
  color: #C0C4CC;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  display: block;
  padding: 0 15px;
  box-sizing: border-box;
}
.tc {
  text-align: center;
  padding-top: 30px;
  background: #fff;
  position: relative;
  margin-top: -2px;
}
.supplementuser {
  padding-bottom: 80px;
  h1 {
    position: relative;
    .save {
      position: absolute;
      right: 0;
      top: 10px;
      font-size: 18px;
      font-family: Rubik-Regular, Rubik;
      font-weight: 400;
      color: rgba(86, 190, 205, 1);
      line-height: 22px;
      cursor: pointer;
    }
  }
  .el-icon-facebook, .el-icon-google {
    width: 49%;
    line-height: 72px;
    padding-left: 60px;
    box-sizing: border-box;
    border-radius: 5px;
    font-size: 18px;
    text-decoration: none;
    float: left;
  }
  .el-icon-facebook {
    color: #3D5A98;
    border: 1px solid #3D5A98;
    background: url('../../assets/theme-default/images/common/icon_facebook_xiao.png') no-repeat 20px 50%;
  }
  .el-icon-google {
    border: 1px solid #B2B2B2;
    background: url('../../assets/theme-default/images/common/icon_gmail_xiao.png') no-repeat 20px 50%, url('../../assets/theme-default/images/common/icon_link@2x.png') no-repeat 96% 50% / 25px 25px;
    margin-left: 2%;
    border: 1px solid #551a8b;
  }
  .student {
    margin-top: 30px;
    .item {
      height: 60px;
      background: rgba(255, 255, 255, 1);
      font-size: 18px;
      font-family: Rubik-Regular, Rubik;
      font-weight: 400;
      color: rgba(52, 54, 77, 1);
      line-height: 20px;
      display: flex;
      align-items: center;
      padding: 0 30px;
      cursor: pointer;
      &.active {
        font-size: 20px;
        color: rgba(86, 190, 205, 1);
        background: rgba(244, 244, 244, 1);
      }
    }
  }
  .ydx-card {
    padding-bottom: 30px;
    .ydx-upload {
      position: absolute;
      width: 144px;
      height: 144px;
      top: 38px;
      left: 30px;
      border-radius: 50%;
    }
  }
  .student-profile {
    display: flex;
    padding: 30px;
    border: 1px solid #f9f9f9;
    margin-bottom: 20px;
    border-radius: 6px;
    background: #fff;
    position: relative;
    .editBtn {
      position: absolute;
      right: 10px;
      top: 10px;
      color: #56becd;
      cursor: pointer;
    }
    .el-avatar {
      flex: 0 144px;
      margin-top: 10px;
      position: relative;
      cursor: pointer;
      transition: background 0.5s;
      overflow: hidden;
      .el-avatar-img {
        width: 144px;
        height: 144px;
        position: absolute;
        left: -144px;
        transition: left 0.5s;
        background: url('../../assets/theme-default/images/usercenter/icon_zhaoxiangji.png') no-repeat center center;
      }
    }
    .el-avatar:hover {
      background: #f4f4f4 !important;
      .el-avatar-img {
        display: block;
        left: 0;
      }
      >img {
        display: none;
      }
    }
    .lg-gender {
      padding-top: 10px;
    }
    form {
      flex: 1;
      padding-left: 60px;
      padding-right: 30px;
      .el-form-item {
        margin-bottom: 20px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  .upgrade-account {
    p {
      font-size: 16px;
      font-family: Rubik-Regular, Rubik;
      font-weight: 400;
      color: rgba(52, 54, 77, 1);
      line-height: 24px;
      &.zh {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(52, 54, 77, 1);
        line-height: 32px;
        margin-top: 15px;
      }
      &.btn {
        text-align: center;
        margin-top: 40px;
      }
    }
  }
  .set-referrer {
    width: 895px;
    height: 200px;
    // background-size: 100%;
    // background-repeat: no-repeat;
    // bg-image('../../assets/theme-default/images/usercenter/pic_tuijianren');
    position: relative;
    h1 {
      position: absolute;
      top: 110px;
      color: #fff;
      left: 416px;
    }
    p {
      position: absolute;
      color: #fff;
      top: 166px;
      right: 25px;
      width: 528px;
      font-size: 16px;
      line-height: 24px;
    }
    .referrer {
      box-sizing: border-box;
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 60px;
      padding: 0 120px;
      .el-input {
        width: 500px;
        button {
          width: 120px;
          height: 40px;
          color: #fff;
          background: rgba(110, 112, 160, 1);
          border-bottom-left-radius: 0;
          border-top-left-radius: 0;
        }
      }
      label {
        width: 100px;
        display: inline-block;
        font-size: 18px;
        font-family: Rubik-Regular, Rubik;
        font-weight: 400;
        color: rgba(52, 54, 77, 1);
      }
    }
  }
}
</style>