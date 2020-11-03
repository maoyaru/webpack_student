<template>
  <el-dialog
    title="Choose Coupon"
    :visible.sync="isShow"
    width="90%"
    @closeed="close"
    :show-close="false"
    :center="true"
    class="choose-coupon"
    :destroy-on-close="true"
    append-to-body
  >
    <div class="coupon-card">
      <el-input placeholder="Coupon code" v-model="code">
        <el-button type="primary" slot="append" @click="addCoupon">{{$t('ADD')}}</el-button>
      </el-input>
      <!-- <dl v-for="(item,key) in coupons" :key="key" @click="choose(key)" v-if="item.amount<=points"> -->
      <dl v-for="(item,key) in coupons" :key="key" @click="choose(key)" class="dl-box" :class="item.isAvailable ? '' : 'disable' ">
        <dt :class="item.flag">
          <span class="val">{{item.discount}}</span>
          <span class="unit">%</span>
          <div class="discount">{{$t('discount')}}</div>
        </dt>
        <dd>
          <div class="tip-warpper">
            <p class="tip">{{$t('Top-up')}} {{item.amount}} {{$t('points or more')}}</p>
            <p class="time">{{$t('Validity period')}}:
              {{DateTimeUtils.formartDateFromUTC(item.validStartTime,'yyyy.MM.dd')}}
              -{{DateTimeUtils.formartDateFromUTC(item.validEndTime,'yyyy.MM.dd')}}</p>
            <p class="no-available" v-if="!item.isAvailable">{{$t('Reason for unavailability')}} : {{ canNotReason(item.notAvailableReason) }}</p>
              <img class="point-type" v-if="item.accountClass === 1" :src="pointType[$i18n.locale]['standard']"/>
              <img class="point-type" v-else :src="pointType[$i18n.locale]['sg']"/>
          </div>
        </dd>
      </dl>
      <div class="no-cupon" v-show="coupons.length == 0">No coupons here</div>
    </div>
  </el-dialog>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { lgLocalStorage } from '@/common/js/store'
import { urlParse } from '@/common/js/util'
export default {
  data() {
    return {
      loading: false,
      code: '',
      points: 100,
      countCoupon: 0,
      userInfo: {},
      userId: '',
      pointType: {
        zh: {
          standard: require('../../assets/theme-default/images/pay/zh_standard_point.png'),
          sg: require('../../assets/theme-default/images/pay/zh_sg_point.png')
        },
        en: {
          standard: require('../../assets/theme-default/images/pay/en_standard_point.png'),
          sg: require('../../assets/theme-default/images/pay/en_sg_point.png')
        }
      }
    }
  },
  props: {
    isOpen: {
      default: false,
      type: Boolean
    },
    coupons: {
      default () {
        return [];
      },
      type: Array
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/getUserInfo'
    }),
    isShow: {
      get() {
        return this.isOpen
      },
      set() {
        this.$emit("close", false);
      }
    }
  },
  methods: {
    ...mapActions({
      addCouponAction: 'finance/addCouponAction'
    }),
    choose(index) {
      if (!this.coupons[index].isAvailable) {
        return
      }
      this.$emit("change", false, index);
    },
    close() {
      this.$emit("close", false);
    },
    addCoupon() {
      let self = this;
      console.log(this.userId, this.userInfo)
      if (this.code == '') {
        this.$message({
          message: 'Please Fill the Coupon code',
        })
        return;
      }
      self.loading = true;

      this.addCouponAction({
        userId: this.userId,
        code: this.code
      }).then((data) => {
        self.loading = false;
        self.$emit('reGetAllCoupon')
        self.$message({
          message: self.$t('add coupon sccess', { amount: data.amount })
        });
      }, (err) => {
        self.loading = false;
      })
    },
    canNotReason (val) {
      let reason = ''
      switch (val) {
        case 1:
          reason = 'Inconsistent point type'
          break
        case 2:
          reason = 'Less than coupon requirements'
          break
        case 3:
          reason = 'More than coupon requirements'
          break
        case 4:
          reason = 'The coupon is not yet valid'
        default:
          reason = ''
      }
      return this.$t(reason)
    },
  },
  created() {
    let userInfo = lgLocalStorage('__lgzy__s__');
    if (userInfo && userInfo.login_info.user.jwtToken) {
      // let jwtExpireTime = userInfo.login_info.user.jwtExpireTime
      this.userId = userInfo.login_info.user.userParentInfo.id;
      this.userInfo = userInfo.login_info.user.userParentInfo;
    }
  }
};

</script>
<style lang='stylus' scoped>
.choose-coupon {
  width: 100% !important;
  padding-top: 30px;
  // max-width: 800px;
  margin: 0 auto;
}

.coupon-card {
  box-sizing: border-box;
  overflow-y: auto;
  margin: -20px -20px 0;
  height: 50vh;

  // .coupon-card {
  //   background-size: 50%;
  //   background-position: 50% 50%;
  // }

  .dl-box {
    border: 1px solid #e0e0e0;

    &:hover {
    border-color: #efa83e;
    }
  }

  .disable {
    opacity: 0.5;
    &:hover {
      cursor: default;
      border-color: #e0e0e0;
    }
  }

  .el-input button {
    width: 120px;
    height: 40px;
    color: #fff;
    background: rgba(110, 112, 160, 1);
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }

  dl,
  dt,
  dd {
    box-sizing: border-box;
  }

  dl {
    cursor: pointer;
    height: 90px;
    border-radius: 8px;
    border: 1px solid rgba(221, 221, 221, 1);
    display: flex;
    overflow: hidden;
    margin-top: 20px;

    dd {
      flex: 1;

      .tip-warpper {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        box-sizing: border-box;
        position: relative;
        border-radius: 8px;
        margin-left: -8px;
        background-color: #fff;
        height: 70px;
        padding: 5px 15px;
        margin-top: 10px;

        .point-type {
          position: absolute;
          right: 0;
          top: 25px;
          height: 20px;
        }

        .tip {
          font-size: 16px;
          font-family: Rubik-Regular, Rubik;
          font-weight: 400;
          color: rgba(52, 54, 77, 1);
          margin: 0;
        }

        .time {
          font-size: 12px;
          font-family: Rubik-Regular, Rubik;
          font-weight: 400;
          color: rgba(178, 178, 178, 1);
          line-height: 19px;
        }

        .no-available {
          font-size: 12px;
          font-family: Rubik-Regular, Rubik;
          font-weight: 400;
          color: rgba(178, 178, 178, 1);
        }

        .el-button {
          position: absolute;
          right: 20px;
          top: 10px;
        }
      }
    }

    dt {
      flex: 0 100px;
      background: rgba(239, 168, 62, 1);
      text-align: center;
      color: rgba(255, 255, 255, 1);
      padding-top: 5px;

      &.yellow {
        background: rgba(239, 168, 62, 1);
      }

      &.blue {
        background: rgba(110, 112, 160, 1);
      }

      .val {
        font-size: 32px;
        font-family: Rubik-Regular, Rubik;
        font-weight: 400;
        line-height: 50px;
      }

      .unit {
        font-size: 16px;
      }

      .discount {
        font-size: 16px;
        font-family: Rubik-Regular, Rubik;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 18px;
      }
    }
  }

  .no-cupon {
    background-size: 30%;
  }

  @media screen and (max-width: 480px) {
    .no-cupon {
      background-size: 50%;
    }
  }
}

</style>
