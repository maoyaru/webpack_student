<template>
  <span class="user-warpper">
    <el-dropdown :hide-on-click="false">
      <span class="userinfo">
        <span class="name">
          {{username}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
      </span>
      <el-dropdown-menu slot="dropdown" class="dropdown">
        <el-dropdown-item @click.native="jump">{{$t('Profile')}}</el-dropdown-item>
        <el-dropdown-item @click.native="jumpOrder">
          <div class="dropdown-order-box">
            <div>{{$t('My Order')}}</div>
            <div class="dropdown-order-ball" v-if="pendingOrderCount > 0"></div>
          </div>
        </el-dropdown-item>
        <el-dropdown-item @click.native="isOpen2=true">{{$t('Change Password')}}</el-dropdown-item>
        <el-dropdown-item @click.native="isOpen = true">{{$t('Sign Out')}}</el-dropdown-item>
      </el-dropdown-menu>
      <div class="order-tips-box" v-if="pendingOrderCount > 0">
        <div class="order-delta"></div>
        <!-- <div class="order-tips">You have {{pendingOrderCount}} pending order</div> -->
        <div class="order-tips" @click="goToOrderCenter">{{$t('You have')}} {{pendingOrderCount}} {{$t('Pending order')}}</div>
      </div>
    </el-dropdown>
    <el-dialog :title="$t('Sign Out')" :center="true" :show-close="false" :visible.sync="isOpen" width="400px" append-to-body class="m-alert-dialog-with-title">
      <div class="c-tips f18">{{$t('Confirm to sign out')}}</div>
      <div slot="footer">
        <el-button class="w160" @click="isOpen = false">{{$t('Cancel')}}</el-button>
        <el-button class="w160" @click="logout()" type="primary">{{$t('Confirm')}}</el-button>
      </div>
    </el-dialog>
    <!-- 修改密码弹窗start -->
    <el-dialog :title="$t('Change Password')" :visible.sync="isOpen2" width="400px" @close="close" :show-close="false" :center="true" :destroy-on-close="false" append-to-body>
      <div class="form-wrap">
        <el-form label-position="left" ref="passwordForm" :rules="rule" :model="form">
          <el-form-item label prop="oldPassword" class="mb30">
            <el-input v-model="form.oldPassword" :placeholder="$t('Enter old password')" type="password"></el-input>
          </el-form-item>
          <el-form-item label prop="newPassword" class="mb30">
            <el-input v-model="form.newPassword" :placeholder="$t('Set password')" type="password"></el-input>
          </el-form-item>
          <el-form-item label prop="checkPassword">
            <el-input v-model="form.checkPassword" :placeholder="$t('Enter password again')" type="password"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="w160" @click="close">{{$t('CANCEL')}}</el-button>
        <el-button class="w160" @click="changePassword" type="primary">{{$t('CONFIRM')}}</el-button>
      </span>
    </el-dialog>
  </span>
</template>
<script>
import { mapActions, mapGetters } from "vuex"
import MD5 from "crypto-js/md5"
import api from "@/api/index"
export default {
  data() {
    // 自定义验证规则
    var reg = /^[0-9A-Za-z]{6,12}$/;
    var validatePass = (rule, value, callback) => {
      if (!reg.test(value)) {
        callback(
          new Error(
            this.$t(
              "Must be 6-12 characters in length. Only letters, digits are allowed."
            )
          )
        );
      } else {
        if (
          this.form.checkPassword !== "" &&
          this.form.checkPassword == value
        ) {
          this.$refs.passwordForm.validateField("checkPassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (!reg.test(value)) {
        callback(
          new Error(
            this.$t(
              "Must be 6-12 characters in length. Only letters, digits are allowed."
            )
          )
        );
      } else if (value !== this.form.newPassword) {
        callback(new Error(this.$t("The two passwords are inconsistent!")));
      } else {
        callback();
      }
    };
    var validatePass3 = (rule, value, callback) => {
      if (!reg.test(value)) {
        callback(
          new Error(
            this.$t(
              "Must be 6-12 characters in length. Only letters, digits are allowed."
            )
          )
        );
      } else {
        callback();
      }
    };
    return {
      pendingOrderCount: 0,
      isOpen: false,
      isOpen2: false,
      form: {
        newPassword: "",
        checkPassword: "",
        oldPassword: ""
      },
      rule: {
        newPassword: { validator: validatePass, trigger: "blur" },
        checkPassword: { validator: validatePass2, trigger: "blur" },
        oldPassword: { validator: validatePass3, trigger: "blur" }
      }
    };
  },
  mounted() {
    this.getPendingOrderCount()
    this.$EventBus.$on("onRefreshPendingOrderCount", () => {
      setTimeout(() => {
        this.getPendingOrderCount()
      }, 2000)
    });
  },
  //监听属性 类似于data概念
  computed: {
    username: function() {
      let __user = this.$store.state.user.user.userParentInfo;
      if (__user) {
        return __user.username;
      } else {
        return "";
      }
    },
    ...mapGetters({
      user: "user/getUserInfo",
      parentInfo: 'user/getParentInfo'
    })
  },
  methods: {
    // 获取pending订单数量
    getPendingOrderCount() {
      api.order.getUserParentUndoNumber(this.parentInfo.id).then(res => {
        if (res.status === 200 && res.data.code === 200) {
          this.pendingOrderCount = res.data.data
        } else {
          this.$message(res.data.message)
        }
      })
    },
    goToOrderCenter() {
      this.getPendingOrderCount()
      this.$router.push('/order/orderCenter')
    },
    logout() {
      let self = this;
      let cal = () => {
        // this.$router.push("/login");
        window.location.href = "/login.html";
      }
      this.logoutAction(cal);
      this.isOpen = false;
    },
    close() {
      this.isOpen2 = false;
    },
    jump() {
      this.$router.push("/supplementuser");
    },
    jumpOrder() {
      this.$router.push("/order/orderCenter");
    },
    changePassword() {
      let self = this;
      this.$refs["passwordForm"].validate(valid => {
        if (valid) {
          self
            .changePasswordAction({
              role: this.user.userParentInfo.role,
              newPassword: MD5(this.form.newPassword).toString(),
              oldPassword: MD5(this.form.oldPassword).toString(),
              userId: this.user.userParentInfo.id
            })
            .then(
              () => {
                self.$message({
                  message: "Password changed successfully"
                });
                this.close();
                window.localStorage.setItem("__lgzy__s__", "");
                this.$router.push("/login");
              },
              () => {
                self.$message({
                  message: "Password changed successfully"
                });
              }
            );
        } else {
          return false;
        }
      });
    },
    ...mapActions({
      logoutAction: "user/logoutAction",
      changePasswordAction: "user/changePasswordAction"
    })
  }
};

</script>
<style scoped lang="stylus">
.user-warpper {
  position: relative;

  .order-tips-box {
    position: absolute;
    top: 40px;
    right: 0px;
    width: 204px;
    height: 51px;

    .order-delta {
      position: relative;
      width: 0;
      height: 0;
      margin-left: 150px;
      border-width: 0 13px 13px;
      border-style: solid;
      border-color: transparent transparent #EFA83E;
    }

    .order-tips {
      width: 204px;
      height: 38px;
      background: #EFA83E;
      border-radius: 19px;
      text-align: center;
      line-height: 40px;
      color: #fff;
    }
  }
}

.dropdown-order-box {
  position: relative;

  .dropdown-order-ball {
    position: absolute;
    top: 4px;
    right: -8px;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background: #EB532F;
  }
}

</style>
