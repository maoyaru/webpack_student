<template>
  <div class="login-form-warpper">
    <div class="title">
      {{$t('Sign Up')}}
      <!-- 印尼展示 -->
      <template v-if="isIndonesia">(Terdaftar)</template>
    </div>
    <el-form ref="loginForm" :model="form" :rules="rules" class="login-form" @submit.native.prevent>
      <el-form-item prop="identify">
        <el-input v-model="form.identify" type="text" :placeholder="$t('Mobile / Email')"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password" class="passworld">
        <el-input
          v-model="form.password"
          :type="isText?'text':'password'"
          :placeholder="$t('Password')"
        ></el-input>
        <i class="showpass" @click="isText=!isText" :class="{'active':isText}"></i>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="register()">{{$t('Sign Up')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import MD5 from "crypto-js/md5";
import { strlen } from "@/common/js/util.js";
import { mapActions } from "vuex";
import { urlParse } from "@/common/js/util";
export default {
  data() {
    //这里存放数据
    let regPhone = /^[0-9\-\+]{4,20}$/;
    let regMail = /^[A-Za-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
    let identifyPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(
          this.$t("Mobile/Email is required")
        ));
      } else if (!regMail.test(value) && !regPhone.test(value)) {
        if(/[a-zA-Z]/.test(value)) {
          return callback(new Error(
            this.$t("Pls enter a valid email")
          ));
        }else if (value.indexOf("@") > -1) {
          return callback(new Error(
            this.$t("Pls enter a valid email")
          ));
        } else {
          return callback(
            new Error(
              this.$t(
                "Pls enter a valid phone number with international area code in front, e.g. +6586183670"
              )
            )
          );
        }
      } else if (strlen(value) > 30) {
        return callback(
          new Error(
            this.$t("Mobile / email must be less than 20 characters")
          )
        );
      } else {
        callback();
      }
    };
    let regPassword = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,12}$/;
    let passwordPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(
          this.$t("Password is required")
        ));
      } else if (!regPassword.test(value)) {
        return callback(new Error("必须"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      form: {
        identify: "",
        password: "",
        role: this.ApiConstants.userRoleStudent,
        verifyCode: "",
        verifyToken: ""
      },
      rules: {
        identify: [
          { validator: identifyPass, required: true, trigger: "blur" }
        ],
        password: [
          {
            required: true,
            message: this.$t("Password is required"),
            trigger: "blur"
          }
        ]
      },
      isText: false,
      isIndonesia: this.currentLocation === 'Indonesia',
    };
  },
  props: ['currentLocation'],
  //方法集合
  // const _phoneExpr = r'^\s*\+?\s*(\(\s*\d+\s*\)|\d+)(\s*-?\s*(\(\s*\d+\s*\)|\s*\d+\s*))*\s*$';
  // const _emailExpr = r'^.+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$';
  methods: {
    ...mapActions({
      registerAction: "user/registerAction"
    }),
    register() {
      this.loading = true;
      this.$refs["loginForm"].validate(valid => {
        if (valid) {
          let user = Object.assign({}, this.form);
          user.password = this.form.password;
          user.role = this.ApiConstants.userRoleStudent;
          // 取地址参数
          let querys = urlParse();
          if (querys && querys["referrerId"]) {
            user.referrerId = decodeURIComponent(querys["referrerId"]);
          }
          if (querys && querys["code"]) {
            user.code = querys["code"];
          }
          if (querys && querys["from"]) {
            user.from = querys["from"];
          }
          this.registerAction({ user, self: this }).then(() => {
            this.loading = false;
          }, () => {
            this.loading = false;
          });
        } else {
          return false;
        }
      });
    },
    codeToMD5(passwordWord) {
      var password = passwordWord;
      var passwordMD5 = MD5(password).toString();
      return passwordMD5;
    }
  }
};
</script>
<style lang='stylus'>
.login-form {
  .el-button {
    width: 100%;
  }

  .passworld {
    position: relative;
    margin: 32px 0;

    .showpass {
      position: absolute;
      right: 10px;
      top: 50%;
      width: 20px;
      height: 20px;
      background-image: url('../../../assets/theme-default/images/login/close@2x.png');
      background-size: 20px 20px;
      transform: translateY(-50%);

      &.active {
        background-image: url('../../../assets/theme-default/images/login/open@2x.png');
      }
    }
  }
}
</style>