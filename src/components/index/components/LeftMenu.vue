<template>
  <el-menu
    :default-active="activeIndex"
    @select="selectMenu"
    text-color="#34364D"
    active-text-color="#56BECD"
  >
    <el-menu-item
      v-show="(memberRole!=ApiConstants.classMemberRoleExit&&$key==menus.length-1) || $key<menus.length-1"
      v-for="(item,$key) in menus"
      :disabled="item.isEnable"
      :index="item.href"
      :key="$key"
    >
      <i :class="['mg-icon',item.icon]"></i>
      <span v-html="item.title"></span>
    </el-menu-item>
  </el-menu>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  mounted() {
    this.activeIndex = this.$route.name;
  },
  data() {
    return {
      activeIndex: ''
    };
  },
  props: {
    isRegister: {
      default: true,
      type: Boolean
    }
  },
  watch: {
    '$route'(toRouter, fromRouter) {
      this.activeIndex = toRouter.name;
    }
  },
  computed: {
    ...mapGetters({
      memberRole: "student/getMemberRole"
    }),
    menus() {
      return [
        {
          title: this.$i18n.t("Home"),
          icon: "icon-home",
          href: "home",
          index: "1-1",
          isEnable: false
        },
        {
          title: this.$i18n.t("Booking"),
          icon: "icon-booking",
          href: "booking",
          index: "1-2",
          isEnable: false
        },
        {
          title: this.$i18n.t("Schedule"),
          icon: "icon-schedule",
          href: "schedule",
          index: "1-3",
          isEnable: false
        },
        {
          title: this.$i18n.t("History"),
          icon: "icon-history",
          href: "history",
          index: "1-4",
          isEnable: false
        },
        {
          title: this.$i18n.t("Discover"),
          icon: "icon-discovery",
          href: "goodCourse",
          index: "1-5",
          isEnable: false
        },
        {
          title: this.$i18n.t("Group"),
          icon: "icon-group",
          href: "group",
          index: "1-6",
          isEnable: false
        }
      ]
    }
  },
  methods: {
    selectMenu(path) {
      this.$emit('selectMenu', path);
    }
  }
};
</script>