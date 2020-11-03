<template>
  <el-dialog
    :title="$t('Choose Coupon')"
    :visible.sync="isShow"
    width="800px"
    height="600px"
    @closeed="close"
    :show-close="false"
    :center="true"
    class="choose-coupon"
    :destroy-on-close="true"
    append-to-body
  >
    <div class="coupon-card">
      <el-input :placeholder="$t('Coupon code')" v-model="code">
        <el-button type="primary" slot="append" @click="addCoupon">{{$t('ADD')}}</el-button>
      </el-input>
      <dl v-for="(item,key) in coupons" :key="key" @click="choose(key)" class="dl-box" :class="item.isAvailable ? '' : 'disable' ">
        <dt>
          <span class="val">{{item.discount}}</span>
          <span class="unit">%</span>
          <br />
          <span class="discount">{{$t('discount')}}</span>
        </dt>
        <dd>
          <div class="tip-warpper">
            <p class="tip">{{$t('Top-up')}} {{item.amount}} {{$t('points or more')}}</p>
            <p class="time">{{$t('Validity period')}}: 
              {{DateTimeUtils.formartDateFromUTC(item.validStartTime,'yyyy.MM.dd')}}
              -{{DateTimeUtils.formartDateFromUTC(item.validEndTime,'yyyy.MM.dd')}}</p>
            <p class="no-available" v-if="!item.isAvailable">{{$t('Reason for unavailability')}} : {{canNotReason(item.notAvailableReason)}}</p>
              <img class="point-type" v-if="item.accountClass === 1" :src="pointType[$i18n.locale]['standard']"/>
              <img class="point-type" v-else :src="pointType[$i18n.locale]['sg']"/>
          </div>
        </dd>
      </dl>
      <div class="no-cupon" v-show="coupons.length == 0">{{$t('No coupons here')}}</div>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {
      loading: false,
      code: '',
      points: 100,
      countCoupon: 0,
      pointType: {
        zh: {
          standard: require('../../../assets/theme-default/images/pay/zh_standard_point.png'),
          sg: require('../../../assets/theme-default/images/pay/zh_sg_point.png')
        },
        en: {
          standard: require('../../../assets/theme-default/images/pay/en_standard_point.png'),
          sg: require('../../../assets/theme-default/images/pay/en_sg_point.png')
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
      default() {
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
      if(this.code == '') {
        this.$message({
          message: 'Please Fill the Coupon code',
        })
        return;
      }
      self.loading = true;
      this.addCouponAction({
        userId: this.user.userParentInfo.id,
        code: this.code
      }).then((data) =>{
        self.loading = false;
        self.$emit('reGetAllCoupon')
        self.$message({
          message: self.$t('add coupon sccess', {amount: data.amount})
        })
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
  }
};
</script>
<style lang='stylus' scoped>
.choose-coupon {
  padding-top: 30px;
}

.coupon-card {
  box-sizing: border-box;
  padding: 20px 60px;
  height: 500px;
  overflow-y: auto;

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
    height: 40px;
    padding: 0 40px;
    color: #fff;
    background: rgba(110, 112, 160, 1);
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }

  dl, dt, dd {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  dl {
    cursor: pointer;
    height: 120px;
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
        margin-top: 15px;
        background-color: #fff;
        height: 90px;
        padding: 8px 30px;

        .point-type {
          position: absolute;
          right: 0;
          top: 30px;
          height: 30px;
        }

        .tip {
          height: 24px;
          font-size: 20px;
          font-family: Rubik-Regular, Rubik;
          font-weight: 400;
          color: rgba(52, 54, 77, 1);
          line-height: 24px;
          margin: 0;
        }

        .time {
          height: 22px;
          font-size: 16px;
          font-family: Rubik-Regular, Rubik;
          font-weight: 400;
          color: rgba(178, 178, 178, 1);
          line-height: 19px;
        }

        .no-available {
          font-size: 16px;
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
      flex: 0 120px;
      background: rgba(239, 168, 62, 1);
      text-align: center;
      color: rgba(255, 255, 255, 1);
      padding-top: 20px;

      &.yellow {
        background: rgba(239, 168, 62, 1);
      }

      &.blue {
        background: rgba(110, 112, 160, 1);
      }

      .val {
        font-size: 48px;
        font-family: Rubik-Regular, Rubik;
        font-weight: 400;
        line-height: 57px;
      }

      .unit {
        font-size: 20px;
      }

      .discount {
        font-size: 18px;
        font-family: Rubik-Regular, Rubik;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 22px;
      }
    }
  }
}
</style>