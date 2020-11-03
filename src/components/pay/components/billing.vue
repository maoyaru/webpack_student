<template>
  <div v-loading="confirmRecharge.loading || launching" element-loading-spinner="custom-loading">
    <div class="lg-pay billing" v-if="step == 1">
      <h1 class="lg-title">{{$t("Billing Information")}}</h1>
      <el-card :body-style="{'padding':'30px 60px'}">
        <header>
          <el-dropdown placement="bottom">
            <el-button type="primary" plain round>
              {{ Constants.langEn == lang ? confirmRecharge.currentCurrency.currencyEn : confirmRecharge.currentCurrency.currencyZh}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item,key) in currency" :key="key">
                <div @click="unitChange(item)" class="currency-item">
                  <span class="currency-text">
                    {{ lang == Constants.langEn ? item.currencyEn : item.currencyZh }}
                  </span>
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
              <span>{{bill.point}}</span>
            </div>
            <div class="lg-row">
              <label for>{{$t('Bonus points')}}</label>
              <span>{{bill.bonus}}</span>
            </div>
          </li>
          <li>
            <div class="lg-row">
              <label for>{{$t('Unit Price')}}</label>
              <span>{{getBill.rate | dollarInteger}}.<span class="sm-dollar-decimal">{{getBill.originTotalPrice | dollarDecimal}}</span>&nbsp;&nbsp;{{confirmRecharge.currentCurrency.currency}}</span>
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
            <div v-if="!getBill.ambassadorUsername" class="lg-row" v-show="!referrerDisable">
              <label for>
                <i class="lg-icon lg-icon-referrer"></i>{{$t("Set Referrer")}}({{$t('optional')}})
              </label>
              <span class="setreferrer">
                <el-form ref="referrerForm" :model="form" label-width="0" :rules="referrerRules">
                  <el-form-item label="" prop="referrer">
                    <el-input class="refer-input" :disabled="referrerDisable" :placeholder="$t('Referrer phone number or Email')" v-model="form.referrer">
                      <el-button type="primary" slot="append" :loading="setLoading" @click="changeReferrerUser" v-if="!referrerDisable">{{$t('SET')}}</el-button>
                    </el-input>
                  </el-form-item>
                </el-form>
                <template v-if="getBill.referrerIncentiveAmount">
                  <span class="push-point">+{{getBill.referrerIncentiveAmount}} {{$t('points')}}</span>
                  <span class="referrer">
                    <!-- <template v-show="saveSuccess">{{form.referrer}}</template> -->
                    <el-popover placement="top-start" width="320" trigger="hover" :content="$t('SET-REFFER-TIPS')">
                      <i slot="reference" class="lg-icon lg-icon-ask"></i>
                    </el-popover>
                  </span>
                </template>
              </span>
            </div>
            <div class="lhx40 pt10" v-else>
              <span class="f18">&nbsp;</span>
              <div class="fr">
                {{$t('Refferred by', {reffer: getBill.ambassadorUsername})}}<span class="pl10 push-point">+{{getBill.referrerIncentiveAmount}} {{$t('points')}}</span>
              </div>
            </div>
          </li>
          <li class="mb20">
            <div class="lg-row">
              <label for>{{$t('Total point')}}</label>
              <span>{{getBill.totalAmount}}</span>
            </div>
            <div class="lg-row">
              <label for>{{$t('Saving')}}</label>
              <span>{{getBill.savePrice | dollarInteger}}.<span class="sm-dollar-decimal">{{getBill.savePrice | dollarDecimal}}</span>&nbsp;&nbsp;{{confirmRecharge.currentCurrency.currency}}</span>
            </div>
          </li>
          <li>
            <div class="lg-row" style="border: none;">
              <label for>{{$t('Total price')}}</label>
              <span class="total-price">{{getBill.totalPrice | dollarInteger}}.<span class="sm-dollar-decimal" style="font-size: 16px;border-color: #efa83e;">{{getBill.totalPrice | dollarDecimal}}</span>&nbsp;&nbsp;{{confirmRecharge.currentCurrency.currency}}</span>
            </div>
          </li>
          <li class="btn-warpper">
            <el-button type="primary" @click="pay()">{{$t('Submit orders')}}</el-button>
          </li>
        </ul>
      </el-card>
      <CouponCtl :isOpen="isShowCoupon" :coupons="couponList" @reGetAllCoupon="getAllCoupon" @change="chooseCoupon" @close="chooseCoupon"></CouponCtl>
    </div>
    <PayMentMethod @prevStep="prevStep" v-if="step == 2" :orderInfo="orderInfo" :payInfo="payInfo"></PayMentMethod>
  </div>
</template>
<script>
import CouponCtl from "./couponCtl";
import { mapActions, mapGetters, mapMutations } from 'vuex';
import PayMentMethod from './paymentmethod';
import { urlParse } from '@/common/js/util'

export default {
  components: { CouponCtl, PayMentMethod },
  data() {
    //这里存放数据
    let self = this;
    return {
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
      orderInfo: null,
      launching: false,
      couponList: [],
      noPaymentCount: 0,
      currentLocation: ''
    };
  },
  computed: {
    ...mapGetters({
      currency: 'finance/getCurrency',
      confirmRecharge: 'finance/getConfirmRecharge',
      user: 'user/getUserInfo',
      getBill: 'finance/getBill',
      // unused: 'finance/getUnused'
    })
  },
  methods: {
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
            id: this.user.userParentInfo.id
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
    unitChange(item) {
      // 改变币种
      this.confirmRechargeMutation({ currentCurrency: item });
      this.resetBill();
      // 请求秘钥
    },
    resetBill() {
      // 重新计算账单
      let userId = this.user.userParentInfo.id;
      let currencyId = this.confirmRecharge.currentCurrency.currencyId;
      let rechargeAmount = this.bill.point;
      if (rechargeAmount < 0) {
        this.$message({
          message: this.$t('Recharge hours must be greater than 0')
        });
        return false;
      }
      this.confirmRechargeAction({ userId, code: this.bill.code, currencyId, rechargeAmount, pa: this});
    },
    chooseCoupon(flag, index) {
      if (index > -1) {
        this.bill.discountIndex = index;
        this.bill.code = this.couponList[index].code;
        this.resetBill();
      }
      this.isShowCoupon = flag;
    },
    pay() {
      this.payInfo = {
        code: this.bill.code,
        currencyId: this.confirmRecharge.currentCurrency.currencyId,
        rechargeAmount: this.bill.point,
        rechargeType: 2
      }
      const userId = this.user.userParentInfo.id;
      // 通过待支付订单数确定是否发起支付
      const count = this.noPaymentCount
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
          type: 'warning'
        }).then(() => {
          this.$router.push('/order/orderCenter')
        }).catch((action) => {
          if (action === 'cancel') {
            this.createOrder({userId, ...this.payInfo})
          }
        })
      } else if (count === 2) {
        this.$confirm(descByTwo, tip, { 
          confirmButtonText: goOnPay,
          cancelButtonText: close,
          type: 'warning'
        }).then(() => {
          this.$router.push('/order/orderCenter')
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
      }).then (res => {
        this.launching = false
        if (res && res.data && res.data.code === 200) {
          this.$EventBus.$emit("onRefreshPendingOrderCount");
          this.step = 2
          this.orderInfo = res.data.data
        } else if (res.data.code !== 40006) {
          this.$message({
            message: res.data.message,
            center: true
          });
        }
      }, err => {
        console.log('error', err)
      })
    },
    getAllCoupon () {
      const params = urlParse()
      const userId = this.user.userParentInfo.id
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
    getNoPaymentOrderCount () {
      this.launching = true
      const userId = this.user.userParentInfo.id
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
      couponAction: 'finance/couponAction'
    }),
    ...mapMutations({
      confirmRechargeMutation: 'finance/confirmRechargeMutation'
    })
  },
  async created() {
    let self = this;
    let userId = this.user.userParentInfo.id;
    this.bill.point = this.$route.query.points;
    this.bill.bonus = this.$route.query.bonus;
    this.orderId = this.$route.query.orderId;
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
    if (this.bill.point < 0) {
      this.$message({
        message: this.$t('Recharge hours must be greater than 0')
      });
      return false;
    }
    const result = await this.$api.finance.getLocation()
    if (result.data.code === 200 && result.data.data) {
      this.currentLocation = result.data.data
    }
    self.currencyAction({ userId, point: this.bill.point, location: this.currentLocation }).then(() => {}, () => {
      self.$message({
        message: 'fail'
      })
    });
    this.getNoPaymentOrderCount()
    this.getAllCoupon()
    this.getParentInfo(userId);
  },
  beforeRouteEnter(to, from, next) {
    // 可能非法进来的
    if (to.query.orderId) {
      next();
    } else if (!to.query.points) {
      next('/usercenter/pay');
    } else {
      next();
    }
  }
};

</script>
<style lang='stylus' scoped>
.lg-pay {
  min-height: 600px;
}

.billing {
  font-family: Rubik-Regular, Rubik;
  box-sizing: border-box;

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

  li {
    margin-bottom: 10px;

    &:last-child {
      border: none;
      padding: 20px 0;
    }

    .lg-row {
      display: flex;
      padding-bottom: 10px;

      // &:first-child {
      //   padding-top: 10px;
      // }

      &:last-child {
        padding-bottom: 10px;
        border-bottom: 1px solid #ddd;
      }

      label {
        flex: 0 400px;
        font-size: 18px;
        font-weight: 400;
        color: rgba(52, 54, 77, 1);
        line-height: 22px;

        .lg-icon-coupon {
          width: 48px;
          height: 48px;
          background: url(../../../assets/theme-default/images/pay/icon-coupon.png) 0 0/48px 48px;
        }

        .lg-icon-referrer {
          width: 48px;
          height: 48px;
          background: url(../../../assets/theme-default/images/pay/icon-referrer.png) 0 0/48px 48px;
        }
      }

      span {
        flex: 1;
        text-align: right;

        button {
          width: 60px;
          height: 40px;
          padding: 0;
          color: #fff;
          background: rgba(110, 112, 160, 1);
          border-bottom-left-radius: 0;
          border-top-left-radius: 0;
          position: relative;
          top: 0px;
        }

        &.total-price {
          font-size: 28px;
          font-weight: 400;
          color: #EFA83E;
        }

        &.coupon {
          line-height: 48px;
          cursor: pointer;

          .coupon-val {
            font-size: 16px;
            font-weight: 400;
            color: rgba(235, 83, 47, 1);
            vertical-align: middle;
          }

          .no-availale {
            font-size: 16px;
            vertical-align: middle;
            font-weight: 400;
            color: #B2B2B2;
          }

          .el-icon-arrow-right {
            vertical-align: middle;
            font-size: 20px;
            cursor: pointer;
          }
        }

        &.setreferrer {
          line-height: 48px;

          .referrer {
            font-size: 16px;
            font-weight: 400;
            color: rgba(178, 178, 178, 1);

            .lg-icon-ask {
              width: 24px;
              height: 24px;
              bg-image('../../../assets/theme-default/images/pay/icon-wenhao');
              vertical-align: middle;
              margin-left: 10px;
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

    &.btn-warpper {
      text-align: center;

      .el-button {
        width: 300px;
      }
    }
  }
}

.sm-dollar-decimal {
  font-size: 12px;
  display: inline-block;
  border-bottom: 1px solid #303133;
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
    background-image: url('../../../assets/theme-default/images/pay/icon-card.png')
  }

  .icon-wechat {
    background-image: url('../../../assets/theme-default/images/pay/icon-wechat.png')
  }

  .icon-alipay {
    background-image: url('../../../assets/theme-default/images/pay/icon-alipay.png')
  }
}

</style>
