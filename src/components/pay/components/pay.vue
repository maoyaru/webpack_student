<template>
  <div class="lg-pay pay" v-loading="loading" element-loading-spinner="custom-loading">
    <div class="lg-row" v-if="isShowBalance">
      <div class="wraper" v-if="lessonsInfo.dirtAccount || lessonsInfo.dirtAccount == 0">
        <div class="item" @click="$router.push('/order/orderCenter?tab=points&type=1')">
          <div>{{$t('Normal Points')}} ></div>
          <div class="number">{{lessonsInfo.formalAccount}}</div>
        </div>
        <div class="item" @click="$router.push('/order/orderCenter?tab=points&type=2')">
          <div>{{$t('Special Points')}} ></div>
          <div class="number">{{lessonsInfo.dirtAccount}}</div>
        </div>
        <i class="el-icon-question question" @click="showDescWin"></i>
      </div>
      <div class="balance" v-else>
        <label for>{{$t('Account Balance')}}</label>
        <span class="point" v-if="blance>10000">&gt;10000</span>
        <span class="point" v-else>{{blance}}</span>
        <label class="unit">{{$t('Points')}}</label>
        <el-button plain @click="$router.push('/order/orderCenter?tab=points&type=1')">{{$t('DETAILS')}}</el-button>
      </div>
      <div class="coupon" @click="$router.push('/pay/coupon')">{{$t('COUPON')}}</div>
    </div>
    <h1 class="lg-title title">{{$t('Top-up Normal Points')}}</h1>
    <div class="point-wrap">
      <el-card class="card" v-for="(item,index) in recharge" @mouseenter.native="sindex = index" :class="sindex === index ? 'active' : ''" :key="index">
        <div class="field">
          <div :class="item.incentiveAmount ? '' : 'mb' ">
            <span class="point">{{item.rechargeAmount}}</span>
            {{$t('Points')}}
          </div>
          <div v-if="item.incentiveAmount" class="amount">
            <span class="bouns">+{{item.incentiveAmount}}</span>
            {{$t('bonus points')}}
          </div>
          <el-button class="pay-btn" round @click="continueBill(index)">{{$t('Top-up')}}</el-button>
        </div>
        <div v-if="item.rechargeAmount === 50" class="most-popular" :class="$i18n.locale === 'zh' ? 'zh-popular' : 'en-popular'"></div>
      </el-card>
    </div>
    <el-dialog
      :title="$t('Introduction of Points')"
      center
      :visible.sync="isShowDesc"
      width="50%">
      <template v-if="$i18n.locale === 'zh'">
        <p class="desc-item">此处展示的是您账户各类课时的余额，包括付费课时，以及系统赠送课时。</p>
        <h2>课时用途</h2>
        <p class="desc-item">课时可用于学生的上课，如果家长账号下有多个孩子，则课时可供该账号下所有孩子上课使用。</p>
        <h2>适用范围</h2>
        <p class="desc-item">LingoAce针对不同水平和地区的学生研发了丰富的课程，每种课程消耗的课时类型有所不同。标准课时适用于一对一课程，以及高级版、中级版、国际版的小班课程。定向课时适用于新加坡双语版、新加坡写作课的小班课程。</p>
        <h2>课时明细</h2>
        <p class="desc-item">点击课时余额可查看本账号课时的获得与消耗明细。</p>
        <h2>课时有效期</h2>
        <p class="desc-item">课时有效期以页面显示的时间为准，如未显示则表示长期有效。</p>
        <p class="desc-item desc-tip">如果您对课时的使用规则有任何疑问，请随时联系您的课程顾问或学管老师，他们非常乐意为您解答疑问。</p>
      </template>
      <template v-if="$i18n.locale === 'en'">
        <p class="desc-item">Here is the point balance of your account, including paid points and free bonus points of the system.</p>
        <h2>Purpose of points</h2>
        <p class="desc-item">Points can be used for students' classes. If there are multiple children under the parent account, points can be used for all children under the account.</p>
        <h2>Scope of application</h2>
        <p class="desc-item">LingoAce has developed a variety of courses for students of different levels and regions, each of which consumes different types of points.Normal points are applicable to one-on-one classes, as well as group class of Advanced Chinese, Bilingual Chinese, and International Chinese.Special points are applicable to Singapore Bilingual Chinese and Singapore Creative Writing class.</p>
        <h2>Transaction details</h2>
        <p class="desc-item">You can kindly click the account balance to check the acquisition and consumption details of this account. </p>
        <h2>Period of validity</h2>
        <p class="desc-item">The period of validity is subject to the time displayed on the page. If it is not displayed, it means it is valid for a long time.</p>
        <p class="desc-item desc-tip">If you have any questions about the rules of use of points, please contact your course consultant or learning advisor in time, and they will answer your questions in time.</p>
      </template>
      <span slot="footer">
        <el-button type="primary" class="close-btn" @click="claseDescWin">{{$t('CONFIRM')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      sindex: 1,
      loading: false,
      isShowDesc: false,
      isShowBalance: false,
      lessonsInfo: {},
    };
  },
  computed: {
    ...mapGetters({
      blance: "user/getBlance",
      recharge: "finance/getRecharge",
      user: 'user/getUserInfo',
    })
  },
  methods: {
    ...mapActions({
      rechargeAction: "finance/rechargeAction"
    }),
    showDescWin () {
      this.isShowDesc = true
    },
    claseDescWin () {
      this.isShowDesc = false
    },
    getAccountLessons () {
      const userId = this.user.userParentInfo.id
      this.$api.finance.getAccountLessons({ userId }).then(res => {
        if (res && res.data && res.data.code === 200) {
          this.isShowBalance = true
          this.lessonsInfo = res.data.data
        } else {
          this.$message({
            message: res.data.message,
            center: true
          });
        }
      }, err => {
        console.log('err', err)
      })
    },
    continueBill(index) {
      let points = this.recharge[index].rechargeAmount;
      let bonus = this.recharge[index].incentiveAmount;
      this.$router.push("/pay/billing?points=" + points + "&bonus=" + bonus);
      // Facebook 收集发起购买
      fbq('track', 'InitiateCheckout');
    }
  },
  created() {
    this.loading = true;
    this.getAccountLessons()
    this.rechargeAction().then(
      data => {
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }
};
</script>
<style lang='stylus' scoped>
.pay {
  width: 960px;
  min-height: 600px;

  .title {
    margin: 40px 0;
  }

  .lg-row {
    display: flex;

    .balance {
      flex: 1;
      bg-image('~@/assets/theme-default/images/pay/pic_chongzhi_banner');
      margin-right: 20px;
      padding-left: 160px;
      padding-top: 55px;

      label {
        width: 316px;
        height: 71px;
        font-size: 20px;
        font-family: Rubik-Medium, Rubik;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 24px;
      }

      .point {
        color: rgba(255, 255, 255, 1);
        font-size: 60px;
      }

      .el-button {
        border-radius: 40px;
        float: right;
        vertical-align: top;
        margin: 5px 30px 0 0;
      }
    }

    .wraper {
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex: 1;
      background: #6e70a0;
      margin-right: 20px;
      border-radius: 10px;
      color: #ffffff;

      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 18px;
        cursor: pointer;

        .number {
          margin-top: 18px;
          font-size: 54px;
          font-family: Rubik-Regular,Rubik;
          font-weight: 400;
        }
      }

      .question {
        font-size: 48px;
      }
    }

    .coupon {
      box-sizing: border-box;
      flex: 0 240px;
      height: 160px;
      text-align: center;
      bg-image('~@/assets/theme-default/images/pay/pic_chongzhi_banner2');
      font-size: 20px;
      font-family: Rubik-Medium, Rubik;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 24px;
      padding-top: 112px;
      cursor: pointer;
    }
  }

  .point-wrap {
    display: flex;

    .card {
      position: relative;
      border: 2px solid transparent;
      flex: 1;
      box-shadow: 0 10px 8px rgba(0, 0, 0, 0.2);

      &:nth-child(2) {
        margin: 0 20px;
      }

      .field {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        height: 180px;

        & > div {
          margin-bottom: 20px;
        }

        .mb {
          margin-bottom: 55px;
        }

        .pay-btn {
          width: 80%;
          border: none;
          background: #efa83e;
          color: #ffffff;
        }

        .point {
          font-size: 54px;
          color: #6e70a0;
        }

        .amount {
          font-size: 18px;
          color: #cccccc;
        }

        .bouns {
          font-size: 18px;
          color: #efa83e;
        }
      }

      .most-popular {
        position: absolute;
        top: 0;
        left: 50%;
        margin-left: -53px;
        width: 107px;
        height: 33px;
        background-size: contain;
        background-repeat: no-repeat;
      }

      .en-popular {
        background-image: url('../../../assets/theme-default/images/pay/en-popular.png');
      }

      .zh-popular {
        background-image: url('../../../assets/theme-default/images/pay/zh-popular.png');
      }
    }

    .active {
      background: #fdf4e8;
      border: 2px solid #e19f41;
    }
  }
  .desc-item {
    word-break: keep-all;
    line-height: 24px;
    color: #666666;
  }
  .desc-tip {
    margin-top: 10px;
  }
  .close-btn {
    width: 200px;
  }
}
</style>