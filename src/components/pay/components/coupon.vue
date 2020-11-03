<template>
  <div class="lg-pay coupon">
    <div class="title-content">
      <h1 class="lg-title">{{$t('Coupon')}}</h1>
      <div class="use-desc" @click="openIntro">{{$t('Instructions')}}</div>
    </div>
    <el-card>
      <el-tabs v-model="activeName">
        <el-tab-pane class="unused" :label="$t('Unused')" name="first">
          <el-input :placeholder="$t('Coupon code')" v-model="code">
            <el-button type="primary" slot="append" @click="addCoupon" :loading="loading">{{$t('ADD')}}</el-button>
          </el-input>
          <div class="no-cupon" v-show="!unused.list || unused.list.length == 0">No coupons here</div>
          <dl v-for="(item,key) in unused.list" :key="key">
            <dt :class="item.flag">
              <span class="val">{{item.discount}}</span>
              <span class="unit">%</span>
              <span class="discount">{{$t("discount")}}</span>
            </dt>
            <dd>
              <div class="tip-warpper">
                <p class="tip">{{$t("Top-up")}} {{item.amount}} {{$t("points or more")}}</p>
                <p class="time">{{$t('Validity period')}}: 
                  {{DateTimeUtils.formartDateFromUTC(item.validStartTime,'yyyy.MM.dd')}}
                  -{{DateTimeUtils.formartDateFromUTC(item.validEndTime,'yyyy.MM.dd')}}
                </p>
                <p class="count-down" v-if="showExhibitionTime(item.validEndTime)">{{showExhibitionTime(item.validEndTime)}}</p>
                <!-- 未使用有效状态 -->
                <!-- <el-button type="warning" plain round @click="topUp(item)">{{$t("TOP-UP")}}</el-button> -->
                <img class="point-type" v-if="item.accountClass === 1" :src="pointType[$i18n.locale]['standard']"/>
                <img class="point-type" v-else :src="pointType[$i18n.locale]['sg']"/>
              </div>
            </dd>
          </dl>
        </el-tab-pane>
        <el-tab-pane class="used" :label="$t('Used')" name="second">
          <!-- <el-input :placeholder="$t('Coupon code')" v-model="code">
            <el-button type="primary" slot="append" @click="addCoupon" :loading="loading">{{$t('ADD')}}</el-button>
          </el-input> -->
          <div class="no-cupon" v-show="!used.list || used.list.length == 0">No coupons here</div>
          <dl v-for="(item,key) in used.list" :key="key">
            <dt :class="item.flag">
              <span class="val">{{item.discount}}</span>
              <span class="unit">%</span>
              <span class="discount">{{$t('discount')}}</span>
            </dt>
            <dd>
              <div class="tip-warpper">
                <p class="tip">{{$t('Top-up')}} {{item.amount}} {{$t('points or more')}}</p>
                <p class="time">{{$t('Validity period')}}: 
                  {{DateTimeUtils.formartDateFromUTC(item.validStartTime,'yyyy.MM.dd')}}
                  -{{DateTimeUtils.formartDateFromUTC(item.validEndTime,'yyyy.MM.dd')}}</p>
                  <!-- 已使用状态 -->
                <!-- <i class="lg-icon icon-used"></i> -->
                <img class="point-type" v-if="item.accountClass === 1" :src="pointType[$i18n.locale]['standard']"/>
                <img class="point-type" v-else :src="pointType[$i18n.locale]['sg']"/>
              </div>
            </dd>
          </dl>
        </el-tab-pane>
        <el-tab-pane class="invalid" :label="$t('Invalid')" name="third">
          <!-- <el-input :placeholder="$t('Coupon code')" v-model="code">
            <el-button type="primary" slot="append" @click="addCoupon" :loading="loading">{{$t('ADD')}}</el-button>
          </el-input> -->
          <div class="no-cupon" v-show="!invalid.list || invalid.list.length == 0">No coupons here</div>
          <dl v-for="(item,key) in invalid.list" :key="key">
            <dt :class="item.flag">
              <span class="val">{{item.discount}}</span>
              <span class="unit">%</span>
              <span class="discount">{{$t('discount')}}</span>
            </dt>
            <dd>
              <div class="tip-warpper">
                <p class="tip">{{$t('Top-up')}} {{item.amount}} {{$t('points or more')}}</p>
                <p class="time">{{$t('Validity period')}}: 
                  {{DateTimeUtils.formartDateFromUTC(item.validStartTime,'yyyy.MM.dd')}}
                  -{{DateTimeUtils.formartDateFromUTC(item.validEndTime,'yyyy.MM.dd')}}</p>
                  <!-- 已失效状态 -->
                <!-- <i class="lg-icon icon-invalid"></i> -->
                <img class="point-type" v-if="item.accountClass === 1" :src="pointType[$i18n.locale]['standard']"/>
                <img class="point-type" v-else :src="pointType[$i18n.locale]['sg']"/>
              </div>
            </dd>
          </dl>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <CouponIntro :isOpen="isOpen" @closeIntro="closeIntro"/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CouponIntro from './couponIntro'
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    CouponIntro,
  },
  data() {
    //这里存放数据
    return {
      activeName: "first",
      code: '',
      loading: false,
      isOpen: false,
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
  computed: {
    ...mapGetters({
      user: 'user/getUserInfo',
      unused: 'finance/getUnused',
      used: 'finance/getUsed',
      invalid:'finance/getInvalid'
    })
  },
  methods: {
    topUp() {
      this.$router.push("/pay");
    },
    showExhibitionTime (val) {
      const now = +new Date()
      const end = +new Date(val)
      const leftTime = end - now
      let day,hour,exhibitionTime;
      if (leftTime > 0) {
        day = Math.floor(leftTime / 1000 / 60 / 60 / 24)
        hour = Math.floor(leftTime / 1000 / 60 / 60 % 24)
        if (day > 1 && day < 30) {
          exhibitionTime = this.$i18n.locale === 'zh' ? `${day}天后失效` : `Expired after ${day} days`
        } else if (day < 1) {
          exhibitionTime = this.$i18n.locale === 'zh' ? `${hour}小时后失效` : `Expired after ${hour} hours`
        }
        return exhibitionTime
      }
      return ''
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
        self.code = ''
      }, (err) => {
        self.loading = false;
      })
    },
    openIntro () {
      this.isOpen = true
    },
    closeIntro () {
      this.isOpen = false
    },
    ...mapActions({
      couponAction: 'finance/couponAction',
      addCouponAction: 'finance/addCouponAction'
    })
  },
  created() {
    let userId = this.user.userParentInfo.id;
    this.couponAction({userId, st: this.ApiConstants.financeCouponStatusUnused});
    this.couponAction({userId, st: this.ApiConstants.financeCouponStatusUsed});
    this.couponAction({userId, st: this.ApiConstants.financeCouponStatusInvalid});
  }
};
</script>
<style lang='stylus'>
.coupon {
  .title-content {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .use-desc {
      cursor: pointer;
      color: #56becd;
    }
  }

  .el-tabs {
    .el-tabs__active-bar {
      bottom: 5px;
      background: rgba(86, 190, 205, 1);
    }

    .el-tabs__item {
      font-size: 18px;
      font-family: Comfortaa-Regular, Comfortaa;
      font-weight: 400;
      color: rgba(52, 54, 77, 1);

      &.is-active {
        color: rgba(86, 190, 205, 1);
      }
    }

    .unused, .used, .invalid {
      box-sizing: border-box;
      padding: 20px 60px;

      .el-input button {
        width: 118px;
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
            position: relative;
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
              top: 25px;
            }

            .tip {
              font-size: 20px;
              font-family: Rubik-Regular, Rubik;
              font-weight: 400;
              color: rgba(52, 54, 77, 1);
              margin: 0;
            }

            .time {
              font-size: 16px;
              font-family: Rubik-Regular, Rubik;
              font-weight: 400;
              color: rgba(178, 178, 178, 1);
            }

            .count-down {
              font-size: 16px;
              font-family: Rubik-Regular, Rubik;
              font-weight: 400;
              color: #efa83e;
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
            display: block;
            font-size: 18px;
            font-family: Rubik-Regular, Rubik;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            line-height: 22px;
          }
        }
      }
    }

    .used, .invalid {
      dl {
        opacity: 0.5;

        dd {
          .icon-used {
            position: absolute;
            right: 0px;
            top: 10px;
            width: 90px;
            height: 42px;
            bg-image('../../../assets/theme-default/images/pay/icon-used');
          }

          .icon-invalid {
            position: absolute;
            right: 0px;
            top: 10px;
            width: 90px;
            height: 42px;
            bg-image('../../../assets/theme-default/images/pay/icon-invalid');
          }
        }
      }
    }
  }
}
</style>