<template>
  <div class="m-booking-teacher shadow">
    <span class="avatar-warpper">
      <el-avatar class="c-teacher" :size="144" :src="teacher.avatar" fit="cover"></el-avatar>
      <i class="national-flag"></i>
    </span>
    <div class="c-info-warpper">
      <div class="fix">
        <el-button
          class="fr"
          type="warning"
          @click="booking(teacher.userId, teacher.realName)"
          round
        >{{$t("BOOKING")}}</el-button>
        <div class="c-name fl">{{teacher.realName}}</div>
        <div class="c-year fl">{{teacher.teachingStartTime|setExperience}}</div>
        <div class="c-rate fl">
          <el-rate v-model="teacher.rating" disabled></el-rate>
        </div>
      </div>
      <p
        v-show="lang == Constants.langEn"
        class="c-des"
        :class="{'thidden-more':!show}"
        :style="{height:show ? descHeight :'72px'}"
        ref="descEnNode"
      >{{teacher.descriptionEn}}</p>
      <p
        v-show="lang == Constants.langZh"
        class="c-des"
        :class="{'thidden-more':!show}"
        :style="{height:show ? descHeight :'72px'}"
        ref="descZhNode"
      >{{teacher.descriptionZh}}</p>
    </div>
    <a class="c-more" href="javascript:;" @click="toggle()" v-if="isShowReadMoreBtn">
      <template v-if="show">
        <span :class="{'read': lang == Constants.langEn}">{{$t("READ LESS")}}</span>
      </template>
      <template v-else>
        <span :class="{'read': lang == Constants.langEn}">{{$t("READ MORE")}}</span>
      </template>
      <i v-if="!show" class="el-icon-arrow-down"></i>
      <i v-else class="el-icon-arrow-up"></i>
    </a>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: true,
      isShowReadMoreBtn: true,
      currentHeight: '',
      descHeight: 'auto'
    };
  },
  props: {
    teacher: {
      default() {
        return {
          realName: "",
          rating: 4,
          descriptionEn: "",
          descriptionZh: ""
        };
      }
    },
    index: {
      default: 0
    },
    type: {
      default: "recommend"
    },
    studentid: {
      default: ""
    },
    group: {}
  },
  computed: {
    lang() {
      return this.$i18n.locale;
    }
  },
  mounted() {
    this.computedDescDisplay()
    this.$EventBus.$on("onComputedDescDisplay", () => {
      this.show = true
      this.descHeight = 'auto'
      setTimeout(() => {
        this.computedDescDisplay()
      })
    })
  },
  methods: {
    /**
     * @Author   Yaodongxin
     * @DateTime 2019-12-07
     * @method   booking 跳转到付款页面
     */
    booking(uid, teacher) {
      this.$router.push(
        "/classschedulecard?uid=" +
          uid +
          "&stid=" +
          this.studentid +
          "&group=" +
          this.group +
          "&teacher=" +
          teacher
      );
    },
    toggle() {
      this.descHeight = this.currentHeight - 10 + 'px'
      this.show = !this.show;
    },
    computedDescDisplay() {
      let targetNode = null
      if (this.lang === this.Constants.langZh) {
        targetNode = this.$refs.descZhNode
      } else {
        targetNode = this.$refs.descEnNode
      }
      if (targetNode) {
        const targetHeight = targetNode.offsetHeight
        this.currentHeight = targetHeight
        if (targetHeight > 82) {
          this.isShowReadMoreBtn = true
          this.show = false
        } else {
          this.isShowReadMoreBtn = false
        }
      }
    },
  }
};
</script>