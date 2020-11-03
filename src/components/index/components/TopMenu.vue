<template>
  <ul class="lg-container topmenu">
    <li class="logo">
      <a @click="selectMenu('/home')" href="javascript:;">
        <img :src="logoUrl" alt />
      </a>
    </li>
    <li class="title" @click="selectMenu('/home')" :class="{'active':$route.path.indexOf('/pay/') == -1}">{{$t('STUDY')}}</li>
    <li class="points" @click="selectMenu('/pay')" :class="{'active':$route.path.indexOf('/pay/') == 0}" style="height: 100%;">
      <div>
        <i class="icon"></i>
        <span class="point">{{balance}} {{$t('Points')}}</span>
      </div>
    </li>
  </ul>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      logoUrl: require("@/assets/theme-default/images/index/logo@2x.png"),
      routerParent: ''
    };
  },
  computed: {
    ...mapGetters({
      user: 'user/getUserInfo'
    }),
    balance() {
      let user = this.user;
      console.log(user.userParentInfo)
      return user.userParentInfo.balance * 1 + user.userParentInfo.bonusBalance * 1 + user.userParentInfo.sgBalance * 1;
    }
  },
  watch: {
    '$route': {
      handler(toRouter, fromRouter) {
        this.routerParent = toRouter.path.split('/')[1];
        // console.log(this.routerParent)
      }

    }
  },
  methods: {
    jumpHome() {
      this.$router.push('/');
    },
    selectMenu(path) {
      this.$emit('selectMenu', path);
    }
  }
};

</script>
