<template>
  <div class="multiple-pay">
    <div class="m-top-bar shadow">
      <div class="c-logo"></div>
      <a class="m-logout" href="javascript:;" @click="isOpen=true">{{$t('Sign Out')}}</a>
      <div class="m-uname thidden">
        {{userInfo.username}}
      </div>
    </div>
    <div v-loading="confirmRecharge.loading || launching" element-loading-spinner="custom-loading">
      <div class="lg-pay billing" v-if="step == 1">
        <h1 class="lg-title tc">{{$t("Billing Information")}}</h1>
        <el-card :body-style="{'padding':'30px'}">
          <header class="tc" v-if="sgclassid === ''">
            <el-dropdown trigger="click" placement="bottom">
              <el-button type="primary" plain round>
                {{ Constants.langEn == lang ? confirmRecharge.currentCurrency.currencyEn : confirmRecharge.currentCurrency.currencyZh}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item,key) in currency" :key="key">
                  <div @click="unitChange(item)" class="currency-item">
                    <span class="currency-text">{{lang == Constants.langEn ? item.currencyEn : item.currencyZh}}</span>
                    <i class="payment-icon icon-card"></i>
                    <i class="payment-icon icon-wechat" v-if="item.currencyId === 1"></i>
                    <i class="payment-icon icon-alipay" v-if="item.currencyId === 1"></i>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </header>
          <ul v-if="getBill.rate">
            <li>
              <div class="lg-row">
                <label for>{{$t('Points')}}</label>
                <span>{{getBill.rechargeAmount}}</span>
              </div>
              <div class="lg-row">
                <label for v-if="isFromLand == '1'" class="flex220">
                  {{$t('Bonus points')}}
                  <div class="group-desc">{{$t('After successful Groupon')}}</div>
                </label>
                <label for v-else>
                  {{$t('Bonus points')}}
                </label>
                <span>{{getBill.incentiveAmount}}</span>
              </div>
            </li>
            <li>
              <div class="lg-row">
                <label for>{{$t('Unit Price')}}</label>
                <span>{{getBill.rate}}&nbsp;&nbsp;{{confirmRecharge.currentCurrency.currency}}</span>
              </div>
              <div class="lg-row">
                <label for>{{$t('Subtotal')}}</label>
                <span>{{getBill.originTotalPrice | dollarInteger}}.<span class="sm-dollar-decimal">{{getBill.originTotalPrice | dollarDecimal}}</span>&nbsp;&nbsp;{{confirmRecharge.currentCurrency.currency}}</span>
              </div>
            </li>
            <li>
              <!-- 优惠券 -->
              <div class="lg-row">
                <label for>
                  <i class="lg-icon lg-icon-coupon"></i>{{$t('Choose Coupon')}}
                </label>
                <span class="coupon" @click="chooseCoupon(true)">
                  <span class="coupon-val" v-if="couponList[bill.discountIndex]" v-show="couponList.length > 0">{{couponList[bill.discountIndex].discount}}% {{$t('off')}}</span>
                  <span class="no-availale" v-show="couponList.length == 0">{{$t('no available')}}</span>
                  <i class="el-icon-arrow-right"></i>
                </span>
              </div>
              <!-- 推荐人 -->
              <div v-if="!getBill.ambassadorUsername">
                <div class="lg-row mt10" v-show="!referrerDisable">
                  <label class="flex170" for>
                    <!-- <i class="lg-icon lg-icon-referrer"></i> -->
                    {{$t("Set Referrer")}}({{$t('optional')}})
                  </label>
                  <span class="setreferrer">
                    <el-form ref="referrerForm" :model="form" label-width="0" :rules="referrerRules">
                      <el-form-item label="" prop="referrer">
                        <el-input :disabled="referrerDisable" :placeholder="$t('Referrer phone number or Email')" v-model="form.referrer" style="width:140px;" size="small">
                          <el-button size="small" type="primary" slot="append" :loading="setLoading" @click="changeReferrerUser" v-if="!referrerDisable">{{$t('SET')}}</el-button>
                        </el-input>
                      </el-form-item>
                    </el-form>
                  </span>
                </div>
                <div class="lg-row mt10" v-if="getBill.referrerIncentiveAmount">
                  <span class="push-point">+{{getBill.referrerIncentiveAmount}} {{$t('points')}}</span>
                  <span class="referrer">
                    <!-- <template v-show="saveSuccess">{{form.referrer}}</template> -->
                    <el-popover placement="top-start" width="320" trigger="hover" :content="$t('SET-REFFER-TIPS')">
                      <i slot="reference" class="lg-icon lg-icon-ask"></i>
                    </el-popover>
                  </span>
                </div>
              </div>
              <div class="lhx40" v-else>
                <span class="f18">&nbsp;</span>
                <div class="fr">
                  {{$t('Refferred by', {reffer: getBill.ambassadorUsername})}}<span class="pl10 push-point">+{{getBill.referrerIncentiveAmount}} {{$t('points')}}</span>
                </div>
              </div>
            </li>
            <li>
              <div class="lg-row">
                <label for v-if="isFromLand == '1'" class="flex220">
                  {{$t('Total point')}}
                  <div class="group-desc">{{$t('Total points after successful Groupon')}}</div>
                </label>
                <label for v-else>
                  {{$t('Total point')}}
                </label>
                <span>{{getBill.totalAmount}}</span>
              </div>
              <div class="lg-row">
                <label for>{{$t('Saving')}}</label>
                <span>{{getBill.savePrice | filterInterge}}.<span class="sm-dollar-decimal">{{getBill.savePrice | filterDollarDecimal}}</span>&nbsp;&nbsp;{{confirmRecharge.currentCurrency.currency}}</span>
              </div>
            </li>
            <li>
              <div class="lg-row">
                <label for>{{$t('Total price')}}</label>
                <span class="total-price">{{getBill.totalPrice | filterInterge}}.<span class="sm-dollar-decimal" style="font-size: 16px;border-color: #efa83e;">{{getBill.totalPrice | filterDollarDecimal}}</span>&nbsp;&nbsp;{{confirmRecharge.currentCurrency.currency}}</span>
              </div>
            </li>
            <li class="btn-warpper tc">
              <el-button class="auto" type="primary" @click="pay()">{{$t('Submit orders')}}</el-button>
            </li>
          </ul>
        </el-card>
        <CouponCtl :isOpen="isShowCoupon" :coupons="couponList" @reGetAllCoupon="getAllCoupon" @change="chooseCoupon" @close="chooseCoupon"></CouponCtl>
      </div>
      <div class="multiple" v-else>
        <PayMentMethod :orderInfo="orderInfo" :payInfo="payInfo" @prevStep="prevStep"></PayMentMethod>
      </div>
    </div>
    <el-dialog :title="$t('Sign Out')" :center="true" :show-close="false" :visible.sync="isOpen" width="320px" append-to-body class="m-alert-dialog-with-title">
      <div class="c-tips f18">{{$t('Sure to sign out')}}</div>
      <div slot="footer">
        <el-button class="w120" @click="isOpen = false">{{$t('Cancel')}}</el-button>
        <el-button class="w120" @click="logout()" type="primary">{{$t('Sure')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
/**
 * type=1 一对一
 * type=2 小班课
 */
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { urlParse } from '@/common/js/util'
import { lgLocalStorage } from '@/common/js/store'
import PayMentMethod from './paymentmethodSingle';
import { redirectList, findRedirect } from '@/common/js/redirectList';
import CouponCtl from "./couponCtl";
export default {
  components: { PayMentMethod, CouponCtl },
  data() {
    //这里存放数据
    let self = this;
    return {
      userId: '',
      setLoading: false,
      referrerDisable: true,
      form: {
        referrer: ''
      },
      referrerRules: {
        referrer: { required: true, message: self.$t('required'), trigger: 'blur' }
      },
      saveSuccess: false,
      step: 1,
      lang: this.$i18n.locale.lang,
      isShowCoupon: false,
      bill: {
        code: '',
        discountIndex: -1,
        point: 0,
        bonus: 0
      },
      payInfo: {},
      secret: '',
      userInfo: {
        username: ''
      },
      isOpen: false,
      sgclassid: '',
      packageid: '',
      rechargeAmount: '',
      isFromLand: 0, // 是否从小班团购课落地页而来
      orderInfo: {},
      launching: false,
      couponList: [],
      noPaymentCount: 0,
      isMobile: navigator.userAgent.indexOf('Mobile') > -1, 
      currentLocation: ''
    };
  },
  computed: {
    ...mapGetters({
      currency: 'finance/getCurrency',
      confirmRecharge: 'finance/getConfirmRecharge',
      user: 'user/getUserInfo',
      getBill: 'finance/getBill',
      unused: 'finance/getUnused'
    })
  },
  filters: {
    filterInterge(value) {
      let tempArr = String(Number(value).toFixed(2)).split('.')
      return tempArr[0]
    },
    filterDollarDecimal(value) {
      let tempArr = String(Number(value).toFixed(2)).split('.')
      return tempArr[1]
    }
  },
  methods: {
    logout() {
      let self = this;
      let cal = () => {
        let redirect = findRedirect();
        redirect = encodeURIComponent(redirect + window.location.search);
        window.location.href = '/login.html?redirect=' + redirect;
      }
      this.logoutAction(cal);
      this.isOpen = false;
    },
    prevStep() {
      this.step = 1;
    },
    getParentInfo(userId) {
      this.$api.supplementuser.getParentInfo(userId).then((res) => {
        if (res.data.code == 200) {
          let data = res.data.data;
          this.form.referrer = data.referrerUserName || data.referrerUserIdentify;
          if (!data.referrerUserId && !data.isPaied) {
            this.referrerDisable = false;
          }
        }
      });
    },
    changeReferrerUser() {
      this.$refs['referrerForm'].validate((valid) => {
        if (valid) {
          let identyfy = this.form.referrer;
          let params = {
            referrerUserIdentify: identyfy,
            id: this.userId
          };
          this.setLoading = true;
          this.$api.supplementuser.updataParentInfo(params).then((res) => {
            if (res.data.code == 200) {
              this.$message({
                message: this.$t('set referrer successfully')
              })
              // 重新计算金额
              this.resetBill();
              this.referrerDisable = true;
              this.saveSuccess = true;
            } else {
              this.referrerDisable = false;
            }
            this.setLoading = false;
          })
        }
      })
    },
    unitChange(item, type) {
      // 改变币种
      this.confirmRechargeMutation({ currentCurrency: item });
      if (type != 'data') {
        this.resetBill();
      }
    },
    unitChangeByData(data) {
      let currencyId = this.confirmRecharge.currentCurrency.currencyId
      let fitem = null;
      this.currency.forEach((item) => {
        if (item.currencyId == data.currencyId) {
          fitem = item;
          return false;
        }
      });
      this.unitChange(fitem, 'data');
    },
    resetBill() {
      // 重新计算账单
      let userId = this.userId;
      let currencyId = this.confirmRecharge.currentCurrency.currencyId;
      let rechargeAmount = this.bill.point;
      let amount = this.rechargeAmount;
      let groupId = this.groupId;
      if (amount) {
        this.currencyAction({
          userId,
          point: this.bill.point,
          sgclassid: this.sgclassid,
          packageid: this.packageid,
          rechargeAmount: amount,
          code: this.bill.code,
          pa: this,
          callback: this.unitChangeByData
        }).then(() => {
          //success
        }, () => {
          this.$message({
            message: 'fail'
          })
        });
      } else if (this.sgclassid) {
        // 新加坡小班课充值
        this.confirmRechargeSgClassIdAction({ userId, code: this.bill.code, currencyId, sgClassId: this.sgclassid }).then(data => {
          this.unitChangeByData(data)
        });
      } else if (this.packageid) {
        // 课程包充值
        this.confirmRechargePackageAction({ userId, code: this.bill.code, currencyId, rechargePackageId: this.packageid }).then(data => {
          this.unitChangeByData(data)
        });
      } else if (this.isFromLand == '1') { // 来自落地页，即为小班课团购
        // 按课时充值
        if (rechargeAmount < 0) {
          this.$message({
            message: this.$t('Recharge hours must be greater than 0')
          });
          return false;
        }
        this.confirmRechargeMiniClassAction({ userId, code: this.bill.code, currencyId, rechargeAmount, groupId, showState: true })
      } else {
        // 按课时充值
        if (rechargeAmount < 0) {
          this.$message({
            message: this.$t('Recharge hours must be greater than 0')
          });
          return false;
        }
        this.confirmRechargeAction({ userId, code: this.bill.code, currencyId, rechargeAmount, pa: this, callback: this.unitChangeByData })
      }
    },
    chooseCoupon(flag, index) {
      if (index > -1) {
        this.bill.discountIndex = index;
        this.bill.code = this.couponList[index].code;
        this.resetBill();
      }
      this.isShowCoupon = flag;
    },
    getAllCoupon() {
      const params = urlParse()
      const userId = this.userId || this.user.userParentInfo.id
      const accountClass = params && params.packageid ? 2 : 1
      const amount = this.bill.point
      this.$api.finance.getAllCoupon({ userId, accountClass, amount }).then(res => {
        if (res && res.data && res.data.code === 200) {
          this.couponList = res.data.data
        } else {
          this.$message({
            message: res.data.message,
            center: true
          });
        }
      }, err => {
        console.log('err: ', err)
      })
    },
    pay() {
      if (this.packageid) {
        this.payInfo = {
          code: this.bill.code,
          currencyId: this.confirmRecharge.currentCurrency.currencyId,
          rechargePackageId: this.packageid,
          rechargeAmount: this.getBill.rechargeAmount,
          sgClassId: this.sgclassid,
          rechargeType: 2 //支付方式，暂时只支持2
        }
      } else if (this.sgclassid) {
        this.payInfo = {
          code: this.bill.code,
          currencyId: this.confirmRecharge.currentCurrency.currencyId,
          sgClassId: this.sgclassid,
          rechargeAmount: this.getBill.rechargeAmount,
          rechargeType: 2 //支付方式，暂时只支持2
        }
      } else if (this.groupId) {
        this.payInfo = {
          code: this.bill.code,
          currencyId: this.confirmRecharge.currentCurrency.currencyId,
          rechargeType: 2,
          rechargeAmount: this.bill.point,
          groupId: this.groupId,
          isFromLand: this.isFromLand,
          landPageHost: decodeURIComponent(this.landPageHost),
          showState: true
        }
      } else {
        this.payInfo = {
          code: this.bill.code,
          currencyId: this.confirmRecharge.currentCurrency.currencyId,
          rechargeAmount: this.bill.point,
          rechargeType: 2 //支付方式，暂时只支持2
        }
      }
      const userId = this.userId || this.user.userParentInfo.id;
      const count = this.noPaymentCount
      const origin = window.origin
      // 中英文文本
      const descByOne = this.$t('You have 1 order pending for payment, please continue to pay at the order center or make another order')
      const descByTwo = this.$t('You have 2 orders pending for payment, please continue to pay at the order center or pay again after cancellation')  
      const goOnPay = this.$t('Continue payment')
      const reorder = this.$t('Reorder')
      const close = this.$t('CLOSE')
      const tip = this.$t('Tips')
      if (count === 0) {
        this.createOrder({userId, ...this.payInfo})
      } else if (count === 1) {
        this.$confirm(descByOne, tip, { 
          confirmButtonText: goOnPay,
          cancelButtonText: reorder,
          distinguishCancelAndClose: true,
          customClass: this.isMobile ? 'custom-box-width' : '',
          type: 'warning'
        }).then(() => {
          window.location.replace(`${origin}/#/order/orderCenter`)
        }).catch((action) => {
          if (action === 'cancel') {
            this.createOrder({userId, ...this.payInfo})
          }
        })
      } else if (count === 2) {
         this.$confirm(descByTwo, tip, { 
          confirmButtonText: goOnPay,
          cancelButtonText: close,
          customClass: this.isMobile ? 'custom-box-width' : '',
          type: 'warning'
        }).then(() => {
          window.location.replace(`${origin}/#/order/orderCenter`)
        }).catch(() => {
          console.log('你点击了关闭')
        })
      } else {
        this.$message({
          message: `您有${count}条待支付订单，暂不可发起支付`
        })
      }
    },
    createOrder (params) {
      this.launching = true
      this.$api.finance.createOrder({
        ...params
      }).then(res => {
        this.launching = false
        if (res && res.data && res.data.code === 200) {
          this.step = 2
          this.orderInfo = res.data.data
        } else if (res.data.code !== 40006){
          this.$message({
            message: res.data.message,
            center: true
          });
        }
      }, err => {
        console.log('error', err)
      })
    },
    getNoPaymentOrderCount () {
      this.launching = true
      const userId = this.userId || this.user.userParentInfo.id
      this.$api.order.getUserParentUndoNumber(userId).then(res => {
        this.launching = false
        if (res && res.data && res.data.code === 200) {
          this.noPaymentCount = res.data.data
        } else {
          this.$message({
            message: res.data.message,
          })
        }
      }, err => {
        console.log('err', err)
      })
    },
    ...mapActions({
      currencyAction: 'finance/currencyAction',
      confirmRechargeAction: 'finance/confirmRechargeAction',
      couponAction: 'finance/couponAction',
      logoutAction: 'user/logoutAction',
      confirmRechargeSgClassIdAction: 'finance/confirmRechargeSgClassIdAction',
      confirmRechargePackageAction: 'finance/confirmRechargePackageAction',
      confirmRechargeMiniClassAction: 'finance/confirmRechargeMiniClassAction',
    }),
    ...mapMutations({
      confirmRechargeMutation: 'finance/confirmRechargeMutation'
    })
  },
  async created() {
    let userInfo = lgLocalStorage('__lgzy__s__');
    if (userInfo && userInfo.login_info.user.jwtToken) {
      this.userId = userInfo.login_info.user.userParentInfo.id;
      this.userInfo = userInfo.login_info.user.userParentInfo;
    }
    let self = this;
    let userId = this.userId;
    let querys = urlParse();
    if (querys) {
      this.bill.point = querys.points > 0 ? querys.points : 20;
      this.bill.bonus = querys.bonus || 0; // 按课时数充值
      this.sgclassid = querys.sgclassid || '' // 新加坡小班课充值
      this.packageid = querys.packageid || '' //课程包充值
      this.rechargeAmount = querys.amount || ''
      this.isFromLand = querys.isFromLand || 0
      this.groupId = querys.groupId || ''
      this.landPageHost = querys.landPageHost || ''
      this.orderId = querys.orderId || ''
    } else {
      this.bill.point = 50; //默认充值50
      this.bill.bonus = 0;
    }

    let callback = function(data) {
      self.unitChangeByData(data)
    };
    const reqCurrencyData = {
      userId,
      point: this.bill.point,
      sgclassid: this.sgclassid,
      packageid: this.packageid,
      rechargeAmount: this.rechargeAmount,
      callback
    }
    if (this.isFromLand == '1') {
      reqCurrencyData.groupId = this.groupId
      reqCurrencyData.showState = true
    }
    // 存在orderId
    if (this.orderId) {
      self.launching = true
      self.confirmRechargeMutation({ loading: false })
      this.$api.order.getOrderDetail(this.orderId).then(res => {
        if (res.status === 200 && res.data.code === 200) {
          self.launching = false
          self.orderInfo = res.data.data
          self.step = 2
        } else {
          self.$message({
            message: res.data.message
          })
        }
      }, err => {
        console.log('err', err)
      })
      return
    }
    const result = await this.$api.finance.getLocation()
    if (result.data.code === 200 && result.data.data) {
      this.currentLocation = result.data.data
    }
    self.currencyAction({
      ...reqCurrencyData,
      location: this.currentLocation
    }).then(() => {}, () => {
      if (userInfo && userInfo.login_info.user.jwtToken) {
        self.$message({
          message: 'fail',
        })
      }
    });
    this.getAllCoupon()
    this.getParentInfo(userId);
    this.getNoPaymentOrderCount()
  },
  beforeCreate() {
    let userInfo = lgLocalStorage('__lgzy__s__');
    if (userInfo && userInfo.login_info.user.jwtToken) {
      // let jwtExpireTime = userInfo.login_info.user.jwtExpireTime
      this.userId = userInfo.login_info.user.userParentInfo.id;
    }
  }
};

</script>
<style lang='stylus' scoped>
@media screen and (max-width: 480px) {
  .el-dialog {
    width: 80% !important;
  }
}

.lg-pay {
  max-width: 800px;
  min-height: 600px;
  width: auto;
  overflow: hidden;
}

.billing {
  font-family: Rubik-Regular, Rubik;
  box-sizing: border-box;

  .el-form-item {
    margin-bottom: 5px;
  }

  header {
    margin-bottom: 20px;
    text-align: right;

    .el-button {
      width: 200px;
    }
  }

  .push-point {
    font-size: 16px;
    font-weight: 400;
    color: rgba(235, 83, 47, 1);
  }

  ul {
    display: block;

    li {
      &:last-child {
        border: none;
        padding: 20px 0;
      }

      .lg-row {
        display: flex;
        justify-content: space-between;

        &:first-child {
          padding-top: 10px;
        }

        &:last-child {
          padding-bottom: 10px;
          border-bottom: 1px solid #ddd;
        }

        label {
          flex: 0 120px;
          font-size: 18px;
          font-weight: 400;
          color: rgba(52, 54, 77, 1);
          line-height: 22px;
        }

        .flex170 {
          flex: 0 170px;
          padding-top: 8px;
        }

        .flex220 {
          flex: 0 220px;
        }

        .lg-icon-coupon {
          width: 24px;
          height: 24px;
          background: url('~@/assets/theme-default/images/pay/icon-coupon.png') no-repeat 0 -2px/100%;
        }

        .lg-icon-referrer {
          width: 24px;
          height: 24px;
          background: url('~@/assets/theme-default/images/pay/icon-referrer.png') no-repeat 0 0/100%;
        }

        span {
          flex: 1;
          text-align: right;
          line-height: 22px;

          button {
            width: 42px;
            height: 32px;
            padding: 0;
            color: #fff;
            background: rgba(110, 112, 160, 1);
            border-bottom-left-radius: 0;
            border-top-left-radius: 0;
            position: relative;
            top: 1px;
          }

          &.total-price {
            font-size: 28px;
            font-weight: 400;
            color: #EFA83E;
          }

          &.referrer {
            padding-left: 5px;
            flex: 0 0 auto;
          }

          &.setreferrer {
            line-height: 48px;
            padding-left: 0px;
            flex: 0 0 auto;

            .referrer {
              font-size: 16px;
              font-weight: 400;
              color: rgba(178, 178, 178, 1);

              .lg-icon-ask {
                width: 24px;
                height: 24px;
                background: url('~@/assets/theme-default/images/pay/icon-wenhao.png') no-repeat 50% 46%/70%;
                vertical-align: middle;
              }

              .el-popover {
                font-size: 16px;
                font-weight: 400;
                color: rgba(178, 178, 178, 1);
                line-height: 24px;
              }
            }
          }
        }
      }
    }
  }
}

.m-top-bar {
  height: 60px;
  line-height: 60px;
  overflow: hidden;
  padding: 0 30px;

  .c-logo {
    width: 116px;
    height: 40px;
    margin-top: 10px;
    float: left;
    background: url('~@/assets/theme-default/images/index/logo@2x.png') 0 0/100% 100%;
  }

  .m-uname {
    color: #595e9b;
    font-size: 14px;
    text-decoration: none;
    float: right;
    max-width: 120px;
    line-height: 60px;
    height: 60px;
  }

  .m-logout {
    float: right;
    padding: 0 5px;
    color: #999;
    text-align: center;
    font-size: 14px;
  }
}

.no-availale {
  font-size: 14px;
}

.group-desc {
  font-size: 10px;
  color: #a0a0a0;
}

.sm-dollar-decimal {
  font-size: 12px;
  display: inline-block;
  border-bottom: 1px solid #303133;
  line-height: 14px !important;
}

.currency-item {
  display: flex;
  align-items: center;

  .currency-text {
    width: 132px;
    font-size: 14px;
    white-space: nowrap;
  }

  .payment-icon {
    width: 24px;
    height: 24px;
    margin-left: 8px;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }

  .icon-card {
    background-image: url('../../assets/theme-default/images/pay/icon-card.png')
  }

  .icon-wechat {
    background-image: url('../../assets/theme-default/images/pay/icon-wechat.png')
  }

  .icon-alipay {
    background-image: url('../../assets/theme-default/images/pay/icon-alipay.png')
  }
}
</style>
