<template>
  <el-dialog
    :title="$t('Coupon instructions')"
    center
    @close="closeIntro"
    :visible.sync="isShow"
    width="50%">
    <template v-if="$i18n.locale === 'zh'">
      <h2>优惠券是什么</h2>
      <p>本平台目前使用的优惠券均为折扣券，下单时满足使用条件即可抵扣相应金额。</p>
      <h2>使用规则</h2>
      <p>一笔订单只能使用一张优惠券;</p>
      <p>满足条件的优惠券才能被选择成功并在下单时获得优惠;</p>
      <p>优惠券被订单选中时即被锁定，不能再被其他订单选中;</p>
      <p>订单完成后优惠券即被使用，每张优惠券只能使用一次。</p>
      <h2>如何查看优惠券</h2>
      <p>可以在优惠券中心查看当前可用优惠券、已使用优惠券、失效优惠券。</p>
      <h2>退回规则</h2>
      <p>用户取消订单或超时未付款，其绑定的优惠券将返回用户账户中，未失效的优惠券可被其他订单使用。</p>
      <p>LingoAce对所有优惠券的发放、使用、退回等拥有最终解释权。</p>
    </template>
    <template v-if="$i18n.locale === 'en'">
      <h2>What is a coupon</h2>
      <p>The coupons currently used in LingoAce are discount coupons, and the corresponding amount can be deducted if the usage conditions are met when placing an order.</p>
      <h2>Rules of use</h2>
      <p>Only one coupon can be used for an order;</p>
      <p>Only when the coupon meets the conditions can it be selected successfully and get the discount when placing the order;</p>
      <p>When a coupon is selected by an order, it is locked and cannot be selected by another order;</p>
      <p>The coupon will be used after the order is completed, and each coupon can only be used once.</p>
      <h2>Where to view coupons</h2>
      <p>You can view currently available coupons, used coupons and expired coupons in the coupon center.</p>
      <h2>Return rule</h2>
      <p>If the user cancels the order or fails to pay over time, the coupon bound by it will be returned to the user account, and the coupon not expired can be used by other orders.</p>
      <p>LingoAce has the final right to explain the issuance, use and return of all coupons.</p>
    </template>
    <span slot="footer">
      <el-button type="primary" class="close-btn" @click="closeIntro">{{$t('CONFIRM')}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    isShow: {
      get() {
        return this.isOpen;
      },
      set() {},
    }
  },
  methods: {
    closeIntro () {
      this.$emit('closeIntro')
    },
  },
}
</script>

<style lang="stylus" scoped>
  .close-btn {
    width: 200px;
  }

  p {
    padding: 5px 0;
    color: #666666;
    word-break: keep-all;

    &:last-child {
      margin-top: 18px;
    }
  }
</style>