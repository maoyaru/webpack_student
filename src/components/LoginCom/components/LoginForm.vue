<template>
  <div class="login-form-warpper">
    <div class="title">
      {{$t('Login')}}
      <!-- 印尼展示 -->
      <template v-if="isIndonesia">(Gabung)</template>
    </div>
    <el-form ref="loginForm" :model="form" :rules="rules" class="login-form" @submit.native.prevent>
      <el-form-item prop="identify">
        <el-input v-model="form.identify" type="text" :placeholder="$t('Mobile / Email')"
        ></el-input>
      </el-form-item>
      <el-form-item prop="plainPassword" class="passworld">
        <el-input
          v-model="form.plainPassword"
          :type="isText?'text':'password'"
          :placeholder="$t('Password')"
        ></el-input>
        <i class="showpass" @click="isText=!isText" :class="{'active':isText}"></i>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login()" :loading="loading">{{$t('Login')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import MD5 from "crypto-js/md5";
import { mapActions } from "vuex";
import { urlParse } from '@/common/js/util'
export default {
  data() {
    return {
      loading: false,
      isIndonesia: this.currentLocation === 'Indonesia',
      form: {
        identify: "",
        password: "",
        plainPassword: "",
        role: ""
      },
      rules: {
        identify: [
          {
            required: true,
            message: this.$t("Mobile/Email is required"),
            // message: '11111',
            trigger: "blur"
          }
        ],
        plainPassword: [
          {
            required: true,
            message:  this.$t("Password is required"),
            trigger: "blur"
          }
        ]
      },
      isText: false
    };
  },
  props: ['currentLocation'],
  methods: {
    ...mapActions({
      loginAction: "user/loginAction",
      logoutAction: 'user/logoutAction',
    }),
    login() {
      this.loading = true;
      this.$refs["loginForm"].validate(valid => {
        if (valid) {
          let _regObj = Object.assign({}, this.form);
          _regObj.password = this.codeToMD5(this.form.plainPassword);
          _regObj.role = this.ApiConstants.userRoleStudent;
          let user = {
            identify: _regObj.identify,
            password: _regObj.password,
            plainPassword: this.form.plainPassword,
            role: _regObj.role
          };
          this.loginAction({ user, self: this, callback: () => {
              // 如果页面从H5落地页跳转而来，登录成功后返回至H5
              const querys = urlParse();
              if (querys && querys.isFromLand == '1') {
                const landPageHost = decodeURIComponent(querys.landPageHost)
                window.location.replace(`${landPageHost}?groupId=${querys.groupId}`)
              }
            }
          }).then(() => {
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
    },
  },
  created () {
    const querys = urlParse();
    if (querys && querys.isFromLand == '1') {
      this.logoutAction(() => {});
    }
  },
};
</script>