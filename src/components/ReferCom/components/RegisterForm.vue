<template>
  <div class="container">
    <!-- <div class="title">恭喜您已获得</div> -->
    <!-- <div class="desc">价值<span class="light">30$</span>试听课礼包</div> -->

    <!-- <slot name="top-icons"></slot> -->
    
    <div class="tabs">
      <div class="tab-left tab-right" :class="{ 'active': isPhoneRe }" @click="choiceReMethod('phone')" v-text="getShowDesc('Phone Re')"></div>
<!--       <div class="tab-right" :class="{ 'active': isEmailRe }" @click="choiceReMethod('email')" v-text="getShowDesc('Email Re')"></div> -->
    </div>
   

    <!-- 使用手机号注册表单 -->
    <el-form ref="loginPhoneForm" :rules="rulesPhone" :model="form" v-show="isPhoneRe">
      <el-form-item prop="identify">
        <el-input :placeholder="getShowDesc('Phone Input')" v-model="form.identify" class="input-with-select">
          <el-select v-model="areaCode" slot="prepend" placeholder="请选择" @change="changeArea">
            <el-option-group
              v-for="(group, key) in countryList"
              :key="key"
              :label="key">
              <el-option
                v-for="item in group"
                :key="item.en"
                :label="'+' + item.tel"
                :value="'+' + item.tel">
                <span style="margin-right: 20px; font-size: 12px;">{{item.name}}</span>
                <span style="font-size: 12px;">+{{item.tel}}</span>
              </el-option>
            </el-option-group>
          </el-select>
        </el-input>
      </el-form-item>
      <!-- 
      <el-form-item prop="email">
        <el-input :placeholder="getShowDesc('Email Input')" v-model="form.email"></el-input>
      </el-form-item>
      -->
      <el-form-item prop="password" class="password">
        <el-input :placeholder="getShowDesc('Password Input')" :type="isText ? 'text': 'password'" v-model="form.password"></el-input>
        <div class="eye" :class="{'eye-active': isText}" @click="changeEye"></div>
      </el-form-item>
      <el-button class="btn" @click="registerPhoneForm" v-text="getShowDesc('Now Re')"></el-button>
    </el-form>

    <!-- <slot name="bottom-icons"></slot> -->
    <!-- 使用邮箱注册表单 -->
    
    <el-form ref="loginEmailForm" :rules="rulesEmail" :model="emailForm" v-show="isEmailRe">
      <el-form-item prop="identify">
        <el-input :placeholder="getShowDesc('Email Input')" v-model="emailForm.identify">
        </el-input>
      </el-form-item>
      <el-form-item prop="password" class="password">
        <el-input :placeholder="getShowDesc('Password Input')" :type="isText ? 'text': 'password'" v-model="emailForm.password"></el-input>
        <div class="eye" :class="{ 'eye-active': isText }" @click="changeEye"></div>
      </el-form-item>
      <el-button class="btn" @click="registerEmailForm" v-text="getShowDesc('Now Re')"></el-button>
    </el-form>

    <div class="login" v-if="isIndonesia" v-text="getShowDesc('Login') + ' >>'" @click="goLogin"></div>
  </div>
</template>

<script>
import { formatterCountryList } from '@/utils/formatCountry'
import orignCountryList from '@/utils/countryList'
import { urlParse } from "@/common/js/util"
import { mapActions } from 'vuex'
import allDesc from '../js/lang'
export default {
  data () {
    const regPhone = /^[0-9\-\+]{4,30}$/
    const regEmail = /^[A-Za-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
    const checkIdentify = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.getShowDesc('Phone Input')))
      } else {
        if (!regPhone.test(value)) {
          callback(new Error(this.getShowDesc('Phone Error')))
        } else {
          callback()
        }
      }
    }
    const checkEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.getShowDesc('Email Input')))
      } else {
        if (!regEmail.test(value)) {
          callback(new Error(this.getShowDesc('Email Error')))
        } else {
          callback()
        }
      }
    }
    const checkPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.getShowDesc('Password Input')))
      } else {
        callback()
      }
    }
    return {
      areaCode: '',
      phone: '',
      password: '',
      countryList: [],
      isSuccess: false,
      isEmailRe: false,
      isPhoneRe: true,
      isText: false,
      isIndonesia: false,
      form: {
        identify: '',
        password: '',
        // email: '',
        role: this.ApiConstants.userRoleStudent,
        verifyCode: '',
        verifyToken: '',
      },
      emailForm: {
        identify: '',
        password: '',
        role: this.ApiConstants.userRoleStudent,
        verifyCode: '',
        verifyToken: '',
      },
      rulesEmail: {
        identify: [
          { validator: checkEmail, trigger: 'blur'}
        ],
        password: [
          { validator: checkPassword, trigger: 'blur'}
        ]
      },
      rulesPhone: {
        identify: [
          { validator: checkIdentify, trigger: 'blur'}
        ],
        // email: [
        //   { validator: checkEmail, trigger: 'blur'}
        // ],
        password: [
          { validator: checkPassword, trigger: 'blur'}
        ]
      },
    }
  },
  props: ['isPc'],
  created() {
    this.countryList = formatterCountryList()
    this.getLocation()
  },
  watch: {
    isSuccess: function(_nval) {
      this.$emit('setShowSucc', _nval)
    }
  },
  methods: {
    ...mapActions({
      registerAction: "user/registerAction"
    }),
    goLogin() {
      window.open(window.location.origin + '/login.html')
    },
    changeArea(data) {
      this.$refs['loginPhoneForm'].resetFields()
      this.areaCode = data
      this.isIndonesia = this.areaCode === '+62'
      this.$emit('setIndonesia', this.isIndonesia)
    },
    async getLocation() {
      const result = await this.$api.finance.getLocation()
      if (result.data.code === 200 && result.data.data) {
        const target = orignCountryList.list.filter(item => {
          return item.en.toLowerCase() === result.data.data.toLowerCase()
        })
        this.areaCode = target[0] && '+' + target[0].tel || ''
        if (target[0].tel === '62') {
          this.isIndonesia = true
          this.$emit('setIndonesia', this.isIndonesia)
        }
      }
    },
    choiceReMethod(type) {
      if (type === 'phone') {
        this.isEmailRe = false
        this.isPhoneRe = true
      } else {
        this.isEmailRe = true
        this.isPhoneRe = false
      }
    },
    getShowDesc(key) {
      const temp = this.isIndonesia 
        ? allDesc['indonesia'][key]
        : allDesc['zh'][key]
      return temp
    },
    changeEye() {
      this.isText = !this.isText
    },
    getParams(user) {
      const querys = urlParse()
      if (querys && querys['referrerId']) {
        user.referrerId = decodeURIComponent(querys['referrerId'])
      }
      if (querys && querys['code']) {
        user.code = querys['code']
      }
      if (querys && querys['channel']) {
        user.channel = querys['channel']
      }
      if (querys && querys['activityCode']) {
        user.activityCode = querys['activityCode']
      }
      if (querys && querys['from']) {
        user.from = querys['from']
      }
      return user
    },
    registerPhoneForm() {
      if (!this.areaCode) {
        this.$message('请选择区号')
        return
      }
      this.$refs["loginPhoneForm"].validate(valid => {
        if (valid) {
          let user = Object.assign({}, this.form)
          user.identify = this.areaCode + this.form.identify
          user = this.getParams(user)
          this.registerAction({ user, self: this })
        } else {
          return false
        }
      })
    },
    registerEmailForm() {
      this.$refs["loginEmailForm"].validate(valid => {
        if (valid) {
          let user = Object.assign({}, this.emailForm)
          user.identify = this.emailForm.identify
          user.password = this.form.password
          user = this.getParams(user)
          this.registerAction({ user, self: this })
        } else {
          return false
        }
      })
    }
  },
}
</script>

<style lang="stylus">
fontSty() {
  text-align: center;
  color: #333333;
}
.container {
  padding: 20px;
  border-radius: 10px;
  .title {
    font-size: 24px;
    fontSty()
  }
  .desc {
    margin: 12px 0;
    font-size: 12px;
    fontSty()
    .light {
      font-size: 18px;
      color: #ff414b;
    }
  }
  .tabs {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    cursor: pointer;
    .tab-left, .tab-right {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      width: 150px;
      color: #666666;
      font-size: 12px;
      border: 1px solid #e0e0e0;
    }
    .tab-left {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    .tab-right {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      border-left: none;
    }
    .active {
      background: #fc624b;
      color: #ffffff;
      border-color: #fc624b;
    }
  }
  .password {
    position: relative;
    .el-input__inner {
      padding-right: 30px;
    }
    .eye {
      position: absolute;
      width: 20px;
      height: 20px;
      right: 5px;
      top: 10px;
      background-image: url('~@/assets/theme-default/images/login/close@2x.png');
      background-size: contain;
      backgorund-position: center;

      &.eye-active {
        background-image: url('~@/assets/theme-default/images/login/open@2x.png');
      }
    }
  }
  .btn {
    width: 100%;
    box-shadow: 0px 3px 17px 0px rgba(168, 0, 0, 0.28);
    border: none;
    cursor: pointer;
    color: #fff;
    background: linear-gradient(180deg, rgba(253, 141, 53, 1), rgba(255, 75, 77, 1));
    text-shadow: 0px 1px 1px rgba(190, 72, 0, 0.75);
  }

  .login {
    margin-top: 20px;
    font-size: 12px;
    color: #fc624b;
    text-align: center;
    cursor: pointer;
  }
}
.input-with-select {
  & .el-input-group__prepend {
    width: 50px;
  }
}
</style>
